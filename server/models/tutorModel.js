import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensure email is unique
  expertise: { type: String, required: true }

});

// Create an index for the email field to improve query performance
tutorSchema.index({ email: 1 });

const Tutor = mongoose.model("Tutor", tutorSchema);

export default Tutor;
