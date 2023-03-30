const supertest = require("supertest");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const app = require("../app");
const { initialBlogs, blogsInDb } = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("get blogs list", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(3);
});

test("correct id property", async () => {
  const dummyBlog = {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  };
  const response = await api.post("/api/blogs").send(dummyBlog).expect(201);
  expect(response.body.id).toBeDefined();
});

test("create a new blog", async () => {
  const newBlog = {
    title: "Dummy blog",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await blogsInDb();
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);
  const title = blogsAtEnd.map((blog) => blog.title);
  expect(title).toContain("Dummy blog");
}, 100000);

test("like is 0 when missing", async () => {
  const newBlog = {
    title: "Dummy blog",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
  };

  const addedBlog = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(addedBlog.body.likes).toEqual(0);
});

test("missing title will fail", async () => {
  const newBlog = {
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(400);
  expect(response.body.error).toEqual("title or url is missing");
});

test("missing url will fail", async () => {
  const newBlog = {
    author: "Edsger W. Dijkstra",
    title: "Dummy blog",
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(400);
  expect(response.body.error).toEqual("title or url is missing");
}, 100000);

afterAll(async () => {
  await mongoose.connection.close();
});
