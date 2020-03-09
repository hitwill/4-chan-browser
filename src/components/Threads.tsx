import * as React from 'react';
import { Thread } from './Thread';
import { ThreadProps } from './Thread';

interface ThreadsProps {
    pageNumber: number;
    threads: Array<ThreadProps>;
}

interface ThreadsState {
    singleThread: ThreadProps | boolean;
}

class Threads extends React.Component<ThreadsProps, ThreadsState> {
    constructor(props: Readonly<ThreadsProps>) {
        super(props);
        this.state = {
            singleThread: false
        };
        this.singleThreadActive = this.singleThreadActive.bind(this);
        this.multipleThreadsActive = this.multipleThreadsActive.bind(this);
    }

    allThreads() {
        return this.props.threads.map((threadData: ThreadProps) => {
            let thread: ThreadProps = {
                number: threadData.number,
                title: threadData.title,
                description: threadData.description,
                image: threadData.image,
                time: threadData.time,
                name: threadData.name,
                userID: threadData.userID,
                country: threadData.country,
                imageWidth: threadData.imageWidth,
                imageHeight: threadData.imageHeight,
                replies: threadData.replies,
                images: threadData.images,
                sticky: threadData.sticky,
                isSingleThread: true,
                setSingleThread: false,
                setMultipleThreads: false
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
                    userID={threadData.userID}
                    country={threadData.country}
                    imageWidth={threadData.imageWidth}
                    imageHeight={threadData.imageHeight}
                    replies={threadData.replies}
                    images={threadData.images}
                    sticky={threadData.sticky}
                    isSingleThread={true}
                    setSingleThread={this.singleThreadActive}
                    setMultipleThreads={this.multipleThreadsActive}
                />
            );
        });
    }

    singleThreadActive(threadProps: ThreadProps) {
        this.setState(() => ({
                    ...this.state, 
                    singleThread: threadProps as ThreadProps
        }));
    }

    multipleThreadsActive() {
        this.setState(() => ({
            ...this.state,
            singleThread: false as boolean
        }));
    }

    singleThread(threadProps: ThreadProps | Boolean) {
        let props = threadProps as ThreadProps;
        return (<Thread
            key={props.number}
            number={props.number}
            title={props.title}
            description={props.description}
            image={props.image}
            time={props.time}
            name={props.name}
            userID={props.userID}
            country={props.country}
            imageWidth={props.imageWidth}
            imageHeight={props.imageHeight}
            replies={props.replies}
            images={props.images}
            sticky={props.sticky}
            isSingleThread={false}
            setSingleThread={this.singleThreadActive}
            setMultipleThreads={this.multipleThreadsActive}
        />);
    }

    render() {
        if (this.state.singleThread === false) {
            return this.allThreads();
        } else {
            return this.singleThread(this.state.singleThread);
        }
    }
}

export { Threads };
