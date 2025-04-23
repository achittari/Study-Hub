import express from "express";
import { body, validationResult } from "express-validator";
import Member from "../models/memberModel.js"; // Import the Mongoose model

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
    const members = await Member.find(); // Using Mongoose ORM to query all members
    res.status(200).json(members); // Return members as JSON
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving members");
  }
});

// Get a single member by id
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id); // Find member by id using Mongoose
    if (!member) {
      return res.status(404).send("Member not found");
    }
    res.status(200).json(member); // Return member data as JSON
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving member");
  }
});

// Create a new member
router.post("/", validateMember, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Create a new Member document using Mongoose
    const newMember = new Member({
      name,
      email,
      role,
    });

    // Save the new member to the database
    const result = await newMember.save();
    res.status(201).json(result); // Return the saved member data
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding member");
  }
});

// Update a member by id
router.patch("/:id", validateMember, handleValidationErrors, async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    // Find the member by id and update using Mongoose
    const member = await Member.findByIdAndUpdate(req.params.id, updates, {
      new: true, // Return the updated member
    });

    if (!member) {
      return res.status(404).send("Member not found");
    }

    res.status(200).json(member); // Return the updated member data
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating member");
  }
});

// Delete a member by email
router.delete("/member/:email", async (req, res) => {
  try {
    // Delete member by email using Mongoose
    const result = await Member.deleteOne({ email: req.params.email });
    if (result.deletedCount === 0) {
      return res.status(404).send("Member not found");
    }
    res.status(200).json({ deletedCount: result.deletedCount }); // Return count of deleted documents
  } catch (err) {
    console.error("Error deleting member:", err);
    res.status(500).send("Error deleting member");
  }
});

export default router;
