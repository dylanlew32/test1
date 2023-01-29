import React, { useRef, useState } from "react";
import { getImagefromAI, streamAnswerFromAI } from "./ai";
import "./App.css";
import "./index.css";

const defaultImageHeight = 256;
const defaultImageWidth = 256;

function QuestionAnswerBox() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionHistory, setQuestionHistory] = useState([]);
  const [responses, setResponses] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const isCancelled = useRef(false);

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmitQ = async () => {
    setIsBusy(true);
    isCancelled.current = false;
    setQuestionHistory([...questionHistory, question]);
    setQuestion("");

    let fullQuestion = "";
    for (let i = 0; i < questionHistory.length; i++) {
      fullQuestion += "Question: " + questionHistory[i] + "\n";
      fullQuestion += "Answer: " + responses[i] + "\n";
    }

    fullQuestion += "Question: " + question;

    console.log("calling streamAnswerFromAI");
    setAnswer("");

    let currentAnswer = "";

    await streamAnswerFromAI(
      fullQuestion,
      (token) => {
        if (
          currentAnswer != "" ||
          (token != "\n" && token != "Answer" && token != ":" && token != " ")
        ) {
          currentAnswer += token;
          setAnswer(currentAnswer);
        }
        //console.log(token);
      },
      () => {
        //console.log('onComplete');
        setAnswer("");
        setResponses([...responses, currentAnswer]);
        setIsBusy(false);
      },
      () => isCancelled.current
    );
  };

  const handleCancel = () => {
    isCancelled.current = true;
  };

  const handleSubmitImage = async () => {
    setQuestionHistory([...questionHistory, question]);
    setQuestion("");

    let fullQuestion = "";
    for (let i = 0; i < questionHistory.length; i++) {
      fullQuestion += "Question: " + questionHistory[i] + "\n";
    }

    fullQuestion += "Question: " + question;
    console.log("calling streamAnswerFromAI");
    setAnswer("Working on it...");

    const url = await getImagefromAI(
      fullQuestion,
      defaultImageWidth,
      defaultImageHeight
    );
    setAnswer(url);
    setResponses([...responses, url]);
  };

  const handleClearAll = () => {
    setQuestionHistory([]);
    setResponses([]);
  };

  return (
    <div>
      {questionHistory.map((q, i) => (
        <div key={i}>
          <div className="question">{q}</div>
          {/* <div className="answer">{(i==questionHistory.length-1 && answer) ? answer : responses[i]}</div> */}
          <Answer
            answer={
              i == questionHistory.length - 1 && answer ? answer : responses[i]
            }
          />
        </div>
      ))}

    <div className="question-section">
      <label>
        <strong>Question:</strong>
      </label>
      <br />
      <div>
        <textarea
          type="text"
          value={question}
          onChange={handleQuestionChange}
        />
      </div>
      <div>
        <button
          onClick={isBusy ? handleCancel : handleSubmitQ}
          disabled={question.trim() == "" && !isBusy}
        >
          {isBusy ? "Cancel" : "Submit"}
        </button>

        <button
          onClick={handleSubmitImage}
          disabled={question.trim() == "" || isBusy}
        >
          Image
        </button>
        {questionHistory.length == 0 ? null : (
          <button onClick={handleClearAll} style={{ float: "right" }}>
            Start Over
          </button>
        )}
      </div>
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
    </div>
  );
}

const Answer = ({ answer = "" }) => {
  if (answer.startsWith("https://")) {
    return (
      <div className="answer">
        <img
          src={answer}
          height={defaultImageHeight}
          width={defaultImageWidth}
        />
      </div>
    );
  }

  return <div className="answer">{answer}</div>;
};

export default QuestionAnswerBox;