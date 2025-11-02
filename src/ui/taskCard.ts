import type { TaskWithDetails, Employee, Tag } from '../types/database.js';
import { loadStyles } from './styles/loader.js';
import { getCSSVariables } from './styles/constants.js';

export function getTaskCardUI(
  task: TaskWithDetails,
  availableEmployees: Employee[],
  availableTags: Tag[]
): string {
  const assignedEmployeeIds = new Set(task.employees.map(e => e.id));
  const assignedTagIds = new Set(task.tags.map(t => t.id));

  const unassignedEmployees = availableEmployees.filter(e => !assignedEmployeeIds.has(e.id));
  const unassignedTags = availableTags.filter(t => !assignedTagIds.has(t.id));

  return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task: ${escapeHtml(task.name)}</title>
  <style>
    ${getCSSVariables()}
    ${loadStyles('taskCard.css')}
  </style>
</head>
<body>
  <div class="card">
    <div class="card-header">
      <h1 class="card-title">📋 ${escapeHtml(task.name)}</h1>
      <p class="card-code">Task Code: ${escapeHtml(task.code)}</p>
    </div>
    
    <div class="card-body">
      <!-- Contract Information -->
      <div class="section">
        <h2 class="section-title">📄 Contract</h2>
        <div class="contract-info">
          <div class="contract-info-title">${escapeHtml(task.contract.name)} (${escapeHtml(task.contract.code)})</div>
          <div class="contract-info-detail">Program: ${escapeHtml(task.contract.program.name)}</div>
        </div>
      </div>

      <!-- Completion Progress -->
      <div class="section">
        <h2 class="section-title">📊 Completion Progress</h2>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${task.completion_value * 10}%">
            ${task.completion_value}/10
          </div>
        </div>
        <div class="progress-text">${task.completion_value * 10}% Complete</div>
        <div class="select-wrapper">
          <label for="completion-select">Update:</label>
          <select id="completion-select">
            ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              .map(
                val =>
                  `<option value="${val}" ${val === task.completion_value ? 'selected' : ''}>${val}/10 (${val * 10}%)</option>`
              )
              .join('')}
          </select>
          <button class="btn btn-primary" onclick="updateCompletion()">Update</button>
        </div>
      </div>

      <!-- Assigned Employees -->
      <div class="section">
        <h2 class="section-title">👥 Assigned Employees (${task.employees.length})</h2>
        ${
          task.employees.length > 0
            ? task.employees
                .map(
                  emp => `
          <div class="list-item">
            <div class="list-item-info">
              <div class="list-item-name">${escapeHtml(emp.name)}</div>
              <div class="list-item-detail">${escapeHtml(emp.job_title)} • ${escapeHtml(emp.email)}</div>
            </div>
            <button class="btn btn-danger" onclick="removeEmployee('${escapeHtml(emp.code)}', '${escapeHtml(emp.name)}')">
              ❌ Remove
            </button>
          </div>
        `
                )
                .join('')
            : '<div class="empty-state">No employees assigned yet</div>'
        }
        
        ${
          unassignedEmployees.length > 0
            ? `
          <div class="select-wrapper">
            <select id="employee-select">
              <option value="">-- Select Employee to Assign --</option>
              ${unassignedEmployees
                .map(
                  emp =>
                    `<option value="${escapeHtml(emp.code)}">${escapeHtml(emp.name)} (${escapeHtml(emp.job_title)})</option>`
                )
                .join('')}
            </select>
            <button class="btn btn-success" onclick="assignEmployee()">➕ Assign</button>
          </div>
        `
            : '<div class="empty-state">All employees are already assigned</div>'
        }
      </div>

      <!-- Tags -->
      <div class="section">
        <h2 class="section-title">🏷️ Tags (${task.tags.length})</h2>
        <div>
          ${
            task.tags.length > 0
              ? task.tags
                  .map(
                    tag => `
            <span class="tag-badge">
              ${escapeHtml(tag.name)}
              <button class="btn btn-danger" style="padding: 0.125rem 0.375rem; margin-left: 0.5rem;" 
                      onclick="removeTag('${escapeHtml(tag.code)}', '${escapeHtml(tag.name)}')">
                ✕
              </button>
            </span>
          `
                  )
                  .join('')
              : '<div class="empty-state">No tags assigned yet</div>'
          }
        </div>
        
        ${
          unassignedTags.length > 0
            ? `
          <div class="select-wrapper" style="margin-top: 1rem;">
            <select id="tag-select">
              <option value="">-- Select Tag to Add --</option>
              ${unassignedTags
                .map(
                  tag => `<option value="${escapeHtml(tag.code)}">${escapeHtml(tag.name)}</option>`
                )
                .join('')}
            </select>
            <button class="btn btn-success" onclick="addTag()">➕ Add Tag</button>
          </div>
        `
            : ''
        }
      </div>
    </div>
  </div>

  <script>
    const taskCode = '${escapeHtml(task.code)}';
    
    function updateCompletion() {
      const select = document.getElementById('completion-select');
      const completionValue = parseInt(select.value);
      
      window.parent.postMessage({
        type: 'tool',
        payload: {
          toolName: 'update_task',
          params: {
            code: taskCode,
            completion_value: completionValue
          }
        }
      }, '*');
    }
    
    function assignEmployee() {
      const select = document.getElementById('employee-select');
      const employeeCode = select.value;
      
      if (!employeeCode) {
        alert('Please select an employee');
        return;
      }
      
      window.parent.postMessage({
        type: 'tool',
        payload: {
          toolName: 'add_employee_to_task',
          params: {
            task_code: taskCode,
            employee_code: employeeCode
          }
        }
      }, '*');
    }
    
    function removeEmployee(employeeCode, employeeName) {
      if (confirm('Remove ' + employeeName + ' from this task?')) {
        window.parent.postMessage({
          type: 'tool',
          payload: {
            toolName: 'remove_employee_from_task',
            params: {
              task_code: taskCode,
              employee_code: employeeCode
            }
          }
        }, '*');
      }
    }
    
    function addTag() {
      const select = document.getElementById('tag-select');
      const tagCode = select.value;
      
      if (!tagCode) {
        alert('Please select a tag');
        return;
      }
      
      window.parent.postMessage({
        type: 'tool',
        payload: {
          toolName: 'add_tag_to_task',
          params: {
            task_code: taskCode,
            tag_code: tagCode
          }
        }
      }, '*');
    }
    
    function removeTag(tagCode, tagName) {
      if (confirm('Remove tag "' + tagName + '" from this task?')) {
        window.parent.postMessage({
          type: 'tool',
          payload: {
            toolName: 'remove_tag_from_task',
            params: {
              task_code: taskCode,
              tag_code: tagCode
            }
          }
        }, '*');
      }
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
