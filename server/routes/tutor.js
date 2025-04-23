import express from "express";
import { body, validationResult } from "express-validator";
import Tutor from "../models/tutorModel.js"; // Importing the Tutor model
import Member from "../models/memberModel.js"; // Importing the Member model

// Router instance to define routes
const router = express.Router();

// Validation for the tutor schema
const validateTutor = [
  body("name").isString().notEmpty().withMessage("Name is required and must be a string"),
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("expertise").isString().notEmpty().withMessage("Expertise is required and must be a string"),
];

// Function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all tutors
router.get("/", async (req, res) => {
  try {
    const tutors = await Tutor.find(); // Mongoose query to find all tutors
    res.status(200).json(tutors);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving tutors");
  }
});

// Get a single tutor by id
router.get("/:id", async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id); // Mongoose query to find tutor by ID
    if (!tutor) {
      return res.status(404).send("Tutor not found");
    }
    res.status(200).json(tutor);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving tutor");
  }
});

// Create a new tutor
router.post("/", validateTutor, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, expertise } = req.body;

    // Create a new Tutor
    const newTutor = new Tutor({
      name,
      email,
      expertise,
    });

    // Save the tutor to the database
    await newTutor.save();

    // After creating the tutor, add them to the members collection with role 'tutor'
    const newMember = new Member({
      name,
      email,
      role: "tutor",
    });

    await newMember.save(); // Save the new member to the members collection

    res.status(201).json(newTutor); // Send the created tutor as response
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding tutor");
  }
});

// Update a tutor by id
router.patch("/:id", async (req, res) => {
  const { name, email, expertise } = req.body;
  try {
    // Fetch the tutor data first to get the previous email
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).send("Tutor not found");
    }

    const oldEmail = tutor.email; // Store the old email before updating
    console.log("Old tutor email: ", oldEmail); // Log the old email for debugging

    // Update the tutor in the tutor collection
    tutor.name = name || tutor.name;
    tutor.email = email || tutor.email;
    tutor.expertise = expertise || tutor.expertise;
    await tutor.save();

    // Update the corresponding member in the members collection using the old email
    const updatedMember = await Member.findOneAndUpdate(
      { email: oldEmail }, // Search for the member with the old email
      { $set: { name: tutor.name, email: tutor.email, role: "tutor" } }, // Update the member with the new tutor details
      { new: true }
    );

    // Verify if the member update was successful
    if (!updatedMember) {
      console.warn(`Member with email ${oldEmail} not found or not updated`);
      return res.status(404).send(`Member with email ${oldEmail} not found or not updated`);
    } else {
      console.log(`Member with email ${oldEmail} successfully updated to new email ${tutor.email}`);
    }

    // Send success response with the updated tutor
    res.status(200).json(tutor);
  } catch (err) {
    console.error("Error updating tutor:", err);
    res.status(500).send("Error updating tutor");
  }
});

// Delete a tutor by id
router.delete("/:id", async (req, res) => {
  try {
    // Find the tutor to delete
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).send("Tutor not found");
    }

    // Delete the tutor from the tutors collection
    const tutorDeleteResult = await Tutor.findByIdAndDelete(req.params.id);

    // Delete the corresponding member from the members collection
    let memberDeleteResult = { deletedCount: 0 };
    if (tutor.email) {
      const result = await Member.deleteOne({ email: tutor.email });
      memberDeleteResult.deletedCount = result.deletedCount;
    }

    // Return a success response with deletion results
    res.status(200).json({
      message: "Tutor and associated member deleted",
      tutorDeleted: tutorDeleteResult ? true : false,
      memberDeleted: memberDeleteResult.deletedCount > 0,
    });
  } catch (err) {
    console.error("Error deleting tutor:", err);
    res.status(500).send("Error deleting tutor");
  }
});


export default router;

