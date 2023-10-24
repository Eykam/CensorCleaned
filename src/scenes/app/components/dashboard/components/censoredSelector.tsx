import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../../../store/store";
import "../../../css/wordSelector.css";
import {
  removeSelectedWords,
  addUnselectedWords,
  addSuggestedWords,
} from "../../../../../store/features/dataSlice";
import { Checkbox, Button } from "@mui/material";
import { FixedSizeList as List } from "react-window";
import { Callers } from "./wordCard";
import WordsList from "./wordsList";
import { updateWord } from "../../../../../store/features/formSlice";

const CensoredSelector = ({
  displayWord,
}: {
  displayWord: (word: string, caller: string) => void;
}) => {
  const dispatch = useAppDispatch();

  const entry = useAppSelector((state) => {
    if (state.data.censorship.censorList)
      return state.data.censorship.censorList;
    else return {};
  });
  const originalSuggestedWords = useAppSelector(
    (state) => state.data.originalSuggestedWords
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleEntry, setVisibility] = useState(Object.keys(entry));

  useEffect(() => {
    const search = async (term: string) => {
      if (term !== "") {
        setVisibility(Object.keys(entry).filter((word) => word.includes(term)));
      } else {
        setVisibility(Object.keys(entry));
      }
    };

    search(searchTerm);
  }, [entry, searchTerm]);
  // const checkSmaller = () => {
  //   return window.innerWidth <= 1500;
  // };

  // const checkBrowser = () => {
  //   return window.matchMedia("(max-width: 767px)").matches;
  // };

  // const expand = (curr: string) => {
  //   const currExpander = document.getElementById(
  //     curr + "-expand-selected"
  //   ) as HTMLDivElement;
  //   const currToggle = document.getElementById(
  //     curr + "-checkbox-selected"
  //   ) as HTMLInputElement;
  //   const currShowButton = document.getElementById(
  //     curr + "-show-selected"
  //   ) as HTMLSpanElement;

  //   if (currExpander && currShowButton && currToggle.checked === true) {
  //     currExpander.style.display = "block";
  //     currShowButton.innerText = "[-]";
  //   } else {
  //     currExpander.style.display = "none";
  //     currShowButton.innerText = "[+]";
  //   }
  // };

  // const search = () => {
  //   const searchTerm = (
  //     document.getElementById("search-bar-selected") as HTMLInputElement
  //   ).value;

  //   console.log('Search Value: "', searchTerm, '"');

  //   if (entry != null) {
  //     Object.keys(entry).forEach((curr) => {
  //       const currContainer = document.getElementById(curr + "-outer-selected");

  //       if (currContainer != null) {
  //         if (searchTerm === "") {
  //           currContainer.style.display = "flex";
  //         }

  //         if (!curr.toLocaleLowerCase().includes(searchTerm.toLowerCase())) {
  //           currContainer.style.display = "none";
  //         } else {
  //           currContainer.style.display = "flex";
  //         }
  //       }
  //     });
  //   }
  // };

  // const printTimeStamp = (seconds: number[]): string => {
  //   let updatedTimestamps: string[] | null = null;

  //   seconds.forEach((currSeconds) => {
  //     const minutes = Math.floor(currSeconds / 60);
  //     const remainingSeconds = Math.floor(currSeconds - minutes * 60);

  //     if (updatedTimestamps == null) {
  //       updatedTimestamps = [
  //         String(minutes).padStart(2, "0") +
  //           ":" +
  //           String(remainingSeconds).padStart(2, "0"),
  //       ];
  //     } else {
  //       updatedTimestamps.push(
  //         String(minutes).padStart(2, "0") +
  //           ":" +
  //           String(remainingSeconds).padStart(2, "0")
  //       );
  //     }
  //   });

  //   if (updatedTimestamps)
  //     return updatedTimestamps[0] + " - " + updatedTimestamps[1];

  //   return "";
  // };

  // const selectAllTimes = (curr: string) => {
  //   const wordOuter = document.getElementById(
  //     curr + "-selected"
  //   ) as HTMLInputElement;

  //   if (entry != null) {
  //     entry[curr].forEach((currTimestamp) => {
  //       const currTimestampCheckbox = document.getElementById(
  //         curr + "-" + currTimestamp + "-selected"
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
  //   if (entry !== null && entry !== undefined) {
  //     Object.keys(entry).forEach((currWord) => {
  //       const wordInput = document.getElementById(
  //         currWord + "-selected"
  //       ) as HTMLInputElement;

  //       if (wordInput != null) {
  //         wordInput.checked = false;
  //       }

  //       selectAllTimes(currWord);
  //     });
  //   }
  // };

  // const playClip = (start: number, end: number) => {
  //   try {
  //     const videoPlayer = document.getElementsByTagName(
  //       "video"
  //     )[0] as HTMLVideoElement;

  //     const audioPlayer = document.getElementsByTagName(
  //       "audio"
  //     )[0] as HTMLAudioElement;

  //     const player = videoPlayer !== undefined ? videoPlayer : audioPlayer!;

  //     function checkTime() {
  //       if (player.currentTime >= end + 0.25) {
  //         player.pause();
  //       } else {
  //         /* call checkTime every 1/10th
  //               second until endTime */
  //         setTimeout(checkTime, 100);
  //       }
  //     }

  //     /* stop if playing (otherwise ignored) */
  //     player.pause();
  //     /* set video start time */
  //     player.currentTime = start - 0.25;
  //     /* play video */
  //     player.play();
  //     /* check the current time and
  //        pause IF/WHEN endTime is reached */
  //     checkTime();
  //   } catch (e) {
  //     console.log("Error playing clip: ", (e as Error).message);
  //   }
  // };

  // const confirmSelection = () => {
  //   const checkedWords: { [index: string]: number[][] } = {};
  //   const checkedSuggestedWords: { [index: string]: number[][] } = {};

  //   if (entry !== null && entry !== undefined) {
  //     Object.keys(entry).forEach((currWord) => {
  //       const wordCheckbox = document.getElementById(
  //         currWord + "-selected"
  //       ) as HTMLInputElement;
  //       const wordOuter = document.getElementById(
  //         currWord + "-outer-selected"
  //       ) as HTMLDivElement;

  //       if (wordOuter != null && wordCheckbox.checked) {
  //         if (checkInSuggestedWords(currWord)) {
  //           checkedSuggestedWords[currWord] = entry[currWord];
  //         } else {
  //           checkedWords[currWord] = entry[currWord];
  //         }

  //         dispatch(
  //           removeSelectedWords({
  //             currWord: currWord,
  //             removeTimestamp: [],
  //             all: true,
  //           })
  //         );
  //       } else {
  //         const selectedTimes: number[][] = [];
  //         const lengthList = entry[currWord].length;
  //         const currTimestamps = Object.values(entry[currWord]);

  //         currTimestamps.forEach((currTime) => {
  //           const currTimeStampInput = document.getElementById(
  //             currWord + "-" + currTime + "-selected"
  //           ) as HTMLInputElement;
  //           const currTimeOuter = document.getElementById(
  //             currWord + "-" + currTime + "-outer-selected"
  //           ) as HTMLDivElement;

  //           if (currTimeStampInput != null && currTimeStampInput.checked) {
  //             selectedTimes.push(currTime);
  //             console.log("currTimeOuter being removed: ", currTime);

  //             dispatch(
  //               removeSelectedWords({
  //                 currWord: currWord,
  //                 removeTimestamp: currTime,
  //                 all: false,
  //               })
  //             );
  //           }
  //         });

  //         if (lengthList === selectedTimes.length) {
  //           console.log("WordOuter all not checked: ", wordOuter);
  //           const toRemove = document.getElementById(
  //             currWord + "-outer-selected"
  //           ) as HTMLDivElement;
  //           toRemove.style.display = "none";
  //         }

  //         if (checkInSuggestedWords(currWord)) {
  //           if (selectedTimes.length > 0)
  //             checkedSuggestedWords[currWord] = entry[currWord];
  //         } else {
  //           if (selectedTimes.length > 0)
  //             checkedWords[currWord] = entry[currWord];
  //         }
  //       }
  //     });

  //     dispatch(addUnselectedWords({ entries: checkedWords }));
  //     dispatch(addSuggestedWords({ entries: checkedSuggestedWords }));
  //     resetSelection();
  //   }
  // };

  // const uncheckWord = (checked: boolean, currWord: string) => {
  //   if (!checked) {
  //     const wordInput = document.getElementById(
  //       currWord + "-selected"
  //     ) as HTMLInputElement;
  //     wordInput.checked = false;
  //   }
  // };

  // const selectAll = (checked: boolean) => {
  //   if (entry != null && entry !== undefined) {
  //     const searchTerm = (
  //       document.getElementById("search-bar-selected") as HTMLInputElement
  //     ).value;

  //     Object.keys(entry).forEach((currWord) => {
  //       const wordInput = document.getElementById(
  //         currWord + "-selected"
  //       ) as HTMLInputElement;

  //       if (wordInput != null) {
  //         if (searchTerm !== undefined && searchTerm !== "") {
  //           if (currWord.includes(searchTerm.toLowerCase()))
  //             wordInput.checked = checked;
  //         } else {
  //           wordInput.checked = checked;
  //         }
  //       }
  //     });
  //   }
  // };

  // const checkInSuggestedWords = (word: string): boolean => {
  //   if (originalSuggestedWords[word] === undefined) return false;
  //   else return true;
  // };

  // const expandDiv = (curr: string) => {
  //   const currWordExpander = document.getElementById(
  //     curr + "-checkbox-selected"
  //   ) as HTMLInputElement;

  //   currWordExpander.checked = !currWordExpander.checked;
  //   expand(curr);
  // };

  // const selectTimestamp = (curr: string, time: string) => {
  //   const currTimestampCheckbox = document.getElementById(
  //     curr + "-" + time + "-selected"
  //   ) as HTMLInputElement;

  //   currTimestampCheckbox.checked = !currTimestampCheckbox.checked;
  //   uncheckWord(currTimestampCheckbox.checked, curr);
  // };
  const selectAll = (unselect: boolean) => {
    let data = entry;

    if (unselect) {
      let visibleWords = Object.keys(data).filter((word) => {
        return word.includes(searchTerm);
      });

      visibleWords.forEach((word) => {
        dispatch(
          updateWord({
            word: word,
            timestamps: [],
            caller: Callers.selected,
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
              caller: Callers.selected,
            })
          );
        });
      }
    }
  };

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

  return (
    <div id="selected-words" style={{ display: "block" }}>
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
              float: "right",
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
              // onClick={confirmSelection}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>

      <Checkbox
        size="small"
        sx={{
          color: "rgb(200,200,200)",
          "&.Mui-checked": {
            color: "rgb(180,180,180)",
          },
        }}
        style={{ margin: "0", marginTop: "4%", padding: "0" }}
        id="select-all"
        onClick={(e) => {
          let checked = (e.target as HTMLInputElement).checked;
          selectAll(!checked);
        }}
      />

      <div id="unselected-outer" style={{}}>
        <List
          height={300}
          width={"100%"}
          itemCount={visibleEntry.length}
          itemSize={25}
          itemData={{ list: visibleEntry, caller: Callers.selected }}
        >
          {rows}
        </List>
      </div>
    </div>
  );
};

export default CensoredSelector;
