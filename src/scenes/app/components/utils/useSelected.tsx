import React, { useState } from "react";

export interface SelectedList {
  [index: string]: Set<string>;
}

// const selected = useAppSelector((state) => state.data.censorship.censorList);

const useSelected = () => {
  const [selectedList, setSelectedList] = useState<SelectedList>();

  return selectedList;
};

export default useSelected;
