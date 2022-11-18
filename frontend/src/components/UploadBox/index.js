import { Input, Paper } from "@mui/material";
import { ReactComponent as DropTarget } from "../../assets/dropTarget.svg";
import "./styles.css";

function UploadBox({ onFileChange, onFileDrop }) {
  function handleFileDrag(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }
  return (
    <Paper className="paper">
      <div>
        <div>Upload some files</div>
        <Input
          inputProps={{ multiple: true }}
          type="file"
          id="files"
          onChange={onFileChange}
        />
      </div>
      <div
        className="dropTargetContainer"
        onDrop={onFileDrop}
        onDragEnter={handleFileDrag}
        onDragOver={handleFileDrag}
        onDragLeave={handleFileDrag}
      >
        <DropTarget className="dropTarget" />
      </div>
    </Paper>
  );
}

export default UploadBox;
