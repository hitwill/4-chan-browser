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
import Chip from '@material-ui/core/Chip';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';

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
}

const PostTimeAgo = (time: { time: number }) => {
    let timeAgo = new TimeAgo(time.time).getMoments();
    return <Typography component="span">{timeAgo}</Typography>;
};

const Title = (title: { title: string }) => {
    return (
        <Typography gutterBottom variant="h5" component="h2">
            {title.title}
        </Typography>
    );
};

const Avatar = (avatar: { trip: string; id: string }) => {
    let identicon = avatar.trip ? avatar.trip : avatar.id;
    return <Jdenticon size="48" value={identicon} />;
};

const Identity = (identity: { trip: string; id: string; name: string }) => {
    let id = identity.trip ? identity.trip : identity.id;
    let label = identity.name + ': ' + id;
    return <Chip variant="outlined" size="small" label={label} />;
};

let divStyle = {
    width: '100%'
};

const Image = (image: { src: string }) => {
    return <img style={divStyle} className="image" src={image.src} />;
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
        let tag : any;
        let lines : string[];
        return this.paragraphs.map((paragraph: string, index: number) => {
            lines = paragraph.split('/\r?\n/');
            return lines.map((line: string, index: number) => {
                if(line.indexOf('>') > -1) { //begins with quote symbol
                    line = line.replace('>', '');
                    tag = 'blockquote';
                }else{
                    tag = 'span';
                }
                return (
                    <Typography key={index} component={tag}>
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
        return (
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={1}
                key={this.props.number.toString()}
            >
                <Grid item xs={12}>
                    <Card>
                        <CardActionArea>
                            <CardContent>
                                <Avatar
                                    trip={this.props.trip}
                                    id={this.props.id}
                                />
                                <Identity
                                    trip={this.props.trip}
                                    id={this.props.id}
                                    name={this.props.name}
                                />
                                <Title title={this.props.title} />
                                <PostTimeAgo time={this.props.time} />
                                <Divider />
                                <Description
                                    description={this.props.description}
                                />
                                <Image src={this.props.image} />
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Badge
                                max={999}
                                badgeContent={this.props.replies}
                                {...{
                                    color: 'secondary',
                                    children: <CommentIcon />
                                }}
                            />
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

export { Thread, ThreadProps };
