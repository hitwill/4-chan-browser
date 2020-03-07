import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Pages from './Pages';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

function HideOnScroll(props: { children: any; window: any }) {
    const { children, window } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <HideOnScroll {...this.props.children} {...window}>
                    <AppBar>
                        <Toolbar>
                            <Typography variant="h6" component="span">
                                <Typography variant="h6"  component="span">Pol</Typography>
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </HideOnScroll>
                <Toolbar />
                <Pages />
            </React.Fragment>
        );
    }
}

export default App;
