# Front End
1. Create a new React project
```
npx create-react-app front-end
```

2. Now go into this directory and run:

```sh
cd front-end
npm install
npm install axios
```
This will install all of the dependencies this code needs. 

3. Insert a proxy line in the "package.json" file so that requests to port 8080 to the "/api/tasks" route will be forwarded to port 3000. And add the Homepage line so that the app can be at a relative path.
```
{
  "name": "front-end",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:3000",
  "homepage": ".",
```

4. You will also need to create a file ".env.development.local" with the following content
```
DANGEROUSLY_DISABLE_HOST_CHECK=true
```
The development web server will normally not serve files to a browser from another host, but we want it to so you can develop on Cloud9.
This ".env" file will make things work.  If you dont have this file, you will get the error "Invalid Host header" when you access your React development server.  If you are developing on your laptop, you wont need to worry about this.

6. Now insert the code to call the back end into src/App.js
```
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

```
And add the following lines to App.css
```
.todo {
  cursor: pointer;
}
.strike {
  text-decoration: line-through;
}
```

7. Now start the front end server
```sh
npm start
```

You now have a React front end for a ticket service. 

### State hooks

In `App.js`, are using a [functional component](https://reactjs.org/docs/components-and-props.html) and the [state hook](https://reactjs.org/docs/hooks-state.html). Thus we have three lines that create state variables:

```js
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [item, setItem] = useState("");
```

Each variable (such as `tasks`) comes with a setter function (such as `setTasks`). You also provide a default value in `useState`, such as `[]` or an empty string. You can [read more about the useState hook](https://reactjs.org/docs/hooks-reference.html#usestate).

### Calling the API

You will see three methods for calling the API. We use this function to GET all of the current tasks:

```js
  const fetchTasks = async() => {
    try {      
      const response = await axios.get("/api/todo");
      setTasks(response.data);
    } catch(error) {
      setError("error retrieving tasks: " + error);
    }
  }
```

Notice how we use `await` to wait for the API response. This is because axios returns a Promise. Using `await` means your code is free to handle other events (such as a button click), but this method will not run the next line of code until the Promise is finished.

We also wrap this API call in a `try/catch` block so that we can capture any errors that occur and display them in the UI.

### Fetching tasks when the component is rendered

You will see this line in the function, calling [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect):

```js
  useEffect(() => {
    fetchTasks();
  },[]);
```

This fetches the tasks once, when the application starts. Let's break down what this is doing. The first argument to `useEffect` is a function:

```js
() => { fetchTasks(); }
```

This function takes no arguments and simply calls `fetchTasks()`. We wrap `fetchTasks` in a function because it is an `async` function, and `useEffect` can't handle Promises.

The second argument to `useEffect` is the empty array `[]`. This is a list of dependencies, indicating when the hook should run (whenever its dependencies change). However, since we have given it an empty list, the hook won't run again. Be careful with this -- if you leave off this argument, the function will run after *every* render. This would result in an infinite loop in our case -- `fetchTasks` will cause the component to render (so it can show the tasks), which will trigger another call to `fetchTasks` and so on.

### Handling form events

Each form input needs to handle the `onChange` event. For example:

```js
<input type="text" value={item} onChange={e => setItem(e.target.value)} />
```

Every time the input value changes, we call a function, which takes `e`, an event. This function calls `setItem` with the value of what was typed into the input field, `e.target.value`. Notice we also set the value to the `item` state variable, so that if we change it in our code, this will be shown on the page.

Likewise, we need a function to handle the event that is triggered when the form is submitted:

```js
<form onSubmit={addTask}>
```

This will call the `addTask` function:

```js
  const addTask = async(e) => {
    e.preventDefault();
    await createTask();
    fetchTasks();
    setItem("");
  }
```

We first use `e.preventDefault()` so that the page is not reloaded (the standard browser behavior when submitting a form). We then create the task, fetch all tasks (which should include the new one), and reset the `name` and `problem` state variables. Calling `fetchTasks` will result in a change to the `tasks` state variable. Changing all three state variables will cause the page to be rendered again, showing the changes.

### The rest of the code

You will see the rest of the code uses one of these concepts.

### Connecting the back end to the front end

By default, the React app runs on port `8080`. Your back end server runs on port `3000`. You will be tempted to put the full URL into your API requests, like this:

```js
const response = await axios.get("http://yourserverurl:3000/api/todo");
```

You don't want to do this! This hard-codes a particular hostname (localhost) and port (3030) into your app. It will break when you deploy it.

Instead, notice how our code does this:

```js443
const response = await axios.get("/api/todo");
```

We leave off the hostname and the port number. By default, this means it goes to the same host and port where the front end is running. While developing the code, this is `yourserverurl:8080`. When running the code, it might be `yourserverulr` at port 443 (because we are using a secure server).

For this to work during development, we have the following line in `package.json`:

```js
  "proxy": "http://localhost:3000",
```

This tells the front end to act as a `proxy` for the back end, sending any request that it doesn't handle (such as for `/api/todo`) to the listed hostname and port: `localhost:3000`.

When we deploy a React + Node app on a server, we will likewise setup your web server (nginx or Caddy) so that it can reverse proxy API requests to the Node server.

You should be able to test this if you still have your back end and front end
server running.  Make sure you run your front end in a window with "inspect" and look for errors in the console.
