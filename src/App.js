import './App.css';
import logo from './logo.svg';
import QuestionAnswerBox from './QuestionAnswerBox';
import React from 'react';
import getAnswerFromAI from './ai';
import './App.css';
import './index.css';

function App() {
  return (
  <div class="container mt-3">
   <div className="App">

    <div className='top-text'>
      <h1>Q&A with AI</h1>
    </div>
    
    <div className='description'>
      <p>Ask any question and the AI will answer!</p>
    </div>

    {/* <img src={logo} className="App-logo" alt="logo" /> */}
    <QuestionAnswerBox />
   </div>
  </div>
  );
}

export default App;