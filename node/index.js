import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const { Schema } = mongoose;

app.use(cors());
app.use(express.json());

const usersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ticketNo: {
    type: Number,
    required: true,
  },
});

const Users = mongoose.model("Users", usersSchema);

const winnerSchema = new Schema({
  color: {
    type: String,
    required: true,
  },
  ticket: {
    type: Number,
    required: true,
  },
});

const Winner = mongoose.model("winner", winnerSchema);

const connect = async () => {
  try {
    mongoose
      .set("strictQuery", true)
      .connect("mongodb://localhost:27017/tickets", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    console.log("connected to mongodb");
  } catch (error) {
    console.error(error);
  }
};

app.get("/ticket", async (req, res, next) => {
  const userList = await Users.find();
  res.status(200).send(userList);
  next();
});

app.get("/users", async (req, res) => {
  if (req.query.name) {
    const usersList = await Users.findOne({ name: req.query.name });
    const searchWinColor = await Winner.findOne({
      ticketNo: req.query.ticketNo,
    });
    if (searchWinColor?.color === req.query.color && usersList) {
      res.json({
        msg: "hurray! you win",
      });
    } else {
      if (!usersList) {
        res.json({
          errMsg: "not registered",
        });
      } else {
        res.json({
          errMsg: "you have lost",
        });
      }
    }
  } else {
    const usersList = await Users.find();
    res.json({
      usersList: usersList,
    });
  }
});

app.post("/register", async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      ticketNo: req.body.ticketNo,
    };
    const userList = await Users.findOne({ name: req.body.name });

    if (!userList) {
      const response = await Users.create(data);
      if (response) {
        res.json({
          msg: "user registered",
        });
      } else {
        res.json({
          msg: "registration failed",
        });
      }
    } else {
      res.json({ msg: "users already exists" });
    }
  } catch (error) {
    console.error(error);
  }
  next();
});

app.post("/winner", async (req, res, next) => {
  try {
    const data = {
      color: req.body.color,
      ticket: req.body.ticket,
    };
    const response = await Winner.create(data);
    if (response) {
      res.json({
        msg: `winner ticket number ${req.body.ticket} and color is ${req.body.color}`,
      });
    } else {
      res.json(`failed to upload data`);
    }
  } catch (error) {
    console.error(error);
  }
  next();
});

let port = 8000;
app.listen(port, (err) => {
  if (!err) {
    console.log(`server started at port: ${port}`);
    connect();
  } else {
    console.log(`error occured ${err}`);
  }
});
