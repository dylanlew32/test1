import './App.css';
import QuestionAnswerBox from './QuestionAnswerBox';
import React from 'react';

function App() {
  return (
  <div className="container mt-3">
   <div className="App">

    <div className='top-text'>
      <h1>Learn with AI</h1>
    </div>
    
    <div className='description'>
      <p>Ask any question and the AI will answer!</p>
    </div>

    <QuestionAnswerBox />
   </div>
  </div>
  );
}

export default App;