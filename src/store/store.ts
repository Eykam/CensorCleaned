import { configureStore } from "@reduxjs/toolkit";
import { fileSlice } from "./features/fileSlice";
import { formSlice } from "./features/formSlice";
import { dataSlice } from "./features/dataSlice";
import { userSlice } from "./features/userSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { enableMapSet } from "immer";

enableMapSet();

export const store = configureStore({
  reducer: {
    file: fileSlice.reducer,
    form: formSlice.reducer,
    data: dataSlice.reducer,
    user: userSlice.reducer,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
