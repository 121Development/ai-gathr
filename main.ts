import { parse } from "https://deno.land/std/flags/mod.ts";
import { aiNerCheck, type NERResult } from "./nerCheck.ts";
import { exists } from "https://deno.land/std/fs/mod.ts";

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
    hasKeyword: boolean;
    hasEntities: boolean;
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
        keywords: [firstWord],
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
        ...(Array.isArray(aiEntities.persons)
            ? aiEntities.persons
                  .map((person) => [
                      { text: person.name, type: "PERSON_NAME" },
                      { text: person.role, type: "PERSON_ROLE" },
                      { text: person.company, type: "ORGANIZATION" },
                  ])
                  .flat()
            : []),
        ...(Array.isArray(aiEntities.locations)
            ? aiEntities.locations.map((location) => ({
                  text: location,
                  type: "LOCATION",
              }))
            : []),
        ...(Array.isArray(aiEntities.dateTime)
            ? aiEntities.dateTime.map((dt) => ({ text: dt, type: "DATETIME" }))
            : []),
    ];

    return {
        source: "user-input",
        category: analysis.category || "unknown",
        content: str.trim(),
        keyword: analysis.keywords.length > 0 ? firstWord : null,
        hasKeyword: analysis.keywords.length > 0,
        hasEntities: aiEntities.containsNER,
        entities,
    };
}

// Parse command line arguments
const args = parse(Deno.args, {
    string: ["input"],
    boolean: ["show-db"],
    alias: { input: "i" },
});

if (args["show-db"]) {
    const dbPath = "./json_db.json";
    if (await exists(dbPath)) {
        const content = await Deno.readTextFile(dbPath);
        console.log(content);
        Deno.exit(0);
    } else {
        console.log("Database file not found");
        Deno.exit(1);
    }
}

if (!args.input) {
    console.log("Please provide input using --input or -i flag");
    console.log('Example: deno run main.ts --input "Buy groceries"');
    console.log('Or use --show-db to display database contents');
    Deno.exit(1);
}

async function appendToDatabase(task: ProcessedInput): Promise<void> {
    const dbPath = "./json_db.json";
    
    // Create database file if it doesn't exist
    if (!await exists(dbPath)) {
        await Deno.writeTextFile(dbPath, JSON.stringify({ tasks: [] }, null, 2));
    }

    // Read existing data
    const rawData = await Deno.readTextFile(dbPath);
    const data = JSON.parse(rawData);

    // Append new task
    data.tasks.push({
        ...task,
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID()
    });

    // Write back to file
    await Deno.writeTextFile(dbPath, JSON.stringify(data, null, 2));
}

const result = await processInput(args.input);
console.log(JSON.stringify(result, null, 2));

// Append the processed task to the database
await appendToDatabase(result);
console.log("Task saved to database");
