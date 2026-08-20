import { formatAmount } from "./Invoicedata";
import { toWords } from "number-to-words";
import { useEffect } from "react";

export default function TotalsBank({
  business,
  amountInWords,
  onAmountWordsChange,
  cgst,
  sgst,
  igst,
  onCgstChange,
  onSgstChange,
  onIgstChange,
  cgstAmount,
  sgstAmount,
  igstAmount,
  total,
  isExporting,
}) {
    useEffect(() => {
  const amount = Math.round(Number(total) || 0);

  const words =
    amount > 0
      ? `${toWords(amount)
          .replace(/\b\w/g, (char) => char.toUpperCase())} Rupees Only`
      : "";

  onAmountWordsChange(words);
}, [total]);
  return (
    <section className="invoice-bottom">
      {/* ---------- Left: amount in words + bank ---------- */}
      <div className="bottom-left">
        <div className="amount-words-box">
          <strong>Amount Chargeable In Words</strong>
          <div>
            {isExporting ? (
              <span className="field-input">{amountInWords || ""}</span>
            ) : (
              <input
                className="field-input"
                placeholder="Enter amount in words"
                value={amountInWords}
                onChange={(e) => onAmountWordsChange(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className="bank-box">
          <strong>BANK DETAILS</strong>
          <div>A/c No. : {business.bank.accountNo}</div>
          <div>IFSC : {business.bank.ifsc}</div>
          <div>Bank : {business.bank.bankName}</div>
          <div>Branch : {business.bank.branch}</div>
        </div>

        <div className="common-seal">Common Seal</div>
      </div>

      {/* ---------- Right: GST + total + signatory ---------- */}
      <div className="gst-total-box">
        <div className="gst-row">
          <strong>CGST</strong>
          <span>
            {isExporting ? (
              <span className="field-input percent-input">{cgst || "0"}</span>
            ) : (
              <input
                min={0}
                max={100}
                placeholder="0"
                className="field-input percent-input"
                value={cgst}
                onChange={(e) => onCgstChange(e.target.value)}
              />
            )}
            %
          </span>
          <b>₹ {formatAmount(cgstAmount)}</b>
        </div>

        <div className="gst-row">
          <strong>SGST</strong>
          <span>
            {isExporting ? (
              <span className="field-input percent-input">{sgst || "0"}</span>
            ) : (
              <input
                min={0}
                max={100}
                placeholder="0"
                className="field-input percent-input"
                value={sgst}
                onChange={(e) => onSgstChange(e.target.value)}
              />
            )}
            %
          </span>
          <b>₹ {formatAmount(sgstAmount)}</b>
        </div>

        <div className="gst-row">
          <strong>IGST</strong>
          <span>
            {isExporting ? (
              <span className="field-input percent-input">{igst || "0"}</span>
            ) : (
              <input
                min={0}
                max={100}
                placeholder="0"
                className="field-input percent-input"
                value={igst}
                onChange={(e) => onIgstChange(e.target.value)}
              />
            )}
            %
          </span>
          <b>₹ {formatAmount(igstAmount)}</b>
        </div>

        <div className="total-row">
          <strong>TOTAL</strong>
          <b>₹ {formatAmount(total)}</b>
        </div>

        <div className="authorized-box">
          <strong>For {business.name}</strong>
          <div className="signature-space" />
          <b>Authorised Signatory</b>
        </div>
      </div>
    </section>
  );
}