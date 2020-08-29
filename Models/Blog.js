const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  //TODO add editors list
  // TODO adding creator cred => embedded data
  // TODO create a new model for the type of user
  body: [
    {
      type: String,
      required: true,
    },
  ],
  header: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  layout: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  public: {
    type: Boolean,
    required: true,
    default: false,
  },
  editors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
