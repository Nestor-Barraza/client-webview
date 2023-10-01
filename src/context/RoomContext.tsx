import { createContext, useEffect, useState, useReducer, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { ws } from "../ws";
import { peersReducer, PeerState } from "../reducers/peerReducer";
import {
    addPeerStreamAction,
    addPeerNameAction,
    removePeerStreamAction,
} from "../reducers/peerActions";

import { UserContext } from "./UserContext";

interface RoomValue {
    stream?: MediaStream;
    peers: PeerState;
    roomId: string;
    setRoomId: (id: string) => void;
    token: string
    setToken: (token: string) => void;
}

export const RoomContext = createContext<RoomValue>({
    peers: {},
    setRoomId: (id) => { },
    roomId: "",
    token: "",
    setToken: (token) => { },
});

if (!!window.Cypress) {
    window.Peer = Peer;
}


export const RoomProvider: React.FunctionComponent = ({ children }) => {
    const navigate = useNavigate();
    const { userName, userId } = useContext(UserContext);
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(peersReducer, {});
    const [roomId, setRoomId] = useState<string>("");
    const [token, setToken] = useState("")

    const enterRoom = ({ roomId }: { roomId: "string" }) => {
        navigate(`/room/${roomId}`);
    };

    const removePeer = (peerId: string) => {
        dispatch(removePeerStreamAction(peerId));
    };

    useEffect(() => {
        const setupMediaStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(stream);
            } catch (error) {
                console.error(error);
            }
        };

        setupMediaStream();

        const peer = new Peer(userId, {
            host: process.env.REACT_APP_PEER_SERVER || "peer-qvf4.onrender.com",
            port: Number(process.env.REACT_APP_PEER_PORT) || 443,
        });
        setMe(peer);

        ws.on("room-created", enterRoom);
        ws.on("user-disconnected", removePeer);
        ws.on("error", console.error)

        return () => {
            ws.off("room-created");
            ws.off("user-disconnected");
            ws.off("error");
            me?.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!me) return;
        if (!stream) return;

        me.on("call", (call) => {
            const { userName } = call.metadata;
            dispatch(addPeerNameAction(call.peer, userName));
            call.answer(stream);
            call.on("stream", (peerStream) => {
                dispatch(addPeerStreamAction(call.peer, peerStream));
            });
        });

    }, [me, stream, userName]);

    return (
        <RoomContext.Provider value={{
            stream,
            peers,
            roomId,
            setRoomId,
            token,
            setToken,
        }}>
            {children}
        </RoomContext.Provider>
    );
};