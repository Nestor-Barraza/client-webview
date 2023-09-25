import { useEffect } from 'react';
import { ws } from "../ws";

export const Join: React.FC = () => {
    const createRoom = () => {
        ws.emit("create-room");
    };


    useEffect(() => {
        createRoom();
    }, []); 

    return (
        <div className="flex flex-col">
        </div>
    );
};
