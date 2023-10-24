import React from "react";
import Description from "./components/description";
import FAQ from "./components/faq";

const Home = () => {
  return (
    <div id="landing-page" style={{ justifyContent: "center" }}>
      <Description />
      <FAQ />
    </div>
  );
};

export default Home;
