import github, {GHNotification} from "./github";
import moment = require("moment");

let lastFetch = moment('2019-10-01')
let notifications: GHNotification[] = []

const fetchNotifications = () => {
    const fetchDate = moment()
    if (github.getToken() === null)
        return;

    github.getNotifications().then(from_api => {
        const existingIds = notifications.map(n => n.id)
        const newer = from_api.filter(an => !existingIds.includes(an.id));
        newer.forEach(n => {
            new Notification(n.repository.full_name, {body: n.subject.title}).onclick = e => {
                openNotification(n)
            };
        })

        lastFetch = fetchDate

        notifications = from_api
        notifications.sort((a, b) => (moment(b.updated_at) as any - (moment(a.updated_at) as any)))

        updateBadge();
    });
}

const updateBadge = () => {
    if (notifications.length > 0)
        chrome.browserAction.setBadgeBackgroundColor({color: "#288563"});
    else
        chrome.browserAction.setBadgeBackgroundColor({color: "#ffffff00"});
    chrome.browserAction.setBadgeText({text: "" + notifications.length})
}

const openNotification = (n: GHNotification) => {
    github.getUrl(n.subject.url).then(r => {
        notifications = notifications.filter(ni => ni.id !== n.id)
        updateBadge();
        chrome.tabs.create({url: r.html_url});
    })

}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === 'set_token') {
        github.setToken(message.token)
    }
    if (message.type === 'getNotifications') {
        sendResponse({notifications, lastFetch: lastFetch.format('HH:mm')});
    }
    if (message.type === 'read') {
        notifications = notifications.filter(n => n.id !== message.id)
        updateBadge();
        sendResponse({notifications});
    }
    if (message.type === 'read_all') {
        github.setRead(lastFetch).then(() => {
            notifications = []
            updateBadge();
            sendResponse({notifications: []});
        })
    }
});

setInterval(fetchNotifications, 10000)
fetchNotifications()
