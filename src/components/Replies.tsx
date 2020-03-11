import * as React from 'react';
import { ThreadProps } from './Thread';
import Reply from './Reply';

interface ReplyProps {
    threads: Array<ThreadProps>;
}

class Replies extends React.Component<ReplyProps> {
    constructor(props: Readonly<ReplyProps>) {
        super(props);
        console.log(this.props);
    }

    render() {
        return this.props.threads.map((replyData: ThreadProps) => {
            return <Reply {...replyData} key={replyData.number} />;
        });
    }
}

export { Replies };
