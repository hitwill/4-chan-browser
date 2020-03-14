import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Jdenticon from 'react-jdenticon';
import { TimeAgo } from '../helpers/TimeAgo';
import Badge from '@material-ui/core/Badge';
import CommentIcon from '@material-ui/icons/Comment';
import ImageIcon from '@material-ui/icons/Image';
import Divider from '@material-ui/core/Divider';
import FollowButton from './FollowButton';
import { ThreadText } from './ThreadText';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { TextManager } from '../helpers/TextManager';
import Skeleton from '@material-ui/lab/Skeleton';
import Replies from './Replies';

interface ThreadProps {
    time: number;
    number: number;
    name: string;
    userID: string;
    country: string;
    title: string;
    description: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    replies: number;
    images: number;
    sticky: boolean;
    isSingleThread: boolean;
    setSingleThread: any;
    setMultipleThreads: any;
    isReply: boolean;
    childThreads: any;
    depth: number;
    isLastReply: boolean;
}

const Title = (title: { title: string }) => {
    return (
        <Typography gutterBottom variant="h5" component="h5">
            {title.title}
        </Typography>
    );
};

const Avatar = (avatar: { userID: string }) => {
    let identicon = avatar.userID;
    return (
        <span>
            <Jdenticon size="60" value={identicon} />
            <Typography
                variant="caption"
                className="muted identicon"
                component="span"
            >
                {avatar.userID}
            </Typography>
        </span>
    );
};

const Identity = (identity: { name: string }) => {
    let label = identity.name;
    return (
        <Typography variant="body2" className="muted" component="span">
            {label}
        </Typography>
    );
};

const PostTimeAgo = (time: { time: number }) => {
    let timeAgo = new TimeAgo(time.time).getMoments();
    return (
        <Typography
            variant="body2"
            className="muted pull-right"
            component="span"
        >
            {timeAgo}
        </Typography>
    );
};
const Image = (image: { src: string }) => {
    return <img alt="" className="thread-image" src={image.src} />;
};

const Country = (country: { country: string }) => {
    let flag;
    if (country.country) {
        flag =
            '//s.4cdn.org/image/country/' +
            country.country.toLowerCase() +
            '.gif';
        return (
            <Typography
                className="muted pull-right country"
                variant="body2"
                gutterBottom
                component="span"
            >
                {country.country} <img className="country-image" src={flag} />
            </Typography>
        );
    } else {
        return null;
    }
};

const ThreadStat = (stat: { icon: JSX.Element; type: string; val: number }) => {
    return (
        <Typography variant="body1" component="span" gutterBottom>
            <span>{stat.type}</span>{' '}
            <Badge
                className="stats-badge"
                max={999}
                badgeContent={stat.val}
                {...{
                    color: 'default',
                    children: stat.icon
                }}
            />
        </Typography>
    );
};

interface ThreadState {
    isHidden: boolean;
    downloading: boolean;
    downloaded: boolean;
}
class Thread extends React.Component<ThreadProps, ThreadState> {
    constructor(props: Readonly<ThreadProps>) {
        super(props);

        this.state = {
            isHidden: false,
            downloading: false,
            downloaded: false
        };
    }
    textManager: TextManager = new TextManager('');
    nestedReplies: any = {};

    static hideList() {
        return JSON.parse(sessionStorage.getItem('hiddenThreads')) || {};
    }

    expandThread(e: any) {
        if (
            e.target.matches(
                '.MuiChip-label, .clickable, .hide-button, .MuiIconButton-label, .MuiSvgIcon-root, path'
            )
        )
            return; //this is the follow button or link
        if (this.props.isSingleThread) return; //already expanded
        this.props.setSingleThread(this.props);
    }

    collapseThread() {
        this.props.setMultipleThreads;
    }

