const express = require('express');
const carsRoutes = require('./routes/api/carsRoutes');
const usersRoutes = require('./routes/api/usersRoutes');
const authRoutes = require('./routes/api/authRoutes');
const connectDB = require('./config/connectDB');
const cors = require('cors');

const app = express();

///connect to db
connectDB();

//set a middleware to parse dat
app.use(express.json());
app.use(cors());
app.use('/api/cars', carsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);

app.listen(5001, () => {
  console.log('Server started');
});
