const { Login } = require("../Controllers/AuthLogin");
const router = require("express").Router();

router.post("/login", Login);

module.exports = router;