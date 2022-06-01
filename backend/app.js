const express = require("express");
require("dotenv").config();
require("./db/conn");
const userRouter = require("./routes/user");

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(userRouter);

app.listen(8000, () => {
  console.log("I am live at " + PORT + "!");
});
