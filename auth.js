const argon2 = require('argon2');

const hashPassword = (req, res, next) => {
  argon2
    .hash(req.body.password, {
      type: argon2.argon2id, timeCost: 5, memoryCost: 2 ** 16, parallelism: 1,
    })
    .then((hashedPassword) => {
      req.body.hashedPassword = hashedPassword;
      console.log(req.body.hashedPassword);
      delete req.body.password;
      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  hashPassword,
};
