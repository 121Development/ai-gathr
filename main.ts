import { parse } from "https://deno.land/std/flags/mod.ts";

interface ProcessedInput {
  source: string;
  category: string;
  content: string;
  keyword: string | null;
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

function processInput(str: string): ProcessedInput {
  const analysis = checkKeywords(str);
  const words = str.trim().toLowerCase().split(/\s+/);
  const firstWord = words[0];
  
  return {
    source: "user-input",
    category: analysis.category || "unknown",
    content: str.trim(),
    keyword: analysis.keywords.length > 0 ? firstWord : null
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
