"use client";

import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, XCircle, Plus, Eye, ChevronDown, ChevronUp } from "lucide-react";
import TaskModal from "./TaskModal";

export default function EmployeeTasks({ employee, onTaskUpdate }) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showPreviousTasks, setShowPreviousTasks] = useState(false); // ✅ New state for previous tasks

  const getStatusBadge = (status) => {
    const variants = {
      Completed: { class: "bg-emerald-500/10 text-emerald-400", icon: <CheckCircle2 size={14} /> },
      "In Progress": { class: "bg-blue-500/10 text-blue-400", icon: <Clock size={14} /> },
      Pending: { class: "bg-amber-500/10 text-amber-400", icon: <Clock size={14} /> },
      Failed: { class: "bg-red-500/10 text-red-400", icon: <XCircle size={14} /> },
    };
    return variants[status] || variants.Pending;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      High: "bg-red-500/10 text-red-400",
      Medium: "bg-amber-500/10 text-amber-400",
      Low: "bg-blue-500/10 text-blue-400",
    };
    return variants[priority] || variants.Medium;
  };

  // ✅ All tasks
  const allTasks = employee?.tasks || [];

  // ✅ Recent tasks: not older than 1 day OR completed/failed
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneDayAgo = new Date(today);
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const isRecent = (task) => {
    const taskDate = new Date(task.assignedDate);
    return taskDate >= oneDayAgo;
  };

  const isCompletedOrFailed = (task) => {
    return task.status === "Completed" || task.status === "Failed";
  };

  // ✅ Separate recent + completed/failed (always visible)
  const activeTasks = allTasks.filter(task => isRecent(task) || isCompletedOrFailed(task));

  // ✅ Old pending tasks (hidden by default)
  const oldPendingTasks = allTasks.filter(task => !isRecent(task) && !isCompletedOrFailed(task));

  // ✅ Display tasks: activeTasks + (if showPreviousTasks) oldPendingTasks
  const displayTasks = showAllTasks 
    ? (showPreviousTasks ? [...activeTasks, ...oldPendingTasks] : activeTasks)
    : (showPreviousTasks ? [...activeTasks.slice(0, 3), ...oldPendingTasks] : activeTasks.slice(0, 3));

  // ✅ Counts
  const totalTasks = allTasks.length;
  const hiddenOldCount = oldPendingTasks.length;

  const handleSaveTask = async (taskData) => {
    await onTaskUpdate(taskData);
    setShowTaskModal(false);
    setEditingTask(null);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Tasks</h2>
          <p className="text-xs text-slate-500">
            {totalTasks} total tasks
            {hiddenOldCount > 0 && (
              <span className="ml-2 text-amber-400">
                ({hiddenOldCount} old tasks hidden)
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setShowTaskModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          <Plus size={16} />
          Assign Task
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {displayTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
            <p className="text-sm text-slate-500">No tasks</p>
          </div>
        ) : (
          displayTasks.map((task) => {
            const statusBadge = getStatusBadge(task.status);
            const isExpanded = expandedTask === task.id;
            const isOld = !isRecent(task) && !isCompletedOrFailed(task);

            return (
              <div
                key={task.id}
                className={`rounded-xl border p-4 transition hover:border-slate-700 ${
                  isOld
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-slate-800 bg-slate-950/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-slate-200">{task.title}</h3>
                      <span className={`rounded-lg px-2 py-0.5 text-xs font-medium ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium ${statusBadge.class}`}
                      >
                        {statusBadge.icon}
                        {task.status}
                      </span>
                      {isOld && (
                        <span className="text-xs text-amber-400">⚠️ Overdue</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-400 line-clamp-2">{task.description}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      {task.completedAt && (
                        <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                      )}
                      {task.failureReason && (
                        <span className="text-red-400">Failed: {task.failureReason}</span>
                      )}
                      {task.failureDeduction > 0 && (
                        <span className="text-red-400">Deduction: Rs. {task.failureDeduction}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setShowTaskModal(true);
                      }}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                    >
                      ✏️
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 border-t border-slate-800 pt-3">
                    <div className="grid gap-2 text-sm">
                      <p><span className="text-slate-500">Description:</span> {task.description}</p>
                      <p><span className="text-slate-500">Assigned:</span> {new Date(task.assignedDate).toLocaleString()}</p>
                      <p><span className="text-slate-500">Due:</span> {new Date(task.dueDate).toLocaleString()}</p>
                      {task.completedAt && (
                        <p><span className="text-slate-500">Completed:</span> {new Date(task.completedAt).toLocaleString()}</p>
                      )}
                      {task.remarks && (
                        <p><span className="text-slate-500">Remarks:</span> {task.remarks}</p>
                      )}
                      {task.failureReason && (
                        <p><span className="text-red-400">Failure Reason:</span> {task.failureReason}</p>
                      )}
                      {task.failureDeduction > 0 && (
                        <p><span className="text-red-400">Failure Deduction:</span> Rs. {task.failureDeduction}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ✅ Show More (Recent) */}
      {activeTasks.length > 3 && (
        <div className="mt-4 border-t border-slate-800 pt-3 text-center">
          <button
            onClick={() => setShowAllTasks(!showAllTasks)}
            className="inline-flex items-center gap-1 text-sm text-indigo-400 transition hover:text-indigo-300"
          >
            {showAllTasks ? (
              <>
                <ChevronUp size={16} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Show More ({activeTasks.length - 3} more)
              </>
            )}
          </button>
        </div>
      )}

      {/* ✅ Show Previous (Old Tasks) */}
      {hiddenOldCount > 0 && (
        <div className="mt-2 border-t border-slate-800 pt-3 text-center">
          <button
            onClick={() => setShowPreviousTasks(!showPreviousTasks)}
            className="inline-flex items-center gap-1 text-sm text-amber-400 transition hover:text-amber-300"
          >
            {showPreviousTasks ? (
              <>
                <ChevronUp size={16} />
                Hide Previous ({hiddenOldCount})
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Show Previous ({hiddenOldCount} old tasks)
              </>
            )}
          </button>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          employee={employee}
          task={editingTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}