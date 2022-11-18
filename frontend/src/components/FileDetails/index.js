function FileDetails ({files}) {

    return (
        (files).map((fileInfo, index) => (
            <div key={`file-info-${index}`}>
                {`${fileInfo.filename}: ${fileInfo.content.length}`}
            </div>
        ))
    )
}

export default FileDetails;