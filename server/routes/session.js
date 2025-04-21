import express from "express";
import { body, validationResult } from "express-validator";

// This will help us connect to the database
import db from "../db/connection.js";

// This helps convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
const router = express.Router();

// Time format HH:MM
const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

// Date format YYYY-MM-DD
const dayRegex = /^\d{4}-\d{2}-\d{2}$/;

const validateSession = [
  body("student").isString().notEmpty().withMessage("Student is required and must be a string"),
  body("studentEmail").isEmail().withMessage("Email must be a valid email address"),
  body("tutor").isString().notEmpty().withMessage("Tutor is required and must be a string"),
  body("tutorEmail").isEmail().withMessage("Email must be a valid email address"),
  body("subject").isString().notEmpty().withMessage("Subject is required and must be a string"),
  body("duration").isString().notEmpty().withMessage("Duration is required and must be a string"),
  body("time")
    .matches(timeRegex)
    .withMessage("Time must be in the format HH:MM (e.g., 17:22)"),
  body("day")
    .matches(dayRegex)
    .withMessage("Day must be in the format YYYY-MM-DD (e.g., 2025-03-29)"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// This section will help you get a list of all the sessions.
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("sessions");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching sessions");
  }
});

// This section will help you get a single session by id
router.get("/:id", async (req, res) => {
  try {
    const sessionId = new ObjectId(req.params.id);
    let collection = await db.collection("sessions");
    let result = await collection.findOne({ _id: sessionId });

    if (!result) {
      res.status(404).send("Session not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching session");
  }
});

// This section will help you create a new session.
router.post("/", validateSession, handleValidationErrors, async (req, res) => {
  try {
    const { student,studentEmail, tutor, tutorEmail, subject, time, day, duration } = req.body;

    const newDocument = {
      student,
      studentEmail,
      tutor,
      tutorEmail,
      subject,
      time,
      day,
      duration,
    };

    let collection = await db.collection("sessions");
    let result = await collection.insertOne(newDocument);
    
    if (result.insertedId) {
      res.status(201).send({ message: "Session created", sessionId: result.insertedId });
    } else {
      res.status(400).send("Error creating session");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding session");
  }
});

// This section will help you update a session by id.
router.patch("/:id", validateSession, handleValidationErrors, async (req, res) => {
  try {
    const sessionId = new ObjectId(req.params.id);
    const { student, studentEmail, tutor, tutorEmail, subject, time, day, duration } = req.body;

    const updates = {
      $set: { student, studentEmail, tutor, tutorEmail, subject, time, day, duration },
    };

    let collection = await db.collection("sessions");
    let result = await collection.updateOne({ _id: sessionId }, updates);

    if (result.modifiedCount > 0) {
      res.status(200).send("Session updated successfully");
    } else {
      res.status(404).send("Session not found or no changes made");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating session");
  }
});

// This section will help you delete a session
router.delete("/:id", async (req, res) => {
  try {
    const sessionId = new ObjectId(req.params.id);
    const collection = db.collection("sessions");
    let result = await collection.deleteOne({ _id: sessionId });

    if (result.deletedCount > 0) {
      res.status(200).send("Session deleted successfully");
    } else {
      res.status(404).send("Session not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting session");
  }
});

export default router;
