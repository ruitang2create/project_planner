import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import Checkbox from './Checkbox';
import Axios from 'axios';
import host from '../lib/serverConfig';
import './UserStory.css';
import editIcon from '../assets/imgs/editIcon_black.png';
import deleteIcon from '../assets/imgs/deleteIcon_black.png';

const UserStory = (props) => {
    Axios.defaults.withCredentials = true;

    const [title, setTitle] = useState(props.title);
    const [content, setContent] = useState(props.content);
    const [priority, setPriority] = useState(props.priority);
    const [hourCost, setHourCost] = useState(props.hourCost);
    const [finished, setFinished] = useState(props.finished);

    const [pageRendered, setPageRendered] = useState(false);
    const [toUpdate, setToUpdate] = useState(false);

    const [tempTitle, setTempTitle] = useState(props.title);
    const [tempContent, setTempContent] = useState(props.content);
    const [tempHourCost, setTempHourCost] = useState(props.hourCost);

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const handleDeleteModalClose = () => setDeleteModalShow(false);
    const handleDeleteModalShow = () => setDeleteModalShow(true);


    const storyUpdater = () => {
        const apiUrl = `${host}/stories/${props.sid}`;
        Axios.put(apiUrl, {
            title: title,
            content: content,
            priority: priority,
            hours_cost: hourCost,
            finished: finished,
        }).then(res => {
            if (res.data.success) {
                console.log('Story updated!');
                setToUpdate(false);
            } else {
                console.log('Update failed!');
                console.log('Story update err: ' + res.data.err);
                setToUpdate(false);
            }
        }).catch(err => {
            console.log('Axios PUT request err:' + err);
        });
    }

    const titleContentUpdater = (event) => {
        event.preventDefault();
        setTitle(tempTitle);
        setContent(tempContent);
        setHourCost(tempHourCost);
        setToUpdate(true);
        handleModalClose();
    }

    const checkboxHandler = () => {
        setFinished(!finished);
        setToUpdate(true);
    }

    const newPriorityHandler = (newPriority) => {
        setPriority(newPriority);
        setToUpdate(true);
    }

    const deleteStoryHandler = () => {
        handleDeleteModalClose();
        const apiUrl = `${host}/stories/${props.sid}`;
        Axios.delete(apiUrl).then(res => {
            if (res.data.success) {
                console.log('Story deleted!');
                setToUpdate(false);
                props.reloadStory(true);
            } else {
                console.log('Failed to delete story!');
                console.log('Story deletion err: ' + res.data.err);
                setToUpdate(false);
            }
        }).catch(err => {
            console.log('Axios DELETE request err:' + err);
        });
    }

    useEffect(() => {
        if (pageRendered) {
            if (toUpdate) {
                storyUpdater();
            }
        } else {
            setPageRendered(true);
        }
    }, [toUpdate]);

    const colorOfPriority = ['secondary', 'info', 'primary'];

    const textOfPriority = ['low', 'mid', 'high'];

    return (
        <div className='userStory'>
            <Card className='storyMainContainer'>
                <Card.Header>
                    <div classNmae='storyTitleContainer'>
                        <h4 className='storyTitleDisplay'>{title}</h4>
                        <img className='storyEditBtn' alt='img' src={editIcon} onClick={handleModalShow} />
                        <img className='storyDeleteBtn' alt='img' src={deleteIcon} onClick={handleDeleteModalShow} />
                    </div>
                </Card.Header>
                <Card.Body className='storyCoreContainer'>
                    <div className='storySectionMid'>
                        <div className='storyContentDisplay'>
                            <Card.Text><span style={{ fontSize: '18px' }}>{content}</span></Card.Text>
                        </div>
                        <div className='storyPriorityDisplay'>
                            <DropdownButton variant={colorOfPriority[priority]} id="storyPriorityDropdown" title={textOfPriority[priority]}>
                                <Dropdown.Item onClick={() => newPriorityHandler(2)}>high</Dropdown.Item>
                                <Dropdown.Item onClick={() => newPriorityHandler(1)}>mid</Dropdown.Item>
                                <Dropdown.Item onClick={() => newPriorityHandler(0)}>low</Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </div>
                </Card.Body>
                <Card.Body>
                    <div className='storySectionBot'>
                        <div className='storyCostDisplay' >
                            <span className='storyCostText'>{`Est. ${hourCost} hrs`}</span>
                        </div>
                        <div className='storyCheckboxContainer' onClick={checkboxHandler}>
                            <span className='storyCheckboxContainerLabel'>{'Done '}</span>
                            <Checkbox checked={finished} clickHandler={checkboxHandler} />
                        </div>
                    </div>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={handleModalClose} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Story</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className='storyTitleUpdateForm' onSubmit={titleContentUpdater}>
                        <Form.Group className='storyUpdateInputContainer' contorlId='storyUpdateTitleInputContainer'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                className='storyUpdateTitleInput'
                                value={tempTitle}
                                onChange={e => setTempTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className='storyUpdateInputContainer' contorlId='storyUpdateContentInputContainer'>
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as='textarea'
                                className='storyUpdateContentInput'
                                value={tempContent}
                                onChange={e => setTempContent(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className='storyUpdateInputContainer' contorlId='storyUpdateCostInputContainer'>
                            <Form.Label>Time Cost</Form.Label>
                            <Form.Control
                                className='storyUpdateCostInput'
                                value={tempHourCost}
                                onChange={e => setTempHourCost(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant='light' onClick={handleModalClose}>Cancel</Button>
                        <Button variant='dark' type='submit'>Update</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={deleteModalShow} onHide={handleDeleteModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body><p>Are you sure to <span><strong>delete</strong></span> this user story?</p></Modal.Body>
                <Modal.Footer>
                    <Button variant='light' onClick={handleDeleteModalClose}>Cancel</Button>
                    <Button variant='danger' onClick={deleteStoryHandler}>DELETE</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UserStory;