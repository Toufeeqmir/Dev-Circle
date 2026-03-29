const express = require("express");
const router = express.Router();
const {getComments, createComment } = require("../controllers/comment.controller");
const {protect} = require("../middleware/auth.middleware");

router.post("/", protect, createComment);
router.get("/:postId", getComments);


module.exports = router;