import React from "react";
import { useAppSelector } from "../store/store";

const FileInfo = () => {
  const file = useAppSelector((state) => state.file.uploadedFile);

  return (
    <div id="submit-form">
      <h3>Submission Details:</h3>

      <p>
        <b>File Name:</b> {file?.fileName}
      </p>

      <p>
        <b>File Type:</b> {file?.fileType}
      </p>

      <p>
        <b>File Size:</b> {file?.fileSize}
      </p>

      {file && file.fileType.includes("audio") ? (
        <audio controls src={file.fileUrl} style={{ width: "100%" }} />
      ) : (
        <video
          controls
          src={file?.fileUrl}
          style={{ width: 848, height: 477, borderRadius: "15px" }}
        />
      )}

      <br />
    </div>
  );
};

export default FileInfo;
