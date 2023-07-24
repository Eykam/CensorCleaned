import React, { useState, useRef, SyntheticEvent, useEffect } from "react";
import { componentIDs } from "../store/features/formSlice";
import "../css/submitForm.css";
import Toggle from "./toggle";
import {
  urlToFile,
  sendFile,
  RequestStates,
  fetchTranscription,
} from "../store/features/dataSlice";
import { useAppSelector, useAppDispatch } from "../store/store";
import { FileUpload } from "../store/features/fileSlice";
import { Mode } from "../store/features/dataSlice";

const SubmitSettings = () => {
  //Constants
  const selectedStyle = { backgroundColor: "#ececec", color: "#3d3d3d" };
  const unselectedStyle = { backgroundColor: "#3d3d3d", color: "#ececec" };
  const dispatch = useAppDispatch();

  //States
  const [mode, setMode] = useState<Mode>(Mode.auto);
  const [settingsView, setSettingsView] = useState(false);
  const [currFile, setCurrFile] = useState<File | null>(null);
  const fetchData = useAppSelector((state) => state.data);
  const currFileUpload: FileUpload | null = useAppSelector(
    (state) => state.file.uploadedFile
  );

  //Refs
  const autoRef = useRef<HTMLButtonElement>(null);
  const manualRef = useRef<HTMLButtonElement>(null);
  const advSettingsRef = useRef<HTMLButtonElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLTextAreaElement>(null);

  //Functions and Event Handlers
  const toggleMode = (e: SyntheticEvent) => {
    const event = e.target as HTMLButtonElement;

    if (event.id === "manualButton") {
      setMode(Mode.manual);
    } else if (event.id === "autoButton") {
      setMode(Mode.auto);
    }
  };

  const toggleSettings = () => {
    setSettingsView((prev) => !prev);
  };

  const submitFunction = async () => {
    if (currFileUpload) {
      console.log("Submitting: ", currFileUpload);
      let currFile = await urlToFile(currFileUpload);
      if (currFile != null && !(currFile instanceof Error))
        setCurrFile(currFile);
      else console.log("file is either null or threw an error");
    }
  };

  useEffect(() => {
    if (currFile !== null && fetchData.sendFile.status === RequestStates.idle) {
      dispatch(sendFile(currFile));
    }
  }, [currFile, fetchData.sendFile.status, dispatch]);

  useEffect(() => {
    if (
      fetchData.sendFile.status === RequestStates.success &&
      fetchData.transcription.status === RequestStates.idle
    ) {
      console.log("Moving to transcription...");
      // dispatch(fetchTranscription(mode));
    }
  }, [
    fetchData.sendFile.status,
    fetchData.transcription.status,
    mode,
    dispatch,
  ]);

  useEffect(() => {
    if (mode === "auto") {
      if (advSettingsRef.current)
        advSettingsRef.current.style.display = "block";

      if (manualRef.current) {
        manualRef.current.style.backgroundColor =
          unselectedStyle.backgroundColor;
        manualRef.current.style.color = unselectedStyle.color;
        manualRef.current.disabled = false;
      }

      if (autoRef.current) {
        autoRef.current.style.backgroundColor = selectedStyle.backgroundColor;
        autoRef.current.style.color = selectedStyle.color;
        autoRef.current.disabled = true;
      }
    } else if (mode === "manual") {
      setSettingsView(false);
      if (advSettingsRef.current) advSettingsRef.current.style.display = "none";

      if (manualRef.current) {
        manualRef.current.style.backgroundColor = selectedStyle.backgroundColor;
        manualRef.current.style.color = selectedStyle.color;
        manualRef.current.disabled = true;
      }

      if (autoRef.current) {
        autoRef.current.style.backgroundColor = unselectedStyle.backgroundColor;
        autoRef.current.style.color = unselectedStyle.color;
        autoRef.current.disabled = false;
      }
    }
  }, [
    mode,
    selectedStyle.backgroundColor,
    selectedStyle.color,
    unselectedStyle.backgroundColor,
    unselectedStyle.color,
  ]);

  return (
    <Toggle id={componentIDs.formSettings}>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "75%",
          }}
        >
          <button
            className="audio-side-buttons-auto"
            id="autoButton"
            onClick={toggleMode}
            ref={autoRef}
          >
            <b>Automatic</b>
          </button>

          <button
            className="audio-side-buttons-manual"
            id="manualButton"
            onClick={toggleMode}
            ref={manualRef}
          >
            <b>Manual</b>
          </button>

          <button
            className="audio-side-buttons"
            onClick={toggleSettings}
            ref={advSettingsRef}
          >
            <b>Advanced Settings</b>
          </button>
        </div>

        <button
          className="audio-side-buttons"
          ref={submitRef}
          onClick={submitFunction}
          //   disabled={loading ? true : false}
        >
          <b>Submit</b>
        </button>
      </div>

      {settingsView && (
        <div className="settings-outer">
          <p className="settings-inner">
            Enter words you'd like to filter, separated by commas
            <br />
            <br />
            <b style={{ display: "flex", justifyContent: "center" }}>
              Example: one, two, three
            </b>
          </p>
          <textarea
            ref={filterRef}
            className="settings-textarea"
            // onChange={updateFilter}
          ></textarea>
        </div>
      )}
    </Toggle>
  );
};

export default SubmitSettings;
