import { supabase } from "../supabaseClient";

async function getOutputs(setListId) {
    const { data, error } = await supabase
    .from("outputs")
    .select("*,chordsheets(key,content)")
    .eq("setListId", setListId);

    if (error) {
        console.error("Error getting outputs:", error);
        return null;
    }

    return data;
}

async function createOutputs(outputs) {    
    const { data, error } = await supabase
    .from("outputs")
    .insert(outputs)
    .select()

    if (error) {
        console.error("Error creating output:", error);
        return null;
    }

    console.log("Output created:", data);
    return data;
}

async function deleteOutputs(setListId) {
    const { data, error } = await supabase
    .from("outputs")
    .delete()
    .eq("setListId", setListId);

    if (error) {
        console.error("Error deleting output:", error);
        return null;
    }

    return data;
}

export { createOutputs, deleteOutputs, getOutputs };