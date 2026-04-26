const express = require("express");
const router  = express.Router();
const {getPosts , createPost , votePost, getPostById, deletePost} = require("../controllers/post.controller");
const upload = require("../middleware/upload.middleware")
const {protect} = require("../middleware/auth.middleware");


router.get("/", getPosts);
router.put("/:id/vote",protect,  votePost);
router.get("/:id", getPostById);
router.post("/", protect, upload.single("image"), createPost);
router.delete("/:id", protect, deletePost);

module.exports = router;
