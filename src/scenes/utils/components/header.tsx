import React from "react";

const Header = () => {
  const isMobile = () => {
    return window.matchMedia("(max-width: 767px)").matches;
  };

  return (
    <div
      style={{
        width: "100%",
        color: "rgb(226, 226, 226)",
        background: "#111111",
        padding: isMobile() ? "2% 0" : ".5% 0",
        paddingLeft: "1%",
        display: "flex",
        borderBottom: "solid 2px rgb(30, 30, 30)",
      }}
    >
      <h2
        style={
          isMobile()
            ? {
                margin: "0",
                marginLeft: "4%",
                cursor: "pointer",
              }
            : { margin: "0", cursor: "pointer" }
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
          width: isMobile() ? "15%" : "4%",
          fontWeight: "bold",
          color: "lightgrey",
          background: "none",

          border: "solid 2px lightgrey",
          cursor: "pointer",
        }}
        onClick={() => {}}
      >
        Log In
      </button>
    </div>
  );
};

export default Header;
