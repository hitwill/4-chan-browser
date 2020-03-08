import * as React from 'react';
import Chip from '@material-ui/core/Chip';
import Toast from './Toast';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props: any) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface FollowProps {
    id: string;
}

interface FollowState {
    id: string;
    isFollowed: boolean;
}

class FollowButton extends React.Component<FollowProps, FollowState> {
    constructor(props: Readonly<FollowProps>) {
        super(props);

        this.state = {
            id: this.props.id,
            isFollowed: this.userIsFollowed(this.props.id)
        };
    }

    justfollowed = false;
    userIsFollowed(userId: string): boolean {
        return true;
    }

    handleFollow(id: string) {
        let isFollowed: boolean = !this.state.isFollowed;
        this.setState({ isFollowed: isFollowed });
        if (isFollowed) {
            this.justfollowed = true;
        } else {
            this.justfollowed = false;
        }
    }

    render() {
        let classes;
        let message = 'Posts from ' + this.props.id + ' will show up on top.';
        if (this.state.isFollowed) {
            classes = 'follow-user followed-user';
        } else {
            classes = 'follow-user muted';
        }
        return (
            <span>
                {this.justfollowed ? <Toast message={message} /> : null}
                <Chip
                    data-user-id={this.props.id}
                    className={classes}
                    label={this.state.isFollowed ? 'Following' : 'Follow'}
                    clickable
                    variant={this.state.isFollowed ? 'default' : 'outlined'}
                    size="small"
                    onClick={this.handleFollow.bind(this, this.props.id)}
                />
            </span>
        );
    }
}

export default FollowButton;