    handleHide(threadID: string) {
        let hideList = Thread.hideList();
        this.setState(state => ({
            ...this.state,
            isHidden: true
        }));

        hideList[threadID] = 1;

        sessionStorage.setItem('hiddenThreads', JSON.stringify(hideList));
    }

    componentDidUpdate() {
        if (
            this.props.isSingleThread === true &&
            this.state.downloading === false &&
            this.state.downloaded === false
        ) {
            this.downloadReplies(this.props.number.toString());
        }
        document.getElementById('card-bottom')?.scrollIntoView();
    }

    nestReplies(replies: Array<ThreadProps>) {
        let replyTo: any;
        for (let i = 0; i < replies.length; i++) {
            this.nestedReplies[replies[i].number] = replies[i];
        }

        for (let i = 0; i < replies.length; i++) {
            let reply = replies[i];
            replyTo = reply.description
                ? reply.description.match(/>+(\d*)/)
                : 0;
            if (replyTo && !isNaN(replyTo[1])) {
                this.attachToReplies(
                    this.nestedReplies,
                    replyTo[1] as number,
                    reply,
                    1
                );
            }
        }
    }

    setLastReply(reply: any) {
        let lastKey = '';
        for (let key of Object.keys(reply)) {
            lastKey = key;
            reply[key].isLastReply = false;
        }
        reply[lastKey].isLastReply = true;
    }

