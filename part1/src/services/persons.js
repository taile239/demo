import axios from "axios";

const baseURL = "/api/persons";

const getAll = () => {
  return axios.get(baseURL).then((response) => response.data);
};

const create = (personObj) => {
  return axios.post(baseURL, personObj).then((response) => response.data);
};

const update = (id, personObj) => {
  return axios
    .put(`${baseURL}/${id}`, personObj)
    .then((response) => response.data);
};

const deletePerson = (id) => {
  return axios.delete(`${baseURL}/${id}`).then((response) => response.data);
};

export default { getAll, create, update, deletePerson };
