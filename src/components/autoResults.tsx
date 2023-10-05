import React from "react";
import Toggle from "./toggle";
import { componentIDs } from "../store/features/formSlice";

const AutoResults = () => {
  return (
    <Toggle id={componentIDs.autoResults}>
      <div className="submit-form"> Test </div>
    </Toggle>
  );
};

export default AutoResults;
