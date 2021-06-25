import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './TopNav.css';

const TopNav = () => {
    return (
        <Navbar bg='dark' variant='dark'>
            <Navbar.Brand href='/'>Agile Planner</Navbar.Brand>
            <Nav className='topNav'>
                <Link className='topNavItem' to='/'>Home</Link>
                <Link className='topNavItem' to='/myplans'>Plans</Link>
            </Nav>
        </Navbar>
    );
}

export default TopNav;