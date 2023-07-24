import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FileUpload } from "./fileSlice";

export enum endpoints {
  sendFile = "/file",
  fetchTranscription = "/fetchTranscription",
  fetchCensorship = "/fetchCensorship",
}

export enum Mode {
  auto = "auto",
  manual = "manual",
}

export enum RequestStates {
  idle = "idle",
  pending = "pending",
  success = "success",
  error = "error",
}

interface StringMap {
  [name: string]: string;
}

interface DataState {
  sendFile: {
    originalFile?: File;
    response?: Response;
    status: RequestStates;
    error?: Error;
  };
  transcription: {
    data?: StringMap;
    response?: Response;
    status: RequestStates;
    error?: Error;
  };
  censorship: {
    censoredFile?: File;
    censorList?: StringMap;
    response?: Response;
    status: RequestStates;
    error?: Error;
  };
}

const BASEURL = "http://localhost:9050";

export const urlToFile = async (file: FileUpload): Promise<File | Error> => {
  try {
    console.log("urlToFile executing...");
    let data = await fetch(file.fileUrl);
    let blob = await data.blob();

    let currFile = new File([blob], file.fileName, { type: file.fileType });
    console.log("urlTOFile: ", currFile);
    return currFile;
  } catch (e) {
    return e as Error;
  }
};

export const sendFile = createAsyncThunk(
  "file/sendFile",
  async (file: File, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      if (file != null && file.name !== "") {
        const formData = new FormData();
        formData.append("file", file);

        let data = await fetch(BASEURL + endpoints.sendFile, {
          method: "POST",
          body: formData,
        });

        console.log("Sendfile data: ", data);
        data = await data.json();
        return fulfillWithValue(data);
      }

      return rejectWithValue(new Error("Either no file or empty file name"));
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const fetchTranscription = createAsyncThunk(
  "file/fetchTranscription",
  async (mode: Mode, { rejectWithValue, fulfillWithValue }) => {
    try {
      let data = await fetch(BASEURL + endpoints.fetchTranscription);
      data = await data.json();

      if (mode === Mode.auto) {
        //filter audio here, and call fetchCensorship
      }

      return fulfillWithValue(data);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const fetchCensorship = createAsyncThunk(
  "file/fetchCensorship",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      let data = await fetch(BASEURL + endpoints.fetchCensorship);
      data = await data.json();

      return fulfillWithValue(data);
    } catch (e) {
      throw rejectWithValue(e);
    }
  }
);

const initialState: DataState = {
  sendFile: {
    status: RequestStates.idle,
  },
  transcription: {
    status: RequestStates.idle,
  },
  censorship: {
    status: RequestStates.idle,
  },
};

export const dataSlice = createSlice({
  name: "data",
  initialState: initialState,
  reducers: {
    // sendFile: (state, action: PayloadAction<{ file: File }>) => {
    //   if (state) {
    //     fetch(endpoints.sendFile, {
    //       method: "POST",
    //       type: action.payload.file.type,
    //     });
    //   }
    // },
  },
  extraReducers(builder) {
    builder.addCase(sendFile.pending, (state: DataState, action) => {
      console.log("sendFile pending...");
      state.sendFile.status = RequestStates.pending;
    });

    builder.addCase(sendFile.fulfilled, (state: DataState, action) => {
      console.log("sendFile fulfilled...");
      state.sendFile.status = RequestStates.success;
      state.sendFile.response = action.payload;
    });

    builder.addCase(sendFile.rejected, (state: DataState, action) => {
      console.log("sendFile rejected...");
      console.log("Error: ", action.payload);
      state.sendFile.status = RequestStates.error;
      state.sendFile.error = action.error as Error;
    });

    builder.addCase(fetchTranscription.pending, (state: DataState, action) => {
      console.log("fetchTranscription pending...");
      state.transcription.status = RequestStates.pending;
    });

    builder.addCase(
      fetchTranscription.fulfilled,
      (state: DataState, action) => {
        console.log("fetchTranscription fulfilled...");
        state.transcription.status = RequestStates.success;
        state.transcription.response = action.payload;
      }
    );

    builder.addCase(fetchTranscription.rejected, (state: DataState, action) => {
      console.log("fetchTranscription rejected...");
      console.log("Error: ", action.payload);
      state.transcription.status = RequestStates.error;
      state.transcription.error = action.payload as Error;
    });

    builder.addCase(fetchCensorship.pending, (state: DataState, action) => {
      console.log("fetchCensorship pending...");
      state.censorship.status = RequestStates.pending;
    });

    builder.addCase(fetchCensorship.fulfilled, (state: DataState, action) => {
      console.log("fetchCensorship fulfilled...");
      state.censorship.status = RequestStates.success;
      state.censorship.response = action.payload;
    });

    builder.addCase(fetchCensorship.rejected, (state: DataState, action) => {
      console.log("UrlToFile rejected...");
      console.log("Error: ", action.payload);
      state.censorship.status = RequestStates.error;
      state.censorship.error = action.payload as Error;
    });
  },
});

export default dataSlice.reducer;
// export const {} = dataSlice.actions;
