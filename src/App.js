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

// TO DO: -----------------------------------------------------------------------------------------------------------------------------
// Style 
// make a "how it works" thing on the bottom
// have submit button be colored too
// make it so user has to pay...

// ask dad: 
// why is json file untracked?