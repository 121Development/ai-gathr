import { load } from "https://deno.land/std/dotenv/mod.ts";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ymaplkjuewqkiajrdqll.supabase.co'
const env = await load();
const supabaseKey = env["SUPABASE_API_KEY"];
const supabase = createClient(supabaseUrl, supabaseKey)

export async function insertDocument(content: string, embedding: number[]) {
    try {
        const { data, error } = await supabase
            .from('documents')
            .insert({
                content: content,
                embedding: embedding,
                created_at: new Date().toISOString()
            })
            .select();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error inserting document:', error);
        throw error;
    }
}

