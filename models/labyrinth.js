const { Schema, model } = require("mongoose");

const coordinateSchema = {
  _id: false,
  x: Number,
  y: Number,
};

const labyrinthScchema = new Schema({
  start: coordinateSchema,
  end: coordinateSchema,
  rows: Number,
  columns: Number,
  grid: [[String]],
});

module.exports = model("Labyrinth", labyrinthScchema);
