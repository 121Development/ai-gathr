import { load } from "https://deno.land/std/dotenv/mod.ts";

interface Person {
  name: string;
  role: string;
  company: string;
}

interface NERResult {
  persons: Person[];
  locations: string[];
  dateTime: string[]; // ISO 8601 format: YYYY-MM-DD'T'HH:mm:ss
  containsNER: boolean;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

async function aiNERCheck(text: string): Promise<NERResult> {
  console.log("starting NER check");
  // Load environment variables
  const env = await load();
  const OPENAI_API_KEY = env["OPENAI_API_KEY"];
  
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not found in environment variables");
  }

  const prompt = `
    Analyze the following text and extract named entities into a structured format.
    
    For persons, include their name, role/title, and associated company.
    For dates and times, convert to ISO 8601 combined date-time format (YYYY-MM-DD'T'HH:mm:ss).
    For relative dates/times like "tomorrow" or "in an hour", calculate the specific date-time based on current time.
    
    Set containsNER to true if ANY named entities (persons, locations, or dates) are found, false otherwise.
    
    Return a JSON object with this structure:
    {
      "persons": [
        {
          "name": "John Smith",
          "role": "CEO",
          "company": "Acme Corp"
        }
      ],
      "locations": ["New York", "Silicon Valley"],
      "dateTime": ["2024-01-04T15:30:00"],
      "containsNER": true
    }

    Text to analyze: "${text}"
  `;
  console.log("Using prompt: " + prompt);
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
      persons: nerResult.persons || [],
      locations: nerResult.locations || [],
      dateTime: nerResult.dateTime || [],
      containsNER: Boolean(
        (nerResult.persons && nerResult.persons.length > 0) ||
        (nerResult.locations && nerResult.locations.length > 0) ||
        (nerResult.dateTime && nerResult.dateTime.length > 0)
      )
    };
  } catch (error) {
    console.error("Error performing AI NER:", error);
    return {
      persons: [],
      locations: [],
      dateTime: [],
      containsNER: false
    };
  }
}

export { aiNERCheck, type NERResult };
