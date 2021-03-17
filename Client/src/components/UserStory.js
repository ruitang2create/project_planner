import React, { useEffect, useState } from 'react';
import { Card, Form, Col, Button, Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import Checkbox from './Checkbox';
import Axios from 'axios';
import host from '../lib/serverConfig';
import './UserStory.css';
import editIcon from '../assets/imgs/editIcon_black.png';

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
            }
        }).catch(err => {
            console.log('Axios PUT request err:' + err);
        });
    }

    const titleContentUpdater = (event) => {
        event.preventDefault();
        setTitle(tempTitle);
        setContent(tempContent);
        setToUpdate(true);
        handleModalClose();
    }

    const checkboxHandler = () => {
        setFinished(!finished);
        setToUpdate(true);
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
            <Card >
                <Card.Header>
                    <div classNmae='storyTitleContainer'>
                        <h4 className='storyTitleDisplay'>{title}</h4>
                        <img className='storyEditBtn' alt='img' src={editIcon} onClick={handleModalShow} />
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className='storySectionMid'>
                        <div className='storyContentDisplay'>
                            <Card.Text><span style={{ fontSize: '18px' }}>{content}</span></Card.Text>
                        </div>
                        <div className='storyPriorityDisplay'>
                            <DropdownButton variant={colorOfPriority[priority]} id="storyPriorityDropdown" title={textOfPriority[priority]}>
                                <Dropdown.Item onClick={() => setPriority(2)}>high</Dropdown.Item>
                                <Dropdown.Item onClick={() => setPriority(1)}>mid</Dropdown.Item>
                                <Dropdown.Item onClick={() => setPriority(0)}>low</Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </div>
                </Card.Body>
                <Card.Body>
                    <div className='storySectionBot'>
                        <div className='storyCostDisplay' >{`Est. ${hourCost} hrs`}</div>
                        <div className='storyCheckboxContainer'>
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
                        <Button variant='light' onClick={handleModalClose}>Cancel</Button>
                        <Button variant='dark' type='submit'>Update</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default UserStory;