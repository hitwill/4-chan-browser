class TextManager {
    constructor(text: string) {
        this.text = text;
        this.links = [];
        this.divider = '[xxx]';
    }
    text: string;
    links: string[];
    divider: string;

    getExtractedLinks() {
        return this.links;
    }

    extractLinks() {
        let $this = this;
        let text = $this.text;
        text = text.replace(/newline/g, '\n') //add a new line where <br> was
        text = text.replace(/http/g, ' http');
        text = text.replace(/\.www/g, '. www');
        let unlinked: string = (text || '').replace(
            /(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/gim,
            function(link: string, space: any, paragraph: string) {
                if (
                    link.indexOf('http') != 0 &&
                    link.indexOf('www') != 0 &&
                    link.indexOf('.http') != 0 &&
                    link.indexOf('.https') != 0 &&
                    link.indexOf('.www') != 0
                )
                    return link; //false positive

                $this.links.push(link);
                return ' ' + $this.divider;
            }
        );

        return unlinked;
    }

    shorten(url: string) {
        let urlLength = 20;
        return (
            url
                .replace(/(^\w+:|^)\/\//, '')
                .replace('www.', '')
                .slice(0, 20) + (url.length > urlLength ? '…' : '')
        );
    }
}

export { TextManager };
