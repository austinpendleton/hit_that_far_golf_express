const clubItem = require("../models/clubItem");
const { BadRequestError } = require("../errors/bad-request-error");
const { NotFoundError } = require("../errors/not-found-error");
const { ForbiddenError } = require("../errors/forbidden-error");

const createItem = (req, res, next) => {
  const { name, yards, imageUrl } = req.body;

  clubItem
    .create({ name, yards, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(error);
      }
    });
};

const getItems = (req, res, next) => {
  clubItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((error) => {
      next(error);
    });
};

const deleteItem = (req, res, next) => {
  clubItem
    .findById(req.params.itemId)
    .orFail(() => new NotFoundError("Not Found"))
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        const error = new ForbiddenError("User Not Found");
        throw error;
      }
      return item.deleteOne().then(() => {
        res.send({ message: "Item deleted" });
      });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  deleteItem,
  createItem,
  getItems,
};
