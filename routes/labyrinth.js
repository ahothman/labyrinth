const express = require("express");
const repo = require("../repos/labyrinthRepo.js");
const { asyncWrapper } = require("../utils/asyncUtils");
const { solve, createEmptyLabyrinth } = require("../utils/labyrinthUtils");
const { HttpError } = require("../errors");
const { EMPTY, FILLED } = require("../config");
const { coordinatesValidaton, typeValidaton } = require("../middlewares");
const router = express.Router();

router.get(
  "/",
  asyncWrapper(async (req, res, next) => {
    const labyrinthes = await repo.getAllLabyrinthes();
    res.status(200).json({ labyrinthes });
  })
);

router.get(
  "/:id",
  asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const labyrinth = await repo.getLabyrinthById(id);
    if (labyrinth == null) {
      return next(new HttpError(`No labyrinth found with this id ${id}`, 404));
    }
    res.status(200).json({ labyrinth });
  })
);

router.post(
  "/",
  asyncWrapper(async (req, res, next) => {
    const _labyrinth = createEmptyLabyrinth();
    const labyrinth = await repo.addLabyrinth(_labyrinth);
    res.status(200).json({ labyrinth });
  })
);

router.put(
  "/:id/playfield/:x/:y/:type",
  coordinatesValidaton,
  typeValidaton,
  asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const x = parseInt(req.params.x, 10);
    const y = parseInt(req.params.y, 10);
    const type = req.params.type.toUpperCase();

    let labyrinth = await repo.getLabyrinthById(id);

    if (labyrinth == null) {
      return next(new HttpError(`No labyrinth found with this id ${id}`, 404));
    }

    const { start, end, columns, rows } = labyrinth;

    if ((start.x == x && start.y == y) || (end.x == x && end.y == y)) {
      return next(
        new HttpError("You can not fill the end or the start point", 400)
      );
    }

    if (x >= columns || y >= rows || x < 0 || y < 0) {
      return next(
        new HttpError(
          "the x and y axises should be within the labyrinth range",
          400
        )
      );
    }

    labyrinth = await repo.updateField(id, x, y, type);

    res.status(200).json({ labyrinth });
  })
);

router.put(
  "/:id/start/:x/:y",
  coordinatesValidaton,
  asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const x = parseInt(req.params.x, 10);
    const y = parseInt(req.params.y, 10);

    let labyrinth = await repo.getLabyrinthById(id);

    if (labyrinth == null) {
      return next(new HttpError(`No labyrinth found with this id ${id}`, 404));
    }

    const { end, columns, rows } = labyrinth;

    if (end.x == x && end.y == y) {
      return next(
        new HttpError("the end and the start points cannot be the same", 400)
      );
    }

    if (x >= columns || y >= rows || x < 0 || y < 0) {
      return next(
        new HttpError(
          "the x and y axises should be within the labyrinth range",
          400
        )
      );
    }

    labyrinth = await repo.updateStart(id, x, y);

    res.status(200).json({ labyrinth });
  })
);

router.put(
  "/:id/end/:x/:y",
  coordinatesValidaton,
  asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const x = parseInt(req.params.x, 10);
    const y = parseInt(req.params.y, 10);

    let labyrinth = await repo.getLabyrinthById(id);

    if (labyrinth == null) {
      return next(new HttpError(`No labyrinth found with this id ${id}`, 404));
    }

    const { start, columns, rows } = labyrinth;
    if (start.x == x && start.y == y) {
      return next(
        new HttpError("the end and the start points cannot be the same", 400)
      );
    }

    if (x >= rows || y >= columns || x < 0 || y < 0) {
      return next(
        new HttpError(
          "the x and y axises should be within the labyrinth range",
          400
        )
      );
    }

    labyrinth = await repo.updateEnd(id, x, y);

    res.status(200).json({ labyrinth });
  })
);

router.get(
  "/:id/solution",
  asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const labyrinth = await repo.getLabyrinthById(id);

    if (labyrinth == null) {
      return next(new HttpError(`No labyrinth found with this id ${id}`, 404));
    }

    const directions = solve(labyrinth);
    res.status(200).json({ directions });
  })
);

module.exports = router;
