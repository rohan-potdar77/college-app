const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const collegeRoutes = require("./routes/colleges");
const userRoutes = require("./routes/users");

const port = 4000;
const app = express();

mongoose
  .connect("mongodb://localhost:27017/CollegeDB")
  .then(() => console.info("database connected!"))
  .catch((error) => console.error(error));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/colleges", collegeRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => console.info(`Server running on port ${port}`));
