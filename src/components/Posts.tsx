import * as React from 'react';
import Post from './Post';

class Posts extends React.Component {
    render() {
        const posts = [
            {
                key: 0,
                title: 'Charlie',
                description: 'Janitor',
                image: 'https://i.4cdn.org/pol/1582967448973s.jpg'
            },
            {
                key: 1,
                title: 'Mac',
                description: 'Bouncer',
                image: 'https://i.4cdn.org/pol/1582967448973s.jpg'
            },
            {
                key: 2,
                title: 'Dee',
                description: 'Aspring actress',
                image: 'https://i.4cdn.org/pol/1582967448973s.jpg'
            },
            {
                key: 3,
                title: 'Dennis',
                description: 'Bartender',
                image: 'https://i.4cdn.org/pol/1582967448973s.jpg'
            }
        ];
        return posts.map((post, i) => <Post {...post} />);
    }
}

export default Posts;
