import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab, Button, Modal, Form, Col, InputGroup } from 'react-bootstrap';
import StoriesWall from './StoriesWall';
import Axios from 'axios';
import host from '../lib/serverConfig';
import './Plan.css';

function Plan(props) {
    Axios.defaults.withCredentials = true;
    const [isLoading, setIsLoading] = useState(true);
    const [stories, setStories] = useState([]);
    const [newStoryTitle, setNewStoryTitle] = useState('');
    const [newStoryContent, setNewStoryContent] = useState('');
    const [newStoryPriority, setNewStoryPriority] = useState('0');
    const [newStoryCost, setNewStoryCost] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    const getStories = () => {
        console.log('Fetching stories of Project' + props.pid + '...');
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

    const addStoryHandler = (event) => {
        console.log('Sending request to insert new story...');
        event.preventDefault();
        handleModalClose();
        const apiUrl = `${host}/stories/${props.pid}`;
        Axios.post(apiUrl, {
            title: newStoryTitle,
            content: newStoryContent,
            priority: newStoryPriority,
            hours_cost: newStoryCost,
            finished: false,
        }).then(res => {
            if (res.data.success) {
                alert(`User Story${res.data.sid} 创建成功！`);
            } else {
                alert('创建失败！');
                console.log('Failed to add new story: ' + res.data.err);
            }
        }).catch(err => {
            console.log('Axios POST request error: ' + err);
        });
    }

    useEffect(() => getStories(), []);

    return (
        <div className='planPage'>
            <h1 className='planPageTitle'>{props.name}</h1>
            <Tabs >
                <Tab eventKey='basic' title='Basic Info'>
                    <div className='planBasicInfoContainer'>
                        <h3 className='planPageSubtitles' id='planPageDescTitle'>Description</h3>
                        <div id='planPageDesc'>{props.desc}</div>
                        <h3 className='planPageSubtitles' id='planPageVisionTitle'>Vision Statement</h3>
                        <div id='planPageVision'>{props.vision}</div>
                    </div>
                </Tab>
                <Tab eventKey='stories' title='User Stories'>
                    <Button variant='dark' id='addNewStoryBtn' onClick={handleModalShow}>New Story</Button>
                    {
                        !isLoading &&
                        <StoriesWall
                            stories={stories}
                        />
                    }
                    <Modal show={showModal} onHide={handleModalClose} centered >
                        <Modal.Header closeButton>
                            <Modal.Title>New User Story</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form className='newStoryForm' onSubmit={addStoryHandler}>
                                <Form.Group className='newStoryInputContainer' contorlId='newStoryTitleInputContainer'>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        className='newStoryInput'
                                        onChange={e => setNewStoryTitle(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className='newStoryInputContainer' contorlId='newStoryContentInputContainer'>
                                    <Form.Label>Content</Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        className='newStoryInput'
                                        onChange={e => setNewStoryContent(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className='newStoryInputContainer' contorlId='newStoryPriorityInputContainer'>
                                    <Form.Row>
                                        <Col>
                                            <Form.Check
                                                inline
                                                label='High'
                                                type='radio'
                                                className='newStoryInput newStoryPriorityInputCheck'
                                                name='priorityCheck'
                                                checked={newStoryPriority === 2}
                                                onChange={() => setNewStoryPriority(2)}
                                            />
                                            <Form.Check
                                                inline
                                                label='Mid'
                                                type='radio'
                                                className='newStoryInput newStoryPriorityInputCheck'
                                                name='priorityCheck'
                                                checked={newStoryPriority === 1}
                                                onChange={() => setNewStoryPriority(1)}
                                            />
                                            <Form.Check
                                                inline
                                                label='Low'
                                                type='radio'
                                                className='newStoryInput newStoryPriorityInputCheck'
                                                name='priorityCheck'
                                                checked={newStoryPriority === 0}
                                                onChange={() => setNewStoryPriority(0)}
                                            />
                                        </Col>
                                        <Col>
                                            <InputGroup>
                                                <Form.Control
                                                    className='newStoryInput'
                                                    onChange={e => setNewStoryCost(parseInt(e.target.value))}
                                                    required
                                                />
                                                <InputGroup.Append>
                                                    <InputGroup.Text >Hours</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                    </Form.Row>
                                </Form.Group>
                                <Button variant='light' onClick={handleModalClose}>Cancel</Button>
                                <Button variant='dark' type='submit'>Create</Button>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>
                </Tab>
            </Tabs>
        </div>
    );
}

export default withRouter(Plan);