import React from "react";
import "../../../css/manualResults.css";
import WordSelector from "./uncensoredSelector";
import SelectedWords from "./censoredSelector";
import { Box, Paper } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRef, useState } from "react";
import { Callers } from "./wordCard";

const SelectorContainer = ({
  mobile,
  currWords,
  displayWord,
}: {
  mobile: boolean;
  currWords: {
    [index: string]: number[][];
  } | null;
  displayWord: (curr: string, caller: string) => void;
}) => {
  console.log("WordsContainer Re-Render");

  const [highlighted, setHighlighted] = useState("");

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
        // transcribedOuter.style.height = "4vh";
      } else {
        transcribedExpanded.style.display = "block";
        transcribedExpander.innerText = "[-]";
        transcribedOuter.style.height = "auto";
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
        selectedExpander.innerHTML = "[+]";
        selectedOuter.style.height = "auto";
      } else {
        selectedExpanded.style.display = "block";
        selectedExpander.innerText = "[-]";
        selectedOuter.style.height = "100%";
      }
    }
  };

  const focusWord = (currWord: string, caller: string) => {
    displayWord(currWord, caller);
    console.log("focusing on ", caller);
    setHighlighted(caller);
  };

  return (
    <>
      {/* <div id="manual-outer" className="manual-outer"> */}
      <Box gridColumn="span 1" gridRow="span 2">
        <Paper
          id="transcribed-words"
          className=" manual-inner"
          style={{
            background: "rgb(70, 70, 70)",
            color: "lightgray",
            margin: "0",
            padding: "0",
            border:
              highlighted === Callers.suggested ||
              highlighted === Callers.unselected
                ? "solid 1% rgb(50, 50, 50)"
                : "none",
          }}
        >
          <div style={{ padding: "4%" }}>
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
              <WordSelector
                originalEntries={currWords}
                displayWord={focusWord}
              />
            ) : (
              <></>
            )}
          </div>
        </Paper>
      </Box>

      <Box gridColumn="span 1" gridRow="span 2">
        <Paper
          id="selected-words-outer"
          className=" manual-inner"
          style={{
            height: "100%",
            margin: "0",
            padding: "0",
            background: "rgb(70, 70, 70)",
            color: "lightgray",
            border:
              highlighted === Callers.suggested ||
              highlighted === Callers.unselected
                ? "solid 1% rgb(10, 10, 10)"
                : "none",
          }}
        >
          <div style={{ padding: "4%" }}>
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

            {currWords != null ? (
              <SelectedWords displayWord={focusWord} />
            ) : (
              <></>
            )}
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default SelectorContainer;
