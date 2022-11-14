/* eslint-disable radix */
const movies = [
  {
    id: 1,
    title: 'Citizen Kane',
    director: 'Orson Wells',
    year: '1941',
    colors: false,
    duration: 120,
  },
  {
    id: 2,
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    year: '1972',
    colors: true,
    duration: 180,
  },
  {
    id: 3,
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    year: '1994',
    color: true,
    duration: 180,
  },
];

const database = require('./database');

const getMovies = (req, res) => {
  database
    .query('select * from movies')
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query('select * from movies where id = ?', [id])
    .then((result) => {
      if (!result) {
        res.status(404).send("Film doesn't exist");
      } else {
        res.json(result);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const postMovies = (req, res) => {
  const {
    title, director, year, color, duration,
  } = req.body;

  database
    .query(
      'INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)',
      [title, director, year, color, duration],
    )
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error saving the movie');
    });
};

const updateMovies = (req, res) => {
  const {
    title, director, year, color, duration,
  } = req.body;
  const id = parseInt(req.params.id);

  database
    .query(`UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? WHERE id = ${id}`, [title, director, year, color, duration])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Movie not found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error editing the movie');
    });
};

module.exports = {
  getMovies,
  getMovieById,
  postMovies,
  updateMovies,
};
