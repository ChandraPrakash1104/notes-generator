import React, { useState } from 'react';
import classes from './SearchBar.module.css';
import searchIcon from './searchIcon.svg';

const SearchBar = (props) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);

  const isValidLink = (url) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(url);
  };

  const handleChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsValid(isValidLink(newUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || !isValidLink(url)) {
      setIsValid(false);
      return;
    }
    const response = await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    props.setData(data.message);
    setUrl('');
  };

  return (
    <form action='' className={classes.search_bar} onSubmit={handleSubmit}>
      <input
        type='text'
        name='searchUrl'
        placeholder='Enter YouTube URL...'
        onChange={handleChange}
        value={url}
        className={isValid ? classes.valid_input : classes.invalid_input}
      />
      {isValid ? null : <p className={classes.invalid}>Invalid link</p>}

      <button>Generate</button>
    </form>
  );
};

export default SearchBar;
