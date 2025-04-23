import express from "express";
import { body, validationResult } from "express-validator";
import Student from "../models/studentModel.js";
import Member from "../models/memberModel.js"; // Assuming you’ll also make a Mongoose model for members

const router = express.Router();

// Validation rules
const validateStudent = [
  body("name").isString().notEmpty().withMessage("Name is required and must be a string"),
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("year").isString().notEmpty().withMessage("Year is required and must be a string"),
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving students");
  }
});

// GET student by ID
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.status(200).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving student");
  }
});

// POST create new student
router.post("/", validateStudent, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, year } = req.body;

    const newStudent = new Student({ name, email, year });
    const savedStudent = await newStudent.save();

    const newMember = new Member({
      name,
      email,
      role: "student",
    });
    await newMember.save();

    res.status(201).json(savedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding student");
  }
});

// PATCH update student and sync with member
router.patch("/:id", validateStudent, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, year } = req.body;

    // Fetch the student data first to get the previous email
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send("Student not found");
    }

    const oldEmail = student.email; // Store the old email before updating
    console.log("Old student email: ", oldEmail); // Log the old email for debugging

    // Update the student model with the new data
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, year },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).send("Student not found");
    }

    // Now, update the corresponding member model using the old email
    const updatedMember = await Member.findOneAndUpdate(
      { email: oldEmail }, // Search for the member with the old email
      { $set: { name: updatedStudent.name, email: updatedStudent.email, year: updatedStudent.year } },
      { new: true }
    );

    // Verify if the member update was successful
    if (!updatedMember) {
      console.warn(`Member with email ${oldEmail} not found or not updated`);
      return res.status(404).send(`Member with email ${oldEmail} not found or not updated`);
    } else {
      console.log(`Member with email ${oldEmail} successfully updated to new email ${updatedStudent.email}`);
    }

    // Send success response
    res.status(200).send("Student and member updated successfully");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating student and member");
  }
});


// DELETE student and corresponding member
router.delete("/:id", async (req, res) => {
  try {
    // Find the student to delete
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send("Student not found");
    }

    // Delete the student from the students collection
    const studentDeleteResult = await Student.findByIdAndDelete(req.params.id);

    // Delete the corresponding member if the student exists
    let memberDeleteResult = { deletedCount: 0 };
    if (student.email) {
      // Use the email to find and delete the corresponding member from the member collection
      const result = await Member.deleteOne({ email: student.email });
      memberDeleteResult.deletedCount = result.deletedCount;
    }

    // Return a success response with deletion results
    res.status(200).json({
      message: "Student and associated member deleted",
      studentDeleted: studentDeleteResult ? 1 : 0,
      memberDeleted: memberDeleteResult.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).send("Error deleting student");
  }
});


export default router;
