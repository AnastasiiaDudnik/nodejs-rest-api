const { Schema, model } = require("mongoose");
const { MongooseError } = require("../helpers");

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

contactSchema.post("save", MongooseError);

const Contact = model("contact", contactSchema);

module.exports = Contact;