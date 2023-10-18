const router = require("express").Router();
const User = require("./users");
const clubItem = require("./clubItem");

const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { NotFoundError } = require("../errors/not-found-error");

router.use("/users", auth, User);
router.use("/items", clubItem);

router.get(`/carsh-rest`, () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

router.post("/signup", createUser);
router.post("/signin", login);

router.use(() => {
  throw new NotFoundError("Router not found");
});

module.exports = router;
