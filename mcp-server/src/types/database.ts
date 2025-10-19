// Core entity interfaces
export interface Program {
  id: string;
  name: string;
  description: string;
  manager_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Contract {
  id: string;
  name: string;
  description: string;
  program_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: string;
  name: string;
  completion_value: number; // 0-10
  contract_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Employee {
  id: string;
  name: string;
  job_title: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface Tag {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

// Junction table interfaces for many-to-many relationships
export interface TaskAssignment {
  id: string;
  task_id: string;
  employee_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface TaskTag {
  id: string;
  task_id: string;
  tag_id: string;
  created_at: Date;
  updated_at: Date;
}

// Input types for creating entities (without id and timestamps)
export interface CreateProgram {
  name: string;
  description: string;
  manager_id: string;
}

export interface CreateContract {
  name: string;
  description: string;
  program_id: string;
}

export interface CreateTask {
  name: string;
  completion_value?: number; // Default to 0
  contract_id: string;
}

export interface CreateEmployee {
  name: string;
  job_title: string;
  email: string;
}

export interface CreateTag {
  name: string;
}

export interface CreateTaskAssignment {
  task_id: string;
  employee_id: string;
}

export interface CreateTaskTag {
  task_id: string;
  tag_id: string;
}

// Update types (all fields optional except id)
export interface UpdateProgram {
  id: string;
  name?: string;
  description?: string;
  manager_id?: string;
}

export interface UpdateContract {
  id: string;
  name?: string;
  description?: string;
  program_id?: string;
}

export interface UpdateTask {
  id: string;
  name?: string;
  completion_value?: number;
  contract_id?: string;
}

export interface UpdateEmployee {
  id: string;
  name?: string;
  job_title?: string;
  email?: string;
}

export interface UpdateTag {
  id: string;
  name?: string;
}

// Extended types with relations for queries
export interface ProgramWithManager extends Program {
  manager: Employee;
}

export interface ContractWithProgram extends Contract {
  program: Program;
}

export interface TaskWithContract extends Task {
  contract: Contract;
  employees?: Employee[];
  tags?: Tag[];
}

export interface TaskWithDetails extends Task {
  contract: ContractWithProgram;
  employees: Employee[];
  tags: Tag[];
}

// Knex table definitions for TypeScript support
export interface DatabaseTables {
  programs: Program;
  contracts: Contract;
  tasks: Task;
  employees: Employee;
  tags: Tag;
  task_assignments: TaskAssignment;
  task_tags: TaskTag;
}
