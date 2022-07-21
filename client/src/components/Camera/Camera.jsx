import React, { useState } from "react";
import Webcam from "react-webcam";
import './camera.css'
import {CameraAlt} from '@material-ui/icons';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const WebcamCapture = ({setIsCam, handleFileInputCameraChange}) => {
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      handleFileInputCameraChange(imageSrc)
      setIsCam(false)
    },
    [webcamRef]
  );

  return (
    <>
    <div className="overlay" onClick={() => setIsCam(false)}></div>
    <div className="webcamContainer">
      <Webcam
        audio={false}
        height={600}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={600}
        videoConstraints={videoConstraints}
      />
      <button className="camBtn" onClick={capture}><CameraAlt /></button>
    </div>
    </>
  );
};

export default WebcamCapture