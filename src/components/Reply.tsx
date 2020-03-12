import * as React from 'react';
import { Thread } from './Thread';
import { ThreadProps } from './Thread';
import { Replies } from './Replies';

class Reply extends React.Component<ThreadProps> {
    constructor(props: Readonly<ThreadProps>) {
        super(props);
    }

    render() {
        console.log(Object.keys(this.props.childThreads).length)
        return Object.keys(this.props.childThreads).length > 0 ? (
            <Thread {...this.props}>
                <Replies
                    threads={...this.props.childThreads as Array<ThreadProps>}
                />
            </Thread>
        ) : (
            <Thread {...this.props} />
        );
    }
}

export default Reply;
