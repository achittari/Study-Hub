Study Hub: Database Management 

Overview
This project focuses on optimizing query performance in a tutoring session management system by implementing efficient indexing and transaction strategies across three MongoDB collections: sessions, students, and tutors.

Indexing Strategy
Indexes are applied to support the application's frequent queries:

Sessions Collection: Indexed on subject, student.email, tutor.email, and duration to efficiently filter session reports.

Students & Tutors Collections: Indexed on email for quick lookups and updates.

All indexes utilize MongoDB's default B+ tree structure, chosen for its ability to handle both point and range queries effectively.

Transactions & Concurrency
Transactions are implemented to maintain data consistency during:
- Session bookings and updates
- Student/tutor profile modifications
- Preventing booking conflicts

The system uses a Repeatable Read isolation level to ensure consistent reads during transactions while supporting concurrent access.

Tech Stack
MongoDB
Node.js + Mongoose