    attachToReplies(
        nested: any,
        replyTo: number,
        reply: ThreadProps,
        depth: number
    ) {
        if (nested[replyTo]) {
            if (!nested[replyTo].childThreads)
                nested[replyTo].childThreads = {};
            reply.depth = depth;
            nested[replyTo].childThreads[reply.number] = reply;
            this.setLastReply(nested[replyTo].childThreads);
            delete this.nestedReplies[reply.number];
            return true;
        }

        for (var key in nested) {
            if (nested.hasOwnProperty(key)) {
                if (nested[key].childThreads) {
                    depth += 1;
                    if (
                        this.attachToReplies(
                            nested[key].childThreads,
                            replyTo,
                            reply,
                            depth
                        )
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    downloadReplies(threadNumber: string) {
        this.setState(state => ({
            ...this.state,
            downloading: true
        }));

        //https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks/59956926#59956926
        fetch(
            /**
             * 4chan API currently has CORS policy so can't access from ajax
             */
            //TODO: find a better way to get posts without a proxy. Or create own proxy
            //TODO: make sure these rules are followed: https://libraries.io/github/4chan/4chan-API
            'https://cors-anywhere.herokuapp.com/https://a.4cdn.org/pol/thread/' +
                threadNumber +
                '.json',
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
                data.posts.shift(); //we don't need the first one. It's OP's post
                let replies: Array<ThreadProps> = (data.posts || []).map(
                    (threadData: any, index: number) => {
                        let threads: ThreadProps = {
                            number: threadData.no,
                            title: '',
                            description: this.textManager.parseHTML(
                                threadData.com
                            ),
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
                            replies: 0,
                            images: 0,
                            sticky: false,
                            isSingleThread: true,
                            setSingleThread: false,
                            setMultipleThreads: false,
                            isReply: true,
                            childThreads: false,
                            depth: this.props.depth,
                            isLastReply: false
                        };
                        return threads;
                    }
                );

                //TODO: if following, priorize here
                let sortedReplies: Array<ThreadProps> = replies.sort(
                    (a: ThreadProps, b: ThreadProps) => a.time - b.time
                );

                this.nestReplies(sortedReplies);

                this.setState(state => ({
                    ...this.state,
                    downloading: false,
                    downloaded: true
                }));
            });
    }

    render() {
        if (this.props.sticky) return null;
        if (this.state.isHidden) return null;
        let classType = 'thread';
        let border = {};
        if (this.props.isReply) {
            classType = 'reply';
            if (this.props.depth > 0) {
                classType = 'deep reply';
                border = {
                    borderWidth: this.props.depth * 10 + 'px',
                    marginLeft: '1px',
                    borderLeftStyle: 'solid',
                    borderLeftColor: 'lightgray',
                    marginBottom: this.props.isLastReply ? '10px' : 'initial'
                };
            }
        }

        return !this.state.downloading ? (
            <span>
                <Grid
                    style={border}
                    className={classType}
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    spacing={1}
                    key={this.props.number.toString()}
                >
                    <Grid item xs={12} className={'hundred-percent'}>
                        <Card onClick={this.expandThread.bind(this)}>
                            <CardActionArea className="hundred-percent">
                                <CardActions className="hundred-percent">
                                    <CardContent className="hundred-percent">
                                        <Grid
                                            container
                                            direction="column"
                                            justify="center"
                                            alignItems="center"
                                            spacing={0}
                                        >
                                            <Grid
                                                item
                                                xs={12}
                                                className={'hundred-percent'}
                                            >
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="center"
                                                    spacing={0}
                                                >
                                                    <Grid item xs={2}>
                                                        <Avatar
                                                            userID={
                                                                this.props
                                                                    .userID
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={10}>
                                                        <Title
                                                            title={
                                                                this.props.title
                                                            }
                                                        />

                                                        <Identity
                                                            name={
                                                                this.props.name
                                                            }
                                                        />
                                                        <FollowButton
                                                            userID={
                                                                this.props
                                                                    .userID
                                                            }
                                                        />

                                                        <PostTimeAgo
                                                            time={
                                                                this.props.time
                                                            }
                                                        />

                                                        <Country
                                                            country={
                                                                this.props
                                                                    .country
                                                            }
                                                        />
                                                        <Divider className="top-divider" />
                                                        {!this.props
                                                            .isSingleThread ? (
                                                            <IconButton
                                                                component="span"
                                                                className="muted hide-button"
                                                                children={
                                                                    <CloseIcon />
                                                                }
                                                                onClick={this.handleHide.bind(
                                                                    this,
                                                                    this.props
                                                                        .number
                                                                )}
                                                            ></IconButton>
                                                        ) : (
                                                            <span></span>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                className={'hundred-percent'}
                                            >
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="center"
                                                    spacing={0}
                                                >
                                                    <Grid item xs={2}></Grid>
                                                    <Grid item xs={10}>
                                                        <ThreadText
                                                            description={
                                                                this.props
                                                                    .description
                                                            }
                                                        />
                                                        {this.props
                                                            .isSingleThread ===
                                                            true &&
                                                        Object.keys(
                                                            this.nestedReplies
                                                        ).length > 0 ? (
                                                            <span id="card-bottom"></span>
                                                        ) : null}
                                                        <Image
                                                            src={
                                                                this.props.image
                                                            }
                                                        />

                                                        {!this.props
                                                            .isSingleThread ? (
                                                            <div className="thread-stats pull-right">
                                                                <ThreadStat
                                                                    icon={
                                                                        <CommentIcon />
                                                                    }
                                                                    type="Replies"
                                                                    val={
                                                                        this
                                                                            .props
                                                                            .replies
                                                                    }
                                                                />
                                                                <ThreadStat
                                                                    icon={
                                                                        <ImageIcon />
                                                                    }
                                                                    type="Images"
                                                                    val={
                                                                        this
                                                                            .props
                                                                            .images
                                                                    }
                                                                />
                                                            </div>
                                                        ) : (
                                                            <span></span>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </CardActions>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
                {this.props.isSingleThread === true &&
                Object.keys(this.nestedReplies).length > 0 ? (
                    <Replies threads={...this.nestedReplies} />
                ) : null}
            </span>
        ) : (
            <Skeleton variant="rect" height={600} />
        );
    }
}

export {
    ThreadProps,
    Thread,
    Avatar,
    Title,
    Identity,
    PostTimeAgo,
    Country,
    ThreadText,
    Image
};
