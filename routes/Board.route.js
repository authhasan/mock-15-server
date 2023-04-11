const { Router } = require("express");
const BoardModel = require("../models/Board.model");
const TaskModel = require("../models/Task.model");
const SubtaskModel = require("../models/Subtask.model");

const BoardRouter = Router();

BoardRouter.get("/", async (req, res) => {
  const boards = await BoardModel.find();

  if (boards.length == 0) {
    const board = new BoardModel({ name: "Board 1", tasks: [] });
    await board.save();
    res.send(board);
  } else {
    let board = await BoardModel.findById(boards[0]._id)
      .populate("tasks")
      .populate({ path: "tasks", populate: "subtask" });
    res.send(board);
  }
});

BoardRouter.post("/addtask", async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const board = await BoardModel.findOne();

    let subtasks = [];
    for (let i = 0; i < req.body.subtask.length; i++) {
      let subtask = new SubtaskModel(req.body.subtask[i]);
      await subtask.save();
      subtasks.push(subtask);
    }

    let newTask = new TaskModel({
      title,
      description,
      status,
      subtask: subtasks,
    });
    await newTask.save();
    board.tasks.push(newTask);

    await board.save();
    res.send({ msg: "Task added successfully" });
  } catch (error) {
    res.status(400).send("Something went wrong.", error);
  }
});

BoardRouter.patch("/updatetask/:id", async (req, res) => {
  try {
    await TaskModel.findByIdAndUpdate(req.params.id, req.body);

    for (let i = 0; i < req.body.subtask.length; i++) {
      let subt = req.body.subtask[0];

      await SubtaskModel.findByIdAndUpdate(subt._id, {
        title: subt.title,
        isCompleted: subt.isCompleted,
      });
    }
    res.send({ msg: "Updated successfully" });
  } catch (error) {
    res.status(400).send("Something went wrong.", error);
  }
});

BoardRouter.patch("/deletetask/:id", async (req, res) => {
  try {
    await TaskModel.findByIdAndDelete(req.params.id);

    res.send({ msg: "Deleted successfully" });
  } catch (error) {
    res.status(400).send("Something went wrong.", error);
  }
});

module.exports = BoardRouter;
