import * as React from 'react';
import Page from './Page';
import { ThreadProps } from './Thread';
import { Threads } from './Threads';

interface PagesProps {}

interface PagesState {
    pages: [[ThreadProps]];
    pageNumber: number;
    _hasFetched: boolean;
}

class Pages extends React.Component<PagesProps, PagesState> {
    _isMounted: boolean = false; //needed since we're doing asyncronous calls
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
                        image: 'images/UI/loading.gif',
                        time: 0,
                        name: '',
                        id: '',
                        trip: '',
                        country: '',
                        imageWidth: 0,
                        imageHeight: 0,
                        replies: 0
                    }
                ]
            ],
            pageNumber: 0,
            _hasFetched: false
        };
    }

    parseHTML(encodedStr: string) {
        if(!encodedStr) return '4chan';
        var parser = new DOMParser();
        var dom = parser.parseFromString(
            '<!doctype html><body>' + encodedStr,
            'text/html'
        );
        return dom.body.textContent;
    }

    componentDidMount() {
        this._isMounted = true;

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
                                    trip: threadData.trip ? threadData.trip : '',
                                    country: threadData.country_name,
                                    imageWidth: threadData.w,
                                    imageHeight: threadData.h,
                                    replies: threadData.replies
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

    render() {
        let pageNumber = this.state.pageNumber;
        return (
            <Page
                key={pageNumber}
                pageNumber={pageNumber}
                threads={this.state.pages[pageNumber]}
            />
        );
    }
}

export default Pages;
