import { useEffect, useState } from "react";
import FileDetails from "../FileDetails";
import StatusReport from "../StatusReport";

function FileUpload() {

    var [selectedFiles, setSelectedFiles] = useState(null);
    var [filesInformation, setFilesInformation] = useState([]);
    var [errorEmails, setErrorEmails] = useState([]);
    var [processingDone, setProcessingDone] = useState(false);
    var [loading, setLoading] = useState(false);
    var temporaryFilesInfo = [];

    var onFileChange = (ev) => {
        setSelectedFiles(ev.target.files);
    }

    var onFileUpload = () => {
        if (filesInformation.length) {
            var allEmails = [];
            filesInformation.forEach(fileInfoItem => {
                if (fileInfoItem.content[fileInfoItem.content.length - 1] === "") {
                    fileInfoItem.content.pop();
                }
                allEmails.push(...fileInfoItem.content)
            });
            console.log(allEmails);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "emails": allEmails
            });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            setLoading(true);
            fetch('https://toggl-hire-frontend-homework.onrender.com/api/send', requestOptions)
            .then(response => response.text())
            .then((response) => {
                setProcessingDone(true);
                setLoading(false);
                if (response) {
                    var responseJson = JSON.parse(response);
                    setErrorEmails(responseJson.emails);
                } else {
                    setSelectedFiles(null);
                    setFilesInformation([]);
                    setErrorEmails([]);
                    document.getElementById('files').value = "";
                }
            })
            .catch(error => {
                setLoading(false);
                console.log('error:', error);
                setProcessingDone(true);
            });
        }
    }

    var readFileContent = (file) => {
        var reader = new FileReader();
        reader.onload = async (e) => {
            console.log('processed ', file.name);
            var fileContent = e.target.result.split('\n');
            temporaryFilesInfo.push({filename: file.name, content: fileContent});
            if (temporaryFilesInfo.length === selectedFiles.length) {
                setFilesInformation([...temporaryFilesInfo]);
                temporaryFilesInfo = [];
            }
        }
        reader.readAsText(file);
    }

    useEffect(() => {
        if (selectedFiles && selectedFiles.length) {
            var index = 0;
            temporaryFilesInfo = [];
            while (index < selectedFiles.length) {
                readFileContent(selectedFiles.item(index));
                index++;
            }
        }
    }, [selectedFiles])

    return (
        <>
            <div>Upload some files</div>
            <input multiple type="file" id="files" onChange={onFileChange} />
            <FileDetails files={filesInformation} />
            <br />
            <button disabled={loading} onClick={onFileUpload}>
                {loading ? 'Sending emails' : 'Send emails!'}
            </button>
            <br />
            <StatusReport errorEmails={errorEmails} done={processingDone}/>
        </>
    )
}

export default FileUpload;