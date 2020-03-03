import * as React from 'react';
import { Threads } from './Threads';
import { ThreadProps } from './Thread';

interface PageProps {
    pageNumber: number;
    threads: [ThreadProps];
}

class Page extends React.Component<PageProps> {
    constructor(props: Readonly<PageProps>) {
        super(props);
        this.state = {
            page: {
                pageNumber: this.props.pageNumber,
                threads: this.props.threads
            }
        };
    }

    render() {
        return (
                <Threads
                    key={this.props.pageNumber}
                    threads={this.props.threads}
                    pageNumber={this.props.pageNumber}
                />
        );
    }
}

export default Page;
