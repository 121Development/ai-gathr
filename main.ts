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
  
  // Check for task keywords
  if (taskKeywords.some(keyword => lowercaseStr.includes(keyword))) {
    keywords.push(...taskKeywords.filter(keyword => lowercaseStr.includes(keyword)));
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

// Example usage
const result = processInput("This is a task: complete the project");
console.log(JSON.stringify(result, null, 2));

// Shopping list example
const shoppingList = processInput("Buy bananas, apples, eggs and milk");
console.log(JSON.stringify(shoppingList, null, 2));

// Example of direct keyword analysis
const keywordAnalysis = checkKeywords("Remember to document the API changes");
console.log(JSON.stringify(keywordAnalysis, null, 2));
