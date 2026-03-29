const express = require("express");
const router = express.Router();

const {getProfile, updateProfile} = require("../controllers/user.controller");
const{protect} = require("../middleware/auth.middleware");

router.get("/:username", getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;