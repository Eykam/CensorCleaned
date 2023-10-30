import "./css/App.css";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import AppEntry from "./scenes/app";
import Home from "./scenes/home";
import Header from "./scenes/utils/components/header";
import Footer from "./scenes/utils/components/footer";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const App = () => {
  const isMobile = () => {
    return window.matchMedia("(max-width: 767px)").matches;
  };

  console.log("App Re-Render");

  return (
    <div
      className="App"
      style={{
        minWidth: "100%",
        maxWidth: "100%",
        height: "100%",
      }}
    >
      <Header />

      <div
        id="body-div"
        style={{ flexDirection: "column", justifyContent: "space-between" }}
      >
        <Provider store={store}>
          <AppEntry />
          <Home />
        </Provider>

        <Footer />
      </div>

      <div className="bg"></div>
    </div>
  );
};

export default App;
