import React, { useState } from 'react';
import './NewPlan.css';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import Axios from 'axios';
import host from '../lib/serverConfig';
import { withRouter } from 'react-router-dom';

function NewPlan(props) {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectVSp1, setProjectVSp1] = useState('');
    const [projectVSp2, setProjectVSp2] = useState('');
    const [projectVSp3, setProjectVSp3] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const apiUrl = `${host}/plans`;
        Axios.post(apiUrl, {
            name: projectName,
            description: projectDescription,
            vision: projectVSp1 + '\n' + projectVSp2 + '\n' + projectVSp3,
        })
            .then(res => {
                if (res.data.success) {
                    alert(`计划${res.data.pid} 创建成功!`);
                    props.history.push('/');
                } else {
                    alert('创建失败!');
                    console.log('Err: ' + res.data.err);
                }
            });
    }

    Axios.defaults.withCredentials = true;

    return (
        <div className='NewPlanPage'>
            <h1 className='newPlanPageTitle'>New Project Plan</h1>
            <Form className='newPlanForm' onSubmit={handleSubmit}>
                <Form.Group controlId='projectNameInput'>
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Make a good name'
                        value={projectName}
                        onChange={e => setProjectName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId='projectDescInput'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as='textarea'
                        rows={2}
                        placeholder={'Briefly, what\'s this?'}
                        value={projectDescription}
                        onChange={e => setProjectDescription(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId='projectDescInput'>
                    <Form.Label>Vision Statement</Form.Label>
                    <Form.Text muted>What this project should accomplish?</Form.Text>
                    <Form.Control
                        as='textarea'
                        rows={3}
                        value={projectVSp1}
                        onChange={e => setProjectVSp1(e.target.value)}
                    />
                    <Form.Text muted>Why is this project valuable?</Form.Text>
                    <Form.Control
                        as='textarea'
                        rows={3}
                        value={projectVSp2}
                        onChange={e => setProjectVSp2(e.target.value)}
                    />
                    <Form.Text muted>What's the success criteria of this project?</Form.Text>
                    <Form.Control
                        as='textarea'
                        rows={3}
                        value={projectVSp3}
                        onChange={e => setProjectVSp3(e.target.value)}
                    />
                </Form.Group>
                <Button type='submit' variant='dark'>Create Plan</Button>
            </Form>

        </div >
    );
}

export default withRouter(NewPlan);