import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props: any) {
    return <MuiAlert action="" elevation={6} variant="filled" {...props} />;
}

 const Toast  = (props : {message : string}) => {
    const [open, setOpen] = React.useState(true);
    
    const handleClose = (event: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar  open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="info">
                {props.message}
            </Alert>
        </Snackbar>
    );
}
export default Toast;
