#!/usr/bin/env node --no-warnings --experimental-transform-types

import prompts from './prompts.json';
import { output } from './helpers';

import type { OpenAIResponse } from './types';

(async () => {
  /*****************************************************************************
   * 1. Get the message type and user message from command-line arguments
   ****************************************************************************/
  const OPENAI_API_KEY = process.env['OPENAI_API_KEY'] as string;
  const OPENAI_MODEL = process.env['OPENAI_MODEL'] || 'gpt-4.1-nano';
  const mode = process.argv[2] || 'BASIC';
  const messageType = process.argv[3] as keyof typeof prompts;
  const userMessage = process.argv[4] as string;

  /*****************************************************************************
   * 2. Validate the message type
   ****************************************************************************/
  if (!prompts[messageType]) {
    console.error('Invalid message type.');
    process.exit(1);
  }

  /*****************************************************************************
   * 3. Validate the user message
   ****************************************************************************/
  if (!userMessage) {
    console.error('Please provide the text to improve.');
    process.exit(1);
  }

  /*****************************************************************************
   * 4. Prepare the payload for the OpenAI API
   ****************************************************************************/
  const payload = {
    model: OPENAI_MODEL,
    temperature: 0.7,
    messages: [
      {
        role: 'system',
        content: `${prompts[messageType]}. Just return the improved text, nothing else.`,
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
  };

  /*****************************************************************************
   * 5. Call the OpenAI API
   ****************************************************************************/
  const request = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  /*****************************************************************************
   * 6. Handle the API response
   ****************************************************************************/
  const response = (await request.json()) as OpenAIResponse;

  /*****************************************************************************
   * 7. Exit the process if the API response is not successful
   ****************************************************************************/
  if (!request.ok || !response?.choices?.[0]?.message) {
    console.error(`|ERROR|${response}`);
    process.exit(1);
  }

  /*****************************************************************************
   * 8. Output the original and improved messages
   ****************************************************************************/
  const result = output(mode, userMessage, response.choices[0].message.content);
  console.log(result);
})();
