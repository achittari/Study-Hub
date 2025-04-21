import express from "express";
import { body, validationResult } from "express-validator";

// This will help us connect to the database
import db from "../db/connection.js";

// This helps convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /tutors.
const router = express.Router();

// validation for prepared statements
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

// This section will help you get a list of all the tutors.
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("tutors");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving tutors");
  }
});

// This section will help you get a single tutor by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("tutors");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving tutor");
  }
});

// This section will help you create a new tutor.
router.post("/", validateTutor, handleValidationErrors, async (req, res) => {
  try {
    let newTutor = {
      name: req.body.name,
      email: req.body.email,
      expertise: req.body.expertise,
    };

    // Insert the tutor into the tutors collection
    let collection = await db.collection("tutors");
    let result = await collection.insertOne(newTutor);

    // After inserting the tutor, add the tutor to the members collection with role 'tutor'
    const newMember = {
      name: req.body.name,
      email: req.body.email,
      role: "tutor", // Hardcoding the role as 'tutor'
    };
    const membersCollection = db.collection("members");
    await membersCollection.insertOne(newMember);

    res.send(result).status(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding tutor");
  }
});

/*/ This section will help you update a tutor by id.
/router.patch("/:id", async (req, res) => {
  const tutorId = req.params.id;
  const { name, email, expertise } = req.body;

  try {
    const query = { _id: new ObjectId(tutorId) };
    const updates = {
      $set: {
        name,
        email,
        expertise,
      },
    };

    let collection = await db.collection("tutors");
    let result = await collection.updateOne(query, updates);

    // After updating the tutor, we should also update the corresponding member in the members collection
   /* let memberCollection = await db.collection("members")
    let memberResult = await memberCollection.updateOne(query, updates);*/
   /* const memberQuery = { email }; // Search for the member by email
    const memberUpdates = {
      $set: {
        name,
        email,
        role: "tutor", // Ensure the role is 'tutor' even after update
      },
    };
    let memcollection = await db.collection("members");
    let memresult = await memcollection.updateOne(query, updates);
   /*const membersCollection = db.collection("members");
    await membersCollection.updateOne(memberQuery, memberUpdates);*/
  /*  res.send(result).status(200);
    res.send(memresult).status(200)
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating tutor");
  }
});*/

router.patch("/:id", async (req, res) => {
  const tutorId = req.params.id;
  const { name, email, expertise } = req.body;

  try {
    const tutorCollection = db.collection("tutors");
    const memberCollection = db.collection("members");
    const query = { _id: new ObjectId(tutorId) };

    // Step 1: Find the original tutor to get old email
    const originalTutor = await tutorCollection.findOne(query);
    if (!originalTutor) {
      return res.status(404).send("Tutor not found");
    }

    const oldEmail = originalTutor.email;

    // Step 2: Update the tutor in the tutors collection
    const tutorUpdates = {
      $set: { name, email, expertise },
    };
    const tutorResult = await tutorCollection.updateOne(query, tutorUpdates);

    // Step 3: Update the corresponding member using old email
    const memberQuery = { email: oldEmail };
    const memberUpdates = {
      $set: {
        name,
        email,
        role: "tutor",
      },
    };
    const memberResult = await memberCollection.updateOne(memberQuery, memberUpdates);

    res.status(200).json({
      message: "Tutor and member updated",
      tutorModified: tutorResult.modifiedCount,
      memberModified: memberResult.modifiedCount,
    });
  } catch (err) {
    console.error("Error updating tutor:", err);
    res.status(500).send("Error updating tutor");
  }
});



// This section will help you delete a tutor.
router.delete("/:id", async (req, res) => {
  const tutorId = req.params.id;
  const sessionCollection = db.collection("sessions");
  const tutorCollection = db.collection("tutors");
  const membersCollection = db.collection("members");

  try {
    const tutorQuery = { _id: new ObjectId(tutorId) };
    const tutor = await tutorCollection.findOne(tutorQuery);

    if (!tutor) {
      return res.status(404).send("Tutor not found");
    }

    // 1. Delete sessions associated with the tutor
    await sessionCollection.deleteMany({ tutor: tutorId });

    // 2. Delete the tutor
    const tutorDeleteResult = await tutorCollection.deleteOne(tutorQuery);

    // 3. Delete corresponding member by matching email
    const memberDeleteResult = await membersCollection.deleteOne({ email: tutor.email });

    res.status(200).json({
      message: "Tutor and associated member deleted",
      tutorDeleted: tutorDeleteResult.deletedCount,
      memberDeleted: memberDeleteResult.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting tutor:", err);
    res.status(500).send("Error deleting tutor");
  }
});



export default router;
