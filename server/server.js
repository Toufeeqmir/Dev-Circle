const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
  

  
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/communities", require("./routes/community.routes"));
app.use("/api/posts", require("./routes/post.routes"));
app.use("/api/comments", require("./routes/comment.routes"));
app.use("/api/users", require("./routes/user.routes"))




const BASE_PORT = process.env.PORT || 3000;
connectDB();



app.listen(BASE_PORT, () =>  console.log(`server is running on port ${BASE_PORT}`));


   

   
    
