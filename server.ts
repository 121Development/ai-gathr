import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { load } from "https://deno.land/std/dotenv/mod.ts";
import { processSourceInput, type InformationObject } from "./main.ts";
import { insertDocument, calculateSimilarity } from "./database.ts";

const app = new Application();
const router = new Router();

router.post("/source", async (ctx) => {
  try {
    const body = ctx.request.body();
    const value = await body.value;
    
    // Validate required fields
    if (!value.originSource || !value.serviceType || !value.serviceDetails || !value.content) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Missing required fields in source input" };
      return;
    }

    const result = await processSourceInput(value);
    ctx.response.body = result;
  } catch (error) {
    console.error("Error processing source request:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});


router.post('/embed', async (ctx) => {
  console.log("/embed tapped");
  try {
    const body = ctx.request.body({ type: 'json' });
    const { text } = await body.value;

    if (!text) {
      ctx.response.status = 400;
      ctx.response.body = { error: 'Missing "text" in request body.' };
      return;
    }

    // Call our embedding function
    console.log("calling embedding function");
    const embedding = await getEmbedding(text);

    // Store the document and embedding in Supabase
    console.log("storing embedding and document in Supabase");
    await insertDocument(text, embedding);

    // Return the embedding as JSON
    ctx.response.body = { embedding };
    ctx.response.status = 200;
  } catch (error) {
    ctx.response.body = { error: error.message };
    ctx.response.status = 500;
  }
});

async function getEmbedding(text: string): Promise<number[]> {
  const url = 'https://api.openai.com/v1/embeddings';

  const env = await load();
  const OPENAI_API_KEY = env["OPENAI_API_KEY"];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text,
    }),
  });

  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(`OpenAI API request failed: ${errorMsg}`);
  }

  const data = await response.json();
  // The API returns an array of embeddings in the `data` field.
  return data.data[0].embedding;
}

router.post('/compare', async (ctx) => {
  try {
    const body = ctx.request.body({ type: 'json' });
    const { text } = await body.value;

    if (!text) {
      ctx.response.status = 400;
      ctx.response.body = { error: 'Missing "text" in request body.' };
      return;
    }

    console.log("getting embedding for comparison");
    const embedding = await getEmbedding(text);
    
    console.log("calculating similarity");
    const similarDocs = await calculateSimilarity(embedding);
    ctx.response.body = { matches: similarDocs };
    ctx.response.status = 200;
  } catch (error) {
    ctx.response.body = { error: error.message };
    ctx.response.status = 500;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use((ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', '*')
  return next()
})

console.log("Server running on http://localhost:3000");
await app.listen({ port: 3000 });
