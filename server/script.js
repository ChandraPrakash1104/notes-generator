import { config } from 'dotenv';
import { OpenAI } from 'openai';

config();

const openai = new OpenAI({
  key: process.env.OPENAI_API_KEY,
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'how do make coffe without a esperso machine',
      },
    ],
    model: 'gpt-3.5-turbo',
  });

  console.log(completion.choices[0].message.content);
}

main();
