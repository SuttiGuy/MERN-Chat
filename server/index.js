const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const User = require("./models/User");
const Message = require("./models/Message");
const ws = require("ws");
const fs = require("fs");

//เพื่อโหลดค่าตัวแปร
dotenv.config();

const app = express();
const CLIENT_URL = process.env.CLIENT_URL;
app.use(cors({ credentials: true, origin: "CLIENT_URL" }));
app.use(express.json());
app.use(cookieParser());
//set static(public) folder
app.use("/uploads", express.static(__dirname + "/uploads"));

//เชื่อมต่อฐานข้อมูล
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);
app.get("/", (req, res) => {
  res.send("<h1>'This a ReSTful for MERN Chat'</h1>");
});

//Register
const salt = bcrypt.genSaltSync(10);
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

//login
const secret = process.env.SECRET;
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (userDoc) {
    const isMatchedPassword = bcrypt.compareSync(password, userDoc.password);
    if (isMatchedPassword) {
      //logged in
      jwt.sign({ username, id: userDoc }, secret, {}, (err, token) => {
        if (err) throw err;
        //Save data in cookie
        res.cookie("token", token).json({
          id: userDoc.id,
          username,
        });
      });
    } else {
      res.status(400).json("wrong credentials");
    }
  } else {
    res.status(404).json("user not found");
  }
});

//User logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, secret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

//Run Server
const POST = process.env.POST;
const server = app.listen(POST, () => {
  console.log("Server is running on http://localhost:" + POST);
});

//web Socket Server
const wss = new ws.WebSocketServer({ server });

wss.on('connection', (connection, req) => {
  const notifyAboutOnlinePeople = () => {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      );
    });
  };
  connection.timer = setInterval(() => {
    connection.ping();
    connection.deadTimer = setTimeout(() => {
      connection.isAlive = false
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log('dead');
    }, 1000);
  }, 5000);
  connection.on('pong', () => {
    clearTimeout(connection.deadTimer);
  });

  connection.on("pong", () => {
    clearTimeout(connection.deadTimer);
  });
  //read username and id from the cookie
  const cookie = req.headers.cookie;
  if (cookie) {
    //token=jdfsjafhuewqdsfsa;
    //user=sfdgdsgfdgdfgdgdsgdg;
    //date=123454
    const tokenCookieString = cookie
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")(1);
      if (token) {
        jwt.verify(token, secret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }
  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, sender, text, file } = messageData;
    let filename = null;
    if (file) {
      const parts = file.name.split(".");
      const ext = parts[parts.length - 1];
      filename = Date.now() + "." + ext;
      const  path = __dirname + "/uploads/" +filename;
      const bufferData = Buffer.from(file.data.split(",")[1], 'base64')
      //อยู่ใน uploads
      fs.writeFile(path,bufferData, ()=> {
        console.log("file saved: " + path);
      });
    }
    if(recipient && (text || file )){
        const messageDoc = await Message.create({
            sender: connection.userId,
            recipient,
            text,
            file: file ? filename : null,    
        }); 
        [...wss.clients].filter(c=>c.userId === recipient).forEa(c=> c.send(JSON.stringify({
            text,
            file: file? filename : null,
            sender: connection.userId,
            recipient,
            _id:messageData._id,
        })))
    }
   
  });
  notifyAboutOnlinePeople();
});
