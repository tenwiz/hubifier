import github, {GHNotification} from "../github";
import * as React from "preact/compat";

const Notification = (props: GHNotification & { onOpen: (id: number) => void }) => {
    const open = () => {
        github.getUrl(props.subject.url).then(r => {
            props.onOpen(props.id)
        })
    }

    return (
        <div class="notification" onClick={open}>
            <div class={"repo"}>{props.repository.full_name}</div>
            <div class={"title"}>{props.subject.title}</div>
        </div>
    )

}
export default Notification;
