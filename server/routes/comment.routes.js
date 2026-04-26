const express = require("express");
const router = express.Router();
const {getComments, createComment, deleteComment } = require("../controllers/comment.controller");
const {protect} = require("../middleware/auth.middleware");

router.post("/", protect, createComment);
router.get("/:postId", getComments);
router.delete("/:id", protect, deleteComment);


module.exports = router;
