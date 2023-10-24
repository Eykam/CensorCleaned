import React, { useState } from "react";
import { useAppSelector } from "../../../../store/store";
import { Callers } from "../dashboard/components/wordCard";

export interface UnselectedList {
  [index: string]: Set<string>;
}

const useUnselected = () => {
  const [unselectedList, setUnselectedList] = useState<UnselectedList>({});

  const unselected = useAppSelector((state) => state.data.unselectedWords);
  const suggested = useAppSelector((state) => state.data.suggestedWords);

  const addToCensorList = (
    word: string,
    all: boolean,
    timestamp: string,
    caller: string
  ) => {
    let data = caller === Callers.suggested ? suggested : unselected;

    if (word !== "") {
      if (all) {
        setUnselectedList((prev) => {
          let timestamps = new Set<string>();

          data[word].map((timestamp) => {
            timestamps.add(JSON.stringify(timestamp));
          });

          prev[word] = timestamps;
          return prev;
        });

        return;
      }

      if (unselectedList[word]) {
        let merged = unselectedList[word].add(timestamp);

        setUnselectedList((prev) => {
          prev[word] = merged;
          return prev;
        });

        return;
      } else {
        setUnselectedList((prev) => {
          prev[word] = new Set(timestamp);
          return prev;
        });
        return;
      }
    }
  };

  const removeFromCensorList = (
    word: string,
    all: boolean,
    timestamp: string
  ) => {
    if (word !== "") {
      if (all) {
        setUnselectedList((prev) => {
          delete prev[word];
          return prev;
        });

        return;
      }

      if (unselectedList[word]) {
        setUnselectedList((prev) => {
          if (prev[word].size === 1) {
            if (prev[word].has(timestamp)) delete prev[word];
          } else {
            prev[word].delete(timestamp);
          }

          return prev;
        });

        return;
      }
    }
  };

  return unselectedList;
};

export default useUnselected;
