import * as React from 'react';
import { Thread } from './Thread';
import { ThreadProps } from './Thread';
import { Replies } from './Replies';

class Reply extends React.Component<ThreadProps> {
    constructor(props: Readonly<ThreadProps>) {
        super(props);
    }

    render() {
        return this.props.children ? (
            <Replies threads={...(this.props.children as Array<ThreadProps>)} />
        ) : (
            <Thread {...this.props} />
        );
    }
}

export default Reply;
