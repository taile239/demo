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

describe("check existing blogs", () => {
  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(3);
  });

  test("existed blog title", async () => {
    const response = await api.get("/api/blogs");
    const titles = response.body.map((r) => r.title);

    expect(titles).toContain("Blog 1");
  });
});

describe("create a new blog", () => {
  test("correct id property when created", async () => {
    const dummyBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    };
    const response = await api.post("/api/blogs").send(dummyBlog).expect(201);
    expect(response.body.id).toBeDefined();
  });

  test("correct properties of blog when created", async () => {
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

  test("like is 0 if it is not filled when creating", async () => {
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

  test("missing title will fail when creating", async () => {
    const newBlog = {
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    };

    const response = await api.post("/api/blogs").send(newBlog).expect(400);
    expect(response.body.error).toEqual("title or url is missing");
  });

  test("missing url will fail when creating", async () => {
    const newBlog = {
      author: "Edsger W. Dijkstra",
      title: "Dummy blog",
    };

    const response = await api.post("/api/blogs").send(newBlog).expect(400);
    expect(response.body.error).toEqual("title or url is missing");
  }, 100000);
});

describe("update a blog", () => {
  test("correct like property when updated", async () => {
    const blog = await Blog.findOne({ title: "Blog 1" });

    await api.put(`/api/blogs/${blog.id}`).send({ likes: 10 }).expect(204);

    const blogAfterUpdated = await Blog.findOne({ title: "Blog 1" });
    expect(blogAfterUpdated.likes).toEqual(10);
  });
});

describe("delete a blog", () => {
  test("delete correct blog", async () => {
    const blogsAtStart = await blogsInDb();
    const deleteBlog = blogsAtStart[0];
    await api.delete(`/api/blogs/${deleteBlog.id}`).expect(204);
    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);
    expect(blogsAtEnd).not.toContain("Blog 1");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
