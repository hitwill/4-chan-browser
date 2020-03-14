import * as React from 'react';
import { Thread } from './Thread';
import { ThreadProps } from './Thread';
import { Threads, ThreadsProps } from './Threads';

class Reply extends React.Component<ThreadProps> {
    constructor(props: Readonly<ThreadProps>) {
        super(props);
    }

    static Reply: React.JSXElementConstructor<ThreadProps> = (
        props: ThreadProps
    ) => {
        let threads: Array<ThreadProps> = [] as Array<ThreadProps>;
        let threadsProps: ThreadsProps = ([] as unknown) as ThreadsProps;

        if (props.childThreads !== false) {
            for (let key of Object.keys(props.childThreads)) {
                threads.push(props.childThreads[key] as ThreadProps);
            }
            threadsProps.pageNumber = 1; //just a dummy value
            threadsProps.threads = threads;
        }
        return (
            <span>
                <Thread {...props} isSingleThread={true} />
                {threads.length > 0 ? (
                    <Threads {...threadsProps} isReply={true} />
                ) : null}
            </span>
        );
    };
}

export default Reply.Reply;
