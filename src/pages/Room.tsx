import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { ws } from "../ws";
import { UserContext } from "../context/UserContext";
import { parseJwt } from "../utils/parseJwt";

function newUserName(token: string): string {
    const payload = parseJwt(token)
    const usuario = payload.email
    return usuario
}

export const Room = () => {
    const { id } = useParams();
    const { stream, setRoomId, token } = useContext(RoomContext);
    const { userName, userId } = useContext(UserContext);

    useEffect(() => {
        if (stream)
            ws.emit("join-room", { roomId: id, peerId: userId, userName: newUserName(token), token });
    }, [id, userId, stream, userName, token]);

    useEffect(() => {
        setRoomId(id ?? "");
    }, [id, setRoomId]);

      
       
   
    return (
        <div className="flex flex-col min-h-screen"/>
    );
};
