import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { TextManager } from '../helpers/TextManager';
import Link from '@material-ui/core/Link';


class ThreadText extends React.Component<{ description: string }> {
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


export { ThreadText  };
