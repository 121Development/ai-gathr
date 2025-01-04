import { load } from "https://deno.land/std/dotenv/mod.ts";

interface NERResult {
  names: string[];
  people: string[];
  companies: string[];
  locations: string[];
  dates: string[];
  times: string[];
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

async function aiNerCheck(text: string): Promise<NERResult> {
  // Load environment variables
  const env = await load();
  const OPENAI_API_KEY = env["OPENAI_API_KEY"];
  
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not found in environment variables");
  }

  const prompt = `
    Analyze the following text and extract named entities into these categories:
    names (for proper nouns), people (for roles/titles/positions), companies, locations, dates, and times. Return only a JSON object with
    these categories as arrays. Text to analyze: "${text}"
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
      dates: nerResult.dates || [],
      times: nerResult.times || [],
    };
  } catch (error) {
    console.error("Error performing AI NER:", error);
    return {
      names: [],
      companies: [],
      locations: [],
      dates: [],
      times: [],
    };
  }
}

export { aiNerCheck, type NERResult };
