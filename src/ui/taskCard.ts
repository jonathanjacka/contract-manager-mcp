import type { TaskWithDetails, Employee, Tag } from '../types/database.js';

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
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1.5rem;
      min-height: 100vh;
    }
    .card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      max-width: 800px;
      margin: 0 auto;
      overflow: hidden;
    }
    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
    }
    .card-title {
      font-size: 1.875rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .card-code {
      font-size: 0.875rem;
      opacity: 0.9;
      font-family: 'Monaco', 'Courier New', monospace;
    }
    .card-body {
      padding: 2rem;
    }
    .section {
      margin-bottom: 2rem;
    }
    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: #374151;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .section-content {
      color: #6b7280;
      line-height: 1.7;
    }
    .progress-bar-container {
      background: #e5e7eb;
      border-radius: 9999px;
      height: 2rem;
      overflow: hidden;
      position: relative;
      margin-bottom: 0.5rem;
    }
    .progress-bar {
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      height: 100%;
      transition: width 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
    }
    .progress-text {
      text-align: center;
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }
    .list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      border: 1px solid #e5e7eb;
    }
    .list-item-info {
      flex: 1;
    }
    .list-item-name {
      font-weight: 500;
      color: #1f2937;
    }
    .list-item-detail {
      font-size: 0.875rem;
      color: #6b7280;
    }
    .tag-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.375rem 0.75rem;
      background: #dbeafe;
      color: #1e40af;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
      margin: 0.25rem;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
    }
    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .btn:active {
      transform: translateY(0);
    }
    .btn-danger {
      background: #ef4444;
      color: white;
    }
    .btn-danger:hover {
      background: #dc2626;
    }
    .btn-primary {
      background: #3b82f6;
      color: white;
    }
    .btn-primary:hover {
      background: #2563eb;
    }
    .btn-success {
      background: #10b981;
      color: white;
    }
    .btn-success:hover {
      background: #059669;
    }
    .btn-secondary {
      background: #6b7280;
      color: white;
    }
    .btn-secondary:hover {
      background: #4b5563;
    }
    .select-wrapper {
      margin-bottom: 1rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    select {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      background: white;
      cursor: pointer;
    }
    select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #9ca3af;
      font-style: italic;
    }
    .contract-info {
      background: #f3f4f6;
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .contract-info-title {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }
    .contract-info-detail {
      font-size: 0.875rem;
      color: #6b7280;
    }
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
