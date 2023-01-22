import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// QuestionAnswerBox.js
import getAnswerFromAI from './ai';

// import React, { useState } from 'react';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

function QuestionAnswerBox() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleQuestionChange = (e) => {
      setQuestion(e.target.value);
  }

  const handleAnswerChange = (e) => {
      setAnswer(e.target.value);
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      // send the question to the AI and receive the answer
      const receivedAnswer = await getAnswerFromAI(question);
      setAnswer(receivedAnswer);
  }

  return (
      <div>
          <form onSubmit={handleSubmit}>
              <label>
                  Question:
                  <input type="text" value={question} onChange={handleQuestionChange} />
              </label>
              <button type="submit">Ask</button>
          </form>
          <div>
              <label>
                  Answer:
              <textarea value={answer} onChange={handleAnswerChange} readOnly={true} />
              </label>
          </div>
      </div>
  );
}

export default QuestionAnswerBox;