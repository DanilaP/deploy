import { IUser } from "../../../../../interfaces/interfaces";


export default function FreeChats (props: { chats: any[], changeChat: (chat: any) => void }) {

    return (
        props.chats?.map((chat: any) => {
            if (chat.members.length === 1) {
                const user = chat.members.find((user: IUser ) => user);
                return (
                    <div onClick={ () => props.changeChat(chat) } key={ chat.id } className="chat-preview">
                        <img src={ user.avatar } className="image" />
                        <div className="login">{ user.login }</div>
                        <div className="preview-text">{ chat.messages[0].text }</div>
                    </div>
                );
            }
        })
    );
}