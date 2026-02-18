const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require("path");

const app = express();
app.use(cookieParser());
app.set("trust proxy", 1);

const allowedOrigins = [
  "https://quill-frontend-k2zpizrfu-visha9764s-projects.vercel.app",
  "https://quill-git-main-visha9764s-projects.vercel.app",
  "https://quill-frontend-five.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

app.use("/images", express.static(path.join(__dirname,"/images")));

const connectDb = require('./db');
connectDb();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));

app.listen(process.env.PORT || 5000);
