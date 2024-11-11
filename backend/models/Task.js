const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: String,
  status: { type: String, enum: ['completed', 'pending'], default: 'pending' },
  description: String,
});

module.exports = mongoose.model('Task', taskSchema);
