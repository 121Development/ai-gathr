import { parse } from "https://deno.land/std/flags/mod.ts";
import { aiNerCheck, type NERResult } from "./nerCheck.ts";

interface Entity {
  text: string;
  type: string;
  start: number;
  end: number;
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

function performNER(text: string): Entity[] {
  const entities: Entity[] = [];
  
  // Simple regex patterns for basic NER
  const patterns = {
    DATE: /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b(today|tomorrow|yesterday)\b/gi,
    TIME: /\b\d{1,2}[:]\d{2}\s*(am|pm)?\b/gi,
    EMAIL: /\b[\w.-]+@[\w.-]+\.\w+\b/gi,
    PHONE: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    URL: /https?:\/\/[^\s]+/g,
  };

  // Check for each entity type
  for (const [type, pattern] of Object.entries(patterns)) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type,
        start: match.index,
        end: match.index + match[0].length
      });
    }
  }

  return entities;
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
  
  const [regexEntities, aiEntities] = await Promise.all([
    Promise.resolve(performNER(str)),
    aiNerCheck(str)
  ]);
  
  // Combine regex entities with AI entities
  const entities = [
    ...regexEntities,
    ...aiEntities.names.map(name => ({ text: name, type: "PERSON_NAME", start: -1, end: -1 })),
    ...aiEntities.people.map(person => ({ text: person, type: "PERSON_ROLE", start: -1, end: -1 })),
    ...aiEntities.companies.map(company => ({ text: company, type: "ORGANIZATION", start: -1, end: -1 })),
    ...aiEntities.locations.map(location => ({ text: location, type: "LOCATION", start: -1, end: -1 }))
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
