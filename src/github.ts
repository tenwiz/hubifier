import axios, {AxiosResponse} from "axios";
import moment from "moment";

export interface GHNotification {
    id: number
    last_read_at: string
    reason: string
    unread: boolean
    updated_at: string
    data: any
    url: string
    subject: {
        title: string
        type: string
        url: string
    }
    repository: {
        full_name: string,
        html_url: string
        name: string
    }
}

class HttpError extends Error {
    public response;

    constructor(response: AxiosResponse) {
        super("Http Error");
        this.response = response;
    }
}

let token: string = localStorage.getItem("auth_token");

const setToken = (t) => token = t;

const getToken = () => token;

const getConfig = () => {
    return {cache: {maxAge: 1}, headers: {Authorization: `token ${token}`}};
}

const getUrl = (url) => {
    return axios.get(url, getConfig()).then(r => {
        if (r.status === 200) return r.data
        throw new HttpError(r)
    });
};

const putUrl = (url, data) => {
    return axios.put(url, data, getConfig()).then(r => {
        if (r.status === 200) return r.data
        throw new HttpError(r)
    });
};

const getNotifications = (): Promise<GHNotification[]> => {
    return getUrl("https://api.github.com/notifications?participating=true&t=" + moment().format());
}

const setRead = (date) => {
    const datestr = moment(date).format()
    return putUrl("https://api.github.com/notifications?last_read_at=" + datestr, {last_read_at: datestr})
}

export default {
    getToken,
    setToken,
    getUrl,
    setRead,
    getNotifications
}
