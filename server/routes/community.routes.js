const express = require("express");
const router = express.Router();

const {getCommunities, createCommunity, joinCommunity} = require("../controllers/community.controller");
const {protect} = require("../middleware/auth.middleware");

router.get("/", getCommunities);
router.post("/", protect, createCommunity);
router.put("/:communityId/join", protect, joinCommunity); 

module.exports = router;