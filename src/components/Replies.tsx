import * as React from 'react';
import { ThreadProps } from './Thread';
import Reply from './Reply';

interface ReplyProps {
    threads: any;
}

interface ReplyState {
    replies: any;
}

class Replies extends React.Component<ReplyProps, ReplyState> {
    constructor(props: Readonly<ReplyProps>) {
        super(props);

        this.state = {
            replies: null,
        };
    }

    static Replies: React.JSXElementConstructor<ReplyProps> = (
        props: ReplyProps
    ) => {
        let replies : any = [];
        let toRender;

        for (let key of Object.keys(props.threads)) {
            replies.push(props.threads[key]);
        }

        toRender =  replies.map((replyData: ThreadProps) => {
            return <Reply {...replyData} key={replyData.number} />;
        });
        return toRender;
    };

   
}

export default Replies.Replies;
