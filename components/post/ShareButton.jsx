import { Send } from "lucide-react";
import { RWebShare } from "react-web-share";


function ShareButton({ post }) {
    return (<div>
        <RWebShare
            data={{
                text: `${post.summary}`,
                url: `/post/${post.slug}`,
                title: `${post.title}`,
            }}
        >
            <button><Send className="w-6 cursor-pointer hover:scale-110 ease-in-out transition-all" /></button>
        </RWebShare>
    </div>)
}

export default ShareButton;