const express = require("express");
const router = express.Router();
 
const {register , login, getMe} = require("../controllers/auth.controller");
const {protect} = require("../middleware/auth.middleware");

//Post /api/auth/register
router.post("/register", register);

//Post /api/auth/login
router.post("/login", login);

router.get("/me", protect , getMe);


module.exports = router;