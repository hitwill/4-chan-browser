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
        let unlinked: string = (text || '').replace(
            /(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/gim,
            function(link: string, space: any, paragraph: string) {
                if (!link.match('^https?://')) {
                    link = 'http://' + link;
                }

                $this.links.push(link);
                return '\n'+$this.divider;
            }
        );

        return unlinked;
    }

    shorten(url: string) {
        let urlLength = 20;
        return (
            url.replace(/(^\w+:|^)\/\//, '').slice(0, 20) +
            (url.length > urlLength ? '…' : '')
        );
    }
}

export { TextManager };
