import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},// unique: true }, // Ensure email is unique
  year: { type: String, required: true }
});

studentSchema.index({ email: 1 }); // Add an index to improve email lookup performance

const Student = mongoose.model("Student", studentSchema);

export default Student;
