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
        async function setupCamera() {
            if (stream) {
                try {
                    const constraints = {
                        video: {
                            width: { ideal: 640 }, 
                            height: { ideal: 640 }, 
                            frameRate: { ideal: 20 } 
                        },
                        audio: true
                    };

                    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

                    ws.emit("join-room", { roomId: '37d164ce-8e7a-47dc-86f5-9bc5d3bfcb47', peerId: userId, userName: newUserName(), stream: mediaStream });
                } catch (error) {
                    console.error("Error al obtener acceso a la cámara:", error);
                }
            }
        }

        setupCamera();
    }, [id, userId, stream, userName]);

    useEffect(() => {
        setRoomId(id ?? "");
    }, [id, setRoomId]);

    return (
        <div className="flex flex-col min-h-screen"/>
    );
};
