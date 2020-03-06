import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Pages from './Pages';

class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                {<Pages />}
            </React.Fragment>
        );
    }
}

export default App;
