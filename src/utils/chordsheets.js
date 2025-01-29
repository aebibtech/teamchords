import { supabase } from "../supabaseClient";
import { getProfile } from "./common";

async function getChordsheets(orgId) {
    const { data, error } = await supabase
    .from("chordsheets")
    .select('*')
    .eq("orgId", orgId);

    if (error) {
        console.error("Error fetching chordsheets:", error);
        return null;
    }

    return data;
}

async function getChordsheet(id) {
    const { data, error } = await supabase
    .from("chordsheets")
    .select('*')
    .eq("id", id)
    .limit(1)
    .single();

    if (error) {
        console.error("Error fetching chordsheet:", error);
        return null;
    }

    return data;
}

async function createChordsheet(chordsheet) {    
    const { data, error } = await supabase
    .from("chordsheets")
    .insert({ ...chordsheet });

    if (error) {
        console.error("Error creating chordsheet:", error);
        return null;
    }

    return data;
}

async function updateChordsheet(id, chordsheet) {
    const { data, error } = await supabase
    .from("chordsheets")
    .update({ ...chordsheet, updated_at: new Date().toISOString() })
    .eq("id", id);

    if (error) {
        console.error("Error updating chordsheet:", error);
        return null;
    }

    return data;
}

export { getChordsheets, getChordsheet, createChordsheet, updateChordsheet };