import React from "react";

import { FileUpload } from "../../../../store/features/fileSlice";

const FileDetails = ({ file }: { file: FileUpload | null }) => {
  return (
    <div style={{ padding: "2%" }}>
      <h3 style={{ marginTop: "0" }}>Submission Details</h3>

      <p>
        <b>File Name:</b> {file?.fileName}
      </p>

      <p>
        <b>File Type:</b> {file?.fileType}
      </p>

      <p>
        <b>File Size:</b> {file?.fileSize}
      </p>
    </div>
  );
};

export default FileDetails;
