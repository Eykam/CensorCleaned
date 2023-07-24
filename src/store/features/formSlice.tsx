import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const enum componentIDs {
  fileInput = "FILEINPUT",
  fileInfo = "FILEINFO",
  formSettings = "FORMSETTINGS",
  manualResults = "MANUALRESULTS",
}

const initialState: { [x: string]: boolean } = {
  [componentIDs.fileInput]: true,
  [componentIDs.fileInfo]: false,
  [componentIDs.formSettings]: true,
  [componentIDs.manualResults]: true,
};

export const formSlice = createSlice({
  name: "form",
  initialState: initialState,
  reducers: {
    hideFileInput: (state, action: PayloadAction) => {
      state[componentIDs.fileInput] = false;
    },
    showFileInput: (state, action: PayloadAction) => {
      state[componentIDs.fileInput] = true;
    },
    hideFileInfo: (state, action: PayloadAction) => {
      state[componentIDs.fileInfo] = false;
    },
    showFileInfo: (state, action: PayloadAction) => {
      state[componentIDs.fileInfo] = true;
    },
    hideFormSettings: (state, action: PayloadAction) => {
      state[componentIDs.formSettings] = false;
    },
  },
});

export default formSlice.reducer;
export const { hideFileInput, hideFileInfo, showFileInfo, showFileInput } =
  formSlice.actions;
