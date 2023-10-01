import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from "react-router-dom"
import { ws } from "../ws"
import axios from 'axios'
import { RoomContext } from '../context/RoomContext'

interface LoginData {
    "token": string,
    "role": string,
    "email": string,
    "message": string
}

function useQuery() {
    const { search } = useLocation();
  
    return useMemo(() => new URLSearchParams(search), [search]);
  }

export const Home = () => {
    const [ firebaseToken ] = useState(useQuery().get('firebaseToken'))
    const { token, setToken } = useContext(RoomContext);

    const createRoom = useCallback(() => {
        ws.emit("create-room", { token })
    }, [token])
    
    useEffect(() => {
        if (firebaseToken) {
            
            const url = process.env.REACT_APP_SERVER || "https://server-3j0t.onrender.com:443";
            axios.post(`${url}/auth/login`, {}, {
                headers: {
                    Authorization: firebaseToken
                }
            }).then(response => {
                const data: LoginData = response.data
                setToken(data.token)
            }).catch(console.error)
        }
    }, [firebaseToken, setToken]) 

    useEffect(() => {
        if (token) {
            createRoom()
        }
    }, [token, createRoom, setToken]) 

    return (
        <div></div>
    )
}