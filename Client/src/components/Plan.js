import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Button, Modal, Form, Col, InputGroup, Accordion } from 'react-bootstrap';
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

    const [toLoadStories, setToLoadStories] = useState(true);

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
                setToLoadStories(true);
            } else {
                alert('创建失败！');
                console.log('Failed to add new story: ' + res.data.err);
            }
        }).catch(err => {
            console.log('Axios POST request error: ' + err);
        });
    }

    useEffect(() => {
        if (toLoadStories) {
            getStories();
            setToLoadStories(false);
        }
    }, [toLoadStories]);

    return (
        <div className='planPage'>
            <h1 className='planPageTitle'>{props.name}</h1>
            <Accordion defaultActiveKey='2'>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                            <span className='planPageSubtitles'>Description</span></Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <div className='planBasicInfoContainer'>
                            <div id='planPageDesc'>{props.desc}</div>
                        </div>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1"><span className='planPageSubtitles'>Vision Statement</span></Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <div className='planBasicInfoContainer'>
                            <div id='planPageVision'>{props.vision}</div>
                        </div>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2"><span className='planPageSubtitles'>User Stories</span></Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                        <div className='planUserStoriesContainer'>
                            <Button variant='dark' id='addNewStoryBtn' onClick={handleModalShow}>New Story</Button>
                            {
                                !isLoading &&
                                <StoriesWall
                                    stories={stories}
                                />
                            }
                        </div>
                    </Accordion.Collapse>
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
                    </Modal>
                </Card>
            </Accordion>
        </div>
    );
}

export default withRouter(Plan);