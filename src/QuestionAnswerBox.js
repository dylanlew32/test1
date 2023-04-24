import React, { useEffect, useRef, useState } from "react";
import { getImagefromAI, streamAnswerFromAI } from "./ai";

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
      fullQuestion += " " + questionHistory[i] + "\n";
      //fullQuestion += " " + responses[i] + "\n";
    }

    fullQuestion += " " + question;

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
 
      },
      () => {
  
        setAnswer("");
        setResponses([...responses, currentAnswer]);
        setIsBusy(false);

      },
      () => isCancelled.current
    );
  };

  const handleCancel = () => {
    isCancelled.current = true;
    setIsBusy(false);
  };

  const handleSubmitImage = async () => {
    setQuestionHistory([...questionHistory, question]);
    setQuestion("");
    let fullQuestion = "";
    for (let i = 0; i < questionHistory.length; i++) {
      fullQuestion += " " + questionHistory[i] + "\n";
    }

    fullQuestion += " " + question;
    console.log("calling streamAnswerFromAI");
    setAnswer("Loading...");

    try {
      const url = await getImagefromAI(
        fullQuestion,
        defaultImageWidth,
        defaultImageHeight
      );
      setAnswer(url);
      setResponses([...responses, url]);
    } catch (error) {
      setAnswer('Error: ' + error.response.data.error.message);
      setResponses([...responses, 'Error: ' + error.response.data.error.message]);
    }

  };

  const handleClearAll = () => {
    setQuestionHistory([]);
    setResponses([]);
  };

  useEffect(()=> {
      document.documentElement.scrollTop = document.documentElement.scrollHeight;
  },[responses, questionHistory, answer]);

  return (
    <div>
      {questionHistory.map((q, i) => (
        <div key={i}>
          <div className="question">{q}</div>
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
          type="text" placeholder="No longer in use, sorry :("
          value={question}
          onChange={handleQuestionChange}
        />
      </div>
      <div>
        <button
        className="btn btn-primary me-2"
          onClick={isBusy ? handleCancel : handleSubmitQ}
          disabled={question.trim() == "" && !isBusy}
        >
          {isBusy ? "Cancel" : "Submit"}
        </button>

        <button
        className="btn btn-primary"
          onClick={handleSubmitImage}
          disabled={question.trim() == "" || isBusy}
        >
          Image
        </button>
        {questionHistory.length == 0 ? null : (
          <button onClick={handleClearAll} style={{ float: "right" }} className="btn btn-secondary">
            Restart
          </button>
        )}
      </div>
      </div>
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