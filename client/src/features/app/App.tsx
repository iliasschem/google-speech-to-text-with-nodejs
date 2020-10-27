import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import FileUpload from '../audioToText/FileUpload';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '100px 400px',
    },
  }),
);
function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FileUpload />
    </div>
  );
}

export default App;
