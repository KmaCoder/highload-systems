import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Employee } from '../../../mongo/entities/employee.entity';
import { Resume } from '../../../mongo/entities/resume.entity';
import { Hobby } from '../../../mongo/entities/hobby.entity';

@Injectable()
export class EmployeeService {
  constructor(
    // @ts-ignore
    @InjectRepository(Employee, 'mongo')
    private readonly employeeRepository: MongoRepository<Employee>,
  ) {}

  async getResume(employeeId: string): Promise<Resume | null> {
    const aggregation = await this.employeeRepository.aggregate([
      // Match the employee by ID
      { $match: { _id: new ObjectId(employeeId) } },
      // Unwind the resumes array to get the first resume
      { $unwind: { path: "$resumes", preserveNullAndEmptyArrays: false } },
      // Limit to just the first resume
      { $limit: 1 },
      // Project only the resume
      { $project: { _id: 0, resume: "$resumes" } }
    ]).toArray();
    
    if (!aggregation || aggregation.length === 0) {
      return null;
    }
    
    return (aggregation[0] as any)?.resume as Resume;
  }

  async getHobbies(employeeId: string): Promise<Hobby[]> {
    const aggregation = await this.employeeRepository.aggregate([
      // Match the employee by ID
      { $match: { _id: new ObjectId(employeeId) } },
      // Unwind the resumes array
      { $unwind: { path: "$resumes", preserveNullAndEmptyArrays: false } },
      // Unwind the hobbies array
      { $unwind: { path: "$resumes.hobbies", preserveNullAndEmptyArrays: false } },
      // Group by hobby name (or other unique identifier) to deduplicate
      { 
        $group: { 
          _id: "$resumes.hobbies.name", // Assuming hobby has a name field for uniqueness
          hobby: { $first: "$resumes.hobbies" } 
        } 
      },
      // Project only the hobby object
      { $project: { _id: 0, hobby: 1 } }
    ]).toArray();
    
    if (!aggregation || aggregation.length === 0) {
      return [];
    }
    
    return aggregation.map(item => (item as any).hobby as Hobby);
  }

  async getAllHobbies(): Promise<Hobby[]> {
    const aggregation = await this.employeeRepository.aggregate([
      // Unwind the resumes array to flatten
      { $unwind: { path: "$resumes", preserveNullAndEmptyArrays: false } },
      // Unwind hobbies to get individual hobby documents
      { $unwind: { path: "$resumes.hobbies", preserveNullAndEmptyArrays: false } },
      // Group by hobby fields to remove duplicates
      { 
        $group: { 
          _id: "$resumes.hobbies.name", // Assuming hobby has a name field for uniqueness
          hobby: { $first: "$resumes.hobbies" } 
        } 
      },
      // Project to get just the hobby objects
      { $project: { _id: 0, hobby: 1 } }
    ]).toArray();
    
    return (aggregation as any[]).map(item => item.hobby as Hobby);
  }

  async getAllCities(): Promise<string[]> {
    const aggregation = await this.employeeRepository.aggregate([
      // Unwind the resumes array to flatten
      { $unwind: { path: "$resumes", preserveNullAndEmptyArrays: false } },
      // Unwind work experiences to get individual work experience documents
      { $unwind: { path: "$resumes.workExperiences", preserveNullAndEmptyArrays: false } },
      // Group by city to get unique cities
      { $group: { _id: "$resumes.workExperiences.city" } },
      // Project to get just the city names
      { $project: { _id: 0, city: "$_id" } }
    ]).toArray();
    
    return (aggregation as any[]).map(item => item.city as string);
  }

  async getHobbiesByCity(city: string): Promise<Hobby[]> {
    const aggregation = await this.employeeRepository.aggregate([
      // Unwind the resumes array to flatten
      { $unwind: { path: "$resumes", preserveNullAndEmptyArrays: false } },
      // Unwind work experiences to get individual work experience documents
      { $unwind: { path: "$resumes.workExperiences", preserveNullAndEmptyArrays: false } },
      // Match work experiences in the given city (case-insensitive)
      { 
        $match: { 
          $expr: { 
            $eq: [
              { $toLower: "$resumes.workExperiences.city" }, 
              city.toLowerCase()
            ] 
          } 
        } 
      },
      // Unwind hobbies to get individual hobby documents
      { $unwind: { path: "$resumes.hobbies", preserveNullAndEmptyArrays: false } },
      // Group by hobby name to deduplicate
      { 
        $group: { 
          _id: "$resumes.hobbies.name",
          hobby: { $first: "$resumes.hobbies" } 
        } 
      },
      // Project to get just the hobby objects
      { $project: { _id: 0, hobby: 1 } }
    ]).toArray();
    
    if (!aggregation || aggregation.length === 0) {
      return [];
    }
    
    return (aggregation as any[]).map(item => item.hobby as Hobby);
  }

  async getEmployeesByCompany(minEmployees: number): Promise<{ company: string, employees: Employee[] }[]> {
    const aggregation = await this.employeeRepository.aggregate([
      // Initial projection to prepare data
      { $project: { _id: 1, login: 1, resumes: 1 } },
      // Unwind the resumes array
      { $unwind: { path: "$resumes", preserveNullAndEmptyArrays: false } },
      // Unwind work experiences
      { $unwind: { path: "$resumes.workExperiences", preserveNullAndEmptyArrays: false } },
      // Group by company, collecting employee data
      {
        $group: {
          _id: "$resumes.workExperiences.company",
          employees: {
            $addToSet: {
              _id: "$_id",
              login: "$login",
              password: "$password"
            }
          },
          employeeCount: { $addToSet: "$_id" }
        }
      },
      // Filter companies with at least minEmployees
      {
        $match: {
          $expr: { $gte: [{ $size: "$employeeCount" }, minEmployees] }
        }
      },
      // Project final structure
      { $project: { _id: 0, company: "$_id", employees: 1 } }
    ]).toArray();
    
    return aggregation as any;
  }
} 