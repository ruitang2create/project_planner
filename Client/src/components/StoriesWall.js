import React, { useState } from 'react';
import UserStory from './UserStory';
import { CardDeck } from 'react-bootstrap';
import './StoriesWall.css';

const StoriesWall = (props) => {
    const renderStories = () => {
        return props.stories.map(story =>
            <UserStory
                key={story.sid}
                sid={story.sid}
                title={story.title}
                content={story.content}
                priority={story.priority}
                hourCost={story.hours_cost}
                finished={story.finished}
                reloadStory={props.reloadStories}
            />
        );
    }
    return (
        <div className='StoriesWallContainer'>
            <CardDeck>
                {renderStories()}
            </CardDeck>
        </div>
    );
}

export default StoriesWall;