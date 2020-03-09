import * as React from 'react';
import { Threads } from './Threads';
import { ThreadProps } from './Thread';
import { Container } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

interface PageProps {
    pageNumber: number;
    threads: Array<ThreadProps>;
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
            <Container maxWidth="sm">
                {this.props.pageNumber ? (
                    <Threads
                        key={this.props.pageNumber}
                        threads={this.props.threads}
                        pageNumber={this.props.pageNumber}
                    />
                ) : (
                    <Skeleton variant="rect" height={600} />
                )}
            </Container>
        );
    }
}

export default Page;
