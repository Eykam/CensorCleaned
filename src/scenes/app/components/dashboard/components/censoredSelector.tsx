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
    return state.data.censorship.censorList;
  });

  const originalSuggestedWords = useAppSelector(
    (state) => state.data.originalSuggestedWords
  );

  const checkList = useAppSelector((state) => state.form.selectedList);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleEntry, setVisibility] = useState(
    entry ? Object.keys(entry) : []
  );

  useEffect(() => {
    const search = async (term: string) => {
      let data = entry ? Object.keys(entry) : [];
      if (term !== "") {
        setVisibility(data.filter((word) => word.includes(term)));
      } else {
        setVisibility(data);
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

  // const checkInSuggestedWords = (word: string): boolean => {
  //   if (originalSuggestedWords[word] === undefined) return false;
  //   else return true;
  // };
  const removeAllTimesWord = (word: string, timestamps: string[]): boolean => {
    let data = entry || {};
    console.log("test print:", timestamps);
    console.log("test worD:", word);
    console.log("test1:", data);
    console.log("test2:", data[word]);
    return timestamps.length === data[word].length;
  };

  const updateStore = (
    word: string,
    timestamps: string[] | undefined = undefined
  ) => {
    if (timestamps) {
      timestamps.forEach((timestamp) => {
        let numTimestamp = JSON.parse(timestamp) as number[];
        if (caller === Callers.suggested) {
          dispatch(
            removeSuggestedWords({
              currWord: word,
              removeTimestamp: numTimestamp,
              all: false,
            })
          );
        } else {
          dispatch(
            removeUnselectedWords({
              currWord: word,
              removeTimestamp: numTimestamp,
              all: false,
            })
          );
        }

        dispatch(
          updateTimestamp({
            word: word,
            caller: caller,
            timestamp: timestamp,
            remove: true,
          })
        );
      });
    } else {
      if (caller === Callers.suggested) {
        dispatch(
          removeSuggestedWords({
            currWord: word,
            removeTimestamp: [],
            all: true,
          })
        );
      } else {
        dispatch(
          removeUnselectedWords({
            currWord: word,
            removeTimestamp: [],
            all: true,
          })
        );
      }

      dispatch(
        updateWord({
          word: word,
          timestamps: [],
          caller: caller,
        })
      );
    }
  };

  const confirmSelection = () => {
    const selected: { [index: string]: number[][] } = {};

    Object.keys(checkList).forEach((word) => {
      let timestamps = checkList[word]["timestamps"];
      let caller = checkList[word]["caller"];
      let data = caller === Callers.suggested ? suggestions : entry;

      if (timestamps) {
        let removeAllTimes = removeAllTimesWord(caller, word, timestamps);

        if (removeAllTimes) {
          selected[word] = data[word];
          updateStore(caller, word);
        } else {
          let numTimestamps = timestamps.map((timestamp) => {
            return JSON.parse(timestamp) as number[];
          });
          selected[word] = numTimestamps;
          updateStore(caller, word, timestamps);
        }
      }
    });

    dispatch(addCensorWords({ entries: selected }));
  };

  const selectAll = (unselect: boolean) => {
    let data = entry ? entry : {};

    if (unselect) {
      visibleEntry.forEach((word) => {
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
        visibleEntry.forEach((word) => {
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
        {visibleEntry.length > 0 ? (
          <List
            height={300}
            width={"100%"}
            itemCount={visibleEntry.length}
            itemSize={25}
            itemData={{ list: visibleEntry, caller: Callers.selected }}
          >
            {rows}
          </List>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CensoredSelector;
