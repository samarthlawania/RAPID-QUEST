const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Models
const Template = require('./models/template.model');

// Routes
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

app.post('/api/templates', async (req, res) => {
  const newTemplate = new Template(req.body);

  try {
    await newTemplate.save();
    res.json('Template added!');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

app.get('/api/templates/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    res.json(template);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

app.put('/api/templates/:id', async (req, res) => {
  try {
    await Template.findByIdAndUpdate(req.params.id, req.body);
    res.json('Template updated!');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

app.delete('/api/templates/:id', async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json('Template deleted.');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

