import { aiNERCheck, type NERResult } from "./nerCheck.ts";
import { exists } from "https://deno.land/std/fs/mod.ts";
import { scrapeUrl } from "./scrapeUrl.ts";

// originSource can be either personal, work or other (school, hobby etc)
// serviceType can be either email, slack, whatsapp, sms, etc
// serviceDetails can be the number, email or username of the sender
interface Source {
    originSource: string; 
    serviceType: string;
    serviceDetails: string;
}

interface Entity {
    text: string;
    type: string;
}

interface ProcessedInput {
    source: Source;
    category: string;
    content: string;
    keyword: string | null;
    hasKeyword: boolean;
    hasEntities: boolean;
    entities: Entity[];
    dueDates: Date[];
    startDate: Date | null;
    endDate: Date | null;
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

export async function processInput(str: string): Promise<ProcessedInput> {
    const analysis = checkKeywords(str);
    const words = str.trim().toLowerCase().split(/\s+/);
    const firstWord = words[0];

    const aiEntities = await aiNERCheck(str);
    //console.log(aiEntities);
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

    // Check if task has a due date
    const taskKeywords = ["task", "todo", "do", "reminder", "meeting"];
    const isDueDateTask = taskKeywords.includes(firstWord);
    const dueDates = isDueDateTask && aiEntities.dateTime && aiEntities.dateTime.length > 0 
        ? aiEntities.dateTime.map(dateStr => new Date(dateStr))
        : [];

    return {
        source: {
            originSource: "",
            serviceType: "",
            serviceDetails: "user-input"
        },
        category: analysis.category || "unknown",
        content: str.trim(),
        keyword: analysis.keywords.length > 0 ? firstWord : null,
        hasKeyword: analysis.keywords.length > 0,
        hasEntities: aiEntities.containsNER,
        entities,
        dueDates,
        startDate: null,
        endDate: null
    };
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

