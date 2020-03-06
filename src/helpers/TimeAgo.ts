class TimeAgo {
    templates: {
        prefix: string;
        suffix: string;
        seconds: string;
        minute: string;
        minutes: string;
        hour: string;
        hours: string;
        day: string;
        days: string;
        month: string;
        months: string;
        year: string;
        years: string;
    };
    time: number;

    constructor(time: number) {
        this.time = time;
        this.templates = {
            prefix: '',
            suffix: ' ago',
            seconds: 'less than a minute',
            minute: 'a minute',
            minutes: '%d minutes',
            hour: 'an hour',
            hours: '%d hours',
            day: 'a day',
            days: '%d days',
            month: 'a month',
            months: '%d months',
            year: 'a year',
            years: '%d years'
        };
    }

    template = function(t: string, n: number) {
        return (
            this.templates[t] && this.templates[t].replace(/%d/i, Math.abs(Math.round(n)))
        );
    };

    getMoments = function() {
        let time = this.time.toString();
        if (!time) return;
        time = time.replace(/\.\d+/, ''); // remove milliseconds
        time = time.replace(/-/, '/').replace(/-/, '/');
        time = time.replace(/T/, ' ').replace(/Z/, ' UTC');
        time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2'); // -04:00 -> -0400
        time = new Date(time * 1000 || time);

        var now = new Date();
        var seconds = ((now.getTime() - time) * 0.001) >> 0;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;
        var years = days / 365;

        return (
            this.templates.prefix +
            ((seconds < 45 && this.template('seconds', seconds)) ||
                (seconds < 90 && this.template('minute', 1)) ||
                (minutes < 45 && this.template('minutes', minutes)) ||
                (minutes < 90 && this.template('hour', 1)) ||
                (hours < 24 && this.template('hours', hours)) ||
                (hours < 42 && this.template('day', 1)) ||
                (days < 30 && this.template('days', days)) ||
                (days < 45 && this.template('month', 1)) ||
                (days < 365 && this.template('months', days / 30)) ||
                (years < 1.5 && this.template('year', 1)) ||
                this.template('years', years)) +
            this.templates.suffix
        );
    };
}

export {TimeAgo};