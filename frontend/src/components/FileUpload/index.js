import { useEffect, useState } from "react";
import FileDetails from "../FileDetails";
import StatusReport from "../StatusReport";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { Box, Paper } from "@mui/material";
import "./styles.css";
import UploadBox from "../UploadBox";

function FileUpload() {
  var [selectedFiles, setSelectedFiles] = useState([]);
  var [filesInformation, setFilesInformation] = useState([]);
  var [errorEmails, setErrorEmails] = useState([]);
  var [processingDone, setProcessingDone] = useState(false);
  var [loading, setLoading] = useState(false);
  var temporaryFilesInfo = [];

  var fileListToArray = (fileList) => {
    var listOfFiles = [];
    for (var i = 0; i < fileList.length; i++) {
      listOfFiles.push(fileList.item(i));
    }
    return listOfFiles;
  };

  var onFileChange = (ev) => {
    setSelectedFiles(fileListToArray(ev.target.files));
  };

  var onFileDropped = (files) => {
    setSelectedFiles([...(selectedFiles ?? []), ...fileListToArray(files)]);
  };

  var onFileUpload = () => {
    if (filesInformation.length) {
      var allEmails = [];
      filesInformation.forEach((fileInfoItem) => {
        if (fileInfoItem.content[fileInfoItem.content.length - 1] === "") {
          fileInfoItem.content.pop();
        }
        allEmails.push(...fileInfoItem.content);
      });
      console.log(allEmails);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        emails: allEmails,
      });
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      setLoading(true);
      fetch(
        "https://toggl-hire-frontend-homework.onrender.com/api/send",
        requestOptions
      )
        .then((response) => response.text())
        .then((response) => {
          setProcessingDone(true);
          setLoading(false);
          if (response) {
            var responseJson = JSON.parse(response);
            setErrorEmails(responseJson.emails);
          } else {
            setSelectedFiles([]);
            setFilesInformation([]);
            setErrorEmails([]);
            document.getElementById("files").value = "";
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("error:", error);
          setProcessingDone(true);
        });
    }
  };

  var readFileContent = (file) => {
    var reader = new FileReader();
    reader.onload = async (e) => {
      var fileContent = e.target.result.split("\n");
      if (fileContent[fileContent.length - 1] === "") {
        fileContent.pop();
      }
      temporaryFilesInfo.push({ filename: file.name, content: fileContent });
      if (temporaryFilesInfo.length === selectedFiles.length) {
        setFilesInformation([...temporaryFilesInfo]);
        temporaryFilesInfo = [];
      }
    };
    reader.readAsText(file);
  };

  function handleFileDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    console.log(ev.dataTransfer.files);
    onFileDropped(ev.dataTransfer.files);
  }

  function handleModalClose() {
    setProcessingDone(false);
  }

  useEffect(() => {
    (selectedFiles ?? []).forEach((file) => readFileContent(file));
  }, [selectedFiles]);

  return (
    <>
      <Box
        sx={{ display: "flex", justifyItems: "center", flexDirection: "row" }}
      >
        <UploadBox onFileChange={onFileChange} onFileDrop={handleFileDrop} />
        <FileDetails files={filesInformation} />
      </Box>
      <Box sx={{ margin: "8px 16px" }}>
        <Button variant="contained" disabled={loading} onClick={onFileUpload}>
          {loading ? "Sending emails" : "Send emails!"}
        </Button>
      </Box>
      <StatusReport
        errorEmails={errorEmails}
        done={processingDone}
        onClose={handleModalClose}
      />
    </>
  );
}

export default FileUpload;
