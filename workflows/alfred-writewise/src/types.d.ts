export interface OpenAIResponse {
  choices?: { message: { content: string } }[];
  error?: { message: string };
}
