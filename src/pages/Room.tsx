import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { ws } from "../ws";
import { UserContext } from "../context/UserContext";

export const Room = () => {
    const { id } = useParams();
    const { stream, setRoomId } = useContext(RoomContext);
    const { userName, userId } = useContext(UserContext);

    function newUserName(): string {
        const usuario = "user";
        const digitosAleatorios = Math.floor(1000 + Math.random() * 9000); 
        return usuario + digitosAleatorios.toString();
    }

    useEffect(() => {
        const joinRoom = async () => {
            if (stream) {
                try {
                    
                    const videoTrack = stream.getVideoTracks()[0];
                    if (videoTrack) {
                        videoTrack.applyConstraints({
                            width: { ideal: 1280 }, 
                            height: { ideal: 720 },  
                            frameRate: { ideal: 25 }, 
                        });
                    }
                    ws.emit("join-room", { roomId: id, peerId: userId, userName: newUserName() });
                } catch (error) {
                    console.error("Error al unirse a la sala:", error);
                }
            }
        };

        joinRoom();
    }, [id, userId, stream, userName]);

    useEffect(() => {
        setRoomId(id ?? "");
    }, [id, setRoomId]);

    return (
        <div className="flex flex-col min-h-screen"/>
    );
};
