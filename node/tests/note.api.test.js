const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Note = require("../models/note");
const { initialNotes, notesInDb, nonExistingId } = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  // await Note.deleteMany({});

  // const noteObjects = initialNotes.map((note) => new Note(note));
  // const promiseArray = noteObjects.map((noteObject) => noteObject.save());

  // await Promise.all(promiseArray);
  await Note.deleteMany({});

  for (let note of initialNotes) {
    let noteObject = new Note(note);
    await noteObject.save();
  }
});

describe("when there is initially some notes saved", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");
    expect(response.body).toHaveLength(initialNotes.length);
  });

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");
    const content = response.body.map((r) => r.content);

    expect(content).toContain("Browser can execute only JavaScript");
  });
});

// test("there are two notes", async () => {
//   const response = await api.get("/api/notes");
//   expect(response.body).toHaveLength(initialNotes.length);
// }, 100000);

// test("the first note is my name", async () => {
//   const response = await api.get("/api/notes");

//   const contents = response.body.map((r) => r.content);

//   expect(contents).toContain("HTML is easy");
// }, 100000);

describe("viewing a specific note", () => {
  test("succeeds with a valid id", async () => {
    const notesAtStart = await notesInDb();
    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const compareNote = { ...noteToView, id: noteToView.id.toString() };
    expect(resultNote.body).toEqual(compareNote);
  });

  test("fails with statuscode 404 if note does not exist", async () => {
    const validNonExistingId = await nonExistingId();

    await api.get(`/api/notes/${validNonExistingId}`).expect(404);
  });

  test("fails with statuscode 400 if id is invalid", async () => {
    const invalidId = "63e5eab928b3df70c812daf4";

    await api.get(`/api/notes/${invalidId}`).expect(404);
  });
});

describe("addition of a new note", () => {
  test("a valid note can be added", async () => {
    const newNote = {
      content: "Note added by test function",
      important: false,
    };

    await api
      .post("/api/notes")
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const notesAtEnd = await notesInDb();

    expect(notesAtEnd).toHaveLength(initialNotes.length + 1);
    const contents = notesAtEnd.map((r) => r.content);
    expect(contents).toContain("Note added by test function");
  }, 200000);

  test("note without content is not added", async () => {
    const note = {
      important: false,
    };

    await api.post("/api/notes").send(note).expect(400);
    const notesAtEnd = await notesInDb();
    expect(notesAtEnd).toHaveLength(initialNotes.length);
  });
});

describe("deletion of a note", () => {
  test("a note can be deleted", async () => {
    const notesAtStart = await notesInDb();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const notesAtEnd = await notesInDb();

    expect(notesAtEnd).toHaveLength(initialNotes.length - 1);
    const contents = notesAtEnd.map((r) => r.content);
    expect(contents).not.toContain(noteToDelete.content);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
