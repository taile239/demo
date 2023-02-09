const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || "8080";

morgan.token("type", (req, res) => {
  return JSON.stringify(req.body);
});

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());
app.use(morgan(":method :url :status :response-time ms - :type"));
app.use(cors());
app.use(express.static("build"));

const generateId = () => {
  return Math.random() * 10000;
};

const isBodyValid = (body) => {
  let returnObj = {
    isValid: true,
    message: "",
  };
  if (!body.name || !body.number) {
    returnObj = {
      isValid: false,
      message: "There is no name or number",
    };
    return returnObj;
  }

  const existedName = persons.find((p) => p.name === body.name);

  if (existedName) {
    returnObj = {
      isValid: false,
      message: "Name must be unique",
    };
    return returnObj;
  }

  return returnObj;
};

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/info", (request, response) => {
  const date = new Date();
  const people = persons.length;

  const content = `<div>Phonebook has info for ${people} people</div>
  <div>${date}</div>`;

  response.send(content);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  persons.filter((p) => p.id === id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const checkedBody = isBodyValid(body);

  if (!checkedBody.isValid) {
    return response.status(400).json({
      error: checkedBody.message,
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons.concat(person);
  response.json(person);
});

app.listen(PORT);
