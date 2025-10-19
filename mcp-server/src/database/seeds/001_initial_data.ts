import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data in reverse order (handle foreign key dependencies)
  await knex('task_tags').del();
  await knex('task_assignments').del();
  await knex('tasks').del();
  await knex('tags').del();
  await knex('contracts').del();
  await knex('programs').del();
  await knex('employees').del();

  const employees = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Leia Organa',
      job_title: 'Senior Project Manager',
      email: 'leia.organa@rebellion.com',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Luke Skywalker',
      job_title: 'Lead Developer',
      email: 'luke.skywalker@jedi.com',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Padmé Amidala',
      job_title: 'UI/UX Designer',
      email: 'padme.amidala@naboo.gov',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Han Solo',
      job_title: 'DevOps Engineer',
      email: 'han.solo@millennium-falcon.com',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'Rey Skywalker',
      job_title: 'Quality Assurance Lead',
      email: 'rey.skywalker@resistance.com',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
  await knex('employees').insert(employees);

  // Insert programs
  const programs = [
    {
      id: '660e8400-e29b-41d4-a716-446655440001',
      name: 'Digital Transformation Initiative',
      description: 'A comprehensive program to modernize our digital infrastructure and processes.',
      manager_id: '550e8400-e29b-41d4-a716-446655440001', // Leia Organa
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440002',
      name: 'Customer Experience Enhancement',
      description: 'Program focused on improving customer touchpoints and satisfaction.',
      manager_id: '550e8400-e29b-41d4-a716-446655440005', // Rey Skywalker
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
  await knex('programs').insert(programs);

  // Insert contracts
  const contracts = [
    {
      id: '770e8400-e29b-41d4-a716-446655440001',
      name: 'Core Platform Upgrade',
      description: 'Upgrade the main application platform to modern technologies.',
      program_id: '660e8400-e29b-41d4-a716-446655440001',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440002',
      name: 'Mobile App Development',
      description: 'Develop a new mobile application for customer engagement.',
      program_id: '660e8400-e29b-41d4-a716-446655440001',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440003',
      name: 'Customer Portal Redesign',
      description: 'Complete redesign of the customer portal interface.',
      program_id: '660e8400-e29b-41d4-a716-446655440002',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
  await knex('contracts').insert(contracts);

  // Insert tags
  const tags = [
    {
      id: '880e8400-e29b-41d4-a716-446655440001',
      name: 'Frontend',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '880e8400-e29b-41d4-a716-446655440002',
      name: 'Backend',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '880e8400-e29b-41d4-a716-446655440003',
      name: 'Database',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '880e8400-e29b-41d4-a716-446655440004',
      name: 'API',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '880e8400-e29b-41d4-a716-446655440005',
      name: 'Testing',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '880e8400-e29b-41d4-a716-446655440006',
      name: 'DevOps',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '880e8400-e29b-41d4-a716-446655440007',
      name: 'Security',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '880e8400-e29b-41d4-a716-446655440008',
      name: 'Performance',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
  await knex('tags').insert(tags);

  // Insert tasks
  const tasks = [
    {
      id: '990e8400-e29b-41d4-a716-446655440001',
      name: 'Setup development environment',
      completion_value: 10,
      contract_id: '770e8400-e29b-41d4-a716-446655440001',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '990e8400-e29b-41d4-a716-446655440002',
      name: 'Design database schema',
      completion_value: 8,
      contract_id: '770e8400-e29b-41d4-a716-446655440001',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '990e8400-e29b-41d4-a716-446655440003',
      name: 'Implement user authentication',
      completion_value: 5,
      contract_id: '770e8400-e29b-41d4-a716-446655440001',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '990e8400-e29b-41d4-a716-446655440004',
      name: 'Create mobile app wireframes',
      completion_value: 7,
      contract_id: '770e8400-e29b-41d4-a716-446655440002',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '990e8400-e29b-41d4-a716-446655440005',
      name: 'Develop React Native components',
      completion_value: 3,
      contract_id: '770e8400-e29b-41d4-a716-446655440002',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '990e8400-e29b-41d4-a716-446655440006',
      name: 'Conduct user research',
      completion_value: 10,
      contract_id: '770e8400-e29b-41d4-a716-446655440003',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '990e8400-e29b-41d4-a716-446655440007',
      name: 'Design new portal layout',
      completion_value: 6,
      contract_id: '770e8400-e29b-41d4-a716-446655440003',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
  await knex('tasks').insert(tasks);

  // Insert task assignments
  const taskAssignments = [
    {
      id: 'aa0e8400-e29b-41d4-a716-446655440001',
      task_id: '990e8400-e29b-41d4-a716-446655440001',
      employee_id: '550e8400-e29b-41d4-a716-446655440004', // Han Solo
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'aa0e8400-e29b-41d4-a716-446655440002',
      task_id: '990e8400-e29b-41d4-a716-446655440002',
      employee_id: '550e8400-e29b-41d4-a716-446655440002', // Luke Skywalker
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'aa0e8400-e29b-41d4-a716-446655440003',
      task_id: '990e8400-e29b-41d4-a716-446655440003',
      employee_id: '550e8400-e29b-41d4-a716-446655440002', // Luke Skywalker
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'aa0e8400-e29b-41d4-a716-446655440004',
      task_id: '990e8400-e29b-41d4-a716-446655440004',
      employee_id: '550e8400-e29b-41d4-a716-446655440003', // Padmé Amidala
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'aa0e8400-e29b-41d4-a716-446655440005',
      task_id: '990e8400-e29b-41d4-a716-446655440005',
      employee_id: '550e8400-e29b-41d4-a716-446655440002', // Luke Skywalker
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'aa0e8400-e29b-41d4-a716-446655440006',
      task_id: '990e8400-e29b-41d4-a716-446655440006',
      employee_id: '550e8400-e29b-41d4-a716-446655440005', // Rey Skywalker
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'aa0e8400-e29b-41d4-a716-446655440007',
      task_id: '990e8400-e29b-41d4-a716-446655440007',
      employee_id: '550e8400-e29b-41d4-a716-446655440003', // Padmé Amidala
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
  await knex('task_assignments').insert(taskAssignments);

  // Insert task tags
  const taskTags = [
    {
      id: 'bb0e8400-e29b-41d4-a716-446655440001',
      task_id: '990e8400-e29b-41d4-a716-446655440001',
      tag_id: '880e8400-e29b-41d4-a716-446655440006', // DevOps
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'bb0e8400-e29b-41d4-a716-446655440002',
      task_id: '990e8400-e29b-41d4-a716-446655440002',
      tag_id: '880e8400-e29b-41d4-a716-446655440003', // Database
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'bb0e8400-e29b-41d4-a716-446655440003',
      task_id: '990e8400-e29b-41d4-a716-446655440003',
      tag_id: '880e8400-e29b-41d4-a716-446655440002', // Backend
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'bb0e8400-e29b-41d4-a716-446655440004',
      task_id: '990e8400-e29b-41d4-a716-446655440003',
      tag_id: '880e8400-e29b-41d4-a716-446655440007', // Security
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'bb0e8400-e29b-41d4-a716-446655440005',
      task_id: '990e8400-e29b-41d4-a716-446655440004',
      tag_id: '880e8400-e29b-41d4-a716-446655440001', // Frontend
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'bb0e8400-e29b-41d4-a716-446655440006',
      task_id: '990e8400-e29b-41d4-a716-446655440005',
      tag_id: '880e8400-e29b-41d4-a716-446655440001', // Frontend
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'bb0e8400-e29b-41d4-a716-446655440007',
      task_id: '990e8400-e29b-41d4-a716-446655440006',
      tag_id: '880e8400-e29b-41d4-a716-446655440005', // Testing
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'bb0e8400-e29b-41d4-a716-446655440008',
      task_id: '990e8400-e29b-41d4-a716-446655440007',
      tag_id: '880e8400-e29b-41d4-a716-446655440001', // Frontend
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
  await knex('task_tags').insert(taskTags);
}
