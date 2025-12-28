const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  task_data: {
    type: Array,
    required: true,
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Form', formSchema);
