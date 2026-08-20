import { DatePicker } from "antd";

// Renders an <input> normally, or plain text when exporting to PDF —
// html2canvas renders plain text pixel-perfectly but only approximates
// form controls, which is what causes wrong fonts / clipped text in the PDF.
function TextField({ isExporting, value, placeholder, onChange }) {
  if (isExporting) {
    return <span className="field-input">{value || ""}</span>;
  }

  return (
    <input
      className="field-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

function DateField({ isExporting, value, onChange }) {
  if (isExporting) {
    return <span className="field-input">{value ? value.format("DD/MM/YYYY") : ""}</span>;
  }

  return (
    <DatePicker
      className="field-picker"
      bordered={false}
      allowClear={false}
      suffixIcon={null}
      format="DD/MM/YYYY"
      value={value}
      onChange={onChange}
    />
  );
}

export default function CustomerMeta({ invoice, onChange, isExporting }) {
  return (
    <section className="top-details">
      {/* ---------- Customer ---------- */}
      <div className="customer-box">
        <div className="customer-line">
          <strong>Mr/Ms.</strong>
          <span>
            <TextField
              isExporting={isExporting}
              value={invoice.customerName}
              onChange={(e) => onChange("customerName", e.target.value)}
            />
          </span>
        </div>

        <div className="customer-line address-line">
          <strong>Address</strong>
          <span>
            {isExporting ? (
              <span className="field-input" style={{ whiteSpace: "pre-wrap" }}>
                {invoice.customerAddress || ""}
              </span>
            ) : (
              <textarea
                className="field-input"
                rows={2}
                value={invoice.customerAddress}
                onChange={(e) => onChange("customerAddress", e.target.value)}
              />
            )}
          </span>
        </div>

        <div className="customer-line">
          <strong>Ph.</strong>
          <span>
            <TextField
              isExporting={isExporting}
              value={invoice.customerMobile}
              onChange={(e) => onChange("customerMobile", e.target.value)}
            />
          </span>
        </div>

        <div className="customer-line">
          <strong>GSTIN</strong>
          <span>
            <TextField
              isExporting={isExporting}
              value={invoice.customerGstin}
              onChange={(e) => onChange("customerGstin", e.target.value)}
            />
          </span>
        </div>
      </div>

      {/* ---------- Invoice meta ---------- */}
      <div className="invoice-meta-box">
        <div className="meta-row">
          <div>
            <strong>No.</strong>
            <span>
              <TextField
                isExporting={isExporting}
                value={invoice.number}
                onChange={(e) => onChange("number", e.target.value)}
              />
            </span>
          </div>

          <div>
            <strong>Date</strong>
            <span>
              <DateField
                isExporting={isExporting}
                value={invoice.date}
                onChange={(date) => onChange("date", date)}
              />
            </span>
          </div>
        </div>

        <div className="meta-single">
          <strong>Despatch thro</strong>
          <span>
            <TextField
              isExporting={isExporting}
              value={invoice.dispatchThrough}
              onChange={(e) => onChange("dispatchThrough", e.target.value)}
            />
          </span>
        </div>

        <div className="meta-row">
          <div>
            <strong>Order No.</strong>
            <span>
              <TextField
                isExporting={isExporting}
                value={invoice.orderNo}
                onChange={(e) => onChange("orderNo", e.target.value)}
              />
            </span>
          </div>

          <div>
            <strong>Dated</strong>
            <span>
              <DateField
                isExporting={isExporting}
                value={invoice.orderDate}
                onChange={(date) => onChange("orderDate", date)}
              />
            </span>
          </div>
        </div>

        <div className="meta-single-LR">
          <strong>L.R. / R.R. No.</strong>
          <span>
            <TextField
              isExporting={isExporting}
              value={invoice.lrNo}
              onChange={(e) => onChange("lrNo", e.target.value)}
            />
          </span>
        </div>
      </div>
    </section>
  );
}