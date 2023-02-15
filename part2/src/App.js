import { useState, useEffect } from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import Notification from "./components/Notification";
import Footer from "./components/Footer";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  const inputNoteHandler = (e) => {
    setNewNote(e.target.value);
  };

  const toggleImportance = (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((updatedNote) => {
        setNotes(notes.map((n) => (n.id === id ? updatedNote : n)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already deleted from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const addNoteHandler = (e) => {
    e.preventDefault();

    const noteObj = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    noteService.create(noteObj).then((newNote) => {
      setNotes(notes.concat(newNote));
      setNewNote("");
    });
  };
  let content;
  if (showAll) {
    content = notes;
  } else {
    content = notes.filter((note) => note.important);
  }
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {content.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportance(note.id)}
          />
        ))}
      </ul>
      <form action="post">
        <div>
          New note:
          <input value={newNote} onChange={inputNoteHandler} />
        </div>
        <button type="submit" onClick={addNoteHandler}>
          Add
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
