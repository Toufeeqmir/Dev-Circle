const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");

const {getProfile, updateProfile, uploadAvatar} = require("../controllers/User.controller");
const{protect} = require("../middleware/auth.middleware");

router.get("/:username", getProfile);
router.put("/profile", protect, updateProfile);
router.put("/profile/avatar", protect , upload.single("avatar"), uploadAvatar);

module.exports = router;