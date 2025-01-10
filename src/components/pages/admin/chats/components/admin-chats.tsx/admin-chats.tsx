import { IUser } from "../../../../../../models/user/user";
import { RiPushpinFill } from "react-icons/ri";
import { RiUnpinFill } from "react-icons/ri";
import $api from '../../../../../../configs/axiosconfig/axios';
import { IChat } from "../../../../../../interfaces/interfaces";

export default function AdminChats (props: { 
    chats: any[], 
    user: IUser, 
    changeChat: (chat: any) => void,
    changeChatsInfo: (chats: any[]) => void
}) {

    const pinChat = (event: any, chat: IChat) => {
        event.stopPropagation();
        $api.post("/chat/pin", chat)
        .then((res) => {
            props.changeChatsInfo(res.data.chats);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    return (
        props.chats.map((chat: any) => {
            const user = chat.members.find((user: IUser ) => user.id !== props?.user?.id);
            if (chat.members.find((user: IUser ) => user.id === props.user?.id)) {
                return (
                    <div onClick={ () => props.changeChat(chat) } key={ chat.id } className="chat-preview">
                        <img src={ user.avatar } className="image" />
                        <div className="login">{ user.login }</div>
                        <div className="preview-text">{ chat.messages[0].text }</div>
                        { chat.fixed 
                            ? 
                                <div>
                                    <RiPushpinFill onClick={ (e) => pinChat(e, chat) } className="icon" />
                                </div> 
                            : 
                                <div>
                                    <RiUnpinFill onClick={ (e) => pinChat(e, chat) } className="icon" /> 
                                </div> 
                        }
                    </div>
                );
            }
        })
    );
}