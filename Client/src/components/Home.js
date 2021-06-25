import React from 'react';
import './Home.css';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import TopNav from './TopNav';
import Helmet from 'react-helmet';

function Home(props) {
    return (
        <div className='HomePage'>
            <Helmet>
                <title>Agile Planner</title>
                <meta name="description" content="Plan your project in an agile way" />
            </Helmet>
            <TopNav />
            <div className='HomePageMain'>
                <h1 className='homeGreeting'>{`Hello, ${props.username}!`}</h1>
                <div className='HomePortals'>
                    <Link to='/new' className='homePortalLink'>
                        <Button variant='outline-dark' className='homePortal'>
                            Create New Project
                        </Button>
                    </Link>
                    <Link to='/myplans' className='homePortalLink'>
                        <Button variant='dark' className='homePortal'>
                            Check My Projects
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;