import socketIOClient from "socket.io-client";

export const WS = process.env.REACT_APP_SERVER || "https://server-3j0t.onrender.com:443";
// export const WS = "https://ws.webrtctest.online";
export const ws = socketIOClient(WS);
