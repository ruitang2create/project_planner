import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab, Button } from 'react-bootstrap';
import StoriesWall from './StoriesWall';
import Axios from 'axios';
import host from '../lib/serverConfig';
import './Plan.css';

function Plan(props) {
    Axios.defaults.withCredentials = true;
    const [isLoading, setIsLoading] = useState(true);
    const [stories, setStories] = useState([]);

    const getStories = () => {
        const apiUrl = `${host}/stories/${props.pid}`;
        Axios.get(apiUrl)
            .then(res => {
                if (res.data.success) {
                    setStories(res.data.stories);
                    setIsLoading(false);
                } else {
                    console.log('Failed to load stories: ' + res.data.err);
                }
            }).catch(err => {
                console.log('Axios GET request error: ' + err);
            });
    }

    useEffect(() => getStories(), []);

    return (
        <div className='planPage'>
            <Tabs >
                <Tab eventKey='basic' title='Basic Info'>
                    <div className='planBasicInfoContainer'>
                        <h1 className='planPageTitle'>{props.name}</h1>
                        <h3 className='planPageSubtitles' id='planPageDescTitle'>Description</h3>
                        <div id='planPageDesc'>{props.desc}</div>
                        <h3 className='planPageSubtitles' id='planPageVisionTitle'>Vision Statement</h3>
                        <div id='planPageVision'>{props.vision}</div>
                    </div>
                </Tab>
                <Tab eventKey='stories' title='User Stories'>
                    <Button>New Story</Button>
                    {
                        !isLoading &&
                        <StoriesWall
                            stories={stories}
                        />
                    }
                </Tab>
            </Tabs>
        </div>
    );
}

export default withRouter(Plan);