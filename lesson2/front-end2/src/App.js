import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [item, setItem] = useState("");

  const fetchTasks = async() => {
    try {      
      const response = await axios.get("/api/todo");
      setTasks(response.data);
    } catch(error) {
      setError("error retrieving tasks: " + error);
    }
  }
  const createTask = async() => {
    try {
      await axios.post("/api/todo", {task: item, completed: false});
    } catch(error) {
      setError("error adding a task: " + error);
    }
  }
  const deleteOneTask = async(task) => {
    try {
      await axios.delete("/api/todo/" + task.id);
    } catch(error) {
      setError("error deleting a task" + error);
    }
  }
  const toggleOneTask = async(task) => {
    try {
      if(task.completed === true) {
        task.completed = false;
      } else {
        task.completed = true;
      }
      await axios.put("/api/todo/" + task.id, task);
    } catch(error) {
      setError("error modifying a task" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchTasks();
  },[]);

  const addTask = async(e) => {
    e.preventDefault();
    await createTask();
    fetchTasks();
    setItem("");
  }

  const deleteTask = async(task) => {
    await deleteOneTask(task);
    fetchTasks();
  }
  const toggleTask = async(task) => {
    await toggleOneTask(task);
    fetchTasks();
  }
  // render results
  return (
    <div className="App">
      {error}
      <h1>Create a Task</h1>
      <form onSubmit={addTask}>
        <div>
          <label>
            Task:
            <input type="text" value={item} onChange={e => setItem(e.target.value)} />
          </label>
        </div>
        <input type="submit" value="Submit" />
      </form>
      <h1>Tasks</h1>
      {tasks.map( item => (
        <div key={item.id} className={item.completed?"strike":"todo"}>
            <p><i onClick={e=> toggleTask(item)}>-- {item.task}</i></p>
          <button onClick={e => deleteTask(item)}>Delete</button>
        </div>
      ))}     
    </div>
  );
}

export default App;
