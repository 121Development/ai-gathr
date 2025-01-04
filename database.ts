import { load } from "https://deno.land/std/dotenv/mod.ts";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ymaplkjuewqkiajrdqll.supabase.co'
const env = await load();
const supabaseKey = env["SUPABASE_API_KEY"];
const supabase = createClient(supabaseUrl, supabaseKey)

