import { useState, useEffect } from "react";
import { useAppSelector } from "../store/store";
import { FileUpload } from "../store/features/fileSlice";

const useFetch = (endpoint: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState<Object | null>(null);
  const [serverError, setServerError] = useState<Error | null>(null);
  const [fileObject, setFileObject] = useState<File | null>(null);

  const currFile = useAppSelector((state) => state.file.uploadedFile);

  const convertURLToFile = async (file: FileUpload) => {
    try {
      setIsLoading(true);

      const res = await fetch(file.fileUrl);
      const data = await res.blob();

      let currFile = new File([data], file.fileName, { type: file.fileType });

      setFileObject(currFile);
      setApiData(currFile);
    } catch (error) {
      setServerError(error as Error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (currFile) convertURLToFile(currFile);

    // if (fileObject) {
    //   const formData = new FormData();
    //   const fileName = fileObject.name;
    //   formData.append("file", fileObject, fileName);

    //   fetch(endpoint, {
    //     method: "POST",
    //   });
    // }
  }, [currFile]);

  //   const fetchAudio = () => {
  //     // let file = new File(currFile?.fileUrl, currFile?.fileName, {
  //     //   type: currFile?.fileType,
  //     // });
  //   };

  //   const fetchTranscription = (url: string) => {};

  //   const fetchCensorship = (url: string) => {};

  //   useEffect(() => {
  //     setIsLoading(true);
  //     try {
  //     } catch (error) {
  //       let result = error as Error;
  //       setServerError(result);
  //       setIsLoading(false);
  //     }
  //   }, [currFile]);

  return { isLoading, apiData, serverError };
};

export default useFetch;
