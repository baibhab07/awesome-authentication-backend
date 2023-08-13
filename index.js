const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const loginRoute = require("./routes/user/login");
const registerRoute = require("./routes/user/register");

//middleware
require("dotenv").config();

app.use((req, res, next) => {
  console.log("HTTP Method - " + req.method + " , URL - " + req.url);
  next();
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

//linking router files
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);

app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});
