import Blog from '../models/Blog.js';
import path from 'path';
import fs from 'fs/promises';

const uploadDir = path.join(process.cwd(), 'Uploads', 'blogs');
fs.mkdir(uploadDir, { recursive: true })
  .then(() => console.log(`✅ Ensured upload directory exists: ${uploadDir}`))
  .catch((err) => console.error(`❌ Failed to create upload directory: ${err.message}`));

export const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = '' } = req.query;
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      populate: { path: 'author', select: 'name email' },
    };

    const blogs = await Blog.paginate(query, options);
    res.json({
      success: true,
      data: blogs.docs,
      pagination: {
        total: blogs.totalDocs,
        page: blogs.page,
        pages: blogs.totalPages,
        limit: blogs.limit,
      },
    });
  } catch (error) {
    console.error('[blogController] getBlogs Error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
};

export const getPublicBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = '' } = req.query;
    const query = {
      status: 'published',
      ...(search && { title: { $regex: search, $options: 'i' } }),
    };
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      populate: { path: 'author', select: 'name' },
    };

    const blogs = await Blog.paginate(query, options);
    res.json({
      success: true,
      data: blogs.docs,
      pagination: {
        total: blogs.totalDocs,
        page: blogs.page,
        pages: blogs.totalPages,
        limit: blogs.limit,
      },
    });
  } catch (error) {
    console.error('[blogController] getPublicBlogs Error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch public blogs' });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, status, tags } = req.body;
    if (!title || !content || !req.file) {
      return res.status(400).json({ success: false, message: 'Title, content, and image are required' });
    }

    const imagePath = `/Uploads/blogs/${req.file.filename}`;
    const blog = new Blog({
      title,
      content,
      status: status || 'draft',
      image: imagePath,
      author: req.user._id,
      tags: tags ? JSON.parse(tags) : [],
    });

    await blog.save();
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    console.error('[blogController] createBlog Error:', error.message, error.stack);
    if (req.file) {
      await fs.unlink(req.file.path).catch((err) => console.error(`Failed to delete uploaded file: ${err.message}`));
    }
    res.status(500).json({ success: false, message: 'Failed to create blog' });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status, tags } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.status = status || blog.status;
    blog.tags = tags ? JSON.parse(tags) : blog.tags;

    if (req.file) {
      if (blog.image) {
        const oldImagePath = path.join(process.cwd(), blog.image);
        await fs.unlink(oldImagePath).catch((err) => console.error(`Failed to delete old image: ${err.message}`));
      }
      blog.image = `/Uploads/blogs/${req.file.filename}`;
    }

    await blog.save();
    res.json({ success: true, data: blog });
  } catch (error) {
    console.error('[blogController] updateBlog Error:', error.message, error.stack);
    if (req.file) {
      await fs.unlink(req.file.path).catch((err) => console.error(`Failed to delete uploaded file: ${err.message}`));
    }
    res.status(500).json({ success: false, message: 'Failed to update blog' });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.image) {
      const imagePath = path.join(process.cwd(), blog.image);
      await fs.unlink(imagePath).catch((err) => console.error(`Failed to delete image: ${err.message}`));
    }

    await blog.deleteOne();
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('[blogController] deleteBlog Error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Failed to delete blog' });
  }
};