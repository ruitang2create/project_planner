import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const TopNav = () => {
    return (
        <Navbar bg='dark' variant='dark'>
            <Navbar.Brand href='/'>Project Planner</Navbar.Brand>
            <Nav className='topNav'>
                <Nav.Link href='/'>Home</Nav.Link>
                <Nav.Link href='/myplans'>Plans</Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default TopNav;