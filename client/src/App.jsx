import { useState } from 'react';
import './App.css';
import SearchBar from './SearchBar';
import Display from './Display';

function App() {
  const [content, setContent] = useState(``);
  const handleContent = (data) => {
    setContent(data);
  };
  return (
    <div className='App'>
      <SearchBar setData={handleContent} />
      {content.length != 0 && <Display data={content} />}
    </div>
  );
}

export default App;
