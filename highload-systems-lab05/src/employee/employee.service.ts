import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { Resume } from '../entities/resume.entity';
import { Hobby } from '../entities/hobby.entity';

@Injectable()
export class EmployeeService {
  constructor(
    // @ts-ignore-next-line
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
    // @ts-ignore-next-line
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>
  ) {}

  async createEmployee(employee: Employee): Promise<Employee> {
    return this.employeeRepository.save(employee);
  }

  async getEmployee(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOne({ where: { id } });
  }

  async getResume(employeeId: number): Promise<Resume | null> {
    return this.resumeRepository.findOne({
      where: { employee: { id: employeeId } },
      relations: ['workExperiences', 'hobbies'],
    });
  }

  async getHobbies(employeeId: number): Promise<Hobby[]> {
    const resume = await this.resumeRepository.findOne({
      where: { employee: { id: employeeId } },
      relations: ['hobbies'],
    });
    if (!resume) {
      throw new NotFoundException(`Resume not found for employee with id ${employeeId}`);
    }
    return resume.hobbies;
  }

  async getAllHobbies(): Promise<Hobby[]> {
    const resumes = await this.resumeRepository.find({ relations: ['hobbies'] });
    const hobbyMap = new Map<number, Hobby>();
    resumes.forEach(resume => {
      resume.hobbies?.forEach(hobby => {
        hobbyMap.set(hobby.id, hobby);
      });
    });
    return Array.from(hobbyMap.values());
  }

  async getAllCities(): Promise<string[]> {
    const resumes = await this.resumeRepository.find({ relations: ['workExperiences'] });
    const citySet = new Set<string>();
    resumes.forEach(resume => {
      resume.workExperiences?.forEach(workExperience => {
        if (workExperience.city) {
          citySet.add(workExperience.city);
        }
      });
    });
    return Array.from(citySet);
  }

  async getHobbiesByCity(city: string): Promise<Hobby[]> {
    const cityLower = city.trim().toLowerCase();

    const resumes = await this.resumeRepository
      .createQueryBuilder('resume')
      .leftJoinAndSelect('resume.workExperiences', 'workExperience')
      .leftJoinAndSelect('resume.hobbies', 'hobby')
      .where('LOWER(workExperience.city) = :cityLower', { cityLower })
      .getMany();

    const hobbyMap = new Map<number, Hobby>();
    resumes.forEach(resume => {
      resume.hobbies?.forEach(hobby => {
        hobbyMap.set(hobby.id, hobby);
      });
    });

    return Array.from(hobbyMap.values());
  }

  async getEmployeesByCompany(minEmployees: number): Promise<{ company: string, employees: Employee[] }[]> {
    const result = await this.resumeRepository
      .createQueryBuilder('resume')
      .leftJoin('resume.workExperiences', 'w')
      .leftJoin('resume.employee', 'emp')
      .select('w.company', 'company')
      .addSelect('json_agg(DISTINCT emp)', 'employees')
      .where('w.company IS NOT NULL')
      .groupBy('w.company')
      .having('COUNT(DISTINCT emp.id) >= :minEmployees', { minEmployees })
      .getRawMany();
    return result;
  }
} 