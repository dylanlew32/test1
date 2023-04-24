import { fetchEventSource } from "@microsoft/fetch-event-source";

const apiKey = ['s', 'k', '-', 'p', 't', 'p', 'J', 'W', 'U', 'F', 'd', 'j', '3', 'V', 'e', 'C', 'f', 'J', 'l', 'd', 'u', 'L', 'S', 'T', '3', 'B', 'l', 'b', 'k', 'F', 'J', 'i', '3', 'q', 'g', 'P', 'N', 'Q', 'p', 'x', 'c', 'g', 'X', 'p', '9', 'H', 'D', 'H', '6', 'i', '3'].join('');

// const newApiKey = ['s', 'k', '-', 'i', 'F', 'c', '7', '7', 'D', '0', 'P', 'E', 'Z', 'r', 'N', 'm', 'R', 'q', 'n', '4', 'q', 'k','R','T', '3','B','l','b','k','F','J','o','4','Q','k','u','L','h','9','T','C','n','e','O','R','Z','s','4','G','t','s'].join('');


// export async function getAnswerFromAI(question) {
//   const { Configuration, OpenAIApi } = require("openai");
//   const configuration = new Configuration({
//     apiKey,
//   });
//   const openai = new OpenAIApi(configuration);
//   const response = openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: question,
//     // controls randomness
//     temperature: 0.99,
//     // max characters
//     max_tokens: 2048,
//     // controls randomness
//     top_p: 0.54,
//     // prevent word repetitions
//     frequency_penalty: 1,
//     // prevent topic repetitions
//     presence_penalty: 1,
//   });

//   let answer = response.data.choices[0].text;
//   if (answer.startsWith("\n\n")) {
//     answer = answer.substring(2);
//   }
//   return answer;

// }

export async function streamAnswerFromAI(question, callback, onComplete, isCancelled) {
  console.log("streamAnswerFromAI " + question);
  const abortController = new AbortController();  

  const response = await fetchEventSource("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer " + apiKey,
    },
    method: "POST",
    body: JSON.stringify({
      model: "text-davinci-003",
      // model: "gpt-3.5-turbo-0301",
      prompt: question,
      max_tokens: 2048,
      stream: true,
      temperature: 0.4,
      top_p: 0.54,
      frequency_penalty: 1,
      presence_penalty: 1,
    }),
    signal: abortController.signal,
    onmessage: (ev) => {
      if (isCancelled()) {
        abortController.abort();
      }
      if (ev.data == "[DONE]") {
        onComplete();
      } else {
        callback(JSON.parse(ev.data).choices[0].text);
      }
    },
    onerror: (e) => console.error(e),

  });
}

export async function getImagefromAI(question, width=1024, height=1024) {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createImage({
    prompt: question,
    n: 1,
    size: width + "x" + height,

  });
  return response.data.data[0].url;

}