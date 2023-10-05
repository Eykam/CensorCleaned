import React, { useEffect } from "react";
import Toggle from "./toggle";
import "../css/submitForm.css";
import { componentIDs } from "../store/features/formSlice";
import { RequestStates, fetchCensorship } from "../store/features/dataSlice";
import { useAppSelector, useAppDispatch } from "../store/store";
import { hideFileInfo } from "../store/features/formSlice";

const TimestampSubmit = () => {
  const dispatch = useAppDispatch();

  const badWords = useAppSelector((state) => state.data.censorship.censorList);
  const originalFilename = useAppSelector(
    (state) => state.file.uploadedFile?.fileName
  );
  const filename = useAppSelector(
    (state) => state.data.sendFile.response?.body.uuid
  );
  const censoredStatus = useAppSelector(
    (state) => state.data.censorship.status
  );
  const censoredURLObject = useAppSelector(
    (state) => state.data.censorship.censorURL
  );

  const submit = () => {
    console.log("Clicked Submit");
    if (
      badWords != null &&
      badWords !== undefined &&
      Object.keys(badWords).length > 0
    ) {
      if (filename !== undefined) {
        // const transcribedCheckbox = document.getElementById(
        //   "transcribed-checkbox"
        // ) as HTMLInputElement;
        // const selectedCheckbox = document.getElementById(
        //   "selected-checkbox"
        // ) as HTMLInputElement;

        // if (!transcribedCheckbox.checked) transcribedCheckbox.click();

        // if (!selectedCheckbox.checked) selectedCheckbox.click();
        dispatch(
          fetchCensorship({
            filename: filename,
            badWords: badWords,
          })
        );
      }
    }
  };

  const download = () => {
    let link = document.createElement("a");
    link.download =
      originalFilename !== undefined
        ? "censored-" + originalFilename
        : "censored-video";
    link.href = censoredURLObject;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const checkBrowser = () => {
    return window.matchMedia("(max-width: 767px)").matches;
  };

  useEffect(() => {
    if (censoredStatus === RequestStates.success) {
      dispatch(hideFileInfo());

      if (!checkBrowser() && Notification.permission)
        new Notification("Censoring Complete!\nFile is Ready for Download");

      const submitButton = document.getElementById(
        "submit-button-censor"
      ) as HTMLButtonElement;
      const downloadButton = document.getElementById(
        "download-button-censor"
      ) as HTMLAnchorElement;

      submitButton.innerHTML = "Resubmit";
      submitButton.style.marginLeft = "0%";

      downloadButton.style.display = "flex";
      downloadButton.href = censoredURLObject;
    }
  }, [dispatch, censoredStatus, censoredURLObject]);

  return (
    <Toggle id={componentIDs.timestampSubmit}>
      <div
        style={
          checkBrowser()
            ? {
                marginTop: ".5%",
                width: "100%",
                display: "flex",
                justifyContent: "right",
              }
            : {
                marginLeft: "auto",
                marginTop: "3%",
                width: "50%",
                minWidth: "40vw",
                display: "flex",
                justifyContent: "right",
              }
        }
      >
        <button
          className="audio-side-buttons"
          id="submit-button-censor"
          style={{
            marginLeft: "auto",
            fontWeight: "bold",
            width: "47.5%",
            color: "rgb(70,70,70)",
          }}
          onClick={submit}
        >
          Submit
        </button>

        <button
          className="audio-side-buttons"
          id="download-button-censor"
          style={{
            fontWeight: "bold",
            width: "47.5%",
            display: "none",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "2.5%",
            color: "rgb(70,70,70)",
          }}
          onClick={download}
        >
          Download
        </button>
      </div>
    </Toggle>
  );
};

export default TimestampSubmit;
