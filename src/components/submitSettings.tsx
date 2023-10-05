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
import ProgressBar from "./progressBar";
import { socket } from "../socket";

const SubmitSettings = () => {
  //Constants
  const selectedStyle = { backgroundColor: "#ececec", color: "#3d3d3d" };
  const unselectedStyle = { backgroundColor: "#3d3d3d", color: "#ececec" };
  const dispatch = useAppDispatch();

  //States
  const [mode, setMode] = useState<Mode>(Mode.auto);
  const [progress, setProgress] = useState<number>(0);

  const [currFile, setCurrFile] = useState<File | null>(null);
  const fetchData = useAppSelector((state) => state.data);
  const currFileUpload: FileUpload | null = useAppSelector(
    (state) => state.file.uploadedFile
  );
  const pending = useAppSelector((state) => state.data.transcription.status);

  //Refs
  const autoRef = useRef<HTMLButtonElement>(null);
  const manualRef = useRef<HTMLButtonElement>(null);
  const advSettingsRef = useRef<HTMLButtonElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  //Functions and Event Handlers
  const submitFunction = async () => {
    if (currFileUpload) {
      console.log("Submitting: ", currFileUpload);
      let currFile = await urlToFile(currFileUpload);
      if (currFile != null && !(currFile instanceof Error)) {
        setCurrFile(currFile);
        if (submitRef.current) submitRef.current.style.display = "none";
      } else console.log("file is either null or threw an error");
    }
  };

  //UseEffect to trigger sendFile thunk when currFile is transformed into a file successfully
  useEffect(() => {
    if (currFile !== null && fetchData.sendFile.status === RequestStates.idle) {
      dispatch(sendFile(currFile));
    }
  }, [currFile, fetchData.sendFile.status, dispatch]);

  //UseEffect to trigger fetchTranscription api call when sendFile has been executed successfully
  useEffect(() => {
    if (
      fetchData.sendFile.status === RequestStates.success &&
      fetchData.transcription.status === RequestStates.idle &&
      fetchData.sendFile.response !== undefined
    ) {
      console.log("Moving to transcription...");

      socket.emit("uploadedFile", fetchData.sendFile.response.body.uuid);

      dispatch(
        fetchTranscription({
          mode: mode,
          uuid: fetchData.sendFile.response.body.uuid,
        })
      );
      updateProgress();
    } else {
    }
  }, [
    fetchData.sendFile.status,
    fetchData.sendFile.response,
    fetchData.transcription.status,
    mode,
    dispatch,
  ]);

  useEffect(() => {
    if (mode === Mode.auto) {
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
    } else if (mode === Mode.manual) {
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

  const updateProgress = async function () {
    var secondsRan = 0.0;
    var interval = setInterval(function () {
      secondsRan += 1.0;
      if (currFile && currFile !== undefined) {
        var percentage = ((secondsRan * 1.25 * 1000000) / currFile.size) * 100;

        if (percentage < 100) {
          setProgress(percentage);
        } else {
          clearInterval(interval);
        }
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <Toggle id={componentIDs.formSettings}>
      <div style={{ width: "100%", marginTop: "4%" }}>
        <button
          className="audio-side-buttons"
          style={{ float: "right", color: "rgb(70,70,70)" }}
          ref={submitRef}
          onClick={submitFunction}
          disabled={
            pending === RequestStates.pending ||
            pending === RequestStates.success
              ? true
              : false
          }
        >
          <b>Submit</b>
        </button>
      </div>

      {fetchData.transcription.status === "pending" ? (
        <div style={{ width: "100%", marginTop: "2%" }}>
          <ProgressBar bgColor={"#ececec"} completed={progress} />
        </div>
      ) : (
        <></>
      )}
    </Toggle>
  );
};

export default SubmitSettings;
