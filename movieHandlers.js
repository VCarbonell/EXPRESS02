/* eslint-disable radix */
const database = require('./database');

const getMovies = (req, res) => {
  let sql = 'SELECT * FROM movies';
  const sqlValues = [];

  if (req.query.color != null) {
    sql += ' WHERE color = ?';
    sqlValues.push(req.query.color);
  }

  if (req.query.max_duration != null) {
    if (req.query.color != null) {
      sql += ' and duration <= ?';
    } else {
      sql += ' WHERE duration <= ?';
    }
    sqlValues.push(req.query.max_duration);
  }

  database
    .query(sql, sqlValues)
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

const deleteMovies = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query(`DELETE FROM movies WHERE id = ${id}`)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Movie not found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error deleting the movie');
    });
};

module.exports = {
  getMovies,
  getMovieById,
  postMovies,
  updateMovies,
  deleteMovies,
};
