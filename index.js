require("dotenv").config();
const express = require("express");
const connection = require("./configs/db");
const cors = require("cors");
const UserRouter = require("./routes/User.route");
const BoardRouter = require("./routes/Board.route");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("KANBAN BOARD - HOME PAGE");
});

// ROUTES
app.use("/users", UserRouter);
app.use("/boards", BoardRouter);

app.listen(process.env.PORT, async (req, res) => {
  try {
    await connection;
    console.log("CONNNECTED TO DB");
  } catch (error) {
    console.log("ERROR WHILE CONNECTING TO DB");
  }
  console.log("SERVER IS RUNNING");
});
