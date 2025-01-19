const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const templateSchema = new Schema({
  name: { type: String, required: true },
  html: { type: String, required: true },
  config: {
    title: String,
    content: String,
    imageUrl: String,
  },
}, {
  timestamps: true,
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;

