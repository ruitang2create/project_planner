import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Button, Modal, Form, Col, InputGroup, Accordion } from 'react-bootstrap';
import StoriesWall from './StoriesWall';
import Axios from 'axios';
import host from '../lib/serverConfig';
import './Plan.css';
import editIcon from '../assets/imgs/editIcon_black.png';
import deleteIcon from '../assets/imgs/deleteIcon_red.png';
import TopNav from './TopNav';

function Plan(props) {
    Axios.defaults.withCredentials = true;

    const [pageRendered, setPageRendered] = useState(false);

    const [visionFormatted, setVisionFormatted] = useState(false);

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

    const [tempDesc, setTempDesc] = useState(props.desc);
    const [tempVision, setTempVision] = useState(props.vision);

    const [showDescEditModal, setShowDescEditModal] = useState(false);
    const handleDescEditModalClose = () => setShowDescEditModal(false);
    const handleDescEditModalShow = () => setShowDescEditModal(true);

    const [showVisionEditModal, setShowVisionEditModal] = useState(false);
    const handleVisionEditModalClose = () => setShowVisionEditModal(false);
    const handleVisionEditModalShow = () => setShowVisionEditModal(true);

    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const handleDeleteModalClose = () => setDeleteModalShow(false);
    const handleDeleteModalShow = () => setDeleteModalShow(true);

    const planDescUpdater = (e) => {
        e.preventDefault();
        props.descSetter(uploadTextFormatter(tempDesc));
        props.updateWatcher(true);
        handleDescEditModalClose();
    }

    const planVisionUpdater = (e) => {
        e.preventDefault();
        props.visionSetter(uploadTextFormatter(tempVision));
        props.updateWatcher(true);
        handleVisionEditModalClose();
    }

    const visionTextFormatter = () => {
        const newLineRegex = /(\r\n|\n)/g;
        const formattedText = props.vision.replace(newLineRegex, '<br>');
        document.getElementById('planPageVision').innerHTML = formattedText;
        setVisionFormatted(true);
    }

    const uploadTextFormatter = (text) => {
        const formattedText = text.replace('"', '""');
        return formattedText;
    }

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
                console.log('Failed to add new story: ' + JSON.stringify(res.data.err));
            }
        }).catch(err => {
            console.log('Axios POST request error: ' + err);
        });
    }

    const deletePlanHandler = () => {
        handleDeleteModalClose();
        let apiUrl = `${host}/stories/plan/${props.pid}`;
        Axios.delete(apiUrl).then(res => {
            console.log('Deleting stories of plan' + props.pid + '...');
            if (res.data.success) {
                console.log('Stories of plan' + props.pid + ' deleted!');
                apiUrl = `${host}/plans/${props.pid}`;
                Axios.delete(apiUrl).then(res => {
                    console.log('Deleting plan' + props.pid + '...');
                    if (res.data.success) {
                        alert('Plan deleted!');
                        props.history.push('/myplans');
                    } else {
                        console.log('Failed to delete plan!');
                        console.log('Plan deletion err: ' + res.data.err);
                    }
                }).catch(err => {
                    console.log('Axios DELETE request err:' + err);
                });
            } else {
                console.log('Failed to delete stories of the plan!');
                console.log('Stories deletion err: ' + res.data.err);
            }
        }).catch(err => {
            console.log('Axios DELETE request err:' + err);
        });
    }

    useEffect(() => {
        if (toLoadStories) {
            getStories();
            setToLoadStories(false);
        }
    }, [toLoadStories]);

    useEffect(() => {
        if (pageRendered) {
            if (!visionFormatted) {
                visionTextFormatter();
            }
        } else {
            setPageRendered(true);
        }
    });

    return (
        <div className='planPage'>
            <TopNav />
            <h1 className='planPageTitle'>{props.name}</h1>
            <Accordion defaultActiveKey='2'>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        <span className='planPageSubtitles'>Description</span></Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <div className='planBasicInfoContainer'>
                            <div className='planBasicText' id='planPageDesc'>{props.desc}</div>
                            <img className='planEditBtn' alt='img' src={editIcon} onClick={handleDescEditModalShow} />
                        </div>
                    </Accordion.Collapse>
                    <Modal show={showDescEditModal} onHide={handleDescEditModalClose} centered >
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Description</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form className='planDescEditForm' onSubmit={planDescUpdater}>
                                <Form.Group className='planEditInputContainer' contorlId='planDescEditInputContainer'>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        className='planDescEditInput'
                                        value={tempDesc}
                                        onChange={e => setTempDesc(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button variant='light' onClick={handleDescEditModalClose}>Cancel</Button>
                                <Button variant='dark' type='submit'>Update</Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1"><span className='planPageSubtitles'>Vision Statement</span></Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <div className='planBasicInfoContainer'>
                            <div className='planBasicText' id='planPageVision'>{props.vision}</div>
                            <img className='planEditBtn' alt='img' src={editIcon} onClick={handleVisionEditModalShow} />
                        </div>
                    </Accordion.Collapse>
                    <Modal show={showVisionEditModal} onHide={handleVisionEditModalClose} centered >
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Vision Statement</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form className='planVisionEditForm' onSubmit={planVisionUpdater}>
                                <Form.Group className='planEditInputContainer' contorlId='planVisionEditInputContainer'>
                                    <Form.Label>Vision Statement</Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        className='planVisionEditInput'
                                        value={tempVision}
                                        onChange={e => setTempVision(e.target.value)}
                                        required
                                        rows={20}
                                    />
                                </Form.Group>
                                <Button variant='light' onClick={handleVisionEditModalClose}>Cancel</Button>
                                <Button variant='dark' type='submit'>Update</Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
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
                                    reloadStories={setToLoadStories}
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
            <div className='planDeleteBtnContainer'>
                <img className='planDeleteBtn' alt='img' src={deleteIcon} onClick={handleDeleteModalShow} />
            </div>
            <Modal show={deleteModalShow} onHide={handleDeleteModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body><p>Are you sure to <span><strong>delete</strong></span> this plan?</p></Modal.Body>
                <Modal.Footer>
                    <Button variant='light' onClick={handleDeleteModalClose}>Cancel</Button>
                    <Button variant='danger' onClick={deletePlanHandler}>DELETE</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default withRouter(Plan);