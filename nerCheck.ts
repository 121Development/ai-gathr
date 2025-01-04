import { load } from "https://deno.land/std/dotenv/mod.ts";

interface NERResult {
  names: string[];
  people: string[];
  companies: string[];
  locations: string[];
  dateTime: string[]; // ISO 8601 format: YYYY-MM-DD'T'HH:mm:ss
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

async function aiNerCheck(text: string): Promise<NERResult> {
  console.log("starting NER check");
  // Load environment variables
  const env = await load();
  const OPENAI_API_KEY = env["OPENAI_API_KEY"];
  
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not found in environment variables");
  }

  const prompt = `
    Analyze the following text and extract named entities into these categories:
    names (for proper nouns), people (for roles/titles/positions), companies, locations, dateTime.
    
    For dates and times, convert to ISO 8601 combined date-time format (YYYY-MM-DD'T'HH:mm:ss).
    For relative dates/times like "tomorrow" or "in an hour", calculate the specific date-time based on current time.
    
    Return only a JSON object with these categories as arrays. Text to analyze: "${text}"
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: prompt
        }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    const nerResult: NERResult = JSON.parse(content);
    
    return {
      names: nerResult.names || [],
      people: nerResult.people || [],
      companies: nerResult.companies || [],
      locations: nerResult.locations || [],
      dateTime: nerResult.dateTime || [],
    };
  } catch (error) {
    console.error("Error performing AI NER:", error);
    return {
      names: [],
      people: [],
      companies: [],
      locations: [],
      dateTime: [],
    };
  }
}

export { aiNerCheck, type NERResult };
