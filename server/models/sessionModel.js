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

sessionSchema.index({ subject: 1 }); 
sessionSchema.index({ day: 1 });  
sessionSchema.index({ "student.email": 1 });
sessionSchema.index({ "tutor.email": 1 });

const Session = mongoose.model("Session", sessionSchema);

export default Session;
