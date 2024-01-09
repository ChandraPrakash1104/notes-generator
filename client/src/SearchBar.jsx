import React, { useEffect, useState } from 'react';
import classes from './SearchBar.module.css';

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
    await props.fetchData(url);
    setUrl('');
  };

  return (
    <form
      autoComplete='off'
      action=''
      className={classes.search_bar}
      onSubmit={handleSubmit}
    >
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
