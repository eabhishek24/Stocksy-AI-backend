const { Signup } = require("../Controllers/AuthSignUp");
const router = require("express").Router();

router.post("/signup", Signup);

module.exports = router;