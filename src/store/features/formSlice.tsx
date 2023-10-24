import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Callers } from "../../scenes/app/components/dashboard/components/wordCard";

export const enum componentIDs {
  fileInput = "FILEINPUT",
  fileInfo = "FILEINFO",
  formSettings = "FORMSETTINGS",
  manualResults = "MANUALRESULTS",
  autoResults = "AUTORESULTS",
  timestampSubmit = "TIMESTAMPSUBMIT",
  submitForm = "SUBMITFORM",
  censoredVideo = "CENSOREDVIDEO",
  description = "DESCRIPTION",
  FAQ = "FAQ",
  dashboard = "DASHBOARD",
}

export interface WordList {
  [index: string]: string[];
}

export interface TimestampPayload {
  word: string;
  caller: string;
  timestamp: string;
  remove: boolean;
}

export interface WordPayload {
  word: string;
  caller: string;
  timestamps: string[];
}

const initialState: { [x: string]: boolean | WordList } = {
  [componentIDs.fileInput]: true,
  [componentIDs.fileInfo]: false,
  [componentIDs.formSettings]: true,
  [componentIDs.manualResults]: false,
  [componentIDs.autoResults]: false,
  [componentIDs.timestampSubmit]: false,
  [componentIDs.submitForm]: false,
  [componentIDs.censoredVideo]: false,
  [componentIDs.description]: true,
  [componentIDs.FAQ]: true,
  [componentIDs.dashboard]: false,
  unselectedList: {},
  selectedList: {},
  mobile: false,
};

export const formSlice = createSlice({
  name: "form",
  initialState: initialState,
  reducers: {
    hideFileInput: (state) => {
      state[componentIDs.fileInput] = false;
    },
    showFileInput: (state) => {
      state[componentIDs.fileInput] = true;
    },
    hideFileInfo: (state) => {
      state[componentIDs.fileInfo] = false;
    },
    showFileInfo: (state) => {
      state[componentIDs.fileInfo] = true;
    },
    hideFormSettings: (state) => {
      state[componentIDs.formSettings] = false;
    },
    showManualResults: (state) => {
      state[componentIDs.manualResults] = true;
    },
    hideManualResults: (state) => {
      state[componentIDs.manualResults] = false;
    },
    showAutoResults: (state) => {
      state[componentIDs.autoResults] = true;
    },
    hideAutoResults: (state) => {
      state[componentIDs.autoResults] = false;
    },
    showTimestampSubmit: (state) => {
      state[componentIDs.timestampSubmit] = true;
    },
    hideTimestampSubmit: (state) => {
      state[componentIDs.timestampSubmit] = false;
    },
    showSubmitForm: (state) => {
      state[componentIDs.submitForm] = true;
    },
    hideSubmitForm: (state) => {
      state[componentIDs.submitForm] = false;
    },
    showCensoredVideo: (state) => {
      state[componentIDs.censoredVideo] = true;
    },
    hideCensoredVideo: (state) => {
      state[componentIDs.censoredVideo] = false;
    },
    showDescription: (state) => {
      state[componentIDs.description] = true;
    },
    hideDescription: (state) => {
      state[componentIDs.description] = false;
    },
    showFAQ: (state) => {
      state[componentIDs.FAQ] = true;
    },
    hideFAQ: (state) => {
      state[componentIDs.FAQ] = false;
    },
    showDashboard: (state) => {
      state[componentIDs.dashboard] = true;
    },
    hideDashboard: (state) => {
      state[componentIDs.dashboard] = false;
    },
    backButtonForm: (state) => {
      return initialState;
    },
    intializeMobile: (state, { payload }: PayloadAction<boolean>) => {
      if (payload) state.mobile = true;
      else state.mobile = false;
    },
    updateTimestamp: (state, { payload }: PayloadAction<TimestampPayload>) => {
      if (payload.remove) {
        if (payload.caller === Callers.unselected) {
          let timestamps = (state.unselectedList as WordList)[payload.word];

          if (
            timestamps &&
            timestamps.length === 1 &&
            timestamps[0] === payload.timestamp
          ) {
            delete (state.unselectedList as WordList)[payload.word];
          } else {
            if ((state.unselectedList as WordList)[payload.word]) {
              (state.unselectedList as WordList)[payload.word] =
                timestamps.filter(
                  (timestamp) => timestamp !== payload.timestamp
                );
            }
          }
        } else {
          let timestamps = (state.selectedList as WordList)[payload.word];

          if (timestamps.length === 1 && timestamps[0] === payload.timestamp) {
            delete (state.selectedList as WordList)[payload.word];
          } else {
            if ((state.selectedList as WordList)[payload.word]) {
              (state.selectedList as WordList)[payload.word] =
                timestamps.filter(
                  (timestamp) => timestamp !== payload.timestamp
                );
            }
          }
        }
      } else {
        if (payload.caller === Callers.unselected) {
          if ((state.unselectedList as WordList)[payload.word]) {
            let tempArr = (state.unselectedList as WordList)[payload.word];
            let tempSet = new Set(tempArr);
            tempSet.add(payload.timestamp);

            (state.unselectedList as WordList)[payload.word] = [...tempSet];
          } else {
            (state.unselectedList as WordList)[payload.word] = [
              payload.timestamp,
            ];
          }
        } else {
          if ((state.selectedList as WordList)[payload.word]) {
            let tempArr = (state.selectedList as WordList)[payload.word];
            let tempSet = new Set(tempArr);
            tempSet.add(payload.timestamp);

            (state.unselectedList as WordList)[payload.word] = [...tempSet];
          } else {
            (state.selectedList as WordList)[payload.word] = [
              payload.timestamp,
            ];
          }
        }
      }
    },
    updateWord: (state, { payload }: PayloadAction<WordPayload>) => {
      if (
        payload.caller === Callers.unselected ||
        payload.caller === Callers.suggested
      ) {
        if (payload.timestamps.length === 0) {
          delete (state.unselectedList as WordList)[payload.word];
        } else {
          if ((state.unselectedList as WordList)[payload.word]) {
            let tempArr = (state.unselectedList as WordList)[payload.word];
            let tempSet = new Set([...tempArr, ...payload.timestamps]);

            (state.unselectedList as WordList)[payload.word] = [...tempSet];
          } else {
            (state.unselectedList as WordList)[payload.word] =
              payload.timestamps;
          }
        }
      } else {
        if (payload.timestamps.length === 0) {
          delete (state.selectedList as WordList)[payload.word];
        } else {
          payload.timestamps.forEach((timestamp) => {
            if ((state.selectedList as WordList)[payload.word])
              (state.selectedList as WordList)[payload.word].push(timestamp);
            else
              (state.selectedList as WordList)[payload.word] = [payload.word];
          });
        }
      }
    },
  },
});

export default formSlice.reducer;
export const {
  backButtonForm,
  showFileInput,
  hideFileInput,
  showFileInfo,
  hideFileInfo,
  showManualResults,
  hideManualResults,
  showAutoResults,
  hideAutoResults,
  showTimestampSubmit,
  hideTimestampSubmit,
  hideFormSettings,
  showSubmitForm,
  hideSubmitForm,
  showCensoredVideo,
  hideCensoredVideo,
  showDescription,
  hideDescription,
  showFAQ,
  hideFAQ,
  showDashboard,
  hideDashboard,
  intializeMobile,
  updateWord,
  updateTimestamp,
} = formSlice.actions;
