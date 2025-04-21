import express from "express";
import { body, validationResult } from "express-validator";

// This will help us connect to the database
import db from "../db/connection.js";

// This helps convert the id from string to ObjectId for the _id
import { ObjectId } from "mongodb";

// Router instance to define routes
const router = express.Router();

// Validation for the member schema
const validateMember = [
  body("name").isString().notEmpty().withMessage("Name is required and must be a string"),
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("role").isString().notEmpty().withMessage("Role is required and must be a string"),
];

// Function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all members
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("members");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving members");
  }
});

// Get a single member by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("members");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);
    if (!result) {
      return res.status(404).send("Member not found");
    }
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving member");
  }
});

// Create a new member
router.post("/", validateMember, handleValidationErrors, async (req, res) => {
  try {
    let newMember = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    let collection = await db.collection("members");
    let result = await collection.insertOne(newMember);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding member");
  }
});

// Update a member by id
router.patch("/:id", validateMember, handleValidationErrors, async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
      },
    };

    let collection = await db.collection("members");
    let result = await collection.updateOne(query, updates);
    if (result.matchedCount === 0) {
      return res.status(404).send("Member not found");
    }
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating member");
  }
});

// Delete a member by id
router.delete("/member/:email", async (req, res) => {
  const email = req.params.email;
  const membersCollection = db.collection("members");

  try {
    const result = await membersCollection.deleteOne({ email });
    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error("Error deleting member:", err);
    res.status(500).send("Error deleting member");
  }
});


export default router;
