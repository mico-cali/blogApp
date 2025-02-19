import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import './App.css';

// From Components
import AppNavbar from './components/AppNavbar';


// From Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Blogs from './pages/Blogs';

// From Context
import { UserProvider } from './context/UserContext';

function App() {

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  function unsetUser(){
    localStorage.clear();
  };

  useEffect(() => {
    console.log(localStorage.getItem('token'))

    // fetch(`https://blogapp-sever.onrender.com/users/details`, {
    fetch(`http://localhost:4000/users/details`, {
      headers: {
        Authorization: `Bearer ${ localStorage.getItem('token') }`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      console.log(data.auth !== "Failed")
      // Set the user states values with the user details upon successful login.
      if (data.auth !== "Failed") {

        setUser({
          id: data._id,
          isAdmin: data.isAdmin
        });

      // Else set the user states to the initial values
      } else {

        setUser({
          id: null,
          isAdmin: null
        });

      }

    })
  }, [])

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user])


 return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blogs" element={<Blogs />} />
            {/*<Route path="*" element={<Error />} />*/}
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;