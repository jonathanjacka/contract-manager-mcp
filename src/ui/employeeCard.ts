import type { Employee, Task } from '../types/database.js';
import { loadStyles } from './styles/loader.js';
import { getCSSVariables } from './styles/constants.js';

export interface EmployeeWithTasks extends Employee {
  tasks: Task[];
}

export function getEmployeeCardUI(employee: EmployeeWithTasks): string {
  const completedTasks = employee.tasks.filter(t => t.completion_value === 10).length;
  const inProgressTasks = employee.tasks.filter(
    t => t.completion_value > 0 && t.completion_value < 10
  ).length;
  const notStartedTasks = employee.tasks.filter(t => t.completion_value === 0).length;
  const totalTasks = employee.tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Employee: ${escapeHtml(employee.name)}</title>
  <style>
    ${getCSSVariables()}
    ${loadStyles('employeeCard.css')}
  </style>
</head>
<body>
  <div class="card">
    <div class="card-header">
      <h1 class="card-title">👤 ${escapeHtml(employee.name)}</h1>
      <p class="card-subtitle">${escapeHtml(employee.job_title)}</p>
      <p class="card-code">Employee Code: ${escapeHtml(employee.code)}</p>
    </div>
    
    <div class="card-body">
      <div class="section">
        <h2 class="section-title">📧 Contact Information</h2>
        <div class="info-box">
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${escapeHtml(employee.email)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Job Title:</span>
            <span class="info-value">${escapeHtml(employee.job_title)}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">📊 Workload Summary</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${totalTasks}</div>
            <div class="stat-label">Total Tasks</div>
          </div>
          <div class="stat-card stat-success">
            <div class="stat-value">${completedTasks}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-card stat-warning">
            <div class="stat-value">${inProgressTasks}</div>
            <div class="stat-label">In Progress</div>
          </div>
          <div class="stat-card stat-info">
            <div class="stat-value">${notStartedTasks}</div>
            <div class="stat-label">Not Started</div>
          </div>
        </div>
        <div class="completion-rate">
          <div class="completion-label">Overall Completion Rate</div>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${completionRate}%">
              ${completionRate}%
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">📋 Assigned Tasks (${totalTasks})</h2>
        ${
          employee.tasks.length > 0
            ? employee.tasks
                .map(
                  task => `
          <div class="task-item">
            <div class="task-info">
              <div class="task-name">${escapeHtml(task.name)}</div>
              <div class="task-code">Code: ${escapeHtml(task.code)}</div>
            </div>
            <div class="task-progress">
              <div class="task-progress-bar">
                <div class="task-progress-fill" style="width: ${task.completion_value * 10}%"></div>
              </div>
              <div class="task-progress-text">${task.completion_value}/10</div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="viewTask('${escapeHtml(task.code)}')">
              View Task
            </button>
          </div>
        `
                )
                .join('')
            : '<div class="empty-state">No tasks assigned</div>'
        }
      </div>
    </div>
  </div>

  <script>
    function viewTask(taskCode) {
      window.parent.postMessage({
        type: 'tool',
        payload: {
          toolName: 'view_task',
          params: {
            code: taskCode
          }
        }
      }, '*');
    }
  </script>
</body>
</html>
  `.trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
