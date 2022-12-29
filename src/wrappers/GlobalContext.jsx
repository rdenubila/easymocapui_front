import react, { useState, useEffect } from "react";
import { listCommands } from "../services/command";
import TaskService from "../services/tasks";
import VideoStream from "../services/videoStream";

const videoStream = new VideoStream();

const globalContextInitialValues = {
    videoStream: null,
    peers: [],
    addPeer: () => { },
    removePeer: () => { },
    logList: []
};

let logListInterval;

export const GlobalStateContext = react.createContext(globalContextInitialValues);
const taskService = new TaskService();

function GlobalContext({ children, isServer }) {
    const [peers, setPeers] = useState([])
    const [logList, setLogList] = useState([])

    const addPeer = (peerData) => {
        const p = [...peers, peerData];
        console.log(peerData);
        setPeers(p);
    }

    const removePeer = (peerData) => {
        setPeers(peers.filter(peer => peer.peer !== peerData.peer));
    }

    const loadLogs = async () => {
        const _data = await listCommands();
        taskService.updateData(_data);
        setLogList(_data);
        logListInterval = setTimeout(loadLogs, 3000);
    }

    useEffect(() => {
        loadLogs();
        return () => { clearTimeout(logListInterval) }
    }, [])

    return <GlobalStateContext.Provider value={{ videoStream, peers, addPeer, removePeer, logList }}>{children}</GlobalStateContext.Provider>
}

export default GlobalContext;