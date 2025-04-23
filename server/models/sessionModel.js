import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  student: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  tutor: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  subject: { type: String, required: true },
  time: { type: String, required: true },
  day: { type: String, required: true },
  duration: { type: String, required: true }
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
