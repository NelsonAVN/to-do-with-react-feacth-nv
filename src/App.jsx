import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const [newTask, setNewTask] = useState('');
  const [taskList, setTaskList] = useState([]);

  const [showX, setShowX] = useState(false);

  const notifyUserCreated = () => toast.success('Success creating user');
  const notifyTaskAdded = () => toast.success('Task has been added');
  const notifyTaskDeleted = () => toast.error('Task has been deleted');
  const notifyUserDeleted = () => toast.error('User was deleted');
  const notifyError = (message) => toast.error(message);

  const createUser = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/users/NelsonV', {
        method: 'POST',
      });
      if (!response.ok) {
        console.log("User already exists");
        notifyError("User already exists");
        return;
      }
      const data = await response.json();
      console.log('User created:', data);
      notifyUserCreated();
    } catch (error) {
      console.error('Error creating user:', error);
      notifyError('Error creating user');
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/users/NelsonV', {
        method: 'GET',
      });
      if (!response.ok) {
        console.log("Error fetching tasks: ", response.statusText);
        notifyError("Error fetching tasks");
        return;
      }
      const data = await response.json();
      console.log("Tasks fetched: ", data);
      setTaskList(data.todos);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      notifyError('Error fetching tasks');
    }
  };

  const deleteUser = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/users/NelsonV', {
        method: 'DELETE',
      });
      if (response.ok) {
        setTaskList([]);
        notifyUserDeleted();
      } else {
        console.error('Error deleting user:', response.statusText);
        notifyError('Error deleting user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      notifyError('Error deleting user');
    }
  };

  const createTodo = async (e) => {
    if (e.key === 'Enter' && newTask.length > 0) {
      try {
        const response = await fetch("https://playground.4geeks.com/todo/todos/NelsonV", {
          method: 'POST',
          body: JSON.stringify({
            label: newTask,
            is_done: false
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        const data = await response.json();
        console.log("Task created: ", data);
        setTaskList([...taskList, data]);
        setNewTask('');
        notifyTaskAdded();
      } catch (error) {
        console.error('Error creating task:', error);
        notifyError('Error creating task');
      }
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTaskList(taskList.filter(task => task.id !== id));
        notifyTaskDeleted();
      } else {
        console.error('Error deleting task:', response.statusText);
        notifyError('Error deleting task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      notifyError('Error deleting task');
    }
  };

  return (
    <>
      <h1>todos</h1>
      <div className='buttons'>
        <button onClick={createUser}>Create User</button>
        <button onClick={deleteUser}>Delete User</button>
      </div>
      <ul>
        <li>
          <input
            name='task'
            type="text"
            placeholder={taskList.length === 0 ? "No unfinished tasks, add a new one" : "Add task"}
            onChange={(e) => setNewTask(e.target.value)}
            value={newTask}
            onKeyDown={createTodo}
          />
        </li>
        {taskList.map((task, index) => (
          <li
            className="addedTask"
            key={index}
            onMouseEnter={() => setShowX(true)}
            onMouseLeave={() => setShowX(false)}
          >
            {task.label}
            {showX ? (
              <i
                className="fas fa-xmark"
                onClick={() => handleDeleteTask(task.id)}
              ></i>
            ) : null}
          </li>
        ))}
        <li className='li-final'>
          <strong>{taskList.length}</strong> Remaining tasks
        </li>
      </ul>
      <ToastContainer />
    </>
  );
};

export default App;