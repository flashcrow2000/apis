function StatusReport({errorEmails, done}) {

    if (!done) {
        return null;
    }
    return errorEmails && errorEmails.length ? (<div>Error sending emails to: {errorEmails.join(', ')}</div>) : (<div>Emails sent successfuly!</div>);
}

export default StatusReport;