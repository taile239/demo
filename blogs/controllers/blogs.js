const express = require("express");
const blogRouter = express.Router();
const Blog = require("../models/blog");
require("dotenv").config();

blogRouter.get("/", (request, response) => {
  console.log(process.env.MONGODB_URL);
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogRouter.post("/", (request, response) => {
  const body = request.body;

  if (!body.url || !body.title) {
    return response.status(400).json({
      error: "title or url is missing",
    });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

blogRouter.put(`/:id`, async (request, response) => {
  const { likes } = request.body;

  await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: "query" }
  );
  response.status(204).end();
});

blogRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = blogRouter;
