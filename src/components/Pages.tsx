import * as React from 'react';
import Page from './Page';
import { ThreadProps, Thread } from './Thread';
import FollowButton from './FollowButton';
import { TablePagination } from '@material-ui/core';
import { TextManager } from '../helpers/TextManager';

interface PagesProps {}

interface PagesState {
    pages: Array<Array<ThreadProps>>;
    pageNumber: number;
    _hasFetched: boolean;
    threadsFetched: boolean;
}

class Pages extends React.Component<PagesProps, PagesState> {
    _isMounted: boolean = false; //needed since we're doing asyncronous calls
    queuedThreads = Array();
    textManager: TextManager = new TextManager('');

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
                        userID: '',
                        country: '',
                        imageWidth: 0,
                        imageHeight: 0,
                        replies: 0,
                        images: 0,
                        sticky: false,
                        isSingleThread: true,
                        setSingleThread: false,
                        setMultipleThreads: false,
                        isReply: false
                    }
                ]
            ],
            pageNumber: 0,
            _hasFetched: false,
            threadsFetched: false
        };
    }
    downloading: boolean = false;

    handleScroll = (e: any) => {
        if(document.getElementsByClassName('thread').length < 2) return; //single thread
        const bottom =
            e.target.scrollingElement.scrollHeight -
                e.target.scrollingElement.scrollTop <=
            e.target.scrollingElement.clientHeight * 5;
        if (bottom) {
            let nextPage = this.state.pageNumber + 1;
            if (nextPage < this.state.pages.length) {
                this.updateSate({
                    ...this.state,
                    pageNumber: nextPage
                });
            }
        }
    };

    listenScroll() {
        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }

   

    downloadThreads() {
        this.downloading = true;
        console.log('downloading');
        //https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks/59956926#59956926
        fetch(
            /**
             * 4chan API currently has CORS policy so can't access from ajax
             */
            //TODO: find a better way to get posts without a proxy. Or create own proxy
            //TODO: make sure these rules are followed: https://libraries.io/github/4chan/4chan-API
            'https://cors-anywhere.herokuapp.com/https://a.4cdn.org/pol/catalog.json',
            {
                method: 'GET'
            }
            //       './testData.json'
        )
            .then(data => {
                if (!data.ok) {
                    throw new Error('Network response was not ok');
                }
                return data.json();
            })
            .then(data => {
                let pages: Array<Array<ThreadProps>> = (data || []).map(
                    (pageData: any, index: number) => {
                        let page: Array<ThreadProps> = (
                            pageData.threads || []
                        ).map((threadData: any, index: number) => {
                            let threads: ThreadProps = {
                                number: threadData.no,
                                title: this.textManager.parseHTML(threadData.sub),
                                description: this.textManager.parseHTML(threadData.com),
                                time: threadData.time,
                                image: threadData.tim
                                    ? '//i.4cdn.org/pol/' +
                                      threadData.tim +
                                      threadData.ext
                                    : '',
                                name: threadData.name,
                                userID: threadData.trip
                                    ? threadData.trip
                                    : threadData.id
                                    ? threadData.id
                                    : 'anon',
                                country: threadData.country,
                                imageWidth: threadData.w,
                                imageHeight: threadData.h,
                                replies: threadData.replies,
                                images: threadData.images,
                                sticky: threadData.sticky ? true : false,
                                isSingleThread: true,
                                setSingleThread: false,
                                setMultipleThreads: false,
                                isReply: false
                            };
                            return threads;
                        });

                        return page;
                    }
                );
                pages = this.prioritizeAndRepaginate(pages);
                this.updateSate({
                    ...this.state,
                    pageNumber: 1,
                    pages: pages,
                    _hasFetched: true,
                    threadsFetched: true
                });
            });
    }

    componentDidMount() {
        this.listenScroll();
        this._isMounted = true;
        if (this.state.threadsFetched === false && this.downloading === false) {
            this.downloadThreads();
        }
    }

    threadRepeated(number: number) {
        return this.queuedThreads.indexOf(number) > -1 ? true : false;
    }

    prioritizeAndRepaginate(
        pages: Array<Array<ThreadProps>>
    ): Array<Array<ThreadProps>> {
        let allThreads = [];
        let topThreads = [];
        let paginated: Array<Array<ThreadProps>> = new Array<
            Array<ThreadProps>
        >();
        let pageSize = 15;
        let followedUsers = FollowButton.followList();
        let hiddenThreads = Thread.hideList();

        for (let i = 0; i < pages.length; i++) {
            let page = pages[i];
            for (let ii = 0; ii < page.length; ii++) {
                if (hiddenThreads[page[ii].number] == 1) continue;
                if (followedUsers[page[ii].userID]) {
                    topThreads.push(page[ii]);
                } else {
                    allThreads.push(page[ii]);
                }
            }
        }

        allThreads = topThreads.concat(allThreads);

        for (let i = 0, len = allThreads.length; i < len; i += pageSize) {
            if (paginated.length === 0) {
                paginated[0] = allThreads.slice(i, i + pageSize);
            } else {
                paginated.push(allThreads.slice(i, i + pageSize));
            }
        }

        return paginated;
    }

    queueThreads() {
        let pageNumber = this.state.pageNumber;
        let threads: Array<ThreadProps> = this.state.pages[0];
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
