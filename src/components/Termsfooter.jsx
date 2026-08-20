export default function TermsFooter({ terms, onChange, isExporting }) {
  return (
    <footer className="invoice-footer">
      <div className="terms-box">
        <div className="terms-title">Terms &amp; Conditions</div>

        {isExporting ? (
          <div className="field-input terms-edit" style={{ whiteSpace: "pre-wrap" }}>
            {terms}
          </div>
        ) : (
          <textarea
            className="field-input terms-edit"
            rows={4}
            value={terms}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    </footer>
  );
}