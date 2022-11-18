import { Paper } from "@mui/material";
import "./styles.css";

function FileDetails({ files }) {
  var content =
    files && files.length ? (
      files.map((fileInfo, index) => (
        <div key={`file-info-${index}`}>
          {`${fileInfo.filename}: ${fileInfo.content.length}`}
        </div>
      ))
    ) : (
      <div>No files added yet!</div>
    );

  return <Paper className="paper">{content}</Paper>;
}

export default FileDetails;
