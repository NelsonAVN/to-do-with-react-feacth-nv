import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

const App	 = () => {
  
  const [newTask, setNewTask] = useState ('')
  const [taskList, setTaskList] = useState ([])

  const [showX, setShowX] = useState(false)

  const notifyTaskAdded = () => toast.success('Added Task');
  const notifyTaskEmpty = () => toast.error('you must add a task');
  const notifyTaskDeleted = () => toast.error ("Deleted task")


  const handlePressKey = (e) => {
    if (newTask === "" && e.key === "Enter"){
      notifyTaskEmpty()
      return
    }

    if( e.key === "Enter" ) {
      setTaskList([...taskList, newTask])
      notifyTaskAdded(" Task Add")
      setNewTask('')
    }
  }

  const handleDeleteTask =(index) => {
          
      setTaskList(taskList.filter((task, i) => i !== index))
      notifyTaskDeleted()

  }

  return (
    <>

    <h1>todos</h1>
    <ul>
    <li><input name='task' type="text" placeholder={taskList.length === 0 ? "No unfinished tasks, add a new one" : "Add task" }  
    onChange={(e) => (setNewTask(e.target.value))}
    value={newTask}
    onKeyDown={handlePressKey}

    /></li>
    {taskList.map((task, index) => {
             return <li className="addedTask"
             key={index}
             onMouseEnter ={() => setShowX(true) }
             onMouseLeave={() => setShowX(false)}>
              {task}
             {showX ? <i className="fas fa-xmark" 
             onClick={() => handleDeleteTask(index)}></i> : null}</li>
             
    })}

    <li className='li-final'> <strong> {taskList.length} </strong> Remaining tasks</li>
    </ul>
    < ToastContainer />

    </>
  )
}

export default App
