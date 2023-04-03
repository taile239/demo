const notesRouter = require("express").Router();
const Note = require("../models/note");

// notesRouter.get("/", (request, response) => {
//   response.send("<h1>Hello World</h1>");
// });

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

notesRouter.get("/:id", async (request, response, next) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

notesRouter.delete("/:id", async (request, response, next) => {
  await Note.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

notesRouter.post("/", async (request, response, next) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  const savedNote = await note.save();
  response.status(201).json(savedNote);
});

notesRouter.put("/:id", async (request, response, next) => {
  const { content, important } = request.body;

  await Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  );
  response.status(204).end();
});

module.exports = notesRouter;
