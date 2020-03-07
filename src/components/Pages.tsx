import * as React from 'react';
import Page from './Page';
import { ThreadProps } from './Thread';

interface PagesProps {}

interface PagesState {
    pages: [[ThreadProps]];
    pageNumber: number;
    _hasFetched: boolean;
    threadsFetched: boolean;
}

class Pages extends React.Component<PagesProps, PagesState> {
    _isMounted: boolean = false; //needed since we're doing asyncronous calls
    queuedThreads = Array();

    componentWillUnmount = () => (this._isMounted = false);
    updateSate(state: {}) {
        if (this._isMounted === true) this.setState(state);
    }

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            pages: [
                [
                    {
                        number: 0,
                        title: '',
                        description: '',
                        image: '',
                        time: 0,
                        name: '',
                        id: '',
                        trip: '',
                        country: '',
                        imageWidth: 0,
                        imageHeight: 0,
                        replies: 0,
                        images: 0,
                        sticky: false
                    }
                ]
            ],
            pageNumber: 0,
            _hasFetched: false,
            threadsFetched: false
        };
    }

    handleScroll = (e: any) => {
        const bottom =
            e.target.scrollingElement.scrollHeight -
                e.target.scrollingElement.scrollTop <=
            e.target.scrollingElement.clientHeight * 5;
        if (bottom) {
            let nextPage = this.state.pageNumber + 1;
            if (nextPage < this.state.pages.length) {
                this.updateSate({
                    pageNumber: nextPage
                });
            }
        }
    };

    listenScroll() {
        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }

    parseHTML(encodedStr: string) {
        if (!encodedStr) return '4chan';
        var parser = new DOMParser();
        var dom = parser.parseFromString(
            '<!doctype html><body>' + encodedStr,
            'text/html'
        );
        return dom.body.textContent;
    }

    downloadThreads() {
        //https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks/59956926#59956926
        fetch(
            /**
             * TODO: find a better way to get posts without a proxy. Or create own proxy
             * 4chan API currently has CORS policy so can't access from ajax
             */
            /* 'https://cors-anywhere.herokuapp.com/https://a.4cdn.org/pol/catalog.json',
    {
        method: 'GET'
    }*/
            './testData.json'
        )
            .then(data => {
                if (!data.ok) {
                    throw new Error('Network response was not ok');
                }
                return data.json();
            })
            .then(data => {
                let pages: [[ThreadProps]] = (data || []).map(
                    (pageData: any, index: number) => {
                        let page: [ThreadProps] = (pageData.threads || []).map(
                            (threadData: any, index: number) => {
                                let threads: ThreadProps = {
                                    number: threadData.no,
                                    title: this.parseHTML(threadData.sub),
                                    description: this.parseHTML(threadData.com),
                                    time: threadData.time,
                                    image: threadData.tim
                                        ? '//i.4cdn.org/pol/' +
                                          threadData.tim +
                                          threadData.ext
                                        : '',
                                    name: threadData.name,
                                    id: threadData.id ? threadData.id : '',
                                    trip: threadData.trip
                                        ? threadData.trip
                                        : '',
                                    country: threadData.country,
                                    imageWidth: threadData.w,
                                    imageHeight: threadData.h,
                                    replies: threadData.replies,
                                    images: threadData.images,
                                    sticky: threadData.sticky ? true : false
                                };
                                return threads;
                            }
                        );

                        return page;
                    }
                );

                this.updateSate({
                    pageNumber: 1,
                    pages: pages,
                    _hasFetched: true
                });
            });
    }

    componentDidMount() {
        this.listenScroll();
        this._isMounted = true;
        if (this.state.threadsFetched === false) {
            this.downloadThreads();
            this.updateSate({
                threadsFetched: true
            });
        }
    }
    threadRepeated(number: number) {
        return this.queuedThreads.indexOf(number) > -1 ? true : false;
    }

    queueThreads() {
        let pageNumber = this.state.pageNumber;
        let threads: [ThreadProps] = this.state.pages[0];
        for (let i = 1; i <= pageNumber; i++) {
            this.state.pages[i].map((threadData: ThreadProps) => {
                if (!this.threadRepeated(threadData.number)) {
                    threads.push(threadData);
                    this.queuedThreads.push(threadData.number);
                }
            });
        }
        return threads;
    }

    render() {
        let pageNumber = this.state.pageNumber;
        return (
            <Page
                key={pageNumber}
                pageNumber={pageNumber}
                threads={this.queueThreads()}
            />
        );
    }
}

export default Pages;
