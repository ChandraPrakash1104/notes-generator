import React, { useState } from 'react';
import classes from './Display.module.css';
import editIcon from './edit.svg';

const Display = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleInput = (event) => {
    props.onDataChange(event.target.innerText);
  };

  return (
    <div
      className={`${classes.container} ${
        isEditing ? classes.container_editing : ''
      }`}
    >
      <pre
        className={classes.para}
        contentEditable={isEditing}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: props.data }}
      />
      {!isEditing && (
        <span className={classes.edit_box} onClick={handleEditClick}></span>
      )}
      {isEditing && (
        <span className={classes.save_box} onClick={handleSaveClick}></span>
      )}
    </div>
  );
};

export default Display;
