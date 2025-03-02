import { Hobby } from './hobby.entity';
import { WorkExperience } from './workexperience.entity';

export interface Resume {
  hobbies?: Hobby[];
  workExperiences?: WorkExperience[];
} 