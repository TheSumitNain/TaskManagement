import React from 'react';
import { useParams } from 'react-router-dom';

const TaskDetailPage = () => {
  const { id } = useParams(); // Get task ID from URL
  const task = JSON.parse(localStorage.getItem('tasks'))?.find((task) => task.id === id);

  if (!task) {
    return <div>Task not found.</div>;
  }

  return (
    <div className="task-detail-page">
      <h1>{task.title}</h1>
      <p><strong>Status:</strong> {task.completed ? 'Completed' : 'Incomplete'}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
    </div>
  );
};

export default TaskDetailPage;
