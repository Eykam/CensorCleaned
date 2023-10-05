import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
}

const initialState: { [x: string]: boolean } = {
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
    backButtonForm: (state) => {
      return initialState;
    },
    intializeMobile: (state, { payload }: PayloadAction<boolean>) => {
      if (payload) state.mobile = true;
      else state.mobile = false;
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
  intializeMobile,
} = formSlice.actions;
