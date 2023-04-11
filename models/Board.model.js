const mongoose = require("mongoose");

const BoardSchema = mongoose.Schema({
  name: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task", default: [] }],
});

const BoardModel = mongoose.model("Board", BoardSchema);

module.exports = BoardModel;
