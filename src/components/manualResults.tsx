import React, { useEffect, useState } from "react";
import Toggle from "./toggle";
import { componentIDs, showManualResults } from "../store/features/formSlice";
import "../css/manualResults.css";

import { TranscriptionResponse } from "../store/features/dataSlice";
import { useAppSelector, useAppDispatch } from "../store/store";
import WordSelector from "./wordSelector";
import SelectedWords from "./selectedWords";

const ManualResults = ({ mobile }: { mobile: boolean }) => {
  const [transcriptionText, setTranscriptionText] = useState("");
  const [elapsedtimeText, setElapsedTime] = useState("");
  const [currWords, setWords] = useState<{
    [index: string]: number[][];
  } | null>(null);

  const dispatch = useAppDispatch();

  const transcriptionResponse: TranscriptionResponse | undefined =
    useAppSelector((state) => state.data.transcription.response);

  const hideWordSelectors = (container: string) => {
    if (container === "transcribed") {
      const transcribedInput = document.getElementById(
        "transcribed-checkbox"
      ) as HTMLInputElement;
      const transcribedExpanded = document.getElementById(
        "word-selector"
      ) as HTMLDivElement;
      const transcribedExpander = document.getElementById(
        "transcribed-show"
      ) as HTMLSpanElement;
      const transcribedOuter = document.getElementById(
        "transcribed-words"
      ) as HTMLDivElement;

      if (transcribedInput.checked) {
        transcribedExpanded.style.display = "none";
        transcribedExpander.innerText = "[+]";
        transcribedOuter.style.height = "4vh";
      } else {
        transcribedExpanded.style.display = "block";
        transcribedExpander.innerText = "[-]";
        transcribedOuter.style.height = "100%";
      }
    } else if (container === "selected") {
      const selectedInput = document.getElementById(
        "selected-checkbox"
      ) as HTMLInputElement;
      const selectedExpanded = document.getElementById(
        "selected-words"
      ) as HTMLDivElement;
      const selectedExpander = document.getElementById(
        "selected-show"
      ) as HTMLSpanElement;
      const selectedOuter = document.getElementById(
        "selected-words-outer"
      ) as HTMLDivElement;

      if (selectedInput.checked) {
        selectedExpanded.style.display = "none";
        selectedExpander.innerText = "[+]";
        selectedOuter.style.height = "4vh";
      } else {
        selectedExpanded.style.display = "block";
        selectedExpander.innerText = "[-]";
        selectedOuter.style.height = "100%";
      }
    }
  };

  useEffect(() => {
    if (mobile) {
      const selectedWordsDiv = document.getElementById(
        "selected-words"
      ) as HTMLDivElement;
      const transcribedWordsDiv = document.getElementById(
        "transcribed-words"
      ) as HTMLDivElement;

      if (selectedWordsDiv != null && selectedWordsDiv !== undefined) {
        selectedWordsDiv.style.width = "100%";
        selectedWordsDiv.style.height = "50%";
      }

      if (transcribedWordsDiv != null && selectedWordsDiv !== undefined) {
        transcribedWordsDiv.style.width = "100%";
        transcribedWordsDiv.style.height = "50%";
      }
    }
  }, [mobile]);

  useEffect(() => {
    let transcribed = "";
    let words: { [index: string]: number[][] } | null = null;

    const showTranscription = () => {
      if (
        transcriptionResponse?.data !== undefined &&
        transcriptionResponse.data.length > 0
      ) {
        if (!mobile && Notification.permission)
          new Notification("Transcription Complete!");

        for (let x in transcriptionResponse.data) {
          let currEntry = transcriptionResponse.data[x];
          transcribed += currEntry.text;

          let currWord = currEntry.text.replace(/[^\w*]/g, "").toLowerCase();

          let validWord = currWord !== "" && /[aeiouy\d\*]/.test(currWord);
          if (!validWord) console.log("Word: ", currWord, " hasVowel: false");

          if (words != null && validWord) {
            if (words[currWord] !== undefined) {
              words[currWord].push([currEntry.start, currEntry.end]);
            } else {
              words[currWord] = [[currEntry.start, currEntry.end]];
            }
          } else if (validWord) {
            words = { [currWord]: [[currEntry.start, currEntry.end]] };
          }
        }

        setWords(words);
        setTranscriptionText(transcribed);
        setElapsedTime(transcriptionResponse.requestTime);

        const submitForm = document.getElementById(
          "submit-form"
        ) as HTMLDivElement;

        const fileInfo = document.getElementById(
          "file-info-div"
        ) as HTMLDivElement;

        dispatch(showManualResults());

        submitForm.style.maxWidth = "80vw";

        if (!mobile) {
          fileInfo.style.width = "50%";
        } else {
          submitForm.style.maxWidth = "100vw";
        }
      }
    };

    showTranscription();
  }, [dispatch, transcriptionResponse, mobile]);

  return (
    <Toggle id={componentIDs.manualResults}>
      <div id="manual-outer" className="manual-outer">
        <div
          id="transcribed-words"
          className=" manual-inner"
          style={{
            height: "100%",
            maxHeight: "56vh",
            marginRight: mobile ? "0%" : "2.5%",
            paddingBottom: "2%",
          }}
        >
          <b>Uncensored Words</b>
          <label style={{ float: "right", fontSize: "100%", padding: "1px" }}>
            <input
              type="checkbox"
              id="transcribed-checkbox"
              style={{ display: "none" }}
              onClick={() => {
                hideWordSelectors("transcribed");
              }}
            />
            <span className="expander" id={"transcribed-show"}>
              [-]
            </span>
          </label>
          {currWords != null ? (
            <WordSelector originalEntries={currWords} />
          ) : (
            <></>
          )}
        </div>

        <div
          id="selected-words-outer"
          className=" manual-inner"
          style={{
            height: "100%",
            maxHeight: "56vh",
            marginLeft: mobile ? "0%" : "2.5%",
            paddingBottom: "2%",
          }}
        >
          <b>Censored Words</b>
          <label
            style={{
              fontSize: "100%",
              padding: "1px",
              float: "right",
            }}
          >
            <input
              type="checkbox"
              id="selected-checkbox"
              style={{ display: "none" }}
              onClick={() => {
                hideWordSelectors("selected");
              }}
            />
            <span
              className="expander"
              id="selected-show"
              style={{ marginLeft: "auto" }}
            >
              [-]
            </span>
          </label>
          {currWords != null ? <SelectedWords /> : <></>}
        </div>
      </div>
    </Toggle>
  );
};

export default ManualResults;
