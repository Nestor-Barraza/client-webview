import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { ws } from "../ws";
import { UserContext } from "../context/UserContext";

export const Room = () => {
    const { id } = useParams();
    const { stream, setRoomId, emitStreaming, token } = useContext(RoomContext);
    const { userName, userId } = useContext(UserContext);

    useEffect(() => {
        if (stream)
            emitStreaming()
    }, [id, userId, stream, userName, token]);

    useEffect(() => {
        setRoomId(id ?? "");
    }, [id, setRoomId]);

      
       
   
    return (
        <div className="flex flex-col min-h-screen"/>
    );
};
