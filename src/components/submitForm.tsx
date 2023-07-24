import React, { SyntheticEvent } from "react";
import "../css/submitForm.css";
import Toggle from "./toggle";
import FileInfo from "./fileInfo";
import {
  componentIDs,
  hideFileInfo,
  showFileInput,
} from "../store/features/formSlice";
import { deleteFile } from "../store/features/fileSlice";
import { useAppDispatch } from "../store/store";
import SubmitSettings from "./submitSettings";
import AudioWave from "./audioWave";
import ManualResults from "./manualResults";

const SubmitForm = () => {
  const dispatch = useAppDispatch();

  const back = (e: SyntheticEvent) => {
    dispatch(hideFileInfo());
    dispatch(showFileInput());
    dispatch(deleteFile());
  };

  return (
    <Toggle id={componentIDs.fileInfo}>
      <div id="submit-form">
        <button onClick={back} id="back-button">
          &larr;
        </button>
        <div style={{ display: "flex" }}>
          <h1>Analyzing Audio</h1>
          <AudioWave />
        </div>

        <FileInfo />
        <SubmitSettings />
        <ManualResults />
      </div>
    </Toggle>
  );
};

export default SubmitForm;
