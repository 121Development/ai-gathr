import { load } from "https://deno.land/std/dotenv/mod.ts";

interface Person {
  name: string;
  role: string;
  company: string;
}

interface NERResult {
  persons: Person[];
  locations: string[];
  dateTime: Date[]; // ISO 8601 format converted to Date objects
  containsNER: boolean;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

async function aiNERCheck(info: InformationObject): Promise<InformationObject> {
  console.log("starting NER check");
  const text = info.content;
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
    
    // Update the InformationObject with NER results
    info.entities = [
      ...(nerResult.persons || []).map(person => [
        { text: person.name, type: "PERSON_NAME" },
        { text: person.role, type: "PERSON_ROLE" },
        { text: person.company, type: "ORGANIZATION" }
      ]).flat(),
      ...(nerResult.locations || []).map(location => ({
        text: location,
        type: "LOCATION"
      })),
      ...(nerResult.dateTime || []).map(dt => ({
        text: dt,
        type: "DATETIME"
      }))
    ];

    info.hasEntities = Boolean(
      (nerResult.persons && nerResult.persons.length > 0) ||
      (nerResult.locations && nerResult.locations.length > 0) ||
      (nerResult.dateTime && nerResult.dateTime.length > 0)
    );

    // Update dates if present
    if (nerResult.dateTime && nerResult.dateTime.length > 0) {
      info.dueDates = nerResult.dateTime.map(dateStr => new Date(dateStr));
      // Set start date to first date found if not already set
      if (!info.startDate && info.dueDates.length > 0) {
        info.startDate = info.dueDates[0];
      }
      // Set end date to last date found if not already set
      if (!info.endDate && info.dueDates.length > 0) {
        info.endDate = info.dueDates[info.dueDates.length - 1];
      }
    }

    return info;
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

import { type InformationObject } from "./main.ts";
export { aiNERCheck };
