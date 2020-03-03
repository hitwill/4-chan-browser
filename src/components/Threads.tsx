import * as React from 'react';
import { Thread } from './Thread';
import { ThreadProps } from './Thread';

interface ThreadsProps {
    pageNumber: number;
    threads: [ThreadProps];
}

class Threads extends React.Component<ThreadsProps> {
    constructor(props: Readonly<ThreadsProps>) {
        super(props);
    }

    render() {
        return this.props.threads.map(
            (threadData: {
                number: number;
                title: string;
                description: string;
                image: string;
            }) => {
                let thread: ThreadProps = {
                    number: threadData.number,
                    title: threadData.title,
                    description: threadData.description,
                    image: threadData.image
                };
                return (
                    <Thread
                        key={thread.number}
                        number={thread.number}
                        title={thread.title}
                        description={thread.description}
                        image={thread.image}
                    />
                );
            }
        );
    }
}

export { Threads };
