import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/store";
import "../css/wordSelector.css";
import {
  removeSelectedWords,
  addUnselectedWords,
  addSuggestedWords,
} from "../store/features/dataSlice";

const SelectedWords = () => {
  const dispatch = useAppDispatch();

  const entry = useAppSelector((state) => state.data.censorship.censorList);
  const originalSuggestedWords = useAppSelector(
    (state) => state.data.originalSuggestedWords
  );

  const checkSmaller = () => {
    return window.innerWidth <= 1500;
  };

  const expand = (curr: string) => {
    const currExpander = document.getElementById(
      curr + "-expand-selected"
    ) as HTMLDivElement;
    const currToggle = document.getElementById(
      curr + "-checkbox-selected"
    ) as HTMLInputElement;
    const currShowButton = document.getElementById(
      curr + "-show-selected"
    ) as HTMLSpanElement;

    if (currExpander && currShowButton && currToggle.checked === true) {
      currExpander.style.display = "block";
      currShowButton.innerText = "[-]";
    } else {
      currExpander.style.display = "none";
      currShowButton.innerText = "[+]";
    }
  };

  const search = () => {
    const searchTerm = (
      document.getElementById("search-bar-selected") as HTMLInputElement
    ).value;

    console.log('Search Value: "', searchTerm, '"');

    if (entry != null) {
      Object.keys(entry).forEach((curr) => {
        const currContainer = document.getElementById(curr + "-outer-selected");

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
    }
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

  const selectAllTimes = (curr: string) => {
    const wordOuter = document.getElementById(
      curr + "-selected"
    ) as HTMLInputElement;

    if (entry != null) {
      entry[curr].forEach((currTimestamp) => {
        const currTimestampCheckbox = document.getElementById(
          curr + "-" + currTimestamp + "-selected"
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
    if (entry !== null && entry !== undefined) {
      Object.keys(entry).forEach((currWord) => {
        const wordInput = document.getElementById(
          currWord + "-selected"
        ) as HTMLInputElement;

        if (wordInput != null) {
          wordInput.checked = false;
        }

        selectAllTimes(currWord);
      });
    }
  };

  const playClip = (start: number, end: number) => {
    try {
      const videoPlayer = document.getElementsByTagName(
        "video"
      )[0] as HTMLVideoElement;

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

  const confirmSelection = () => {
    const checkedWords: { [index: string]: number[][] } = {};
    const checkedSuggestedWords: { [index: string]: number[][] } = {};

    if (entry !== null && entry !== undefined) {
      Object.keys(entry).forEach((currWord) => {
        const wordCheckbox = document.getElementById(
          currWord + "-selected"
        ) as HTMLInputElement;
        const wordOuter = document.getElementById(
          currWord + "-outer-selected"
        ) as HTMLDivElement;

        if (wordOuter != null && wordCheckbox.checked) {
          if (checkInSuggestedWords(currWord)) {
            checkedSuggestedWords[currWord] = entry[currWord];
          } else {
            checkedWords[currWord] = entry[currWord];
          }

          dispatch(
            removeSelectedWords({
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
              currWord + "-" + currTime + "-selected"
            ) as HTMLInputElement;
            const currTimeOuter = document.getElementById(
              currWord + "-" + currTime + "-outer-selected"
            ) as HTMLDivElement;

            if (currTimeStampInput != null && currTimeStampInput.checked) {
              selectedTimes.push(currTime);
              console.log("currTimeOuter being removed: ", currTime);

              dispatch(
                removeSelectedWords({
                  currWord: currWord,
                  removeTimestamp: currTime,
                  all: false,
                })
              );
            }
          });

          if (lengthList === selectedTimes.length) {
            console.log("WordOuter all not checked: ", wordOuter);
            const toRemove = document.getElementById(
              currWord + "-outer-selected"
            ) as HTMLDivElement;
            toRemove.style.display = "none";
          }

          if (checkInSuggestedWords(currWord)) {
            if (selectedTimes.length > 0)
              checkedSuggestedWords[currWord] = entry[currWord];
          } else {
            if (selectedTimes.length > 0)
              checkedWords[currWord] = entry[currWord];
          }
        }
      });

      dispatch(addUnselectedWords({ entries: checkedWords }));
      dispatch(addSuggestedWords({ entries: checkedSuggestedWords }));
      resetSelection();
    }
  };

  const uncheckWord = (checked: boolean, currWord: string) => {
    if (!checked) {
      const wordInput = document.getElementById(
        currWord + "-selected"
      ) as HTMLInputElement;
      wordInput.checked = false;
    }
  };

  const selectAll = (checked: boolean) => {
    if (entry != null && entry !== undefined) {
      const searchTerm = (
        document.getElementById("search-bar-selected") as HTMLInputElement
      ).value;

      Object.keys(entry).forEach((currWord) => {
        const wordInput = document.getElementById(
          currWord + "-selected"
        ) as HTMLInputElement;

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

  const checkInSuggestedWords = (word: string): boolean => {
    if (originalSuggestedWords[word] === undefined) return false;
    else return true;
  };

  const expandDiv = (curr: string) => {
    const currWordExpander = document.getElementById(
      curr + "-checkbox-selected"
    ) as HTMLInputElement;

    currWordExpander.checked = !currWordExpander.checked;
    expand(curr);
  };

  const selectTimestamp = (curr: string, time: string) => {
    const currTimestampCheckbox = document.getElementById(
      curr + "-" + time + "-selected"
    ) as HTMLInputElement;

    currTimestampCheckbox.checked = !currTimestampCheckbox.checked;
    uncheckWord(currTimestampCheckbox.checked, curr);
  };

  return (
    <div id="selected-words" style={{ display: "block", height: "100%" }}>
      <div
        style={{
          display: "flex",
          height: "8%",
          minHeight: checkSmaller() ? "6vh" : "4vh",
        }}
      >
        <input
          id="search-bar-selected"
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
            margin: "auto 0px",
            width: "100%",
            justifyContent: "end",
            maxWidth: "47.5%",
          }}
        >
          <button
            style={{
              borderRadius: "5px",
              color: "#454545",
              height: checkSmaller() ? "4vh" : "3vh",
            }}
            onClick={() => {
              confirmSelection();
            }}
          >
            Remove
          </button>
        </div>
      </div>

      <label style={{ margin: "2.5% 0" }}>
        <input
          style={{ margin: "0" }}
          type="checkbox"
          id="select-all-selected"
          onClick={(e) => {
            selectAll((e.target as HTMLInputElement).checked);
          }}
        />
      </label>

      <div
        style={{
          height: "85%",
          maxHeight: "85%",
          overflow: "scroll",
        }}
      >
        {entry != null ? (
          Object.keys(entry)
            .sort()
            .map((curr) => {
              return (
                <div
                  className="word-shell"
                  style={{
                    display: "flex",
                    padding: "0.5%",
                  }}
                  id={curr + "-outer-selected"}
                  key={curr + "-outer-selected"}
                >
                  <div
                    className="collapsible"
                    id={curr + "-collapsible-selected"}
                    style={{ width: "100%" }}
                    onClick={() => {
                      expandDiv(curr);
                    }}
                  >
                    <input
                      type="checkbox"
                      id={curr + "-selected"}
                      name={curr + "-selected"}
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
                        id={curr + "-checkbox-selected"}
                        style={{ display: "none" }}
                      />
                      <span className="expander" id={curr + "-show-selected"}>
                        [+]
                      </span>
                    </label>

                    <div
                      className="expanded"
                      id={curr + "-expand-selected"}
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
                            id={curr + "-" + time + "-outer-selected"}
                            key={curr + "-" + time + "-outer-selected"}
                            onClick={(e) => {
                              e.stopPropagation();
                              selectTimestamp(curr, time.toString());
                            }}
                          >
                            <input
                              type="checkbox"
                              id={curr + "-" + time + "-selected"}
                              name={curr + "-" + time + "-selected"}
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
            })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SelectedWords;
