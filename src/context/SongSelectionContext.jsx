import { createContext, useState, useContext } from "react";

const SongSelectionContext = createContext({});

export const SongSelectionContextProvider = ({ children }) => {
    const [selectedSong, setSelectedSong] = useState({song: "", targetKey: ""});
    const [songId, setSongId] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    
    // useEffect(() => {
    //     console.log(selectedSong, songId, isEdit, setSelectedSong, setSongId, setIsEdit);
    // });

    return (
        <SongSelectionContext.Provider value={{ selectedSong, setSelectedSong, isEdit, setIsEdit, songId, setSongId }}>
            {children}
        </SongSelectionContext.Provider>
    );
};

export const useSongSelection = () => {
    return useContext(SongSelectionContext);
};