const express = require('express');

const BIND = process.env.BIND || 'localhost'
const PORT = process.env.PORT || 9101

const app = express();

app.post('/users-list', (req, res) => {
  const usersList = req.body;

  // Save the data of user that was sent by the client

  // Send a response to client that will show that the request was successfull.
  res.send({
    message: 'New user was added to the list',
  });
});

// static content
app.use(express.static('mod'))


app.listen(PORT, BIND, () => {
    console.log(`Cork server is running on http://${BIND}:${PORT}`);
})
