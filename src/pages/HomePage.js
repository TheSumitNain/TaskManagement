import React from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const HomePage = () => {
  const [tasks, setTasks] = React.useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = React.useState('');
  const [filter, setFilter] = React.useState('All');
  const [sortOption, setSortOption] = React.useState('Time');
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleCreateTask = () => {
    if (newTask.trim()) {
      const newTaskObj = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        priority: 'Low',
        createdAt: new Date(),
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleUpdateTask = (id) => {
    const updatedTitle = prompt('Enter new title for the task:');
    if (updatedTitle) {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, title: updatedTitle } : task
        )
      );
    }
  };

  const handleToggleStatus = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleChangePriority = (id, newPriority) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, priority: newPriority } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'Completed') return task.completed;
    if (filter === 'Incomplete') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === 'Time') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortOption === 'Priority') {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const items = Array.from(tasks);
    const [reorderedTask] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedTask);

    setTasks(items);
  };

  return (
    <div className="homepage" style={{ overflow: 'hidden' }}>
      <h1 className='homepage_heading'>Task Management</h1>
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className='input_field'
        />
        <button className='add_task_btn' onClick={handleCreateTask}>Add Task</button>
      </div>

      {tasks.length > 0 && (
        <div className='filters'>
          <div className="task_filters">
            <button onClick={() => setFilter('All')} className={filter === 'All' ? 'active' : ''}>
              All
            </button>
            <button onClick={() => setFilter('Completed')} className={filter === 'Completed' ? 'active' : ''}>
              Completed
            </button>
            <button onClick={() => setFilter('Incomplete')} className={filter === 'Incomplete' ? 'active' : ''}>
              Incomplete
            </button>
          </div>
          <div className="task-sort">
            <label>Sort By:</label>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="Time">Creation Time</option>
              <option value="Priority">Priority</option>
            </select>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <ul
              style={{ listStyle: 'none' }}
              className="task_list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sortedTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <li
                      className="task-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <span
                        onClick={() => navigate(`/task/${task.id}`)}
                        style={{ cursor: 'pointer', textDecoration: task.completed ? 'line-through' : 'none' }}
                      >
  {task.title.length > 20 ? `${task.title.slice(0, 20)}...` : task.title}
  </span>
                      <div>
                      <button onClick={() => handleToggleStatus(task.id)}>
                        {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                      </button>
                      <button onClick={() => handleUpdateTask(task.id)}>Edit</button>
                      <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                      <select
                        value={task.priority}
                        onChange={(e) => handleChangePriority(task.id, e.target.value)}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default HomePage;
