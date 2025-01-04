import { load } from "https://deno.land/std/dotenv/mod.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const env = await load();
const supabaseKey = env["SUPABASE_API_KEY"];
const supabaseUrl = env["SUPABASE_URL"];
const supabase = createClient(supabaseUrl, supabaseKey)

export async function calculateSimilarity(embedding: number[]) {
    console.log("inside calculateSimilarity function");
    try {
        const { data: documents, error } = await supabase
            .rpc('match_documents', {
                query_embedding: `[${embedding.join(',')}]`,
                match_threshold: 0.78, // Threshold for similarity matching
                match_count: 5 // Limit to top 5 matches
            });

        if (error) throw error;
        return documents;
        
    } catch (error) {
        console.error('Error calculating similarity:', error);
        throw error;
    }
}

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

