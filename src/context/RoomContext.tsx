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
import { Roles, parseJwt } from "../utils/parseJwt";

interface RoomValue {
    stream?: MediaStream;
    peers: PeerState;
    roomId: string;
    setRoomId: (id: string) => void;
    emitStreaming: () => void;
    token: string
    setToken: (token: string) => void;
}

function getUserName(token: string, calledBy: string): string {
    console.log({token, calledBy})
    const payload = parseJwt(token)
    console.log({payload})
    const usuario = payload.email
    return usuario
}

export const RoomContext = createContext<RoomValue>({
    peers: {},
    setRoomId: (id) => { },
    roomId: "",
    emitStreaming: () => { },
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
        setRoomId(roomId)
        navigate(`/room/${roomId}`);
    };

    const removePeer = (peerId: string) => {
        dispatch(removePeerStreamAction(peerId));
    };

    const emitStreaming = () => {
        localStorage.setItem("token", token)
        localStorage.setItem("roomId", roomId)
        localStorage.setItem("peerId", userId)
        ws.emit("join-room", { roomId, peerId: userId, userName: getUserName(token, "ws.emit"), token });
    }

    const reemitStreaming = () => {
        const token = localStorage.getItem("token")
        const roomId = localStorage.getItem("roomId")
        const peerId = localStorage.getItem("peerId")
        if (token) {
            ws.emit("join-room", { roomId, peerId, userName: getUserName(token, "ws.emitRE"), token })
        }
    }

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
        ws.on("emit-streaming", reemitStreaming);
        ws.on("user-disconnected", removePeer);
        ws.on("error", console.error)

        return () => {
            ws.off("room-created");
            ws.off("emit-streaming");
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
            emitStreaming,
            token,
            setToken,
        }}>
            {children}
        </RoomContext.Provider>
    );
};