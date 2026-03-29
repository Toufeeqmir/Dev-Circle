const express = require("express");
const router  = express.Router();
const {getPosts , createPost , votePost, getPostById} = require("../controllers/post.controller");
const {protect} = require("../middleware/auth.middleware");

router.post("/",protect,  createPost);
router.get("/", getPosts);
router.put("/:id/vote",protect,  votePost);
router.get("/:id", getPostById)
module.exports = router;