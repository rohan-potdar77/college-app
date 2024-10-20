const express = require("express");
const router = express.Router();
const College = require("../models/College");
const { authenticateToken } = require("../middlewares/authentication");

router.use(authenticateToken);

router.post("/", async (req, res) => {
  try {
    const college = new College(req.body);
    await college.save();
    res.status(201).send(college);
  } catch (err) {
    res
      .status(400)
      .send({ error: "Failed to create college", details: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const colleges = await College.find();
    res.send(colleges);
  } catch (err) {
    res
      .status(500)
      .send({ error: "Failed to retrieve colleges", details: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!college) {
      return res.status(404).send({ error: "College not found" });
    }
    res.send(college);
  } catch (err) {
    res
      .status(400)
      .send({ error: "Failed to update college", details: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) {
      return res.status(404).send({ error: "College not found" });
    }
    res.send({ message: "College deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .send({ error: "Failed to delete college", details: err.message });
  }
});

module.exports = router;
