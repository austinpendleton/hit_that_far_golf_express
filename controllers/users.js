const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const { NotFoundError } = require("../errors/not-found-error");
const { ConflictError } = require("../errors/conflict-error");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => new NotFoundError("Not Found"))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      next(error);
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => {
      res.status(201).send({
        data: { name: user.name, email: user.email },
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError("Duplicate email error"));
      } else {
        next(error);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token, message: "Here is the token" });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
};
