const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send('Welcome to my favourite movie list');
};

app.get('/', welcome);

const movieHandlers = require('./movieHandlers');
const userHandlers = require('./userHandlers');
const validator = require('./validator');
const { hashPassword, verifyPassword, verifyToken } = require('./auth');

app.get('/api/movies', movieHandlers.getMovies);
app.get('/api/movies/:id', movieHandlers.getMovieById);
app.get('/api/users', userHandlers.getUsers);
app.get('/api/users/:id', userHandlers.getUsersById);

app.post('/api/users', validator.validateUser, hashPassword, userHandlers.postUser);
app.post('/api/login', userHandlers.getUserByEmailWithPasswordAndPassToNext, verifyPassword);

app.use(verifyToken);

app.post('/api/movies', validator.validateMovie, movieHandlers.postMovies);

app.put('/api/movies/:id', validator.validateMovie, movieHandlers.updateMovies);
app.put('/api/users/:id', validator.validateUser, userHandlers.updateUser);

app.delete('/api/movies/:id', movieHandlers.deleteMovies);
app.delete('/api/users/:id', userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error('Something bad happened');
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
