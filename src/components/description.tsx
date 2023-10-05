import React from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { componentIDs } from "../store/features/formSlice";
import Toggle from "./toggle";

const Description = () => {
  const checkSmaller = () => {
    return window.innerWidth <= 1500;
  };

  const checkMobile = () => {
    return window.matchMedia("(max-width: 767px)").matches;
  };

  const enterApp = () => {
    const landingPage = document.getElementById(
      "landing-page"
    ) as HTMLDivElement;
    const appEntry = document.getElementById("app-entry") as HTMLDivElement;

    if (landingPage) landingPage.style.display = "none";
    if (appEntry) appEntry.style.display = "flex";

    return;
  };

  return (
    <Toggle id={componentIDs.description}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: checkMobile() ? "80vh" : "50vh",
          width: checkMobile() ? "90%" : "60%",
          color: "lightgray",
          //   fontWeight: "bold",
          padding: "5%",
          margin: "auto",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontSize: "300%",
            margin: "0",
            marginBottom: "2%",
            color: "white",
          }}
        >
          AI Content Moderation
        </h2>
        <p style={checkSmaller() ? { fontSize: "100%" } : { fontSize: "150%" }}>
          Welcome to Sanitize.gg. Our technology allows users to automatically
          edit videos while ensuring they meet content policies of their
          intended platform. Our platform is designed for video editors who need
          to carefully monitor and moderate their content, whether it's for
          social media, streaming platforms, or any other reason. With
          Sanitize.gg, you can trust that your content will always meet the
          guidelines and regulations of your chosen platform.
          {/* <br />
        Here's how it works - users submit their media to the Sanitize.gg
        platform and our advanced AI algorithms quickly detect and censor any
        words or content that may violate the policies of the platform the media
        is intended for. The sanitized media is then returned to the user, ready
        to be uploaded and shared without any concerns about policy violations.
        <br />
        <br />
        Our platform is perfect for video editors who need to carefully monitor
        and moderate their content, whether it's for social media, streaming
        platforms, or any other reason. With Sanitize.gg, you can trust that
        your content will always meet the guidelines and regulations of your
        chosen platform. */}
        </p>

        <button
          style={{
            display: "flex",
            width: checkMobile() ? "40%" : "20%",
            minHeight: checkMobile() ? "7vh" : "5vh",
            margin: "auto",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            borderRadius: "7px",
            fontWeight: "bold",
            color: "lightgrey",
            border: "solid 2px lightgrey",
            boxShadow: "10px 5px 5px rgb(50,50,50)",
          }}
          onMouseOver={(e) => {
            const el = e.target as HTMLButtonElement;
            el.style.background = "rgb(95, 95, 95)";
          }}
          onMouseOut={(e) => {
            const el = e.target as HTMLButtonElement;
            el.style.background = "none";
          }}
          onClick={() => {
            enterApp();
          }}
        >
          Use App
        </button>
      </div>
    </Toggle>
  );
};

export default Description;
