import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props: any) {
    return <MuiAlert action="" elevation={6} variant="filled" {...props} />;
}

const Toast = (props: { message: string }) => {
    const [state, setState] = React.useState({
        open: true,
        vertical: 'top' as 'top',
        horizontal: 'center' as 'center'
    });

    let vertical = 'top' as 'top';
    let horizontal = 'center' as 'center';

    const SnackbarOrigin = {
        vertical: vertical,
        horizontal: horizontal
    };

    const handleClose = (event: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setState({ ...state, open: false });
    };

    return (
        <Snackbar
            open={state.open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={SnackbarOrigin}
        >
            <Alert onClose={handleClose} severity="success">
                {props.message}
            </Alert>
        </Snackbar>
    );
};
export default Toast;
