const express = require('express');
const app = express();

app.get('/', (req, res) => { // C
  res.send('Hello World!');
});

app.post('/', (req, res) => { // R
  res.send('Here is the response to your POST, man!\n');
});

app.put('/', (req, res) => { // U
  res.send('I am updated.\n');
});

app.delete('/', (req, res) => { // D
  res.send('All my memories have been deleted. Are you happy now?\n');
});

app.get('/secret', (req, res) => {
  res.send('Psst. You are being watched.\n');
});

app.get('/api/user/1', (req, res) => {
  res.send({
    name: "Amy Caprietti",
    avatar: "/avatars/supergirl.jpg",
    role: "admin"
  });
});

app.listen(3000, () => console.log('Server listening on port 3000!'));