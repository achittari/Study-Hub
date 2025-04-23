import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
});

const Tutor = mongoose.model("Tutor", tutorSchema);

export default Tutor;
