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

function getCapoText(capoValue) {
    if (capoValue == 1)
        return `${capoValue}st fret`;
    if (capoValue == 2)
        return `${capoValue}nd fret`;
    if (capoValue == 3)
        return `${capoValue}rd fret`;

    return `${capoValue}th fret`;
}

export { createOutputs, deleteOutputs, getOutputs, getCapoText };