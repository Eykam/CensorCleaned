import React from "react";
import Toggle from "./toggle";
import { componentIDs } from "../store/features/formSlice";

const ManualResults = () => {
  return (
    <Toggle id={componentIDs.manualResults}>
      <div id="submit-form"> Test </div>
    </Toggle>
  );
};

export default ManualResults;
