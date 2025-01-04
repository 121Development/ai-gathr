import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { processInput } from "./main.ts";

const app = new Application();
const router = new Router();

router.post("/process", async (ctx) => {
  try {
    const body = ctx.request.body();
    const value = await body.value;
    
    if (!value.input || typeof value.input !== "string") {
      ctx.response.status = 400;
      ctx.response.body = { error: "Input string is required" };
      return;
    }

    const result = await processInput(value.input);
    ctx.response.body = result;
  } catch (error) {
    console.error("Error processing request:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:3000");
await app.listen({ port: 3000 });
