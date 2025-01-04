import { parse } from "https://deno.land/std/flags/mod.ts";

interface ProcessedInput {
  source: string;
  category: string;
  content: string;
}

interface KeywordAnalysis {
  category: string;
  keywords: string[];
}

function checkKeywords(str: string): KeywordAnalysis {
  const lowercaseStr = str.toLowerCase();
  const keywords: string[] = [];
  
  // Define keyword patterns
  const taskKeywords = ['task', 'todo', 'complete', 'finish', 'implement'];
  const noteKeywords = ['note', 'remember', 'document', 'record'];
  
  // Check for task keywords at the start of the string
  const words = lowercaseStr.trim().split(/\s+/);
  const firstWord = words[0];
  
  if (taskKeywords.some(keyword => firstWord === keyword)) {
    keywords.push(firstWord);
    return { category: 'task', keywords };
  }
  
  // Check for note keywords
  if (noteKeywords.some(keyword => lowercaseStr.includes(keyword))) {
    keywords.push(...noteKeywords.filter(keyword => lowercaseStr.includes(keyword)));
    return { category: 'note', keywords };
  }
  
  return { category: 'general', keywords };
}

function processInput(str: string): ProcessedInput {
  const analysis = checkKeywords(str);
  
  return {
    source: "user-input",
    category: analysis.category,
    content: str.trim()
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

const result = processInput(args.input);
console.log(JSON.stringify(result, null, 2));
