import { forwardRef } from "react";
import dayjs from "dayjs";
import watermark from "../assets/Sri_Image.jpg";
import "./pdfSheet.css";

/**
 * PdfSheet — the actual invoice layout that gets captured into the PDF.
 * Always renders at a FIXED width (see pdfSheet.css), regardless of the
 * device/viewport it's displayed on. This is what makes the downloaded
 * PDF look identical whether the person is on desktop or mobile —
 * html2canvas always captures this exact same layout.
 */
const PdfSheet = forwardRef(function PdfSheet({ data }, ref) {
  const {
    logo,
    orgName,
    email,
    phone,
    address,
    serviceDesc,
    items = [],
    total = 0,
  } = data;

  return (
    <div className="psheet" ref={ref}>
      <img src={watermark} alt="" className="psheet-watermark" />

      <div className="psheet-content">
        <div className="psheet-header">
          <div className="psheet-header-left">
            {logo && <img src={logo} alt="logo" className="psheet-logo" />}
            <div className="psheet-org">{orgName || "Untitled Company"}</div>
            <div className="psheet-contact">
              {email && (
                <>
                  {email}
                  <br />
                </>
              )}
              {phone}
              <br />
              {address &&
                address.split("\n").map((l, i) => (
                  <span key={i}>
                    {l}
                    <br />
                  </span>
                ))}
            </div>
          </div>
          <div className="psheet-header-right">
            <div className="psheet-title">SRI VENKATESWARA STORES</div>
            <div className="psheet-sub-title">INVOICE</div>
            <div className="psheet-meta">{dayjs().format("DD/MM/YYYY")}</div>
          </div>
        </div>

        {serviceDesc && (
          <div className="psheet-service-box">
            <span className="psheet-service-label">Service Details</span>
            {serviceDesc.split("\n").map((l, i) => (
              <span key={i}>
                {l}
                <br />
              </span>
            ))}
          </div>
        )}

        <table className="psheet-table">
          <thead>
            <tr>
              <th>S/No</th>
              <th>Service</th>
              <th>Paid Date</th>
              <th>Mode</th>
              <th style={{ textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx}>
                <td className="mono muted">{idx + 1}</td>
                <td>{it.service || "—"}</td>
                <td>{it.date ? dayjs(it.date).format("DD/MM/YYYY") : "—"}</td>
                <td>{it.mode}</td>
                <td style={{ textAlign: "right" }} className="mono">
                  ₹
                  {(Number(it.amount) || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="psheet-totals-row">
          <div className="psheet-total-box">
            <div className="psheet-total-line">
              <span>Total</span>
              <span className="mono">
                ₹
                {(Number(total) || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="psheet-footer">
        <span className="psheet-footer-label">Terms &amp; Policy</span>
        <ul>
          <li>Full payment is due upon completion of the project unless otherwise agreed in writing.</li>
          <li>Source files and ownership transfer to the client only after final payment is received.</li>
          <li>Any advance paid is non-refundable once work has commenced.</li>
          <li>Revisions beyond the agreed scope may be billed separately.</li>
          <li>Delivery timelines depend on timely feedback and content from the client.</li>
        </ul>
      </div>
    </div>
  );
});

export default PdfSheet;
