const Filter = ({ value, filterFunc }) => {
  return (
    <div>
      Filter shown with: <input value={value} onChange={filterFunc} />
    </div>
  );
};

export default Filter;
