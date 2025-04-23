import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true }, // Ensure email is unique
  role: String // 'student' or 'tutor'
});

memberSchema.index({ email: 1 }); // Add an index to improve email lookup performance

const Member = mongoose.model("Member", memberSchema);

export default Member;
