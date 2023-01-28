import React, { useState } from 'react';
import {streamAnswerFromAI} from './ai';
import './App.css';
import './index.css';
  
 function QuestionAnswerBox() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [questionHistory, setQuestionHistory] = useState([]);
    const [responses, setResponses] = useState([]);

    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
    }

    const handleSubmitQ = async (event) => {
        event.preventDefault();
       
        setQuestionHistory([...questionHistory, question]);
        setQuestion('');
        //setResponses([...responses, '']);
        // Construct the prompt by concatenating the previous questions and answers
        // let prompt = questionHistory.map((q, i) => {
        //     let answer = questionHistory[i + 1] ? `Answer: ${questionHistory[i + 1]}\n` : '';
        //     return `${i + 1}. ${q}\n${answer}`;
        //   }).join('');
        //   prompt += `\nCurrent question: ${question}`;
    
        let fullQuestion = "";
        for (let i =0; i< questionHistory.length; i++) {
            
            fullQuestion+='Question: ' + questionHistory[i] + '\n';
            fullQuestion+='Answer: ' + responses[i] + '\n';

        }

        fullQuestion+='Question: ' + question;
        // Pass the prompt to the API
        //const aiAnswer = await getAnswerFromAI(fullQuestion);
        //const responses = aiAnswer.split('.');
        //setResponses([...responses, aiAnswer]);

        console.log('calling streamAnswerFromAI');
        setAnswer('');

        let currentAnswer = '';

        await streamAnswerFromAI(fullQuestion, 
            (token)=> {

                if (currentAnswer!='' || (token!='\n' && token !='Answer' && token != ':' && token != ' ')) {
                    currentAnswer += token;
                    setAnswer(currentAnswer);
                }
                //console.log(token);
            }, 
            ()=> {
                //console.log('onComplete');
                setAnswer('');
                setResponses([...responses, currentAnswer]);
            }
        );
    
    }

    return (
    <div>
        {questionHistory.map((q,i)=> <div key={i}>
            <div className="question">{q}</div>
            <div className="answer">{(i==questionHistory.length-1 && answer) ? answer : responses[i]}</div>
        </div>)}
        <form onSubmit={handleSubmitQ}>
            <label><strong>Question:</strong></label>
            <br/>
            <div>
                <textarea className="question-box" type="text" value={question} onChange={handleQuestionChange} style={{width:'100%', height:200, marginTop: '2px'}} />
            </div>
            <br />
            <div>
                <input className="submit-button" type="submit" value="Submit" style={{padding: "10px 15px", fontSize: "17px", marginTop: '15px', marginTop: '1px'}} />
            </div>

            {/* <label>Answer:</label>
            <br/> */}

                {/* {responses.map((sentence, i) => <p key={i} className="chat-bubble">{sentence}</p>)}*/}

                
                {/* <div>
                {responses.map((sentence, i) => (
                    <Typing speed={30} delay={1000} key={i}>
                        <p>{sentence}</p>
                    </Typing>
                ))}
            </div> */}
                {/* {<textarea type="text" value={answer} readOnly style={{width:600, height:200, marginTop: '3px'}} /> } */}
            {/* <br />
            

            <textarea type="text" value={answer} readOnly style={{width:600, height:200, marginTop: '3px'}}>
                <div>
                    {responses.map((sentence, i) => (
                    <Typing speed={40} delay={1000} key={i}>
                        <p className="chat-bubble">{sentence}</p>
                    </Typing>
                    ))}
                </div>
            </textarea> */}

            
        </form>

        </div>
    );

    
}

export default QuestionAnswerBox;