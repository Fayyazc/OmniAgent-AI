import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskItem } from '../types';
import { CheckSquare, Plus, Sparkles, AlertCircle, Clock, UserCheck } from 'lucide-react';

export const TaskManagementView: React.FC = () => {
  const { tasks, updateTaskStatus, addTask, selectedAgent } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskItem['priority']>('high');
  const [showAdd, setShowAdd] = useState(false);

  const columns: { id: TaskItem['status']; label: string; color: string }[] = [
    { id: 'todo', label: 'To Do', color: 'border-amber-500' },
    { id: 'in_progress', label: 'In Progress', color: 'border-brand-500' },
    { id: 'review', label: 'AI Review', color: 'border-purple-500' },
    { id: 'completed', label: 'Completed', color: 'border-emerald-500' }
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const task: TaskItem = {
      id: `task_${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc || 'Task created by project manager.',
      status: 'todo',
      priority: newTaskPriority,
      aiScore: Math.floor(Math.random() * 20) + 80,
      assignee: selectedAgent.name,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      subtasks: []
    };

    addTask(task);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAdd(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-brand-400" /> AI Task Prioritization & Kanban Board
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kanban workflow with Groq AI priority scoring, subtask decomposition, and assigned AI workforce execution.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-xs flex items-center gap-2 hover:shadow-lg transition-all w-fit"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreateTask} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task Title..."
              required
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none capitalize"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <textarea
            rows={2}
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            placeholder="Task Description..."
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400">Cancel</button>
            <button type="submit" className="px-4 py-1.5 rounded-lg bg-brand-600 text-xs text-white font-bold">Deploy Task</button>
          </div>
        </form>
      )}

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between space-y-3 min-h-[450px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className={`text-xs font-bold text-slate-200 border-l-2 pl-2 ${col.color}`}>
                  {col.label} ({colTasks.length})
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2 group shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                        task.priority === 'high' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {task.priority}
                      </span>

                      <div className="flex items-center gap-1 text-[10px] text-purple-400 font-mono">
                        <Sparkles className="w-3 h-3" /> Score {task.aiScore}%
                      </div>
                    </div>

                    <div className="text-xs font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
                      {task.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2">{task.description}</div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Assignee: <span className="text-slate-200">{task.assignee}</span></span>
                      <span>Due {task.dueDate}</span>
                    </div>

                    {/* Status Mover Buttons */}
                    <div className="flex items-center justify-end gap-1 pt-1">
                      {columns.map(c => c.id !== task.status && (
                        <button
                          key={c.id}
                          onClick={() => updateTaskStatus(task.id, c.id)}
                          className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[9px] text-slate-400 hover:text-white"
                        >
                          → {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
