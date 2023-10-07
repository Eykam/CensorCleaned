import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import "../css/wordSelector.css";
import "../css/manualResults.css";
import {
  addCensorWords,
  setUnselectedWords,
  removeUnselectedWords,
  resetWordList,
  removeSuggestedWords,
} from "../store/features/dataSlice";
import {
  hideFormSettings,
  showTimestampSubmit,
} from "../store/features/formSlice";

interface WordSelectorComponenets {
  originalEntries: { [index: string]: number[][] };
}

const WordSelector = ({ originalEntries }: WordSelectorComponenets) => {
  const dispatch = useAppDispatch();

  const checkBrowser = () => {
    return window.matchMedia("(max-width: 767px)").matches;
  };

  const checkSmaller = () => {
    return window.innerWidth <= 1500;
  };

  useEffect(() => {
    dispatch(setUnselectedWords({ entries: originalEntries }));
    dispatch(hideFormSettings());
    dispatch(showTimestampSubmit());

    if (checkBrowser()) {
      const transcribedCheckbox = document.getElementById(
        "transcribed-checkbox"
      ) as HTMLInputElement;
      const selectedCheckbox = document.getElementById(
        "selected-checkbox"
      ) as HTMLInputElement;

      if (!transcribedCheckbox.checked) transcribedCheckbox.click();

      if (!selectedCheckbox.checked) selectedCheckbox.click();
    }
  }, []);

  const entry = useAppSelector((state) => state.data.unselectedWords);
  const suggestions = useAppSelector((state) => state.data.suggestedWords);
  const censorReasons = useAppSelector((state) => {
    if (
      state.data.transcription.response != null &&
      state.data.transcription.response !== undefined
    ) {
      return state.data.transcription.response.badWords;
    }
  });

  const expand = (curr: string) => {
    const currExpander = document.getElementById(
      curr + "-expand"
    ) as HTMLDivElement;
    const currToggle = document.getElementById(
      curr + "-checkbox"
    ) as HTMLInputElement;
    const currShowButton = document.getElementById(
      curr + "-show"
    ) as HTMLSpanElement;

    if (currToggle.checked === true) {
      currExpander.style.display = "block";
      currShowButton.innerText = "[-]";
    } else {
      currExpander.style.display = "none";
      currShowButton.innerText = "[+]";
    }
  };

  const search = () => {
    const searchTerm = (
      document.getElementById("search-bar") as HTMLInputElement
    ).value;

    console.log('Search Value: "', searchTerm, '"');
    Object.keys(entry).forEach((curr) => {
      const currContainer = document.getElementById(curr + "-outer");

      if (currContainer != null) {
        if (searchTerm === "") {
          currContainer.style.display = "flex";
        }

        if (!curr.toLocaleLowerCase().includes(searchTerm.toLowerCase())) {
          currContainer.style.display = "none";
        } else {
          currContainer.style.display = "flex";
        }
      }
    });

    Object.keys(suggestions).forEach((curr) => {
      const currContainer = document.getElementById(curr + "-outer");

      if (currContainer != null) {
        if (searchTerm === "") {
          currContainer.style.display = "flex";
        }

        if (!curr.toLocaleLowerCase().includes(searchTerm.toLowerCase())) {
          currContainer.style.display = "none";
        } else {
          currContainer.style.display = "flex";
        }
      }
    });
  };

  const printTimeStamp = (seconds: number[]): string => {
    let updatedTimestamps: string[] | null = null;

    seconds.forEach((currSeconds) => {
      const minutes = Math.floor(currSeconds / 60);
      const remainingSeconds = Math.floor(currSeconds - minutes * 60);

      if (updatedTimestamps == null) {
        updatedTimestamps = [
          String(minutes).padStart(2, "0") +
            ":" +
            String(remainingSeconds).padStart(2, "0"),
        ];
      } else {
        updatedTimestamps.push(
          String(minutes).padStart(2, "0") +
            ":" +
            String(remainingSeconds).padStart(2, "0")
        );
      }
    });

    if (updatedTimestamps)
      return updatedTimestamps[0] + " - " + updatedTimestamps[1];

    return "";
  };

  const playClip = (start: number, end: number) => {
    try {
      const videoPlayer = document.getElementsByTagName(
        "video"
      )[0] as HTMLVideoElement;

      console.log("Videoplaeer: ", videoPlayer);

      const audioPlayer = document.getElementsByTagName(
        "audio"
      )[0] as HTMLAudioElement;

      const player = videoPlayer !== undefined ? videoPlayer : audioPlayer!;

      function checkTime() {
        if (player.currentTime >= end + 0.25) {
          player.pause();
        } else {
          /* call checkTime every 1/10th
                second until endTime */
          setTimeout(checkTime, 100);
        }
      }

      /* stop if playing (otherwise ignored) */
      player.pause();
      /* set video start time */
      player.currentTime = start - 0.25;
      /* play video */
      player.play();
      /* check the current time and
         pause IF/WHEN endTime is reached */
      checkTime();
    } catch (e) {
      console.log("Error playing clip: ", (e as Error).message);
    }
  };

  const selectAllTimes = (curr: string) => {
    const wordOuter = document.getElementById(curr) as HTMLInputElement;

    if (entry[curr] !== undefined) {
      entry[curr].forEach((currTimestamp) => {
        const currTimestampCheckbox = document.getElementById(
          curr + "-" + currTimestamp
        ) as HTMLInputElement;

        if (wordOuter != null && currTimestampCheckbox != null) {
          if (wordOuter.checked) {
            currTimestampCheckbox.checked = true;
          } else {
            currTimestampCheckbox.checked = false;
          }
        }
      });
    } else if (suggestions[curr] !== undefined) {
      suggestions[curr].forEach((currTimestamp) => {
        const currTimestampCheckbox = document.getElementById(
          curr + "-" + currTimestamp
        ) as HTMLInputElement;

        if (wordOuter != null && currTimestampCheckbox != null) {
          if (wordOuter.checked) {
            currTimestampCheckbox.checked = true;
          } else {
            currTimestampCheckbox.checked = false;
          }
        }
      });
    }
  };

  const resetSelection = () => {
    Object.keys(entry).forEach((currWord) => {
      const wordInput = document.getElementById(currWord) as HTMLInputElement;

      if (wordInput != null) {
        wordInput.checked = false;
      }

      selectAllTimes(currWord);
    });
  };

  const confirmSelection = () => {
    const selected: { [index: string]: number[][] } = {};

    Object.keys(entry).forEach((currWord) => {
      const wordCheckbox = document.getElementById(
        currWord
      ) as HTMLInputElement;
      const wordOuter = document.getElementById(
        currWord + "-outer"
      ) as HTMLDivElement;

      if (wordCheckbox.checked) {
        selected[currWord] = entry[currWord];

        dispatch(
          removeUnselectedWords({
            currWord: currWord,
            removeTimestamp: [],
            all: true,
          })
        );
      } else {
        const selectedTimes: number[][] = [];
        const lengthList = entry[currWord].length;
        const currTimestamps = Object.values(entry[currWord]);

        currTimestamps.forEach((currTime) => {
          const currTimeStampInput = document.getElementById(
            currWord + "-" + currTime
          ) as HTMLInputElement;

          if (currTimeStampInput != null && currTimeStampInput.checked) {
            selectedTimes.push(currTime);

            dispatch(
              removeUnselectedWords({
                currWord: currWord,
                removeTimestamp: currTime,
                all: false,
              })
            );
          }
        });

        if (lengthList === selectedTimes.length) {
          const toRemove = document.getElementById(
            currWord + "-outer"
          ) as HTMLDivElement;
          toRemove.style.display = "none";
        }

        if (selectedTimes.length > 0) {
          console.log(currWord, " Remaining Times: ", entry[currWord]);
          console.log("Removing: ", selectedTimes);
          selected[currWord] = selectedTimes;
        }
      }
    });

    Object.keys(suggestions).forEach((currWord) => {
      const wordCheckbox = document.getElementById(
        currWord
      ) as HTMLInputElement;
      const wordOuter = document.getElementById(
        currWord + "-outer"
      ) as HTMLDivElement;

      if (wordCheckbox.checked) {
        selected[currWord] = suggestions[currWord];

        dispatch(
          removeSuggestedWords({
            currWord: currWord,
            removeTimestamp: [],
            all: true,
          })
        );
      } else {
        const selectedTimes: number[][] = [];
        const lengthList = suggestions[currWord].length;
        const currTimestamps = Object.values(suggestions[currWord]);

        currTimestamps.forEach((currTime) => {
          const currTimeStampInput = document.getElementById(
            currWord + "-" + currTime
          ) as HTMLInputElement;

          if (currTimeStampInput != null && currTimeStampInput.checked) {
            selectedTimes.push(currTime);

            dispatch(
              removeSuggestedWords({
                currWord: currWord,
                removeTimestamp: currTime,
                all: false,
              })
            );
          }
        });

        if (lengthList === selectedTimes.length) {
          const toRemove = document.getElementById(
            currWord + "-outer"
          ) as HTMLDivElement;
          toRemove.style.display = "none";
        }

        if (selectedTimes.length > 0) {
          console.log(currWord, " Remaining Times: ", suggestions[currWord]);
          console.log("Removing: ", selectedTimes);
          selected[currWord] = selectedTimes;
        }
      }
    });

    const suggestionsExpanded = document.getElementById(
      "suggestions-expanded"
    ) as HTMLDivElement;
    const suggestionsInput = document.getElementById(
      "suggestions-checkbox"
    ) as HTMLInputElement;

    if (suggestionsExpanded.style.display !== "none") {
      suggestionsInput.checked = true;
      hideSuggestions();
    }

    dispatch(addCensorWords({ entries: selected }));
    resetSelection();
  };

  const uncheckWord = (checked: boolean, currWord: string) => {
    if (!checked) {
      const wordInput = document.getElementById(currWord) as HTMLInputElement;
      wordInput.checked = false;
    }
  };

  const selectAll = (checked: boolean) => {
    if (entry != null && entry !== undefined) {
      const searchTerm = (
        document.getElementById("search-bar") as HTMLInputElement
      ).value;

      Object.keys(entry).forEach((currWord) => {
        const wordInput = document.getElementById(currWord) as HTMLInputElement;

        if (wordInput != null) {
          if (searchTerm !== undefined && searchTerm !== "") {
            if (currWord.includes(searchTerm.toLowerCase()))
              wordInput.checked = checked;
          } else {
            wordInput.checked = checked;
          }
        }
      });
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
      suggestionsOuter.style.height = "5%";
      unselectedOuter.style.height = "72%";
      suggestionExpander.innerText = "[+]";
    } else {
      if (Object.keys(suggestions).length > 0) {
        suggestionsExpanded.style.display = "block";
        suggestionsOuter.style.height = "30%";
        unselectedOuter.style.height = "47%";
      }

      suggestionExpander.innerText = "[-]";
    }
  };

  const selectSuggested = (checked: boolean) => {
    if (suggestions != null && suggestions !== undefined) {
      const searchTerm = (
        document.getElementById("search-bar") as HTMLInputElement
      ).value;

      Object.keys(suggestions).forEach((currWord) => {
        const wordInput = document.getElementById(currWord) as HTMLInputElement;

        if (wordInput != null) {
          if (searchTerm !== undefined && searchTerm !== "") {
            if (currWord.includes(searchTerm.toLowerCase()))
              wordInput.checked = checked;
          } else {
            wordInput.checked = checked;
          }
        }
      });
    }
  };

  const expandDiv = (curr: string) => {
    const currWordExpander = document.getElementById(
      curr + "-checkbox"
    ) as HTMLInputElement;

    currWordExpander.checked = !currWordExpander.checked;
    expand(curr);
  };

  const selectTimestamp = (curr: string, time: string) => {
    const currTimestampCheckbox = document.getElementById(
      curr + "-" + time
    ) as HTMLInputElement;

    currTimestampCheckbox.checked = !currTimestampCheckbox.checked;
    uncheckWord(currTimestampCheckbox.checked, curr);
  };

  return (
    <div id="word-selector" style={{ display: "block", height: "100%" }}>
      <div
        style={{
          display: "flex",
          height: "8%",
          minHeight: checkSmaller() ? "6vh" : "4vh",
        }}
      >
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
            maxWidth: "47.5%",
          }}
          onChange={search}
        />

        <div
          style={{
            display: "flex",
            height: checkSmaller() ? "100%" : "70%",
            margin: "auto 0px",
            justifyContent: "end",
            width: "100%",
            maxWidth: checkBrowser() ? "100%" : "47.5%",
          }}
        >
          <button
            style={
              checkSmaller()
                ? {
                    display: "block",
                    minHeight: "4vh",
                    margin: "0",
                    marginRight: "2%",
                    padding: "0",
                    borderRadius: "5px",
                    color: "#454545",
                    width: "50%",
                  }
                : { borderRadius: "5px", color: "#454545", height: "3vh" }
            }
            onClick={reset}
          >
            Reset
          </button>
          <button
            style={
              checkSmaller()
                ? {
                    display: "block",
                    margin: "0",
                    padding: "0",
                    borderRadius: "5px",
                    color: "#454545",
                    width: "50%",
                    minHeight: "4vh",
                  }
                : { borderRadius: "5px", color: "#454545", height: "3vh" }
            }
            onClick={confirmSelection}
          >
            Add
          </button>
        </div>

        <br />
      </div>

      <div
        id="suggestions-outer"
        className="manual-inner"
        style={{
          height: "30%",
          margin: "4% 0",
          overflow: "hidden",
          width: "100%",
          transform: "translateX(-3.5%)",
          padding: "3%",
          border: "solid rgb(62, 62, 62)",
          boxShadow: "4px 2px 4px rgb(40, 40, 40)",
        }}
      >
        <div style={{ display: "flex" }}>
          <h4 style={{ margin: "0" }}>AI Suggestions</h4>
          <input
            type="checkbox"
            onClick={(e) => {
              selectSuggested((e.target as HTMLInputElement).checked);
            }}
          ></input>
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
            height: "100%",
            maxHeight: "100%",
            overflow: "scroll",
            display: "block",
          }}
        >
          {Object.keys(suggestions)
            .sort()
            .map((curr) => {
              return (
                <div
                  className="word-shell"
                  style={{
                    display: "flex",
                    padding: "0.5%",
                  }}
                  id={curr + "-outer"}
                  key={curr + "-outer"}
                >
                  <div
                    className="collapsible"
                    id={curr + "-collapsible"}
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                    }}
                    onClick={() => {
                      expandDiv(curr);
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        maxWidth: "100%",
                      }}
                    >
                      <input
                        type="checkbox"
                        id={curr}
                        name={curr}
                        style={{ margin: "0 0", display: "inline-block" }}
                        onClick={() => {
                          selectAllTimes(curr);
                        }}
                      />
                      {curr + " "}

                      <span
                        style={{
                          display: "inline-block",
                          margin: "auto 0",
                          marginLeft: "auto",
                          fontSize: "70%",
                          color: "grey",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        {"Type: "}
                        {censorReasons !== undefined ? censorReasons[curr] : ""}
                      </span>

                      <label
                        style={{
                          marginLeft: "2.5%",
                          fontSize: "100%",
                          padding: "1px",
                        }}
                      >
                        <input
                          type="checkbox"
                          onClick={(e) => {
                            expand(curr);
                          }}
                          id={curr + "-checkbox"}
                          style={{ display: "none" }}
                        />
                        <span className="expander" id={curr + "-show"}>
                          [+]
                        </span>
                      </label>
                    </div>

                    <div
                      className="expanded"
                      id={curr + "-expand"}
                      style={{ display: "none", width: "100%" }}
                    >
                      {suggestions[curr].map((time) => {
                        return (
                          <div
                            className="timestamp-shell"
                            style={{
                              overflow: "hidden",
                              marginLeft: "10%",
                              width: "85%",
                              paddingRight: "0%",
                            }}
                            id={curr + "-" + time + "-outer"}
                            key={curr + "-" + time + "-outer"}
                            onClick={(e) => {
                              e.stopPropagation();
                              selectTimestamp(curr, time.toString());
                            }}
                          >
                            <input
                              type="checkbox"
                              id={curr + "-" + time}
                              name={curr + "-" + time}
                              onClick={(e) => {
                                e.stopPropagation();
                                const checked: boolean = (
                                  e.target as HTMLInputElement
                                ).checked;
                                uncheckWord(checked, curr);
                              }}
                            />

                            {printTimeStamp(time)}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playClip(time[0], time[1]);
                              }}
                              style={{ float: "right", borderRadius: "7px" }}
                            >
                              &#9658;
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <label style={{ marginTop: "2%", marginBottom: "1%", marginLeft: ".5%" }}>
        <input
          style={{ margin: "0" }}
          type="checkbox"
          id="select-all"
          onClick={(e) => {
            selectAll((e.target as HTMLInputElement).checked);
          }}
        />
      </label>

      <div
        id="unselected-outer"
        style={{
          height: "47%",
          maxHeight: checkBrowser() ? "25vh" : "72%",
          overflow: "scroll",
        }}
      >
        {Object.keys(entry)
          .sort()
          .map((curr) => {
            return (
              <div
                className="word-shell"
                style={{
                  display: "flex",
                  padding: "0.5%",
                }}
                id={curr + "-outer"}
                key={curr + "-outer"}
              >
                <div
                  className="collapsible"
                  id={curr + "-collapsible"}
                  style={{ width: "100%", margin: "auto 0" }}
                  onClick={() => {
                    expandDiv(curr);
                  }}
                >
                  <input
                    type="checkbox"
                    id={curr}
                    name={curr}
                    style={{ margin: "0 0" }}
                    onClick={() => {
                      selectAllTimes(curr);
                    }}
                  />
                  {curr}
                  <label
                    style={{
                      float: "right",
                      fontSize: "100%",
                      padding: "1px",
                    }}
                  >
                    <input
                      type="checkbox"
                      onClick={() => {
                        expand(curr);
                      }}
                      id={curr + "-checkbox"}
                      style={{ display: "none" }}
                    />
                    <span className="expander" id={curr + "-show"}>
                      [+]
                    </span>
                  </label>

                  <div
                    className="expanded"
                    id={curr + "-expand"}
                    style={{ display: "none", width: "100%" }}
                  >
                    {entry[curr].map((time) => {
                      return (
                        <div
                          className="timestamp-shell"
                          style={{
                            overflow: "hidden",
                            marginLeft: "10%",
                            width: "85%",
                            paddingRight: "0%",
                          }}
                          id={curr + "-" + time + "-outer"}
                          key={curr + "-" + time + "-outer"}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectTimestamp(curr, time.toString());
                          }}
                        >
                          <input
                            type="checkbox"
                            id={curr + "-" + time}
                            name={curr + "-" + time}
                            onClick={(e) => {
                              e.stopPropagation();
                              const checked: boolean = (
                                e.target as HTMLInputElement
                              ).checked;
                              uncheckWord(checked, curr);
                            }}
                          />

                          {printTimeStamp(time)}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playClip(time[0], time[1]);
                            }}
                            style={{ float: "right", borderRadius: "7px" }}
                          >
                            &#9658;
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default WordSelector;
