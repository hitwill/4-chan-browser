import * as React from 'react';

interface ThreadProps {
    time: number;
    number: number;
    name: string; 
    id: string;
    country: string;
    title: string; 
    description: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    replies: number;
}

const Title = (title: { title: string }) => {
    return <span className="card-title">{title.title}</span>;
};

const Image = (image: { src: string }) => {
    return <img className="image" src={image.src} />;
};

const Description = (description: { description: string }) => {
    return <p className="description">{description.description}</p>;
};

class Thread extends React.Component<ThreadProps> {
    constructor(props: Readonly<ThreadProps>) {
        super(props);
    }

    render() {
        return (
            <div key={this.props.number.toString()} className="row thread">
                <div className="col s12 m7">
                    <div className="card">
                        <div className="card-image">
                            <Image src={this.props.image} />
                        </div>
                        <Title title={this.props.title} />
                        <div className="card-content">
                            <Description description={this.props.description} />
                        </div>
                        <div className="card-action">
                            <a href="#">This is a link</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { Thread, ThreadProps };
