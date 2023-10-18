const router = require("express").Router();
const auth = require("../middlewares/auth");

const { createItem, getItems, deleteItem } = require("../controllers/clubItem");

router.get("/", getItems);
router.use(auth);
router.post("/", createItem);

router.delete("/:itemId", deleteItem);

module.exports = router;
