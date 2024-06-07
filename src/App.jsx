import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

const App	 = () => {
  
  const [newTask, setNewTask] = useState ('')
  const [taskList, setTaskList] = useState ([])

  const [showX, setShowX] = useState(false)

  const notifyUserCreated = () => toast.success('Success creating user')
  const notifyTaskAdded = () => toast.success('Task has been added');
  const notifyTaskDeleted = () => toast.error ('Task has been deleted')
  const notifyUserDeleted = () => toast.error ('User was deleted')


  const createUser = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/users/NelsonV', {
        method: 'POST',
      });
      if (!response.ok) {
        console.log("user already exist")
      }
      const data = await response.json();
      console.log('User created:', data);
      notifyUserCreated();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  useEffect (() =>{
    getTasks()
  }, [])

  const getTasks = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/users/NelsonV', {
        method: 'GET',
      });
      if (!response.ok) {
        console.log("error al traer las tareas")
      }
      const data = await response.json();
      setTaskList(data.todos);
    } catch (error) {
      console.error('Error al traer las tareas:', error);
    }
  };


  const deleteUser = (e) => { 
    const response = fetch('https://playground.4geeks.com/todo/users/NelsonV', {
        method: 'DELETE',
      })
      .then((response) => {
        if (response.ok) {
          setTaskList([]);
        } else {
          console.error('Error deleting user:', response.statusText);
        }
        notifyUserDeleted ();
      })
      .catch((error) => console.error('Error deleting user:', error));
  };


  const createTodo = (e) => {
    if (e.key === 'Enter' && newTask.length > 0) {
      fetch("https://playground.4geeks.com/todo/todos/NelsonV", {
        method: 'POST',
        body: JSON.stringify({
          label: newTask,
          is_done: false
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTaskList([...taskList, data]);
        setNewTask('');
        notifyTaskAdded ();
      })
      .catch((error) => console.error('Error creating task:', error));
    }
  }


  const handleDeleteTask = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE"
    })
    .then((response) => {
      if (response.ok) {
        setTaskList(taskList.filter(task => task.id !== id));
      } else {
        console.error('Error deleting task:', response.statusText);
      }
      notifyTaskDeleted ();
    })
    .catch((error) => console.error('Error deleting task:', error));
  }


  


  return (
    <>

    <h1>todos</h1>
    <div className='buttons'>
    <button onClick={createUser}>Create User</button>
    <button onClick={deleteUser}>Delete User</button>
    </div>
    <ul>
    <li><input name='task' type="text" placeholder={taskList && taskList.length === 0 ? "No unfinished tasks, add a new one" : "Add task" }  
    onChange={(e) => (setNewTask(e.target.value))}
    value={newTask}
    onKeyDown={createTodo}

    /></li>
    {taskList && taskList.map((task, index,) => {
             return <li className="addedTask"
             key={index}
             onMouseEnter ={() => setShowX(true) }
             onMouseLeave={() => setShowX(false)}>
              {task.label}
             {showX ? <i className="fas fa-xmark" 
             onClick={() => handleDeleteTask(task.id)}></i> : null}</li>
             
    })}

    <li className='li-final'> <strong> {taskList && taskList.length} </strong> Remaining tasks</li>
    </ul>
    < ToastContainer />

    </>
  )
}

export default App