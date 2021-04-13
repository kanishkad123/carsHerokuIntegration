const express = require("express");
const noteRoutes = require("./routes/api/noteRouter-DB");
const jobApplicationsRoutes = require("./routes/api/jobApplicationsRoutes");
const usersRoutes = require("./routes/api/usersRoutes");
const authRoutes = require("./routes/api/authRoutes");
const resumeRoutes = require('./routes/api/resumeComponentRoutes/resumeRoutes');
const connectDB = require("./config/connectDB");
const cors = require("cors");

const app = express();

//imports for task component
const taskConnectDB = require("./config/taskComponentConnectDB");
const groupRoute = require("./routes/api/taskComponentRoutes/groupRoute");
const cardRoute = require("./routes/api/taskComponentRoutes/cardRoute");
const checklistRoute = require("./routes/api/taskComponentRoutes/checklistRoute");
const todoRoute = require("./routes/api/taskComponentRoutes/todoRoute");

//connect to db
connectDB();
//taskConnectDB();

//set a middleware to parse dat
app.use(express.json());
app.use(cors());
app.use('/api/note', noteRoutes);
app.use("/api/jobApplications", jobApplicationsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/resume',resumeRoutes);

//routes for task component
app.use("/api/task/group", groupRoute);
app.use("/api/task/card", cardRoute);
app.use("/api/task/checklist", checklistRoute);
app.use("/api/task/todo", todoRoute);

app.listen(5000, () => {
	console.log("Server started");
});
