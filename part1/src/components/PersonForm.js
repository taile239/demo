const PersonForm = (props) => {
  const { newName, newPhoneNo, onChangeName, onChangePhoneNo, onClickAdd } =
    props.personFormObj;

  return (
    <form>
      <div>
        name: <input value={newName} onChange={onChangeName} />
      </div>
      <div>
        number: <input value={newPhoneNo} onChange={onChangePhoneNo} />
      </div>
      <div>
        <button type="submit" onClick={onClickAdd}>
          add
        </button>
      </div>
    </form>
  );
};

export default PersonForm;
