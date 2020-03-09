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
}
class Thread extends React.Component<ThreadProps, ThreadState> {
    constructor(props: Readonly<ThreadProps>) {
        super(props);

        this.state = {
            isHidden: false
        };
    }

    static hideList() {
        return JSON.parse(sessionStorage.getItem('hiddenThreads')) || {};
    }

    expandThread() {
        if(this.props.isSingleThread) return; //already expanded
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

    render() {
        if (this.props.sticky) return null;
        if (this.state.isHidden) return null;
        return (
            <Grid
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
                                                            this.props.userID
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Title
                                                        title={this.props.title}
                                                    />

                                                    <Identity
                                                        name={this.props.name}
                                                    />
                                                    <FollowButton
                                                        userID={
                                                            this.props.userID
                                                        }
                                                    />

                                                    <PostTimeAgo
                                                        time={this.props.time}
                                                    />

                                                    <Country
                                                        country={
                                                            this.props.country
                                                        }
                                                    />
                                                    <Divider className="top-divider" />
                                                    {this.props.isSingleThread ? (
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
                                                    <Image
                                                        src={this.props.image}
                                                    />

                                                    <div className="thread-stats pull-right">
                                                        <ThreadStat
                                                            icon={
                                                                <CommentIcon />
                                                            }
                                                            type="Replies"
                                                            val={
                                                                this.props
                                                                    .replies
                                                            }
                                                        />
                                                        <ThreadStat
                                                            icon={<ImageIcon />}
                                                            type="Images"
                                                            val={
                                                                this.props
                                                                    .images
                                                            }
                                                        />
                                                    </div>
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
        );
    }
}

export { Thread, ThreadProps };
