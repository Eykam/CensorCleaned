import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { CredentialResponse } from "@react-oauth/google";

const BASEURL = "http://192.168.1.171:8800";

export enum UserEndpoints {
  login = "/login",
  deleteUser = "/deleteUser",
  // logout = "/logout",
}

// export interface GoogleLoginPayload extends JwtPayload {
//   picture: string;
//   email: string;
//   name: string;
//   locale: string;
// }

export interface UserDetails {
  gid: string;
  email: string;
  imageSrc: string;
  name: string;
  locale: string;
  credits: number;
  role: number;
  new: boolean;
}

export interface BooleanResponse {
  success: boolean;
}

export interface LoginResponse {
  [index: string]: string;
}

export interface GetTokensResponse {
  [index: string]: string;
}

export const login = createAsyncThunk(
  "user/login",
  async (token: string, { rejectWithValue, fulfillWithValue }) => {
    if (token !== "") {
      try {
        let userDetails = await fetch(BASEURL + UserEndpoints.login, {
          method: "POST",
          body: token,
        });

        let data = (await userDetails.json()) as UserDetails;
        if (data != null)
          return fulfillWithValue({ userDetails: data, token: token });
        else rejectWithValue(new Error("empty response from auth server"));
      } catch (e) {
        console.log("Error Logging in:", (e as Error).message);
        return rejectWithValue(e as Error);
      }
    }
  }
);

// export const logout = createAsyncThunk(
//   "user/logout",
//   async (gid: string, { rejectWithValue, fulfillWithValue }) => {
//     try {
//       let res = await fetch(BASEURL + UserEndpoints.logout);
//       let status = (await res.json()) as BooleanResponse;

//       if (status["success"]) return fulfillWithValue(true);
//       else return rejectWithValue("Failed to log out");
//     } catch (e) {
//       console.log("Error Logging out:", (e as Error).message);
//       return rejectWithValue(e as Error);
//     }
//   }
// );

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (token: string, { rejectWithValue, fulfillWithValue }) => {
    if (token !== "") {
      try {
        let res = await fetch(BASEURL + UserEndpoints.deleteUser, {
          method: "POST",
          body: token,
        });
        let status = (await res.json()) as BooleanResponse;

        if (status["success"]) return fulfillWithValue(true);
        else return rejectWithValue("Failed to log out");
      } catch (e) {
        console.log("Error Logging in:", (e as Error).message);
        return rejectWithValue(e as Error);
      }
    }
  }
);

const initialState: {
  loggedIn: boolean;
  userDetails: UserDetails | null;
  token: string;
} = {
  loggedIn: false,
  userDetails: null,
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.loggedIn = false;
      state.userDetails = null;
      state.token = "";
    },
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload) {
        state.loggedIn = true;
        state.userDetails = action.payload.userDetails;
        state.token = action.payload.token;
      }
    });

    builder.addCase(login.rejected, (state, action) => {
      state.loggedIn = false;
      state.userDetails = null;
      state.token = "";
    });

    // builder.addCase(logout.fulfilled, (state, action) => {
    //   if (action.payload) {
    //     state.loggedIn = false;
    //     state.userDetails = null;
    //   }
    // });

    builder.addCase(deleteUser.fulfilled, (state, action) => {
      if (action.payload) {
        state.loggedIn = false;
        state.userDetails = null;
        state.token = "";
      }
    });
  },
});

export default userSlice.reducer;
export const { logout } = userSlice.actions;
