import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Jdenticon from 'react-jdenticon';
import { TimeAgo } from '../helpers/TimeAgo';
import { TextManager } from '../helpers/TextManager';
import Badge from '@material-ui/core/Badge';
import CommentIcon from '@material-ui/icons/Comment';
import ImageIcon from '@material-ui/icons/Image';
import StarsOutlinedIcon from '@material-ui/icons/StarsOutlined';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import Chip from '@material-ui/core/Chip';


interface ThreadProps {
    time: number;
    number: number;
    name: string;
    id: string;
    trip: string;
    country: string;
    title: string;
    description: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    replies: number;
    images: number;
    sticky: boolean;
}

const Title = (title: { title: string }) => {
    return (
        <Typography gutterBottom variant="h5" component="h5">
            {title.title}
        </Typography>
    );
};

const Avatar = (avatar: { trip: string; id: string }) => {
    let identicon = avatar.trip ? avatar.trip : avatar.id;
    return (
        <span>
            <Jdenticon size="60" value={identicon} />
            <Typography
                variant="caption"
                className="muted identicon"
                component="span"
            >
                {avatar.id}
            </Typography>
        </span>
    );
};

const Identity = (identity: { trip: string; id: string; name: string }) => {
    let id = identity.trip ? identity.trip : identity.id;
    let label = identity.name; // + ': ' + id;
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
    return <img className="thread-image" src={image.src} />;
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

function handleClick(){
    
}

const FavoriteUser = (favorite: { id: string }) => {
    return (
        <Chip
            data-user-id={favorite.id}
            className="favorite-user muted"
            label="Follow"
            clickable
            variant="outlined"
            size="small"
        />
    );
};

const ThreadStat = (stat: { icon: JSX.Element; type: string; val: number }) => {
    return (
        <Typography
            variant="body1"
            gutterBottom
            component="span"
        >
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

class Description extends React.Component<{ description: string }> {
    constructor(props: Readonly<{ description: string }>) {
        super(props);
    }

    textManager: TextManager = new TextManager(this.props.description);
    paragraphs: string[] = this.textManager
        .extractLinks()
        .split(this.textManager.divider);

    links: string[] = this.textManager.getExtractedLinks();

    render() {
        let tag: any;
        let lines: string[];
        let prevLine = '';
        return this.paragraphs.map((paragraph: string, index: number) => {
            lines = paragraph
                .replace(/>/g, '\n>') //add a new line to all >
                .replace(/\r\n/g, '\r')
                .replace(/\n/g, '\r')
                .split(/\r/); //split based on new lines
            return lines.map((line: string, index: number) => {
                if (
                    (line.length <= 2 &&
                        ['\r\n', '\n\r', '\n', '\r'].indexOf(line.trim()) >
                            -1) ||
                    line.trim() == ''
                )
                    return null;
                if (line.trim() == '>') {
                    prevLine = '>';
                    return null;
                } else {
                    line = prevLine + line;
                    prevLine = '';
                }

                if (line.indexOf('>') > -1) {
                    //begins with quote symbol
                    line = line.replace('>', '');
                    tag = 'blockquote';
                } else {
                    tag = 'span';
                }
                return (
                    <Typography variant="body1" key={index} component={tag}>
                        {line}
                        {this.links[index] ? (
                            <Link href={this.links[index]}>
                                {this.textManager.shorten(this.links[index])}
                            </Link>
                        ) : null}
                    </Typography>
                );
            });
        });
    }
}

class Thread extends React.Component<ThreadProps> {
    constructor(props: Readonly<ThreadProps>) {
        super(props);
    }

    render() {
        if (this.props.sticky) return null;
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
                    <Card>
                        <CardActionArea className="hundred-percent">
                            <CardActions className="hundred-percent">
                                <CardContent className="hundred-percent">
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-start"
                                        spacing={1}
                                    >
                                        <Grid item xs={2}>
                                            <Avatar
                                                trip={this.props.trip}
                                                id={this.props.id}
                                            />
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Title title={this.props.title} />

                                            <Identity
                                                trip={this.props.trip}
                                                id={this.props.id}
                                                name={this.props.name}
                                            />
                                            <FavoriteUser id={this.props.id} />
                                            <PostTimeAgo
                                                time={this.props.time}
                                            />

                                            <Country
                                                country={this.props.country}
                                            />
                                            <Divider className="top-divider" />
                                            <Description
                                                description={
                                                    this.props.description
                                                }
                                            />
                                            <Image src={this.props.image} />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </CardActions>
                        </CardActionArea>
                        <CardActionArea>
                            <CardActions className="pull-right muted">
                                <CardContent>
                                    <BoardStat
                                        icon={<CommentIcon />}
                                        type="Replies"
                                        val={this.props.replies}
                                    />
                                    <BoardStat
                                        icon={<ImageIcon />}
                                        type="Images"
                                        val={this.props.images}
                                    />
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
