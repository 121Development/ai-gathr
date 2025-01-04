import { parse } from "https://deno.land/std/flags/mod.ts";
import { aiNerCheck, type NERResult } from "./nerCheck.ts";

console.log("Welcome to Gathr");

interface Entity {
  text: string;
  type: string;
}

interface ProcessedInput {
  source: string;
  category: string;
  content: string;
  keyword: string | null;
  entities: Entity[];
}

interface KeywordAnalysis {
  category: string;
  keywords: string[];
}


function checkKeywords(str: string): KeywordAnalysis {
  const words = str.toLowerCase().trim().split(/\s+/);
  const firstWord = words[0];
  return {
    category: firstWord,
    keywords: [firstWord]
  };
}

async function processInput(str: string): Promise<ProcessedInput> {
  const analysis = checkKeywords(str);
  const words = str.trim().toLowerCase().split(/\s+/);
  const firstWord = words[0];
  
  const aiEntities = await aiNerCheck(str);
  console.log(aiEntities);
  // Convert AI entities to Entity format
  const entities = [
    ...(Array.isArray(aiEntities.persons) ? aiEntities.persons.map(person => ([
      { text: person.name, type: "PERSON_NAME" },
      { text: person.role, type: "PERSON_ROLE" },
      { text: person.company, type: "ORGANIZATION" }
    ])).flat() : []),
    ...(Array.isArray(aiEntities.locations) ? aiEntities.locations.map(location => ({ text: location, type: "LOCATION" })) : []),
    ...(Array.isArray(aiEntities.dateTime) ? aiEntities.dateTime.map(dt => ({ text: dt, type: "DATETIME" })) : [])
  ];

  return {
    source: "user-input",
    category: analysis.category || "unknown",
    content: str.trim(),
    keyword: analysis.keywords.length > 0 ? firstWord : null,
    entities
  };
}

// Parse command line arguments
const args = parse(Deno.args, {
  string: ["input"],
  alias: { input: "i" },
});

if (!args.input) {
  console.log("Please provide input using --input or -i flag");
  console.log("Example: deno run main.ts --input \"Buy groceries\"");
  Deno.exit(1);
}

const result = await processInput(args.input);
console.log(JSON.stringify(result, null, 2));
