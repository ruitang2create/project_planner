import React from 'react';
import './Home.css';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function Home(props) {
    return (
        <div className='HomePage'>
            <h1 className='homeGreeting'>{`Hello, ${props.username}!`}</h1>
            <div className='HomePortals'>
                <Link to='/new'>
                    <Button variant='outline-dark' className='homePortal newPlanBtn'>
                        Create New Plan
                    </Button>
                </Link>
                <Link to='/myplans'>
                <Button variant='dark' className='homePortal myPlansBtn'>
                    See My Plans
                </Button>
                </Link>
            </div>
        </div>
    );
}

export default Home;