import React, { useEffect } from "react";

interface Props {
  bgColor: string;
  completed: string;
}

const ProgressBar = ({ bgColor, completed }: Props) => {
  useEffect(() => {
    console.log("completed", completed);
  });

  return (
    <div id="container-styles">
      <div
        id="filler-styles"
        style={{ width: `${completed}%`, backgroundColor: bgColor }}
      >
        <span id="label-styles">{`${parseFloat(completed).toFixed(2)}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
