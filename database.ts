import { load } from "https://deno.land/std/dotenv/mod.ts";
import { createClient } from 'jsr:@supabase/supabase-js';
import { supabaseClient } from './lib/supabase'

const env = await load();
const supabaseKey = env["SUPABASE_API_KEY"];
const supabaseUrl = env["SUPABASE_URL"];
const supabase = createClient(supabaseUrl, supabaseKey)

export async function insertDocument(content: string, embedding: number[]) {
    try {
        const { data, error } = await supabase
            .from('documents')
            .insert({
                content: content,
                embedding
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

