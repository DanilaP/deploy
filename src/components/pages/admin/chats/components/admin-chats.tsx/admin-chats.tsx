import { IUser } from "../../../../../../models/user/user";


export default function AdminChats (props: { chats: any[], user: IUser, changeChat: (chat: any) => void }) {
    
    return (
        props.chats?.map((chat: any) => {
            const user = chat.members.find((user: IUser ) => user.id !== props?.user?.id);
            if (chat.members.find((user: IUser ) => user.id === props.user?.id)) {
                return (
                    <div onClick={ () => props.changeChat(chat) } key={ chat.id } className="chat-preview">
                        <img src={ user.avatar } className="image" />
                        <div className="login">{ user.login }</div>
                        <div className="preview-text">
                            { chat.messages[0].text }
                        </div>
                    </div>
                );
            }
        })
    );
}