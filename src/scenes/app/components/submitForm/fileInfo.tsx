import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import Toggle from "../../../utils/components/toggle";
import { componentIDs } from "../../../../store/features/formSlice";
import { RequestStates } from "../../../../store/features/dataSlice";
import Loading from "../../../utils/components/loading";

const FileInfo = () => {
  const dispatch = useAppDispatch();

  const file = useAppSelector((state) => state.file.uploadedFile);

  const censoredStatus = useAppSelector(
    (state) => state.data.censorship.status
  );

  const censoredUrl = useAppSelector(
    (state) => state.data.censorship.censorURL
  );

  const checkIfPending = () => {
    return censoredStatus === RequestStates.pending;
  };

  const checkIFSmallLaptop = () => {
    return window.innerWidth <= 1500;
  };

  useEffect(() => {
    const censorLoader = document.getElementById(
      "loading-censor"
    ) as HTMLDivElement;

    if (censoredStatus === RequestStates.pending && censoredUrl === "") {
      censorLoader.style.display = "block";
    } else if (censoredStatus === RequestStates.success && censoredUrl === "") {
      censorLoader.style.display = "none";
    }
  }, [dispatch, censoredStatus, censoredUrl]);

  return (
    <Toggle id={componentIDs.fileInfo}>
      <div
        id="file-info-div"
        style={{
          width: "100%",
          display: "block",
        }}
      >
        <div style={{ width: "fit-content", minWidth: "40vw" }}>
          <h3 style={{ marginTop: "0" }}>Submission Details:</h3>

          <p style={{ display: "flex", maxWidth: "80%" }}>
            <b>File Name:</b> {file?.fileName}
          </p>

          <p>
            <b>File Type:</b> {file?.fileType}
          </p>

          <p>
            <b>File Size:</b> {file?.fileSize}
          </p>

          <Loading loaderId="censor" />
        </div>

        <br />

        <div
          id="uploaded-content"
          style={checkIfPending() ? { display: "none" } : { display: "block" }}
        >
          {file && file.fileType.includes("audio") ? (
            <audio
              controls
              src={file.fileUrl}
              style={{
                width: "100%",
                borderRadius: "5px",
                marginTop: "auto",
              }}
            />
          ) : (
            <video
              controls
              id="uploaded-video"
              autoPlay
              src={file?.fileUrl}
              style={{
                width: "100%",
                borderRadius: "5px",
                marginTop: "auto",
              }}
            />
          )}
        </div>

        <br />
      </div>
    </Toggle>
  );
};

export default FileInfo;
