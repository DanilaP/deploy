import './emoji-picker.scss';
import { emojilist } from './constants/constants';

export default function EmojiPicker (props: { updateInputString: (str: string) => void }) {

    const htmlCodeToEmoji = (htmlCode: any) => {
        const codePoint = htmlCode.replace(/&#x?/, '');
        return String.fromCodePoint(parseInt(codePoint, 10));
    };

    return (
        <div className="emoji-picker">
            {
                emojilist.map((emoji: string, index: number) => {
                    return (
                        <div onClick={ () => props.updateInputString(htmlCodeToEmoji(emoji)) } key={ emoji + index } className="emoji">
                            { htmlCodeToEmoji(emoji) }
                        </div>
                    );
                })
            }
        </div>
    );
}