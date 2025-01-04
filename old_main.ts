export function add(a: number, b: number): number {
  return a + b;
}

enum mainCategory {
  personal,
  work,
}

enum subCategory {
  todo,
  toRead,
  toListen,
  toWatch,
}

enum sentFrom {
  personalPhone,
  personalEmail,
  personalAccount, //other account, Signal, WhatsApp, Telegram
  workPhone,
  workEmail,
}

type task = {
  mainCategory: mainCategory;
  subCategory: subCategory;
  sentFrom: string;
}

/**
 * Determines the type of input and processes it accordingly
 * @param input - String that could be a file path, URL, JSON, or plain text
 * @returns Promise<{ type: string; content: string; }> - The processed content and its type
 */
async function processInput(input: string): Promise<{ type: string; content: string }> {
  // Try to parse as JSON first
  try {
    JSON.parse(input);
    return { type: 'json', content: input };
  } catch {
    // Not JSON, continue with other checks
  }

  // Check if it's a URL
  if (isValidUrl(input)) {
    try {
      const response = await fetch(input.startsWith('www.') ? `https://${input}` : input);
      const content = await response.text();
      return { type: 'url', content };
    } catch (error) {
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }
  }

  // Try to read as a file
  try {
    const fileContent = await Deno.readTextFile(input);
    return { type: 'file', content: fileContent };
  } catch (error) {
    // If file reading fails, treat it as a direct string input
    if (error instanceof Deno.errors.NotFound) {
      return { type: 'string', content: input };
    }
    throw error;
  }
}

/**
 * Checks if a string is a valid URL
 * @param input - String to evaluate
 * @returns boolean - True if string is a valid URL
 */
function isValidUrl(input: string): boolean {
  // Check for www pattern first
  if (input.startsWith('www.')) {
    // Simple regex to check basic domain format
    const wwwPattern = /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return wwwPattern.test(input);
  }

  // Check for full URLs
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Example usage in main
if (import.meta.main) {
  try {
    // Test with string
    const stringResult = await processInput("Hello, World!");
    console.log("String:", stringResult);

    // Test with JSON
    const jsonResult = await processInput('{"name": "John", "age": 30}');
    console.log("JSON:", jsonResult);

    // Test with file
    await Deno.writeTextFile("test.txt", "Hello from file!");
    const fileResult = await processInput("test.txt");
    console.log("File:", fileResult);
    await Deno.remove("test.txt");

    // Test with URL
    const urlResult = await processInput("www.di.se");
    console.log("URL:", urlResult);
    //console.log("URL:", urlResult.content.slice(0, 10)); // Only show first 10 chars

  } catch (error) {
    console.error("Error:", error.message);
  }

  const testUrls = [
    'https://example.com',
    'http://localhost:8000',
    'ftp://invalid.com',
    'not-a-url',
    'www.di.se',
    'www.cnn.com',
    'www.invalid',  // will fail
    'www.sub.domain.com',
    'https://sub.domain.com/path?query=123#hash'
  ];

//  testUrls.forEach(url => {
//    console.log(`"${url}" is ${isValidUrl(url) ? 'a valid' : 'not a valid'} URL`);
//  });
}


