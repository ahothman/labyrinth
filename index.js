const express = require("express");
const mongoose = require("mongoose");
const middleWares = require("./middlewares");
const labyrinthRoute = require("./routes/labyrinth");
const { insertUseriFNotExists } = require("./utils/dbUtils");

const app = express();

app.use(middleWares.authenticationHandler);
app.use("/labyrinth", labyrinthRoute);
app.use(middleWares.objectIdErrHandler);
app.use(middleWares.genericErrHandler);

(async () => {
  await mongoose.connect("mongodb://localhost:27017/ionos", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  // insert a default user in case there ar not exists user
  await insertUseriFNotExists();
  app.listen(3000, () => {
    console.log("server started");
  });
})();
