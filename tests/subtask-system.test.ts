/**
 * Unit tests for subtask system
 * Tests the parser and calculation functions
 */

import { parseStatusMarkdown, generateStatusMarkdown } from '../core/utils/markdownParser';
import { calculateTaskProgress, calculateOverallProgress } from '../core/types/tasks';
import type { LaunchTask, Subtask } from '../core/types/tasks';

// Sample test data
const sampleMarkdown = `# 📦 YONI Deploy Status with Subtasks

**Last Updated:** 2025-11-12

## Deployment Tasks

| Task | Status | Description | Progress % |
|------|--------|-------------|------------|
| 1. Repository Setup | ✅ Complete | Initial repository structure created | 100% |
| 2. CI Workflow Configuration | ✅ Complete | GitHub Actions CI pipeline configured | 100% |
| 6. Email Notifications | 🔄 In Progress | Email notification system configuration | 66% |

## Subtasks

### Task 6: Email Notifications
| Subtask | Status |
|---------|--------|
| Configure SMTP server | ✅ |
| Set up email templates | ✅ |
| Implement notification triggers | 🔄 |
`;

function testParser() {
  console.log('Testing parseStatusMarkdown...');
  const tasks = parseStatusMarkdown(sampleMarkdown);
  
  console.assert(tasks.length === 3, 'Should parse 3 tasks');
  console.assert(tasks[0].id === '1.', 'First task ID should be 1.');
  console.assert(tasks[0].status === '✅', 'First task status should be ✅');
  console.assert(tasks[2].subtasks?.length === 3, 'Task 6 should have 3 subtasks');
  console.assert(tasks[2].subtasks?.[0].name === 'Configure SMTP server', 'First subtask name correct');
  console.assert(tasks[2].subtasks?.[0].status === '✅', 'First subtask status correct');
  
  console.log('✅ Parser tests passed');
}

function testProgressCalculation() {
  console.log('Testing calculateTaskProgress...');
  
  const taskWithSubtasks: LaunchTask = {
    id: '6.',
    task: 'Email Notifications',
    status: '🔄',
    comment: 'Email system configuration',
    subtasks: [
      { id: '6-1', name: 'Configure SMTP', parent: '6.', status: '✅' },
      { id: '6-2', name: 'Email templates', parent: '6.', status: '✅' },
      { id: '6-3', name: 'Triggers', parent: '6.', status: '🔄' },
    ],
  };
  
  const progress = calculateTaskProgress(taskWithSubtasks);
  console.assert(progress.total === 3, 'Total should be 3');
  console.assert(progress.completed === 2, 'Completed should be 2');
  console.assert(progress.progressPercent === 67, 'Progress should be 67%');
  
  const taskWithoutSubtasks: LaunchTask = {
    id: '1.',
    task: 'Repository Setup',
    status: '✅',
    comment: 'Initial setup',
  };
  
  const progress2 = calculateTaskProgress(taskWithoutSubtasks);
  console.assert(progress2.total === 0, 'Total should be 0 for task without subtasks');
  console.assert(progress2.progressPercent === 0, 'Progress should be 0');
  
  console.log('✅ Progress calculation tests passed');
}

function testOverallProgress() {
  console.log('Testing calculateOverallProgress...');
  
  const tasks: LaunchTask[] = [
    {
      id: '1.',
      task: 'Task 1',
      status: '✅',
      comment: 'Done',
      subtasks: [
        { id: '1-1', name: 'Sub 1', parent: '1.', status: '✅' },
        { id: '1-2', name: 'Sub 2', parent: '1.', status: '✅' },
      ],
    },
    {
      id: '2.',
      task: 'Task 2',
      status: '🔄',
      comment: 'In progress',
      subtasks: [
        { id: '2-1', name: 'Sub 1', parent: '2.', status: '✅' },
        { id: '2-2', name: 'Sub 2', parent: '2.', status: '🔄' },
      ],
    },
  ];
  
  const overall = calculateOverallProgress(tasks);
  console.assert(overall.total === 4, 'Total should be 4');
  console.assert(overall.completed === 3, 'Completed should be 3');
  console.assert(overall.progressPercent === 75, 'Overall progress should be 75%');
  
  console.log('✅ Overall progress tests passed');
}

function testMarkdownGeneration() {
  console.log('Testing generateStatusMarkdown...');
  
  const tasks: LaunchTask[] = [
    {
      id: '1.',
      task: 'Repository Setup',
      status: '✅',
      comment: 'Initial repository structure created',
      subtasks: [],
    },
    {
      id: '6.',
      task: 'Email Notifications',
      status: '🔄',
      comment: 'Email notification system configuration',
      subtasks: [
        { id: '6-1', name: 'Configure SMTP server', parent: '6.', status: '✅' },
        { id: '6-2', name: 'Set up email templates', parent: '6.', status: '✅' },
        { id: '6-3', name: 'Implement notification triggers', parent: '6.', status: '🔄' },
      ],
    },
  ];
  
  const markdown = generateStatusMarkdown(tasks);
  console.assert(markdown.includes('## Deployment Tasks'), 'Should include Deployment Tasks section');
  console.assert(markdown.includes('## Subtasks'), 'Should include Subtasks section');
  console.assert(markdown.includes('### Task 6.'), 'Should include Task 6 subtasks');
  console.assert(markdown.includes('Configure SMTP server'), 'Should include subtask names');
  console.assert(markdown.includes('## Summary'), 'Should include Summary section');
  
  console.log('✅ Markdown generation tests passed');
}

// Run all tests
export function runTests() {
  console.log('=== Running Subtask System Tests ===\n');
  
  try {
    testParser();
    testProgressCalculation();
    testOverallProgress();
    testMarkdownGeneration();
    
    console.log('\n🎉 All tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Tests failed:', error);
    return false;
  }
}

// For Node.js execution
if (typeof require !== 'undefined' && require.main === module) {
  runTests();
}
