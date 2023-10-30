import React, { useState, useRef, useEffect } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Button } from "@mui/material";
import UserMenu from "./userMenu";

const Header = () => {
  const [user, setUser] = useState<null | CredentialResponse>(null);

  const isMobile = () => {
    return window.matchMedia("(max-width: 767px)").matches;
  };

  const handleSuccess = (response: CredentialResponse) => {
    console.log("Successfully logged in", response);
    // setUser(response);
  };

  const handleError = () => {
    console.log("Failed to log in");
  };

  const logOut = () => {
    // setUser(null);
  };

  // useEffect(() => {
  //   console.log("image src:", getProfileImage());
  //   getProfileImage();
  // }, [user]);

  return (
    <div
      style={{
        width: "97%",
        color: "rgb(226, 226, 226)",
        background: "#111111",
        padding: isMobile() ? "2% 1%" : ".5% 1%",
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "solid 2px rgb(30, 30, 30)",
      }}
    >
      <h2
        style={
          isMobile()
            ? {
                display: "flex",
                margin: "0",
                marginLeft: "4%",
                cursor: "pointer",
                alignItems: "center",
              }
            : {
                display: "flex",
                margin: "0",
                cursor: "pointer",
                alignItems: "center",
              }
        }
        onClick={() => {
          window.location.reload();
        }}
      >
        Sanitize.gg
      </h2>

      {user ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <UserMenu img={getProfileImage()} /> */}
        </div>
      ) : (
        // <GoogleLogin
        //   onSuccess={(response) => handleSuccess(response)}
        //   onError={handleError}
        //   auto_select={true}
        //   // isSignedIn={true}
        // />
        <></>
      )}
    </div>
  );
};

export default Header;
