import { fetchEventSource } from "@microsoft/fetch-event-source";

// TEXT MODEL
export async function getAnswerFromAI(question) {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  const response = openai.createCompletion({
    model: "text-davinci-003",
    prompt: question,
    temperature: 0.98,
    max_tokens: 3115,
    top_p: 1,
    frequency_penalty: 1.57,
    presence_penalty: 1.76,
  });

  let answer = response.data.choices[0].text;

  if (answer.startsWith("\n\n")) {
    answer = answer.substring(2);
  }
  return answer;

}

// TEXT MODEL
export async function streamAnswerFromAI(question, callback, onComplete) {
  console.log("streamAnswerFromAI " + question);

  return await fetchEventSource("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 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",
    },
    method: "POST",
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: question,
      max_tokens: 3115,
      stream: true,
      temperature: 0.98,
      top_p: 1,
      frequency_penalty: 1.57,
      presence_penalty: 1.76,
    }),
    onmessage: (ev) => {
      if (ev.data == "[DONE]") {
        onComplete();
      } else {
        callback(JSON.parse(ev.data).choices[0].text);
      }
    },
    onerror: (e) => console.error(e),
  
  });

}

// IMAGE MODEL
// export async function generateImage(prompt) {
//   const { Configuration, OpenAIApi } = require("openai");
//   const configuration = new Configuration({
//       apiKey: "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",
//   });
//   const openai = new OpenAIApi(configuration);

//   const n = 3;
//   const size = "1024x1024";
//   // do i need "image" or "data-url" ??
//   const responseFormat = "image";

//   return await openai.createImage({
//       prompt,
//       n,
//       size,
//       responseFormat,
//   });
//   // return response.data; is this needed?
// }



// told me what to put -----------------------------------
// const Jimp = require('jimp');

// const image = await Jimp.read(response.data);
// await image.writeAsync('dog.jpg');

// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const img = new Image();
// img.src = response.data;
// img.onload = function(){
//     ctx.drawImage(img,0,0);
// };



// new API KEY: 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




