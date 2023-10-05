import React, { SyntheticEvent, useEffect, useRef } from "react";
import "../css/submitForm.css";
import Toggle from "./toggle";
import FileInfo from "./fileInfo";
import {
  componentIDs,
  hideFileInfo,
  showFileInfo,
} from "../store/features/formSlice";

import { useAppDispatch, useAppSelector } from "../store/store";
import SubmitSettings from "./submitSettings";
import AudioWave from "./audioWave";
import ManualResults from "./manualResults";
import TimestampSubmit from "./timestampSubmit";
import CensoredVideo from "./censoredVideo";
import { RequestStates } from "../store/features/dataSlice";
import Loading from "./loading";

const SubmitForm = () => {
  const dispatch = useAppDispatch();

  const transcriptionStatus = useAppSelector(
    (state) => state.data.transcription.status
  );

  const back = (e: SyntheticEvent) => {
    window.location.reload();
  };

  const checkBrowser = () => {
    return window.matchMedia("(max-width: 767px)").matches;
  };

  const askNotificationPermission = (e: SyntheticEvent) => {
    // function to actually ask the permissions
    const handlePermission = (permission: NotificationPermission) => {
      // set the button to shown or hidden, depending on what the user answers
      (e.target as HTMLButtonElement).style.display =
        Notification.permission === "granted" ? "none" : "block";
    };

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
    } else {
      Notification.requestPermission().then((permission) => {
        handlePermission(permission);
      });
    }
  };

  useEffect(() => {
    dispatch(showFileInfo());
  });

  useEffect(() => {
    const uploadedVideo = document.getElementById(
      "uploaded-video"
    ) as HTMLVideoElement;
    const loading = document.getElementById(
      "loading-transcribe"
    ) as HTMLDivElement;

    if (
      transcriptionStatus === RequestStates.success ||
      transcriptionStatus === RequestStates.error
    ) {
      loading.style.display = "none";
      uploadedVideo.style.display = "block";
    }
    if (transcriptionStatus === RequestStates.pending) {
      if (uploadedVideo != null) {
        uploadedVideo.pause();
        uploadedVideo.style.display = "none";
      }
      if (loading != null) loading.style.display = "block";
    }
  }, [transcriptionStatus]);

  return (
    <Toggle id={componentIDs.submitForm}>
      {checkBrowser() ? (
        <div id="submit-form" className="mobile-submit-form ">
          <div
            style={{
              display: "flex",
              paddingTop: "0%",
            }}
          >
            {/* <button
              onClick={back}
              id="back-button"
              style={{
                paddingLeft: "0px",
                marginRight: "0%",
                marginBottom: "2%",
              }}
            >
              &larr;
            </button> */}

            <h1>Analyzing Audio</h1>
            <AudioWave />
          </div>

          <div style={{ display: "block" }}>
            <FileInfo />

            <CensoredVideo />

            <ManualResults mobile={true} />
          </div>
          <Loading loaderId="transcribe" />
          <SubmitSettings />

          <TimestampSubmit />
          <br />
        </div>
      ) : (
        <div
          id="submit-form"
          className="submit-form form-outer"
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "40vw",
            minWidth: "40vw",
            maxHeight: "fit-content",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={back}
              id="back-button"
              style={{ display: "flex", marginRight: "2%" }}
            >
              &larr;
            </button>

            <h1>Analyzing Audio</h1>
            <AudioWave />

            <button
              style={{
                marginLeft: "auto",
                background: "rgb(100, 100, 100)",
                borderRadius: "7px",
                borderStyle: "solid",
                border: "none",
                color: "LightGrey",
                padding: "1%",
              }}
              onClick={(e) => {
                askNotificationPermission(e);
              }}
            >
              Notify Me
            </button>
          </div>

          <div
            style={{
              display: "flex",
              height: "75%",
              margin: "0 auto",
              maxWidth: "100%",
              minWidth: "100%",
            }}
          >
            <FileInfo />

            <CensoredVideo />
            <ManualResults mobile={false} />
          </div>

          <Loading loaderId="transcribe" />

          <SubmitSettings />

          <TimestampSubmit />
        </div>
      )}
    </Toggle>
  );
};

export default SubmitForm;
