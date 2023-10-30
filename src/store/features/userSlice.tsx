import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode, JwtPayload } from "jwt-decode";

export interface GoogleLoginPayload extends JwtPayload {
  picture: string;
  email: string;
  name: string;
  locale: string;
}

export interface UserDetails {
  id: string;
  email: string;
  imageSrc: string;
  name: string;
  locale: string;
  credits: number;
}

export interface LogoutResponse {
  [index: string]: string;
}

export interface LoginResponse {
  [index: string]: string;
}

export interface GetTokensResponse {
  [index: string]: string;
}

const getUserDetails = (token: string) => {
  return jwtDecode(token);
};

const getProfileImage = (userInfo: GoogleLoginPayload) => {
  return userInfo["picture"];
};

export const login = createAsyncThunk(
  "user/login",
  async (
    args: { userDetails: GoogleLoginPayload },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      fulfillWithValue({} as LoginResponse);
    } catch (e) {
      console.log("Error Logging in:", (e as Error).message);
      return rejectWithValue(e as Error);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (args, { rejectWithValue, fulfillWithValue }) => {
    try {
      fulfillWithValue({} as LoginResponse);
    } catch (e) {
      console.log("Error Logging in:", (e as Error).message);
      return rejectWithValue(e as Error);
    }
  }
);

export const getTokens = createAsyncThunk(
  "user/getTokens",
  async (args, { rejectWithValue, fulfillWithValue }) => {
    try {
      fulfillWithValue({} as LoginResponse);
    } catch (e) {
      console.log("Error Logging in:", (e as Error).message);
      return rejectWithValue(e as Error);
    }
  }
);

const initialState: { loggedIn: boolean; userDetails: UserDetails | null } = {
  loggedIn: false,
  userDetails: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(logout.idle, (state, action) => {});

    // builder;
  },
});

export default userSlice.reducer;
export const {} = userSlice.actions;
