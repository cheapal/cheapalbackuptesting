// backend/models/Blog.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'draft',
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.plugin(mongoosePaginate);

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;