const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/formBuilder', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


const responseSchema = new mongoose.Schema({
  formId: Number,
  responses: Object,
  createdAt: { type: Date, default: Date.now }
});

const ResponseModel = mongoose.model('Response', responseSchema);

// POST: Save user response
app.post('/api/responses', async (req, res) => {
  const newResponse = new ResponseModel(req.body);
  await newResponse.save();
  res.json({ message: 'Response saved!' });
});


app.get('/api/responses/:formId', async (req, res) => {
  const formId = req.params.formId;
  const responses = await ResponseModel.find({ formId });
  res.json(responses);
});

app.listen(5000, () => console.log('Server running on port 5000'));
