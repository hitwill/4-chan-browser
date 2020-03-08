import * as React from 'react';
import Chip from '@material-ui/core/Chip';

interface FollowProps {
    id: string;
    isFollowed: boolean;
}

interface FollowState {
    id: string;
    isFollowed: boolean;
}

class FollowUser extends React.Component<FollowProps, FollowState> {
    constructor(props: Readonly<FollowProps>) {
        super(props);
        this.state = {
            id: this.props.id,
            isFollowed: this.props.isFollowed
        };
    }

    handleFollow(id: string) {
        console.log('following');
        console.log(this);
        console.log(id);
        let isFollowed: boolean = !this.state.isFollowed;
        this.setState({ isFollowed: isFollowed });
    }

    render() {
        let classes;
        if (this.state.isFollowed) {
            classes = 'follow-user followed-user';
        } else {
            classes = 'follow-user muted';
        }
        return (
            <Chip
                data-user-id={this.props.id}
                className={classes}
                label={this.state.isFollowed ? 'Following' : 'Follow'}
                clickable
                variant={this.state.isFollowed ? 'default' : 'outlined'}
                size="small"
                onClick={this.handleFollow.bind(this, this.props.id)}
            />
        );
    }
}

export default FollowUser;
