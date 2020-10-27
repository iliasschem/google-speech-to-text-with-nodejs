import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, gql, useSubscription } from '@apollo/client';
import Paper from '@material-ui/core/Paper';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: (props: {loader: boolean}) => ({
      backgroundColor: props.loader ? 'grey' : 'white'
    }),
    dragAndDrop: {
      margin: 0,
      minHeight: 400,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '5px 10px #888888',
      cursor: 'pointer',
    },
    loader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }
  }),
);

const TEXT_SUBSCRIPTION = gql`
  subscription OnTextGenerated {
    textGenerated {
      text
    }
  }
`;


const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      text
    }
  }
`;

// pass in the UploadMutation mutation we created earlier.
const FileUpload = () => {
  const [loader, setLoader] = useState(false);
  const [uploadFile] = useMutation(UPLOAD_FILE);

  const dataReceived = () => {
    setLoader(false);
  }

  const { data: text } = useSubscription(
    TEXT_SUBSCRIPTION,
    {onSubscriptionData: dataReceived},
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      uploadFile({
        variables: {file},
      });
      setLoader(true);
    },
    [uploadFile]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
});

const classes = useStyles({loader});

return (
  <>
   <Paper className={classes.paper}>
        <div {...getRootProps()} className={`dropzone ${isDragActive && "isActive"}`}>
          <input {...getInputProps()} multiple={false} disabled={loader}/>
          {isDragActive ? <p>Drop the files here ...</p> : <p className={classes.dragAndDrop}>Drag 'n' drop file here, or click to select file</p>}
        </div>
    </Paper>

    <div>
      <h3>
        Result: 
      </h3>
        {!loader && text && text.textGenerated &&
          <p>{text.textGenerated.text}</p>
        }
        {loader &&
          <div className={classes.loader}>
            <CircularProgress /> <br />
            <p>Please wait ....</p>
          </div>
        }
        
    </div>
  </>
);
};
export default FileUpload;