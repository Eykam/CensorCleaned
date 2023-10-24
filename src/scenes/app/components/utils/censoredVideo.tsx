import React, { useEffect, useRef } from "react";
import Toggle from "../../../utils/components/toggle";
import {
  componentIDs,
  showCensoredVideo,
} from "../../../../store/features/formSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { RequestStates } from "../../../../store/features/dataSlice";
import Loading from "../../../utils/components/loading";

const CensoredVideo = () => {
  const dispatch = useAppDispatch();

  const censorStatus = useAppSelector((state) => state.data.censorship.status);

  const censorURLObject = useAppSelector(
    (state) => state.data.censorship.censorURL
  );

  const fileInfo = useAppSelector((state) => state.file.uploadedFile);
  const requestTime = useAppSelector(
    (state) => state.data.transcription.response?.requestTime
  );
  const totalWordsCensored = useAppSelector(
    (state) => state.data.censorship.censorList
  );

  const checkBrowser = () => {
    return window.matchMedia("(max-width: 767px)").matches;
  };

  const checkIFSmallLaptop = () => {
    return window.innerWidth <= 1500;
  };

  const getTotalWords = () => {
    let total = 0;
    if (totalWordsCensored !== undefined) {
      Object.keys(totalWordsCensored).forEach((currWord) => {
        total += totalWordsCensored[currWord].length;
      });
    }

    return total;
  };

  const getSpeedUp = () => {
    const video = document.getElementById("censored-video") as HTMLVideoElement;

    return video
      ? video.duration / Number(requestTime)
      : 0 / Number(requestTime);
  };

  useEffect(() => {
    const loaderResubmit = document.getElementById(
      "loading-resubmit"
    ) as HTMLDivElement;

    const censoredVideo = document.getElementById(
      "censored-video"
    ) as HTMLVideoElement;

    if (censorStatus === RequestStates.success && censorURLObject !== "") {
      dispatch(showCensoredVideo());
      if (loaderResubmit != null) loaderResubmit.style.display = "none";
    } else if (
      censorStatus === RequestStates.pending &&
      censorURLObject !== ""
    ) {
      loaderResubmit.style.height = censoredVideo.style.height;
      loaderResubmit.style.width = censoredVideo.style.width;
      loaderResubmit.style.display = "flex";
      loaderResubmit.style.padding = "auto";
      loaderResubmit.style.margin = "auto";
    }
  }, [dispatch, censorStatus, censorURLObject]);

  return (
    <Toggle id={componentIDs.censoredVideo}>
      <div
        style={{
          width: checkBrowser() ? "100vw" : "50%",
          minWidth: "50%",
        }}
      >
        <h2> Censored Video</h2>

        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              width: "75%",
            }}
          >
            <span
              style={{
                marginRight: "5%",
                maxWidth: "100%",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              <b>File Name: </b>
              {"censored-" + fileInfo?.fileName}
            </span>

            <span style={{ marginLeft: "auto" }}>
              <b> Size: </b>
              {fileInfo?.fileSize}
            </span>
          </div>

          <br />

          <div>
            <b>Total Words Censored: </b>
            {getTotalWords()}
          </div>

          <br />

          <div>
            <b>Total Editing Time: </b>
            {requestTime} secs
          </div>

          <br />

          <div>
            <b>Speedup (compared to video length): </b>
            {getSpeedUp().toFixed(2)}x
          </div>

          <br />

          <video
            controls
            id="censored-video"
            style={{
              width: checkIFSmallLaptop() ? "90%" : "100%",
              borderRadius: "15px",
              display:
                censorStatus === RequestStates.pending ? "none" : "block",
            }}
            autoPlay
            src={censorURLObject}
          />

          <Loading loaderId="resubmit" />
        </div>
      </div>
    </Toggle>
  );
};

export default CensoredVideo;
