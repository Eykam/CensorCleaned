import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import "../../../css/wordSelector.css";
import "../../../css/manualResults.css";
import {
  setUnselectedWords,
  resetWordList,
} from "../../../../../store/features/dataSlice";
import {
  hideFormSettings,
  showTimestampSubmit,
  updateWord,
} from "../../../../../store/features/formSlice";
import { FixedSizeList as List } from "react-window";
import { Paper, Button, Checkbox } from "@mui/material";
import { Callers } from "./wordCard";
import WordsList from "./wordsList";
//===========================================================  Interfaces ============================================================

interface WordSelectorComponents {
  originalEntries: { [index: string]: number[][] };
}

//============================================================== Utils ==============================================================

const checkBrowser = () => {
  return window.matchMedia("(max-width: 780px)").matches;
};

const checkSmaller = () => {
  return window.innerWidth <= 1500;
};

//================================================================================= React =======================================================================

const UncensoredSelector = ({
  originalEntries,
  displayWord,
}: {
  originalEntries: WordSelectorComponents["originalEntries"];
  displayWord: (word: string, caller: string) => void;
}) => {
  //============================================================== CONSTANTS & STATES ==============================================================
  const entry = useAppSelector((state) => state.data.unselectedWords);
  const suggestions = useAppSelector((state) => state.data.suggestedWords);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleEntry, setVisibility] = useState(Object.keys(entry));
  const [visibleSuggestion, setSuggestionVisibility] = useState(
    Object.keys(suggestions)
  );
  const [suggestionsHidden, setSuggestionsHidden] = useState(false);

  const dispatch = useAppDispatch();

  console.log("WordSelector Re-Render");

  //============================================================== UseEffects ==============================================================

  useEffect(() => {
    dispatch(setUnselectedWords({ entries: originalEntries }));
    dispatch(hideFormSettings());
    dispatch(showTimestampSubmit());
  }, [originalEntries, dispatch]);

  useEffect(() => {
    const search = async (term: string) => {
      if (term !== "") {
        setVisibility(Object.keys(entry).filter((word) => word.includes(term)));
        setSuggestionVisibility(
          Object.keys(suggestions).filter((word) => word.includes(term))
        );
      } else {
        setVisibility(Object.keys(entry));
        setSuggestionVisibility(Object.keys(suggestions));
      }
    };

    search(searchTerm);
  }, [entry, suggestions, searchTerm]);

  //============================================================== Functions ==============================================================

  // const selectAllTimes = (curr: string) => {
  //   const wordOuter = document.getElementById(curr) as HTMLInputElement;

  //   if (entry[curr] !== undefined) {
  //     entry[curr].forEach((currTimestamp) => {
  //       const currTimestampCheckbox = document.getElementById(
  //         curr + "-" + currTimestamp
  //       ) as HTMLInputElement;

  //       if (wordOuter != null && currTimestampCheckbox != null) {
  //         if (wordOuter.checked) {
  //           currTimestampCheckbox.checked = true;
  //         } else {
  //           currTimestampCheckbox.checked = false;
  //         }
  //       }
  //     });
  //   } else if (suggestions[curr] !== undefined) {
  //     suggestions[curr].forEach((currTimestamp) => {
  //       const currTimestampCheckbox = document.getElementById(
  //         curr + "-" + currTimestamp
  //       ) as HTMLInputElement;

  //       if (wordOuter != null && currTimestampCheckbox != null) {
  //         if (wordOuter.checked) {
  //           currTimestampCheckbox.checked = true;
  //         } else {
  //           currTimestampCheckbox.checked = false;
  //         }
  //       }
  //     });
  //   }
  // };

  // const resetSelection = () => {
  //   Object.keys(entry).forEach((currWord) => {
  //     const wordInput = document.getElementById(currWord) as HTMLInputElement;

  //     if (wordInput != null) {
  //       wordInput.checked = false;
  //     }

  //     selectAllTimes(currWord);
  //   });
  // };

  // const confirmSelection = () => {
  //   const selected: { [index: string]: number[][] } = {};

  //   Object.keys(entry).forEach((currWord) => {
  //     const wordCheckbox = document.getElementById(
  //       currWord
  //     ) as HTMLInputElement;
  //     const wordOuter = document.getElementById(
  //       currWord + "-outer"
  //     ) as HTMLDivElement;

  //     if (wordCheckbox.checked) {
  //       selected[currWord] = entry[currWord];

  //       dispatch(
  //         removeUnselectedWords({
  //           currWord: currWord,
  //           removeTimestamp: [],
  //           all: true,
  //         })
  //       );
  //     } else {
  //       const selectedTimes: number[][] = [];
  //       const lengthList = entry[currWord].length;
  //       const currTimestamps = Object.values(entry[currWord]);

  //       currTimestamps.forEach((currTime) => {
  //         const currTimeStampInput = document.getElementById(
  //           currWord + "-" + currTime
  //         ) as HTMLInputElement;

  //         if (currTimeStampInput != null && currTimeStampInput.checked) {
  //           selectedTimes.push(currTime);

  //           dispatch(
  //             removeUnselectedWords({
  //               currWord: currWord,
  //               removeTimestamp: currTime,
  //               all: false,
  //             })
  //           );
  //         }
  //       });

  //       if (lengthList === selectedTimes.length) {
  //         const toRemove = document.getElementById(
  //           currWord + "-outer"
  //         ) as HTMLDivElement;
  //         toRemove.style.display = "none";
  //       }

  //       if (selectedTimes.length > 0) {
  //         console.log(currWord, " Remaining Times: ", entry[currWord]);
  //         console.log("Removing: ", selectedTimes);
  //         selected[currWord] = selectedTimes;
  //       }
  //     }
  //   });

  //   Object.keys(suggestions).forEach((currWord) => {
  //     const wordCheckbox = document.getElementById(
  //       currWord
  //     ) as HTMLInputElement;
  //     const wordOuter = document.getElementById(
  //       currWord + "-outer"
  //     ) as HTMLDivElement;

  //     if (wordCheckbox.checked) {
  //       selected[currWord] = suggestions[currWord];

  //       dispatch(
  //         removeSuggestedWords({
  //           currWord: currWord,
  //           removeTimestamp: [],
  //           all: true,
  //         })
  //       );
  //     } else {
  //       const selectedTimes: number[][] = [];
  //       const lengthList = suggestions[currWord].length;
  //       const currTimestamps = Object.values(suggestions[currWord]);

  //       currTimestamps.forEach((currTime) => {
  //         const currTimeStampInput = document.getElementById(
  //           currWord + "-" + currTime
  //         ) as HTMLInputElement;

  //         if (currTimeStampInput != null && currTimeStampInput.checked) {
  //           selectedTimes.push(currTime);

  //           dispatch(
  //             removeSuggestedWords({
  //               currWord: currWord,
  //               removeTimestamp: currTime,
  //               all: false,
  //             })
  //           );
  //         }
  //       });

  //       if (lengthList === selectedTimes.length) {
  //         const toRemove = document.getElementById(
  //           currWord + "-outer"
  //         ) as HTMLDivElement;
  //         toRemove.style.display = "none";
  //       }

  //       if (selectedTimes.length > 0) {
  //         console.log(currWord, " Remaining Times: ", suggestions[currWord]);
  //         console.log("Removing: ", selectedTimes);
  //         selected[currWord] = selectedTimes;
  //       }
  //     }
  //   });

  //   const suggestionsExpanded = document.getElementById(
  //     "suggestions-expanded"
  //   ) as HTMLDivElement;
  //   const suggestionsInput = document.getElementById(
  //     "suggestions-checkbox"
  //   ) as HTMLInputElement;

  //   if (suggestionsExpanded.style.display !== "none") {
  //     suggestionsInput.checked = true;
  //     hideSuggestions();
  //   }

  //   dispatch(addCensorWords({ entries: selected }));
  //   resetSelection();
  // };

  const selectAll = (unselect: boolean, caller: string) => {
    let data = caller === Callers.suggested ? suggestions : entry;

    if (unselect) {
      let visibleWords = Object.keys(data).filter((word) => {
        return word.includes(searchTerm);
      });

      visibleWords.forEach((word) => {
        dispatch(
          updateWord({
            word: word,
            timestamps: [],
            caller: Callers.unselected,
          })
        );
      });
    } else {
      if (data) {
        let visibleWords = Object.keys(data).filter((word) => {
          return word.includes(searchTerm);
        });

        visibleWords.forEach((word) => {
          let timestamps = data[word].map((timestamp) => {
            return JSON.stringify(timestamp);
          });
          dispatch(
            updateWord({
              word: word,
              timestamps: timestamps,
              caller: Callers.unselected,
            })
          );
        });
      }
    }
  };

  const reset = () => {
    dispatch(resetWordList());
  };

  const hideSuggestions = () => {
    const suggestionsOuter = document.getElementById(
      "suggestions-outer"
    ) as HTMLDivElement;
    const suggestionsInput = document.getElementById(
      "suggestions-checkbox"
    ) as HTMLInputElement;
    const suggestionsExpanded = document.getElementById(
      "suggestions-expanded"
    ) as HTMLDivElement;
    const unselectedOuter = document.getElementById(
      "unselected-outer"
    ) as HTMLDivElement;
    const suggestionExpander = document.getElementById(
      "suggestions-show"
    ) as HTMLSpanElement;

    if (suggestionsInput.checked) {
      suggestionsExpanded.style.display = "none";
      setSuggestionsHidden(true);
      suggestionExpander.innerText = "[+]";
    } else {
      if (Object.keys(suggestions).length > 0) {
        suggestionsExpanded.style.display = "block";
        setSuggestionsHidden(false);
      }

      suggestionExpander.innerText = "[-]";
    }
  };

  //============================================================== FUNCTIONAL COMPONENTS ==============================================================

  const rows = ({
    data,
    index,
    style,
  }: {
    data: { list: string[]; caller: string };
    index: number;
    style: React.CSSProperties;
  }) => {
    return (
      <div style={style}>
        <WordsList data={data} index={index} displayWord={displayWord} />
      </div>
    );
  };

  //============================================================== MAIN COMPONENT ==============================================================

  return (
    <div id="word-selector" style={{ display: "block" }}>
      <div
        style={{
          display: "block",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "block" }}>
          <input
            id="search-bar"
            type="text"
            placeholder="Search Here"
            style={{
              paddingTop: "2%",
              paddingBottom: "2%",
              marginTop: "2%",
              marginBottom: "2%",
              borderRadius: "5px",
              maxWidth: "40%",
              marginRight: "5%",
            }}
            onChange={(e) => {
              let curr = e.target as HTMLInputElement;
              setSearchTerm(curr.value);
            }}
          />

          <div
            style={{
              display: "inline-flex",
              maxHeight: "100%",
              marginTop: "2%",
              marginBottom: "2%",
              width: "45%",
            }}
          >
            <Button
              variant="contained"
              style={{
                display: "inline-block",
                marginLeft: "auto",
                fontWeight: "bold",
                margin: "0",
                padding: "2%",
                color: "lightgray",
                backgroundColor: "rgb(80,80,80)",
              }}
              onClick={reset}
            >
              Reset
            </Button>

            <Button
              variant="contained"
              style={{
                display: "inline-block",
                marginLeft: "auto",
                fontWeight: "bold",
                margin: "0",
                padding: "2%",
                color: "lightgray",
                backgroundColor: "rgb(80,80,80)",
              }}
              // onClick={confirmSelection}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      <Paper
        id="suggestions-outer"
        style={{
          height: suggestionsHidden ? "5%" : "auto",
          margin: "4% auto",
          overflow: "hidden",
          width: "95%",
          padding: "3%",
          backgroundColor: "rgb(80,80,80)",
          color: "lightgray",
        }}
      >
        <div style={{ display: "flex" }}>
          <h4 style={{ margin: "0" }}>AI Suggestions</h4>

          <Checkbox
            size="small"
            sx={{
              color: "rgb(200,200,200)",
              "&.Mui-checked": {
                color: "rgb(180,180,180)",
              },
            }}
            style={{ margin: "0", padding: "0" }}
            onClick={(e) => {
              let checked = (e.target as HTMLInputElement).checked;
              selectAll(!checked, Callers.suggested);
            }}
          />

          <label
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "0%",
              fontSize: "100%",
              padding: "1px",
            }}
          >
            <input
              type="checkbox"
              onClick={() => {
                hideSuggestions();
              }}
              id={"suggestions-checkbox"}
              style={{ display: "none" }}
            />
            <span className="expander" id={"suggestions-show"}>
              [-]
            </span>
          </label>
        </div>

        <div
          id="suggestions-expanded"
          style={{
            display: "flex",
            padding: "0",
            margin: "0",
          }}
        >
          <List
            height={suggestionsHidden ? 0 : 100}
            width={"100%"}
            itemCount={visibleSuggestion.length}
            itemSize={25}
            itemData={{ list: visibleSuggestion, caller: Callers.suggested }}
          >
            {rows}
          </List>
        </div>
      </Paper>

      <Checkbox
        size="small"
        sx={{
          color: "rgb(200,200,200)",
          "&.Mui-checked": {
            color: "rgb(180,180,180)",
          },
        }}
        style={{ margin: "0", padding: "0" }}
        id="select-all"
        onClick={(e) => {
          let checked = (e.target as HTMLInputElement).checked;
          selectAll(!checked, Callers.unselected);
        }}
      />

      <div id="unselected-outer" style={{}}>
        <List
          height={
            checkBrowser()
              ? suggestionsHidden
                ? 200
                : 100
              : suggestionsHidden
              ? 250
              : 150
          }
          width={"100%"}
          itemCount={visibleEntry.length}
          itemSize={25}
          itemData={{ list: visibleEntry, caller: Callers.unselected }}
        >
          {rows}
        </List>
      </div>
    </div>
  );
};

export default UncensoredSelector;
