import * as React from 'react';
import { ThreadProps } from './Thread';
import Reply from './Reply';

interface ReplyProps {
    threads: any;
}

class Replies extends React.Component<ReplyProps> {
    constructor(props: Readonly<ReplyProps>) {
        super(props);
    }

    render() {
       let replies : any = [];

        for (let key of Object.keys(this.props.threads)) {
            replies.push(this.props.threads[key]);
        }

        return replies.map((replyData: ThreadProps) => {
            return <Reply {...replyData} key={replyData.number} />;
        });
    }
}

export { Replies };
