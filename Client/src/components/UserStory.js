import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
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

    const storyUpdater = () => {
        const apiUrl = `${host}/userstories/${props.sid}`;
        Axios.put(apiUrl, {
            title: title,
            content: content,
            priority: priority,
            hourCost: hourCost,
            finished: finished,
        }).then(res => {
            if (res.data.success) {
                alert('Story updated!');
            } else {
                alert('Update failed!');
                console.log('Story update err: ' + res.data.err);
            }
        }).catch(err => {
            console.log('Axios PUT request err:' + err);
        });
    }

    const checkboxHandler = () => {
        setFinished(!finished);
        storyUpdater();
    }

    return (
        <Card >
            <Card.Header>{'User Story'}</Card.Header>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{content}</Card.Text>
            </Card.Body>
            <Checkbox checked={finished} clickHandler={checkboxHandler} />
        </Card>
    );
}

export default UserStory;