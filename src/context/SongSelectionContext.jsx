import { createContext, useState, useContext } from "react";
import { defaultOutputValue } from "../constants";

const SongSelectionContext = createContext({});

export const SongSelectionContextProvider = ({ children }) => {
    const [selectedSong, setSelectedSong] = useState(defaultOutputValue);
    const [songId, setSongId] = useState("");
    const [isEdit, setIsEdit] = useState(false);

    return (
        <SongSelectionContext.Provider value={{ selectedSong, setSelectedSong, isEdit, setIsEdit, songId, setSongId }}>
            {children}
        </SongSelectionContext.Provider>
    );
};

export const useSongSelection = () => {
    return useContext(SongSelectionContext);
};