import { aiNERCheck, type NERResult } from "./nerCheck.ts";
import { exists } from "https://deno.land/std/fs/mod.ts";
// import { scrapeUrl } from "./scrapeUrl.ts";

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
// lifeCategory is either personal, work or other (school, hobby etc) same as originSource
// typeCategory is the type of task (meeting, reminder, task, etc)
interface InformationObject {
    source: Source;
    lifeCategory: string;
    typeCategory: string;
    content: string;
    keyword: string | null;
    hasKeyword: boolean;
    hasEntities: boolean;
    entities: Entity[];
    dueDates: Date[];
    startDate: Date | null;
    endDate: Date | null;
}

interface SourceInput {
    originSource: string;
    serviceType: string;
    serviceDetails: string;
    content: string;
}

interface KeywordAnalysis {
    category: string;
    keywords: string[];
}

export async function conductor(input: SourceInput): Promise<void> {
    let IO: InformationObject = {
        source: {
            originSource: "",
            serviceType: "",
            serviceDetails: ""
        },
        lifeCategory: "",
        typeCategory: "",
        content: "",
        keywords: string[],
        hasKeywords: boolean,
        hasEntities: false,
        entities: [],
        dueDates: [],
        startDate: null,
        endDate: null
    };
    IO = await processSourceInput(input, IO);
    const processedKeywords = checkKeywords(IO);
}

function checkKeywords(info: InformationObject): InformationObject {
    const words = info.content.toLowerCase().trim().split(/\s+/);
    const keywords = words.filter(word => word.length > 2); // Filter out short words
    
    return {
        ...info,
        keywords: keywords,
        lifeCategory: keywords[0] || "" // Using first keyword as category if available
    };
}

export async function processSourceInput(input: SourceInput, infoObj: InformationObject): Promise<InformationObject> {
    // Validate required fields for SourceInput
    if (!input.originSource || !input.serviceType || !input.serviceDetails || !input.content) {
        throw new Error("Missing required fields in source input");
    }

    // Update the InformationObject with input values
    infoObj.source = {
        originSource: input.originSource,
        serviceType: input.serviceType,
        serviceDetails: input.serviceDetails
    };
    infoObj.content = input.content;

    return infoObj;
}



async function appendToDatabase(task: InformationObject): Promise<void> {
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

