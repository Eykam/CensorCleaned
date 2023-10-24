import React, { useState } from "react";
import Toggle from "../../../utils/components/toggle";
import { componentIDs } from "../../../../store/features/formSlice";
import { Box, Paper } from "@mui/material";
import AudioWave from "../../../utils/components/audioWave";
import FileDetails from "../utils/fileDetails";
import { useAppSelector } from "../../../../store/store";
import VideoCard from "../utils/videoCard";
import { Callers } from "./components/wordCard";
import WordCard from "./components/wordCard";
import CensorSubmit from "./components/censorSubmit";
import SelectorContainer from "./components/selectorContainer";

const Dashboard = ({
  currWords,
}: {
  currWords: {
    [index: string]: number[][];
  } | null;
}) => {
  const file = useAppSelector((state) => state.file.uploadedFile);

  const [currWordInfo, setCurrWordInfo] = useState<{
    word: string;
    caller: string;
  }>({ word: "", caller: Callers.unselected });

  const checkBrowser = () => {
    return window.innerWidth <= 1500;
  };

  const changeWord = (word: string, caller: string) => {
    setCurrWordInfo({ word: word, caller: caller });
  };

  return (
    <Toggle id={componentIDs.dashboard}>
      <Paper
        style={{
          width: "fit-content",
          height: "fit-content",
          margin: checkBrowser() ? "2% 8%" : "2% 20%",
          color: "rgb(226, 226, 226)",
          padding: "1%",
          background: "rgb(65, 65, 65)",
          boxShadow: "6px 5px 5px rgb(35,35,35)",
        }}
      >
        {/* Container for whole dashboard*/}
        <Box
          display="grid"
          gridTemplateColumns="repeat(32,1fr)"
          gridTemplateRows="repeat(9,1fr)"
          gap="20px"
          style={{ height: "fit-content" }}
        >
          {/* Container for header*/}
          <Box gridColumn="span 32" gridRow="span 1">
            <Paper
              style={{
                height: "100%",
                color: "lightgray",
                background: "rgb(70, 70, 70)",
              }}
            >
              <div style={{ display: "flex", margin: "auto" }}>
                <h1 style={{ margin: ".2%", padding: "0", marginRight: "0" }}>
                  Analyzing Audio
                </h1>
                <AudioWave />
              </div>
            </Paper>
          </Box>

          {/* Container for Video details and actual video*/}

          <Box gridColumn="span 16" gridRow="span 8">
            <Box
              style={{ height: "fit-content" }}
              display="grid"
              gridTemplateRows={"repeat(3,1fr)"}
              gridTemplateColumns={"repeat(1,1fr)"}
              gap="20px"
            >
              <Box gridRow="span 1">
                <Paper
                  style={{
                    // height: "fit-content",
                    background: "rgb(70, 70, 70)",
                    color: "lightgray",
                    maxHeight: checkBrowser() ? "22vh" : "20vh",
                    height: checkBrowser() ? "22vh" : "20vh",
                  }}
                >
                  <FileDetails file={file} />
                </Paper>
              </Box>

              <Box gridRow="span 2" style={{ height: "fit-content" }}>
                <VideoCard file={file} />
              </Box>
            </Box>
          </Box>

          {/* Container for Word card and controls*/}
          <Box gridColumn="span 16" gridRow="span 8">
            <Box
              style={{ minHeight: "fit-content" }}
              display="grid"
              gridTemplateColumns="repeat(2,1fr)"
              gap="20px"
            >
              <Box gridColumn="span 2" gridRow="span 2">
                <Paper
                  style={{
                    // height: "100%",
                    background: "rgb(70, 70, 70)",
                    color: "lightgray",
                    maxHeight: checkBrowser() ? "22vh" : "20vh",
                    height: checkBrowser() ? "22vh" : "20vh",
                  }}
                >
                  <WordCard
                    word={currWordInfo["word"]}
                    caller={currWordInfo["caller"]}
                  />
                </Paper>
              </Box>

              <SelectorContainer
                mobile={checkBrowser()}
                currWords={currWords}
                displayWord={changeWord}
              />
            </Box>
          </Box>

          {/* Container for Submit buttons and options*/}
          <Box gridColumn="span 32" gridRow="span 1">
            <Paper
              style={{
                height: "fit-content",
                background: "none",
                boxShadow: "none",
                border: "none",
              }}
            >
              <CensorSubmit />
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Toggle>
  );
};

export default Dashboard;
