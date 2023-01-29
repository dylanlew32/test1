import './App.css';
import logo from './logo.svg';
import QuestionAnswerBox from './QuestionAnswerBox';
import React from 'react';
import getAnswerFromAI from './ai';
import './App.css';
import './index.css';

function App() {
  return (
   <div className="App">

    <div className='top-text'>
      <h1>Q&A With AI</h1>
    </div>
    {/* <img src={logo} className="App-logo" alt="logo" /> */}
    <QuestionAnswerBox />
   </div>
  );
}

export default App;
