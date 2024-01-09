import React, { useState } from 'react';
import './App.css';
import SearchBar from './SearchBar';
import Display from './Display';

function App() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUrl = async (url) => {
    setContent('');
    setIsLoading(true);
    const response = await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    setIsLoading(false);
    const msg = data.message.summary;
    if (msg === undefined) {
      setContent('Sorry try other links...');
      return;
    }
    setContent(data.message.summary);
  };

  return (
    <div className='App'>
      <SearchBar fetchData={handleUrl} />
      {isLoading && <div className='loading-spinner'></div>}
      {content.length !== 0 && <Display data={content} />}
    </div>
  );
}

export default App;
