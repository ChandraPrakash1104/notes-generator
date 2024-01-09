import { YoutubeTranscript } from 'youtube-transcript';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

config();
const app = express();

app.use(bodyParser.json());
app.use(cors());
const PORT = 3000;

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

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GIMINI_API_KEY);

const main = async (transcript) => {
  const chunks = splitTranscriptIntoChunks(transcript, 20000);
  let notes = '';
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  for (let chunk of chunks) {
    const prompt = `Creates Notes from the following transcript ${chunk}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    notes += text;
  }

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
