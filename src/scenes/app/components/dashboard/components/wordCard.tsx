import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Checkbox,
} from "@mui/material";
import { WordList } from "../../../../../store/features/formSlice";
import { updateTimestamp } from "../../../../../store/features/formSlice";

export const Callers = {
  unselected: "unselected",
  selected: "selected",
  suggested: "suggested",
};

const WordCard = ({ word, caller }: { word: string; caller: string }) => {
  const dispatch = useAppDispatch();

  const badWords = useAppSelector(
    (state) => state.data.transcription.response?.badWords
  );

  const unselected = useAppSelector((state) => state.data.unselectedWords);
  const selected = useAppSelector((state) => state.data.censorship.censorList);
  const suggested = useAppSelector((state) => state.data.suggestedWords);

  const checkList = useAppSelector((state) => {
    if (caller === Callers.suggested || caller === Callers.unselected)
      return state.form.unselectedList as WordList;
    else return state.form.selectedList as WordList;
  });

  const playClip = (start: number, end: number) => {
    try {
      const videoPlayer = document.getElementsByTagName(
        "video"
      )[0] as HTMLVideoElement;

      console.log("Videoplayer: ", videoPlayer);

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

  const getDataSource = () => {
    let entry =
      caller === Callers.suggested
        ? suggested
        : caller === Callers.unselected
        ? unselected
        : selected;

    return entry;
  };

  const getCount = (curr: string) => {
    let entry = getDataSource();

    if (entry == null || entry === undefined || entry[curr] === undefined) {
      return [];
    } else {
      return entry[curr].length;
    }
  };

  const checked = (timestamp: string) => {
    if (checkList[word]) return checkList[word].includes(timestamp);
    return false;
  };

  const onCheck = (timestamp: string, checked: boolean) => {
    dispatch(
      updateTimestamp({
        word: word,
        caller: caller === Callers.suggested ? Callers.unselected : caller,
        timestamp: timestamp,
        remove: checked,
      })
    );
  };

  const selectAll = (checked: boolean) => {
    const entry = getDataSource();

    if (entry != null && entry !== undefined && entry[word] !== undefined) {
      let timestamps = entry[word];
      timestamps.forEach((timestamp) => {
        dispatch(
          updateTimestamp({
            word: word,
            caller: caller === Callers.suggested ? Callers.unselected : caller,
            timestamp: JSON.stringify(timestamp),
            remove: checked,
          })
        );
      });
    }
  };

  const timestampComponent = (curr: string) => {
    let entry = getDataSource();

    if (entry != null && entry !== undefined && entry[curr] !== undefined) {
      console.log("Timestamps test:", entry[curr]);
      return (
        <div
          className="expanded"
          id={curr + "-expand"}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {entry[curr].map((time) => {
            return (
              <div
                className="timestamp-shell"
                style={{
                  marginLeft: "2%",
                  width: "100%",
                  paddingRight: "0%",
                }}
                id={curr + "-" + time + "-outer"}
                key={curr + "-" + time + "-outer"}
                // onClick={(e) => {
                //   e.stopPropagation();
                //   selectTimestamp(curr, time.toString());
                // }}
              >
                {/* <input
                  type="checkbox"
                  id={curr + "-" + time}
                  name={curr + "-" + time}
                  onClick={(e) => {
                    e.stopPropagation();
                    const checked: boolean = (e.target as HTMLInputElement)
                      .checked;
                    uncheckWord(checked, curr);
                  }}
                /> */}

                <Checkbox
                  size="small"
                  sx={{
                    color: "rgb(200,200,200)",
                    "&.Mui-checked": {
                      color: "rgb(180,180,180)",
                    },
                  }}
                  style={{ margin: "0", padding: "0" }}
                  id={curr + "-" + time}
                  name={curr + "-" + time}
                  defaultChecked={false}
                  checked={checked(JSON.stringify(time))}
                  onClick={(e) => {
                    let checked = (e.target as HTMLInputElement).checked;
                    onCheck(JSON.stringify(time), !checked);
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
      );
    }
  };

  return (
    <div
      style={{
        display: "block",
        maxWidth: "100%",
        height: "100%",
      }}
    >
      {word === "" ? (
        <div
          style={{
            display: "flex",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          SELECT A WORD{" "}
        </div>
      ) : (
        <div style={{ padding: "2%" }}>
          <div>
            <span style={{ fontSize: "200%" }}>
              <b>{word}</b>
            </span>
            <span style={{ color: "gray" }}> count=[{getCount(word)}]</span>
          </div>

          {badWords && badWords[word] && (
            <div style={{ display: "block", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  width: "99%",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    justifyContent: "start",
                    width: "50%",
                  }}
                >
                  <div style={{ display: "flex", position: "relative" }}>
                    <h4
                      style={{
                        margin: "auto 0",
                      }}
                    >
                      Timestamps{" "}
                    </h4>

                    <Checkbox
                      size="small"
                      sx={{
                        color: "rgb(200,200,200)",
                        "&.Mui-checked": {
                          color: "rgb(180,180,180)",
                        },
                      }}
                      style={{ margin: "0", padding: "0" }}
                      defaultChecked={false}
                      onClick={(e) => {
                        let checked = (e.target as HTMLInputElement).checked;
                        selectAll(!checked);
                      }}
                    />

                    <div style={{ display: "flex", marginLeft: "auto" }}>
                      {Callers.unselected ? (
                        <Button
                          variant="contained"
                          style={{
                            margin: "auto 0",
                            marginLeft: "auto",
                            fontWeight: "bold",
                            width: "100%",
                            height: "70%",
                            color: "lightgray",
                            backgroundColor: "rgb(80,80,80)",
                          }}
                          // onClick={submit}
                        >
                          CENSOR
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          style={{
                            marginLeft: "auto",
                            fontWeight: "bold",
                            width: "20%",
                            color: "lightgray",
                            backgroundColor: "rgb(80,80,80)",
                          }}
                          // onClick={submit}
                        >
                          UNCENSOR
                        </Button>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      background: "rgb(100, 100, 100)",
                      margin: "0%",
                      marginRight: "4%",
                      padding: "2%",
                      maxHeight: "8vh",
                      height: "8vh",
                      borderRadius: "5px",
                      overflow: "hidden",
                      overflowY: "scroll",
                      width: "96%",
                    }}
                  >
                    {timestampComponent(word)}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height: "70%",
                      width: "100%",
                    }}
                  >
                    <div style={{ margin: "auto", height: "auto" }}>
                      <Box
                        sx={{ position: "relative", display: "inline-flex" }}
                      >
                        <CircularProgress
                          variant="determinate"
                          size="5rem"
                          thickness={8}
                          color={
                            badWords[word]["percentage"] <= 0.5
                              ? "success"
                              : "error"
                          }
                          value={
                            badWords[word]["percentage"] <= 0.5
                              ? (1 - badWords[word]["percentage"]) * 100
                              : badWords[word]["percentage"] * 100
                          }
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="caption"
                            fontSize="1.5rem"
                            fontWeight="bold"
                          >
                            {badWords[word]["percentage"] <= 0.5
                              ? (1 - badWords[word]["percentage"]) * 100
                              : badWords[word]["percentage"] * 100}
                          </Typography>
                        </Box>
                      </Box>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        margin: "auto",
                        flexDirection: "row",
                        textAlign: "center",
                      }}
                    >
                      <h3 style={{ margin: "0", padding: "0" }}>
                        Reason:
                        <span style={{ fontSize: "90%", color: "gray" }}>
                          {" "}
                          {badWords[word]["reason"] === "N/A"
                            ? "No Violation"
                            : badWords[word]["reason"]}
                        </span>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WordCard;
