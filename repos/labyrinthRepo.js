const LabyrinthesModel = require("../models/labyrinth");

const getAllLabyrinthes = async () => {
  const labyrinthes = await LabyrinthesModel.find().exec();
  return labyrinthes;
};

const getLabyrinthById = async (id) => {
  const labyrinth = await LabyrinthesModel.findById(id).exec();
  return labyrinth;
};

const addLabyrinth = async (labyrinth) => {
  const model = new LabyrinthesModel(labyrinth);
  const savedLabyrith = await model.save();
  return savedLabyrith;
};

const updateStart = async (id, x, y) => {
  let labyrinth = await LabyrinthesModel.findById(id).exec();
  labyrinth.start = { x, y };
  labyrinth = await labyrinth.save();
  return labyrinth;
};

const updateEnd = async (id, x, y) => {
  let labyrinth = await LabyrinthesModel.findById(id).exec();
  labyrinth.end = { x, y };
  labyrinth = await labyrinth.save();
  return labyrinth;
};

const updateField = async (id, x, y, type) => {
  let labyrinth = await LabyrinthesModel.findById(id).exec();
  labyrinth.grid[y][x] = type;
  labyrinth.markModified("grid");
  labyrinth = await labyrinth.save();
  return labyrinth;
};

module.exports = {
  getAllLabyrinthes,
  getLabyrinthById,
  addLabyrinth,
  updateStart,
  updateEnd,
  updateField,
};
