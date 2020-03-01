import * as React from 'react';

interface PostData {
    key: number;
    title: string;
    description: string;
    image: string;
}


const Title = (title: { title: string; }) => {
    console.log(this);
    return <span className='title'>{title.title}</span>;
};

const Image = (image: {src: string}) => {
    return <img className='image' src={image.src} />;
};

const Description = (description: {description: string}) => {
    return <span className='Description'>{description.description}</span>;
};

const Post = (post: PostData) => {
    return (
        <div key={post.key} className='post'>
            <Title title={post.title} />
            <Image src={post.image} />
            <Description description={post.description} />
        </div>
    );
};

export default Post;
