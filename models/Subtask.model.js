const mongoose = require("mongoose");

const SubtaskSchema = mongoose.Schema({
  title: String,
  isCompleted: { type: Boolean, default: false },
});

const SubtaskModel = mongoose.model("Subtask", SubtaskSchema);

module.exports = SubtaskModel;
