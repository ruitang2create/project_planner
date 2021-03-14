import React, { useState } from 'react';
import checkedIcon from '../assets/imgs/checkmark_checked.png';
import uncheckedIcon from '../assets/imgs/checkmark_unchecked.png';

const Checkbox = (props) => {
    // const [checked, setChecked] = useState(props.checked);

    const clickHandler = () => {
        // setChecked(!checked);
        props.clickHandler();
    }
    return (
        <img
            src={props.checked ? checkedIcon : uncheckedIcon}
            alt='checkbox'
            className='customCheckbox'
            onClick={clickHandler}
        />
    );
}

export default Checkbox;