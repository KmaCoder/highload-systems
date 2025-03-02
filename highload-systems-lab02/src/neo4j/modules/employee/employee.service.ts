import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Neo4jService } from '../../neo4j.service';
import { Resume } from '../../entities/resume.entity';
import { Employee } from '../../entities/employee.entity';
import { Record } from 'neo4j-driver';
import { EmployeesByCompanyDto } from './dto/employee-company.dto';
import { Hobby } from '../../entities/hobby.entity';

@Injectable()
export class Neo4jEmployeeService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getResume(employeeLogin: string): Promise<Resume> {
    const result = await this.neo4jService.run(`
      MATCH (e:Employee {login: $employeeLogin})-[:HAS_RESUME]->(r:Resume)
      OPTIONAL MATCH (r)-[:HAS_HOBBY]->(h:Hobby)
      OPTIONAL MATCH (r)-[:HAS_WORK_EXPERIENCE]->(w:WorkExperience)
      RETURN r, collect(DISTINCT h) as hobbies, collect(DISTINCT w) as workExperiences
    `, { employeeLogin });

    if (result.records.length === 0) {
      throw new NotFoundException(`Resume not found for employee with login ${employeeLogin}`);
    }

    const record = result.records[0];

    const hobbies = record.get('hobbies').map((node: any) => {
      if (!node || !node.properties) return null;
      return { name: node.properties.name };
    });
    const workExperiences = record.get('workExperiences').map((node: any) => {
      if (!node || !node.properties) return null;
      return { 
        city: node.properties.city, 
        company: node.properties.company 
      };
    });

    const resume: Resume = {
      hobbies: hobbies.length > 0 ? hobbies.filter((h: any) => h !== null) : [],
      workExperiences: workExperiences.length > 0 ? workExperiences.filter((w: any) => w !== null) : []
    };

    return resume;
  }

  async getHobbiesByCity(city: string): Promise<Hobby[]> {
    if (!city) {
      throw new BadRequestException('City is required');
    }

    const lowercaseCity = city.trim().toLowerCase();

    const result = await this.neo4jService.run(`
      MATCH (r:Resume)-[:HAS_WORK_EXPERIENCE]->(w:WorkExperience)
      WHERE toLower(w.city) = $lowercaseCity
      MATCH (r)-[:HAS_HOBBY]->(h:Hobby)
      RETURN DISTINCT h
    `, { lowercaseCity });

    if (result.records.length === 0) {
      return [];
    }

    // Extract unique hobbies from the results
    const hobbiesMap = new Map<string, Hobby>();
    
    result.records.forEach((record: Record) => {
      const hobbyNode = record.get('h');
      if (hobbyNode && hobbyNode.properties) {
        const hobbyName = hobbyNode.properties.name;
        if (!hobbiesMap.has(hobbyName)) {
          hobbiesMap.set(hobbyName, { name: hobbyName });
        }
      }
    });

    return Array.from(hobbiesMap.values());
  }

  async getAllCities(): Promise<string[]> {
    const result = await this.neo4jService.run(`
      MATCH (w:WorkExperience)
      WHERE w.city IS NOT NULL
      RETURN DISTINCT w.city AS city
      ORDER BY city
    `);

    if (result.records.length === 0) {
      return [];
    }

    return result.records.map((record: Record) => record.get('city'));
  }

  async getEmployeesByCompany(minEmployees: number): Promise<EmployeesByCompanyDto[]> {
    const result = await this.neo4jService.run(`
      MATCH (e:Employee)-[:HAS_RESUME]->(:Resume)-[:HAS_WORK_EXPERIENCE]->(w:WorkExperience)
      WITH w.company AS company, collect(DISTINCT e) AS employees
      WHERE size(employees) >= $minEmployees
      RETURN company, employees
    `, { minEmployees });

    if (result.records.length === 0) {
      return [];
    }

    return result.records.map((record: Record) => {
      const company = record.get('company');
      const employeeNodes = record.get('employees');
      
      const employees = employeeNodes.map((node: any) => {
        if (!node || !node.properties) return null;
        return {
          login: node.properties.login,
          password: node.properties.password
        };
      }).filter((e: any) => e !== null);

      return {
        company,
        employees
      } as EmployeesByCompanyDto;
    });
  }
}