const Notification = ({ notification }) => {
  if (notification.message === null) {
    return;
  }
  const color = notification.isError ? "red" : "green";

  const messageStyle = {
    color: color,
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderColor: color,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  return <div style={messageStyle}>{notification.message}</div>;
};

export default Notification;
