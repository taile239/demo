import { useEffect, useState } from "react";
import personServices from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Person from "./components/Person";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhoneNo, setNewPhoneNo] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    isError: false,
  });

  useEffect(() => {
    personServices.getAll().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const onChangeName = (e) => {
    setNewName(e.target.value);
  };

  const onChangePhoneNo = (e) => {
    setNewPhoneNo(e.target.value);
  };

  const onFilter = (e) => {
    setFilter(e.target.value);
  };

  const removeNotification = () => {
    setTimeout(() => {
      setNotification({ message: null, isError: false });
    }, 5000);
  };

  const onClickAdd = (e) => {
    e.preventDefault();

    const existedPerson = persons.find((person) => person.name === newName);

    const newPerson = {
      name: newName,
      number: newPhoneNo,
    };

    if (existedPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personServices
          .update(existedPerson.id, newPerson)
          .then((returnedPerson) =>
            setPersons(
              persons.map((person) =>
                person.id !== returnedPerson.id ? person : returnedPerson
              )
            )
          )
          .catch((error) => {
            console.log(error);
            setNotification({
              message: `Information of ${existedPerson.name} has already been removed from server`,
              isError: true,
            });
            removeNotification();
            setPersons(
              persons.filter((person) => person.id !== existedPerson.id)
            );
          });
      }
    } else {
      personServices
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
        })
        .catch((error) => {
          setNotification({
            message: error.response.data.error,
            isError: true,
          });
          removeNotification();
        });
      setNotification({ message: `Added ${newPerson.name}`, isError: false });
      removeNotification();
    }

    setNewName("");
    setNewPhoneNo("");
  };

  const deletePerson = (p) => {
    if (window.confirm(`Delete ${p.name}`)) {
      personServices.deletePerson(p.id);
      setPersons(persons.filter((person) => person.id !== p.id));
    }
  };

  let filteredPersons;
  if (filter.length === 0) {
    filteredPersons = persons;
  } else {
    filteredPersons = persons.filter((person) =>
      person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
    );
  }

  const personFormObj = {
    newName,
    newPhoneNo,
    onChangeName,
    onChangePhoneNo,
    onClickAdd,
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filter} filterFunc={onFilter} />
      <h2>Add new</h2>
      <PersonForm personFormObj={personFormObj} />
      <h2>Numbers</h2>
      <Person persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
