/* eslint-disable radix */
const database = require('./database');

const getUsers = (req, res) => {
  let sql = 'SELECT id, firstname, lastname, email, city, language FROM users';
  const sqlValues = [];

  if (req.query.language != null) {
    sql += ' WHERE language = ?';
    sqlValues.push(req.query.language);
  }

  if (req.query.city != null) {
    if (req.query.language) {
      sql += ' and city = ?';
    } else {
      sql += ' WHERE city = ?';
    }
    sqlValues.push(req.query.city);
  }

  database
    .query(sql, sqlValues)
    .then(([users]) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query('select * from users where id = ?', [id])
    .then(([users]) => {
      if (!users[0]) {
        res.status(404).send('Not Found');
      } else {
        res.status(200).json(users);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const postUser = (req, res) => {
  const {
    firstname, lastname, email, city, language, hashedPassword,
  } = req.body;
  database
    .query('INSERT INTO users (firstname, lastname, email, city, language, hashedPassword) VALUES (?,?,?,?,?,?)', [firstname, lastname, email, city, language, hashedPassword])
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error saving the user');
    });
};

const updateUser = (req, res) => {
  const {
    firstname, lastname, email, city, language,
  } = req.body;
  const id = parseInt(req.params.id);
  
  if (req.payload.sub !== id) {
    res.sendStatus(403);
  } else {
    database
      .query(`UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ${id}`, [firstname, lastname, email, city, language])
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send('User not found');
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error update user');
      });
  }

};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  if (req.payload.sub !== id) {
    res.sendStatus(403);
  } else {
    database
      .query(`DELETE FROM users WHERE id = ${id}`)
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send('User not found');
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error deleting user');
      });  
  }
};

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  const { email } = req.body;
  database
    .query('SELECT * FROM users WHERE email = ?', [email])
    .then(([user]) => {
      if (user[0] !== null) {
        req.user = user[0];
        next();
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(401);
    });
};

module.exports = {
  getUsers,
  getUsersById,
  postUser,
  updateUser,
  deleteUser,
  getUserByEmailWithPasswordAndPassToNext,
};
