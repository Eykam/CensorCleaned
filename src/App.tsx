import "./css/App.css";
import React from "react";
import FileInputForm from "./components/fileInputForm";
import { Provider } from "react-redux";
import { store } from "./store/store";
import SubmitForm from "./components/submitForm";

const App = () => {
  return (
    <div id="body-div">
      <Provider store={store}>
        <FileInputForm />
        <SubmitForm />
      </Provider>
    </div>
  );
};

export default App;
