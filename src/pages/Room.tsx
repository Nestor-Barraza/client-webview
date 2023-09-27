import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { ws } from "../ws";
import { UserContext } from "../context/UserContext";

export const Room = () => {
    const { id } = useParams();
    const { stream, setRoomId } =
        useContext(RoomContext);
    const { userName, userId } = useContext(UserContext);

    function newUserName(): string {
        const usuario = "user";
        const digitosAleatorios = Math.floor(1000 + Math.random() * 9000); 
        
        return usuario + digitosAleatorios.toString();
      }
    

    useEffect(() => {
        if (stream)
            ws.emit("join-room", { roomId: '37d164ce-8e7a-47dc-86f5-9bc5d3bfcb47', peerId: userId, userName: newUserName() });
    }, [id, userId, stream, userName]);

    useEffect(() => {
        setRoomId(id ?? "");
    }, [id, setRoomId]);

      
       
   
    return (
        <div className="flex flex-col min-h-screen"/>
    );
};
