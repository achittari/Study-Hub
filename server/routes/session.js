import express from "express";
import { body, validationResult } from "express-validator";
import Session from "../models/sessionModel.js"; // Import the Session model

const router = express.Router();

// Time format HH:MM
const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

// Date format YYYY-MM-DD
const dayRegex = /^\d{4}-\d{2}-\d{2}$/;

// Validation for the session schema
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

// Function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find(); // Mongoose query to find all sessions
    res.status(200).json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching sessions");
  }
});

// Get a single session by id
router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id); // Mongoose query to find session by ID
    if (!session) {
      return res.status(404).send("Session not found");
    }
    res.status(200).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching session");
  }
});

// Create a new session
router.post("/", validateSession, handleValidationErrors, async (req, res) => {
  try {
    const { student, studentEmail, tutor, tutorEmail, subject, time, day, duration } = req.body;

    // Create a new session using Mongoose model
    const newSession = new Session({
      student: { name: student, email: studentEmail },
      tutor: { name: tutor, email: tutorEmail },
      subject,
      time,
      day,
      duration,
    });

    // Save the session to the database
    await newSession.save();

    res.status(201).json({ message: "Session created", sessionId: newSession._id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating session");
  }
});

// Update a session by id
// Update a session by id
router.patch("/:id", validateSession, handleValidationErrors, async (req, res) => {
  const { student, studentEmail, tutor, tutorEmail, subject, time, day, duration } = req.body;
  try {
    const session = await Session.findById(req.params.id); // Mongoose query to find session by ID
    if (!session) {
      return res.status(404).send("Session not found");
    }

    // Update only the fields that are provided in the request body
    if (student) {
      session.student.name = student;
    }
    if (studentEmail) {
      session.student.email = studentEmail;
    }
    if (tutor) {
      session.tutor.name = tutor;
    }
    if (tutorEmail) {
      session.tutor.email = tutorEmail;
    }
    if (subject) {
      session.subject = subject;
    }
    if (time) {
      session.time = time;
    }
    if (day) {
      session.day = day;
    }
    if (duration) {
      session.duration = duration;
    }

    // Save the updated session
    await session.save();

    res.status(200).json(session); // Return the updated session
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating session");
  }
});

// Delete a session by id
router.delete("/:id", async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id); // Mongoose query to delete session by ID
    if (!session) {
      return res.status(404).send("Session not found");
    }

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting session");
  }
});

export default router;
