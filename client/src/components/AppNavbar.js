import { Container, Navbar, Nav } from 'react-bootstrap' 
import { Link, NavLink } from 'react-router-dom';
// import { useState, useContext } from 'react';
import { useContext } from 'react';
import UserContext from '../context/UserContext';

export default function AppNavbar() {

	const { user } = useContext(UserContext);

	return(
        <Navbar expand="lg" className="bg-black navbar-dark">
            <Container className="ms-auto">
                <Navbar.Brand as={Link} to="/">
                    Threadify
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="justify-content-end">
                    <Nav.Link as={NavLink} to="/" exact="true">Popular</Nav.Link>
                    <Nav.Link as={Link} to="/blogs">Home</Nav.Link>
                        {(user.id !== null) ?
                            <>
                                <Nav.Link as={NavLink} to="/logout" exact="true">Logout</Nav.Link>
                            </>
                        :
                            <>
                                <Nav.Link as={NavLink} to="/login" exact="true">Login</Nav.Link>
                                <Nav.Link as={NavLink} to="/register" exact="true">Register</Nav.Link>
                            </>
                    }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
	)

}