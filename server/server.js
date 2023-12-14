const express = require("express");
const cors = require("cors");
const fs = require("fs");

const mongoose = require("mongoose");
const app = express();

app.use(cors());

app.use(express.json());
// app.use(cookieParser());

// const bodyParser = require("body-parser");

const mongoUri =
  "mongodb+srv://Hashim666:hashim66@cluster0.kmnli4r.mongodb.net/";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("DB connection established");
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });

fs.readdirSync("./routes").map((r) =>
  app.use("/api", require(`./routes/${r}`))
);

const port = 8000;

app.listen(port, () => {
  console.log("server listening on port:8000");
});
