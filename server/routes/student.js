import express from "express";
import { body, validationResult } from "express-validator";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /students.
const router = express.Router();

//validation for prepared statements
const validateStudent = [
  body("name").isString().notEmpty().withMessage("Name is required and must be a string"),
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("year").isString().notEmpty().withMessage("Year is required and must be a string"),
];

// Function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// This section will help you get a list of all the students.
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("students");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving students");
  }
});

// This section will help you get a single student by id.
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("students");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);
    if (!result) {
      return res.status(404).send("Student not found");
    }
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving student");
  }
});


// This section will help you create a new student.
router.post("/", validateStudent, handleValidationErrors, async (req, res) => {
  try {
    let newStudent = {
      name: req.body.name,
      email: req.body.email,
      year: req.body.year,
    };

    let studentCollection = await db.collection("students");
    let result = await studentCollection.insertOne(newStudent);

    // Now, add the student to the members collection with role set to "student"
    let newMember = {
      name: req.body.name,
      email: req.body.email,
      role: "student", // hardcoding the role as "student"
    };

    let memberCollection = await db.collection("members");
    await memberCollection.insertOne(newMember);

    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding student");
  }
});

// This section will help you update a student by id and sync with the member collection
router.patch("/:id", validateStudent, handleValidationErrors, async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    // Prepare updates for the student
    const updates = {
      $set: {
        name: req.body.name,
        email: req.body.email,
        year: req.body.year,
      },
    };

    // Update the student
    let studentCollection = await db.collection("students");
    let studentUpdateResult = await studentCollection.updateOne(query, updates);
    if (studentUpdateResult.matchedCount === 0) {
      return res.status(404).send("Student not found");
    }

    // Update the corresponding member (email in this case)
    let memberCollection = await db.collection("members");
    let memberUpdateResult = await memberCollection.updateOne(
      { email: req.body.email }, // we assume the member's email is unique
      { $set: { email: req.body.email } }
    );

    if (memberUpdateResult.modifiedCount === 0) {
      console.error("Member not found or email not updated.");
    }

    res.status(200).send("Student and member updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating student and member");
  }
});


// This section will help you delete a student
router.delete("/:id", async (req, res) => {
  try {
    const studentId = new ObjectId(req.params.id);

    // Find the student first to get their email (since ObjectIds will differ)
    const studentCollection = db.collection("students");
    const student = await studentCollection.findOne({ _id: studentId });

    if (!student) {
      return res.status(404).send("Student not found");
    }

    // Delete the student from the 'students' collection
    const studentQuery = { _id: studentId };
    let studentResult = await studentCollection.deleteOne(studentQuery);

    if (studentResult.deletedCount === 0) {
      return res.status(404).send("Student not found");
    }

    // Now delete the corresponding member using the student's email
    const memberQuery = { email: student.email }; // Use the student's email to find the member
    const memberCollection = db.collection("members");
    let memberResult = await memberCollection.deleteOne(memberQuery);

    if (memberResult.deletedCount === 0) {
      return res.status(404).send("Member not found");
    }

    res.status(200).send("Student and corresponding member deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting student and member");
  }
});


export default router;