import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { ws } from "../ws";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";

export const Room = () => {
    const { id } = useParams();
    const { stream, setRoomId } =
        useContext(RoomContext);
    const { userName, userId } = useContext(UserContext);

    function newUserName(): string {
        const usuario = "user";
        const digitosAleatorios = Math.floor(1000 + Math.random() * 9000); // Genera un número aleatorio de 4 dígitos
        
        return usuario + digitosAleatorios.toString();
      }
    

    useEffect(() => {
        if (stream)
            ws.emit("join-room", { roomId: '37d164ce-8e7a-47dc-86f5-9bc5d3bfcb47', peerId: userId, userName: newUserName() });
    }, [id, userId, stream, userName]);

    useEffect(() => {
        setRoomId(id ?? "");
    }, [id, setRoomId]);

      
       
    /*    const screenSharingVideo =
           screenSharingId === userId
               ? screenStream
               : peers[screenSharingId]?.stream; */

    /*     const { [screenSharingId]: sharing, ...peersToShow } = peers; */
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex grow">
                {/*   {screenSharingVideo && (
                    <div className="w-4/5 pr-4">
                        <VideoPlayer stream={screenSharingVideo} />
                    </div>
                )} */}
                <div
                /*  className={`grid gap-4 ${
                     screenSharingVideo ? "w-1/5 grid-col-1" : "grid-cols-4"
                 }`} */
                >{/* 
                    {screenSharingId !== userId && (
                        <div>
                            <VideoPlayer stream={stream} />
                            <NameInput />
                        </div>
                    )} */}

                {/*     {Object.values(peersToShow as PeerState)
                        .filter((peer) => !!peer.stream)
                        .map((peer) => (
                            <div key={peer.peerId}>
                                <VideoPlayer stream={peer.stream} />
                                <div>{peer.userName}</div>
                            </div>
                        ))} */}
                </div>            
                </div>            
        </div>
    );
};
