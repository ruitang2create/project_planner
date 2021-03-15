import React, { useEffect, useState } from 'react';
import { Card, ListGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import Checkbox from './Checkbox';
import Axios from 'axios';
import host from '../lib/serverConfig';
import './UserStory.css';

const UserStory = (props) => {
    Axios.defaults.withCredentials = true;

    const [title, setTitle] = useState(props.title);
    const [content, setContent] = useState(props.content);
    const [priority, setPriority] = useState(props.priority);
    const [hourCost, setHourCost] = useState(props.hourCost);
    const [finished, setFinished] = useState(props.finished);
    const [pageRendered, setPageRendered] = useState(false);

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
            } else {
                console.log('Update failed!');
                console.log('Story update err: ' + res.data.err);
            }
        }).catch(err => {
            console.log('Axios PUT request err:' + err);
        });
    }

    const checkboxHandler = () => {
        setFinished(!finished);
    }

    useEffect(() => {
        if (pageRendered) {
            storyUpdater();
        } else {
            setPageRendered(true);
        }
    }, [finished, priority]);

    const colorOfPriority = ['secondary', 'info', 'primary'];

    const textOfPriority = ['low', 'mid', 'high'];

    return (
        <Card >
            <Card.Header>
                <h4 className='storyTitleDisplay'>{title}</h4>
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
    );
}

export default UserStory;