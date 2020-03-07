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
            (threadData: ThreadProps) => {
                let thread: ThreadProps = {
                    number: threadData.number,
                    title: threadData.title,
                    description: threadData.description,
                    image: threadData.image,
                    time: threadData.time,
                    name: threadData.name,
                    id: threadData.id,
                    trip: threadData.trip,
                    country: threadData.country,
                    imageWidth: threadData.imageWidth,
                    imageHeight: threadData.imageHeight,
                    replies: threadData.replies,
                    images: threadData.images
                };
                return (
                    <Thread
                        key={thread.number}
                        number={thread.number}
                        title={thread.title}
                        description={thread.description}
                        image={thread.image}
                        time={threadData.time}
                        name={threadData.name}
                        id={threadData.id}
                        trip={threadData.trip}
                        country={threadData.country}
                        imageWidth={threadData.imageWidth}
                        imageHeight={threadData.imageHeight}
                        replies={threadData.replies}
                        images={threadData.images}
                    />
                );
            }
        );
    }
}

export { Threads };
