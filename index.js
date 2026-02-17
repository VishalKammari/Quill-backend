const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

const multer = require('multer');
const path=require("path")
app.use("/images",express.static(path.join(__dirname,"/images")))


const allowedOrigins = [
  "https://quill-git-main-visha9764s-projects.vercel.app",
  "quill-tan-nine.vercel.app",
  "https://quill-bp03sa5ys-visha9764s-projects.vercel.app"
];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.indexOf(origin) === -1) {
//       return callback(new Error("CORS not allowed"), false);
//     }

//     return callback(null, true);
//   },
//   credentials: true
// }));


app.use(cors({
  origin: true,
  credentials: true
}));




app.use(express.json());
app.use(cookieParser());
const connectDb = require('./db');
console.log("JWT_SECRET:", process.env.JWT_SECRET);
connectDb();
const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);
const usersRoute = require('./routes/users');
app.use('/api/users', usersRoute);
const postRoute = require('./routes/posts');
app.use('/api/posts', postRoute);
const commentRoute = require('./routes/comments');
app.use('/api/comments', commentRoute);



const storage=multer.diskStorage({
    destination:(req,file,fn)=>{
        fn(null,"images")
    },
    filename:(req,file,fn)=>{
        // Use the client-provided filename so post.photo matches the saved file.
        fn(null, req.body.img)
    }
})

const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    // console.log(req.body)
    res.status(200).json("Image has been uploaded successfully!")
})

app.get("/",(req,res)=>{
    res.status(200).json("Server is running!")
})


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});