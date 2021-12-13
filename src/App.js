import "./App.css";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [userList, setUserList] = useState([]);
  const [id, setId] = useState(0);
  const [toggleButton, setToggleButton] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  useEffect(() => {
    Axios.get("http://localhost:3001/users").then((response) => {
    setUserList(response.data); 
    });
  },[]);

  const onClickHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("number", number);
    data.append("file", selectedFile);

    Axios.post("http://localhost:3001/users", data)
      .then(() => {
        console.log("Form Submitted");
        // forceUpdate()
      })
      .then((error) => {
        console.log(error);
      }
    );
  };

  const delHandler = (user) => {
    Axios.delete(`http://localhost:3001/users/${user.id}`).then((res, err) => {
      if (err) {
        console.log("Error :  ", err);
      }
      // forceUpdate()
    });
  }

  const editHandler = (user) => {
    setToggleButton(true);
    setName(user.name);
    setEmail(user.email);
    setNumber(user.number);
    setId(user.id);
  };

  const updateHandler = (e) => {
    e.preventDefault();
    Axios.put(`http://localhost:3001/users/${id}`, {
      name: name,
      email: email,
      number: number,
      id: id,
    }).then((res, err) => {
      if (err) {
        console.log("Error :  ", err);
      }
      alert("Updated successfully.");
      // forceUpdate()
    });
  };

  return (
    <div className="App">
      <Container>
        <form className="form" encType="multipart/form-data">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>

          <input
            type="text"
            placeholder="Mobile number"
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          ></input>

          <input
            name="file"
            type="file"
            id="file"
            onChange={(e) => {
              setSelectedFile(e.target.files[0]);
            }}
          ></input>

          {!toggleButton ? (
            <input type="submit" onClick={onClickHandler} />
          ) : (
            <button type="submit" onClick={updateHandler}>
              Update
            </button>
          )}
        </form>

        <div>
          {userList.map((user) => {
            const source = `http://localhost:3001/uploads/${user.image}`;
            return (
              <span key={user.id}>
                <div className="data">
                  <div className="upper">
                    <div className="image">
                      <img alt="profile" src={source} width="100%"></img>
                    </div>
                    <h3>
                      Name : {user.name}
                      <br />
                      Email : {user.email}
                      <br />
                      Number : {user.number}
                    </h3>
                  </div>
                  <div>
                    <button onClick={() => editHandler(user)}>Edit</button>{" "}
                    <button onClick={() => delHandler(user)}>Delete</button>
                  </div>
                </div>
              </span>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

export default App;
