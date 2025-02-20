import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card, Image} from 'react-bootstrap';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf'

import UserContext from '../context/UserContext';

export default function Login() {
    const notyf = new Notyf();
    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext);

    // State hooks to store the values of the input fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // State to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(true);

    console.log(email);
    console.log(password);

    function authenticate(e) {

        // Prevents page redirection via form submission
        e.preventDefault();

        fetch('https://blogapp-server-7qfm.onrender.com/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                email: email,
                password: password

            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => { // Get error details
                    console.error("API Error:", response.status, errorData);
                    const errorMessage = errorData.message || 'Login failed. Check console for details.';
                    notyf.error(`Login failed: ${response.status} - ${errorMessage}`);
                    throw new Error(errorMessage);
                });
            }
            return response.json(); // Proceed if response is ok
        })
        .then(data => {
            // Test
             console.log('Login Success Data:', data);

            // if(data.access !== undefined){
            if(data && data.access){

                console.log("Token: ",data.access);

                // Set the token of the authenticated user in the local storage
                // Syntax
                // localStorage.setItem('propertyName', value);
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);

                // Clear input fields after submission
                setEmail('');
                setPassword('');

                notyf.success('Successful Login');

                // navigate to home after successful login
                navigate("/");
            } 
            else {
              console.error("Unexpected data format:", data);
              const errorMessage = data?.message || "Login failed: Unexpected data format from the server.";
              notyf.error(errorMessage); // Display error from backend if available
            }
        })
        .catch(error => {
            console.error("Login Error:", error);
            notyf.error(error.message || "An error occurred during login.");
        });
    }

    function retrieveUserDetails(token){
            
        // The token will be sent as part of the request's header information
        // We put "Bearer" in front of the token to follow implementation standards for JWTs
        // fetch('https://blogapp-sever.onrender.com/users/details', {
        fetch('https://blogapp-server-7qfm.onrender.com/users/details', {
            headers: {
                Authorization: `Bearer ${ token }`
            }
        })
        .then(res => res.json())
        .then(data => {

            console.log("User Details: ", data);

            // Changes the global "user" state to store the "id" and the "isAdmin" property of the user which will be used for validation across the whole application
            setUser({
              id: data._id,
              isAdmin: data.isAdmin
            });

        })

    };

    useEffect(() => {

        // Validation to enable submit button when all fields are populated and both passwords match
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);

    return (
        (user.id !== null) ?
            // If user is logged in
            <Navigate to = "/" />
        :
        <Container className="my-4 pt-3">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card className="shadow">
                        <Card.Body className="p-4"> 
                        <h2 className="mb-4 text-center">Login</h2>
                            {/*<Form onSubmit={(e) => authenticate(e)}>*/}
                            <Form onSubmit={authenticate}>
                                <Form.Group className="mb-2" controlId="email">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control"
                                    />
                                </Form.Group>

                                {/*Buttons*/}
                                <div className="d-grid gap-2 mb-4"> 
                                {isActive ? (
                                    <Button variant="primary" type="submit" id="loginBtn">
                                      Login
                                    </Button>
                                ) : (
                                    <Button variant="danger" type="submit" id="loginBtn" disabled>
                                      Login
                                    </Button>
                                )}
                                </div>

                                {/*Register Link*/}
                                <div className="text-center">
                                    Don't have an account? <Link to="/register">Register here</Link>
                                </div>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}