import { useState, useEffect, useContext }  from 'react';
import { Form, Button, Container, Row, Col, Card, Image} from 'react-bootstrap';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';

import UserContext from '../context/UserContext';

export default function Register() {

	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const notyf = new Notyf();

	// State hooks to store the values of the input fields
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // State to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(false);

    //Check if values are successfully binded
    console.log(username);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);

    useEffect(() => {
    	if((username !== "" && email !== "" && password !== "" && confirmPassword !== "") && (password === confirmPassword)) {
			
			setIsActive(true);
		} else {

			setIsActive(false);
		} 
    }, [email, password, confirmPassword])


    function registerUser(e) {
    	e.preventDefault();

        fetch('https://blogapp-server-7qfm.onrender.com/users/register', {
    		method: 'POST',
    		headers: {
    			"Content-Type": "application/json"
    		},
    		body: JSON.stringify({
                username: username,
	            email: email,
	            password: password
    		})
    	})
    	.then(res => res.json())
    	.then(data => {
    		console.log(data)

    		if(data.message === "Registered Successfully") {
                setUsername('');
                setEmail('');
                setPassword('')
                setConfirmPassword('')

                notyf.success("Registration successful")

                // navigate to login
                navigate("/login");
    		} else if (data.error === "Email invalid"){

                notyf.error("Email is invalid");

            } else if (data.error === "Password must be atleast 8 characters long") {

                notyf.error("Password must be at least 8 characters")

            } else {

                notyf.error("Something went wrong.")
            }
    	})
    }

    return (
		(user.id !== null) ?
			<Navigate to = "/" />
		:
            <Container className="my-4 pt-3">
                <Row className="justify-content-md-center">
                    <Col md={8}>
                        <Card className="shadow">
                            <Card.Body className="p-4">

                                <h2 className="mb-4 text-center">Register</h2>

                                {/*Inputs*/}
                                <Form onSubmit={(e) => registerUser(e)}>

                                    <Form.Group className="mb-2" controlId="email">
                                        <Form.Label>Username:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Username"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="form-control"
                                        />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-2" controlId="email">
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter Email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="form-control"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-2" controlId="password">
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter Password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="form-control"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="confirmPassword"> {/* Increased margin */}
                                        <Form.Label>Confirm Password:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm Password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="form-control"
                                        />
                                    </Form.Group>

                                    {/*Buttons*/}
                                    <div className="d-grid gap-2 mb-4" style={{ position: 'relative' }}>
                                        {isActive ? (
                                            <Button variant="primary" type="submit" id="submitBtn" >
                                                Submit
                                            </Button>
                                        ) : (
                                            <Button variant="primary" type="submit" id="submitBtn" disabled>
                                                Submit
                                            </Button>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        Already have an account? <Link to="/login">Login here</Link>
                                    </div>

                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
	)
} 


