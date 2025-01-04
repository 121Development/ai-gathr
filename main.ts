interface ProcessedInput {
  source: string;
  category: string;
  content: string;
}

function processInput(str: string): ProcessedInput {
  // Basic categorization logic - can be expanded based on needs
  const category = str.includes("task") ? "task" : 
                  str.includes("note") ? "note" : "general";
                  
  return {
    source: "user-input",
    category: category,
    content: str.trim()
  };
}

// Example usage
const result = processInput("This is a task: complete the project");
console.log(JSON.stringify(result, null, 2));
