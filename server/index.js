import { YoutubeTranscript } from 'youtube-transcript';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { OpenAI } from 'openai';

config();
const app = express();

app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  key: process.env.OPENAI_API_KEY,
});

const ai21 = process.env.AI21_API_KEY;

const splitTranscriptIntoChunks = (transcript, maxLength) => {
  const words = transcript.split(' ');
  const chunks = [];
  let currentChunk = '';

  for (let word of words) {
    if ((currentChunk + word).length <= maxLength) {
      currentChunk += ' ' + word;
    } else {
      chunks.push(currentChunk);
      currentChunk = word;
    }
  }

  chunks.push(currentChunk);

  return chunks;
};

const main = async (transcript) => {
  // const chunks = splitTranscriptIntoChunks(transcript, 4096);
  // let notes = '';

  // for (let chunk of chunks) {
  //   const completion = await openai.chat.completions.create({
  //     messages: [
  //       {
  //         role: 'system',
  //         content: `prepare notes for given transcript ${chunk}`,
  //       },
  //     ],
  //     model: 'gpt-3.5-turbo',
  //   });

  //   const res = completion.choices[0].message.content;
  //   notes += res;
  //   break;
  // }
  // const chunks = splitTranscriptIntoChunks(transcript, 4096);
  // let notes = '';

  // for (let chunk of chunks) {
  //   const completion = await openai.chat.completions.create({
  //     messages: [
  //       {
  //         role: 'system',
  //         content: `prepare notes for given transcript ${chunk}`,
  //       },
  //     ],
  //     model: 'gpt-3.5-turbo',
  //   });

  //   const res = completion.choices[0].message.content;
  //   notes += res;
  //   break;
  // }
  const res = await fetch('https://api.ai21.com/studio/v1/summarize', {
    headers: {
      Authorization: `Bearer ${ai21}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: transcript,
      sourceType: 'TEXT',
    }),
    method: 'POST',
  });
  const notes = await res.json();
  return notes;
};
app.post('/', async (req, res) => {
  const { url } = req.body;

  try {
    const captionObj = await YoutubeTranscript.fetchTranscript(url);
    const transcript = captionObj.map((obj) => obj.text).join('. ');

    const notes = await main(transcript);

    res.json({ message: notes });
  } catch (error) {
    console.error('Error fetching transcript:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
