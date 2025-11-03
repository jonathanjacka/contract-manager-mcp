import type { Contract, Program, Task } from '../types/database.js';
import { loadStyles } from './styles/loader.js';
import { getCSSVariables } from './styles/constants.js';

export interface ContractWithDetails extends Contract {
  program: Program;
  tasks: Task[];
}

export function getContractDashboardUI(contract: ContractWithDetails): string {
  const totalTasks = contract.tasks.length;
  const completedTasks = contract.tasks.filter(t => t.completion_value === 10).length;
  const inProgressTasks = contract.tasks.filter(
    t => t.completion_value > 0 && t.completion_value < 10
  ).length;
  const notStartedTasks = contract.tasks.filter(t => t.completion_value === 0).length;

  const totalCompletion =
    totalTasks > 0
      ? Math.round(contract.tasks.reduce((sum, t) => sum + t.completion_value, 0) / totalTasks)
      : 0;
  const completionPercentage = totalCompletion * 10;

  return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contract: ${escapeHtml(contract.name)}</title>
  <style>
    ${getCSSVariables()}
    ${loadStyles('contractDashboard.css')}
  </style>
</head>
<body>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">📄 ${escapeHtml(contract.name)}</h1>
        <p class="dashboard-subtitle">Program: ${escapeHtml(contract.program.name)}</p>
        <p class="dashboard-code">Contract Code: ${escapeHtml(contract.code)}</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" onclick="createTask()">
          ➕ Add Task
        </button>
      </div>
    </div>
    
    <div class="dashboard-body">
      <div class="section">
        <h2 class="section-title">📊 Contract Overview</h2>
        <div class="overview-grid">
          <div class="overview-card">
            <div class="overview-icon">📋</div>
            <div class="overview-content">
              <div class="overview-value">${totalTasks}</div>
              <div class="overview-label">Total Tasks</div>
            </div>
          </div>
          <div class="overview-card card-success">
            <div class="overview-icon">✅</div>
            <div class="overview-content">
              <div class="overview-value">${completedTasks}</div>
              <div class="overview-label">Completed</div>
            </div>
          </div>
          <div class="overview-card card-warning">
            <div class="overview-icon">🔄</div>
            <div class="overview-content">
              <div class="overview-value">${inProgressTasks}</div>
              <div class="overview-label">In Progress</div>
            </div>
          </div>
          <div class="overview-card card-info">
            <div class="overview-icon">⏸️</div>
            <div class="overview-content">
              <div class="overview-value">${notStartedTasks}</div>
              <div class="overview-label">Not Started</div>
            </div>
          </div>
        </div>
        
        <div class="completion-section">
          <div class="completion-header">
            <span class="completion-title">Overall Contract Completion</span>
            <span class="completion-percentage">${completionPercentage}%</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${completionPercentage}%"></div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2 class="section-title">📋 Tasks (${totalTasks})</h2>
          <div class="filter-controls">
            <select id="status-filter" class="filter-select" onchange="filterTasks()">
              <option value="all">All Tasks</option>
              <option value="completed">Completed (10/10)</option>
              <option value="in-progress">In Progress (1-9)</option>
              <option value="not-started">Not Started (0/10)</option>
            </select>
            <select id="sort-by" class="filter-select" onchange="sortTasks()">
              <option value="name">Sort by Name</option>
              <option value="completion-asc">Completion (Low to High)</option>
              <option value="completion-desc">Completion (High to Low)</option>
            </select>
          </div>
        </div>
        
        <div class="tasks-container" id="tasks-container">
          ${
            contract.tasks.length > 0
              ? contract.tasks
                  .map(
                    task => `
            <div class="task-card" data-completion="${task.completion_value}" data-name="${escapeHtml(task.name)}">
              <div class="task-header">
                <div class="task-info">
                  <div class="task-name">${escapeHtml(task.name)}</div>
                  <div class="task-code">Code: ${escapeHtml(task.code)}</div>
                </div>
                <div class="task-status">
                  <span class="status-badge status-${getStatusClass(task.completion_value)}">
                    ${getStatusText(task.completion_value)}
                  </span>
                </div>
              </div>
              
              <div class="task-progress-section">
                <div class="task-progress-header">
                  <span class="progress-label">Progress</span>
                  <span class="progress-value">${task.completion_value}/10 (${task.completion_value * 10}%)</span>
                </div>
                <div class="task-progress-bar">
                  <div class="task-progress-fill" style="width: ${task.completion_value * 10}%"></div>
                </div>
              </div>
              
              <div class="task-actions">
                <button class="btn btn-secondary btn-sm" onclick="viewTask('${escapeHtml(task.code)}')">
                  👁️ View
                </button>
                <button class="btn btn-primary btn-sm" onclick="updateTask('${escapeHtml(task.code)}')">
                  ✏️ Edit
                </button>
              </div>
            </div>
          `
                  )
                  .join('')
              : '<div class="empty-state">No tasks in this contract yet. Click "Add Task" to create one.</div>'
          }
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">ℹ️ Contract Details</h2>
        <div class="details-box">
          <div class="detail-row">
            <span class="detail-label">Description:</span>
            <span class="detail-value">${escapeHtml(contract.description)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Program:</span>
            <span class="detail-value">${escapeHtml(contract.program.name)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Program Description:</span>
            <span class="detail-value">${escapeHtml(contract.program.description)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let allTasks = Array.from(document.querySelectorAll('.task-card'));
    
    function createTask() {
      window.parent.postMessage({
        type: 'tool',
        payload: {
          toolName: 'create_task',
          params: {
            contract_code: '${escapeHtml(contract.code)}'
          }
        }
      }, '*');
    }
    
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
    
    function updateTask(taskCode) {
      window.parent.postMessage({
        type: 'tool',
        payload: {
          toolName: 'update_task',
          params: {
            code: taskCode
          }
        }
      }, '*');
    }
    
    function filterTasks() {
      const filter = document.getElementById('status-filter').value;
      const container = document.getElementById('tasks-container');
      
      allTasks.forEach(task => {
        const completion = parseInt(task.dataset.completion);
        let show = false;
        
        switch(filter) {
          case 'all':
            show = true;
            break;
          case 'completed':
            show = completion === 10;
            break;
          case 'in-progress':
            show = completion > 0 && completion < 10;
            break;
          case 'not-started':
            show = completion === 0;
            break;
        }
        
        task.style.display = show ? 'block' : 'none';
      });
    }
    
    function sortTasks() {
      const sortBy = document.getElementById('sort-by').value;
      const container = document.getElementById('tasks-container');
      
      const sortedTasks = Array.from(allTasks).sort((a, b) => {
        switch(sortBy) {
          case 'name':
            return a.dataset.name.localeCompare(b.dataset.name);
          case 'completion-asc':
            return parseInt(a.dataset.completion) - parseInt(b.dataset.completion);
          case 'completion-desc':
            return parseInt(b.dataset.completion) - parseInt(a.dataset.completion);
          default:
            return 0;
        }
      });
      
      container.innerHTML = '';
      sortedTasks.forEach(task => container.appendChild(task));
      allTasks = sortedTasks;
    }
  </script>
</body>
</html>
  `.trim();
}

function getStatusClass(completion: number): string {
  if (completion === 10) return 'completed';
  if (completion > 0) return 'in-progress';
  return 'not-started';
}

function getStatusText(completion: number): string {
  if (completion === 10) return 'Completed';
  if (completion > 0) return 'In Progress';
  return 'Not Started';
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
