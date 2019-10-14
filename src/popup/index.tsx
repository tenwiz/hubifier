import {render} from 'preact';
import * as React from "preact/compat";
import {useEffect, useState} from "preact/hooks";
import './index.scss'
import Notification from "./Notification"
import Auth from "./Auth";
import github from "~github";

const App = () => {
    const [notifications, setNotifications] = useState([])
    const [lastFetch, setLastFetch] = useState('')
    const [token, setToken] = useState(github.getToken())


    useEffect(() => {
        chrome.runtime.sendMessage({type: 'getNotifications'}, (data) => {
            setNotifications(data.notifications)
            setLastFetch(data.lastFetch)
        });
    }, [])

    useEffect(() => {
        if (token) {
            localStorage.setItem("auth_token", token)
            chrome.runtime.sendMessage({type: 'set_token', token}, (data) => {
            });
        }
    }, [token])

    const onOpen = (id: number) => {
        chrome.runtime.sendMessage({type: 'read', id}, (data) => {
            setNotifications(data.notifications)
        });
    }

    const readAll = () => {
        chrome.runtime.sendMessage({type: 'read_all'}, (data) => {
            setNotifications([])
        });
    }

    if (!token)
        return <Auth onToken={token => setToken(token)}/>

    return (
        <div>
            <div class={'notifications'}>
                {notifications.map(n => <Notification {...n} onOpen={onOpen}/>)}
            </div>
            <div class={'footer'}>
                <span class={"read"} onClick={readAll}>Read all</span>
                <span class={"time"}>Last Fetch: {lastFetch}</span>
            </div>
        </div>
    )
}

render(<App/>, document.body);
