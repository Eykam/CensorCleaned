import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import Toggle from "../../../utils/components/toggle";
import { componentIDs } from "../../../../store/features/formSlice";
import { RequestStates } from "../../../../store/features/dataSlice";
import Loading from "../../../utils/components/loading";

const FileInfo = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const file = useAppSelector((state) => state.file.uploadedFile);
  const transcriptionStatus = useAppSelector(
    (state) => state.data.transcription.status
  );

  const checkIfPending = () => {
    return transcriptionStatus === RequestStates.pending;
  };

  useEffect(() => {
    if (transcriptionStatus === RequestStates.pending) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [dispatch, transcriptionStatus]);

  return (
    <Toggle id={componentIDs.fileInfo}>
      <div
        id="file-info-div"
        style={{
          width: "100%",
          display: "block",
        }}
      >
        <div style={{ width: "40vw" }}>
          <h3 style={{ marginTop: "0" }}>Submission Details:</h3>

          <span
            style={{
              display: "block",
              maxWidth: "50%",
              // textOverflow: "ellipsis",
              // overflow: "hidden",
            }}
          >
            <b>File Name:</b>{" "}
            {file?.fileName && file?.fileName.length > 30
              ? file?.fileName.slice(0, 14) + "..."
              : file?.fileName}
          </span>

          <p>
            <b>File Type:</b> {file?.fileType}
          </p>

          <p>
            <b>File Size:</b> {file?.fileSize}
          </p>

          {loading && <Loading loaderId="transcribe" />}
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
