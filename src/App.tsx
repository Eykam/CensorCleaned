import "./css/App.css";
import React from "react";
import FileInputForm from "./components/fileInputForm";
import { Provider } from "react-redux";
import { store } from "./store/store";
import SubmitForm from "./components/submitForm";
import Description from "./components/description";
import FAQ from "./components/faq";

const App = () => {
  const isMobile = () => {
    return window.matchMedia("(max-width: 767px)").matches;
  };

  return (
    <div
      style={{
        minWidth: "100%",
        maxWidth: "100%",
        height: "95%",
      }}
    >
      <div
        style={{
          width: "100%",
          color: "rgb(226, 226, 226)",
          background: "rgb(75, 75, 75)",
          padding: isMobile() ? "2% 0" : ".5% 0",
          paddingLeft: "1%",
          display: "flex",
        }}
      >
        <h2
          style={
            isMobile()
              ? {
                  margin: "0",
                  marginLeft: "4%",
                }
              : { margin: "0" }
          }
          onClick={() => {
            window.location.reload();
          }}
        >
          Sanitize.gg
        </h2>

        <button
          style={{
            marginLeft: "auto",
            marginRight: isMobile() ? "4%" : "3%",
            borderRadius: "7px",
            fontWeight: "bold",
            color: "lightgrey",
            background: "none",

            border: "solid 2px lightgrey",
          }}
          onClick={() => {}}
        >
          Log In
        </button>
      </div>

      <div id="body-div" style={{ flexDirection: "column" }}>
        <Provider store={store}>
          <div
            id="app-entry"
            style={{
              margin: "auto",
              display: "none",
              justifyContent: "center",
            }}
          >
            <FileInputForm />
            <SubmitForm />
          </div>
          <div id="landing-page" style={{ justifyContent: "center" }}>
            <Description />
            <FAQ />
          </div>
        </Provider>
      </div>
    </div>
  );
};

export default App;
