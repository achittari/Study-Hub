import express from "express";
import cors from "cors";
import students from "./routes/student.js";
import tutors from "./routes/tutor.js";
import sessions from "./routes/session.js";
import members from "./routes/member.js";
import "./db/connection.js";



const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/student", students);
app.use("/tutor", tutors);
app.use("/session", sessions);
app.use("/member", members);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});