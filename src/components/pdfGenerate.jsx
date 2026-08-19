import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Row, Col, Empty } from "antd";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PdfSheet from "./PdfSheet";
import watermark from "../assets/Sri_Image.jpg";
import "./pdfGenerate.css";

const DEFAULT_TERMS = `Good Once sold will not be taken back
Interest @ 24% p.a. will be charged if the payment is not made with in the stipulated time.
Subject to "Vellore" Jurisdiction only
Payment should be made by NEFT / RTGS / Cheque`;

/**
 * PdfGenerate — page at route "/preview".
 */
export default function PdfGenerate() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const sheetRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    document.title = state?.orgName
      ? `Invoice - ${state.orgName}`
      : "Invoice Preview";
  }, [state]);

  if (!state) {
    return (
      <div className="pdf-page">
        <div className="pdf-page__inner pdf-page__empty">
          <Empty description="No invoice data found. Please fill the form first." />

          <Button
            type="primary"
            onClick={() => navigate("/")}
            style={{ marginTop: 16 }}
          >
            Go to Invoice Form
          </Button>
        </div>
      </div>
    );
  }

  const {
    logo,
    orgName,
    email,
    phone,
    address,
    serviceDesc,
    items = [],
    total = 0,
    terms = DEFAULT_TERMS,
  } = state;

  async function handleDownload() {
    if (!sheetRef.current) return;

    setDownloading(true);

    try {
      const canvas = await html2canvas(sheetRef.current, {
        scale: 2,
        backgroundColor: "#FBF7EE",
        useCORS: true,
        windowWidth: sheetRef.current.scrollWidth,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;

      const imgHeight =
        (canvas.height * imgWidth) /
        canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight;
      }

      const safeName = (orgName || "invoice")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "");

      const dateStamp =
        dayjs().format("DDMMYYYY-HHmm");

      pdf.save(
        `Invoice-${safeName}-${dateStamp}.pdf`
      );
    } catch (err) {
      console.error(
        "PDF generation failed:",
        err
      );
    } finally {
      setDownloading(false);
    }
  }

  function handleBackToEdit() {
    navigate("/", { state });
  }

  return (
    <div className="pdf-page">
      <div className="pdf-page__inner">

        {/* ACTION BAR */}
        <div className="pdf-actions">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToEdit}
          >
            Back to Edit
          </Button>

          <Button
            className="download-btn"
            icon={
              downloading ? (
                <LoadingOutlined />
              ) : (
                <DownloadOutlined />
              )
            }
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading
              ? "Generating…"
              : "Download PDF"}
          </Button>
        </div>

        {/* RESPONSIVE PREVIEW */}
        <div className="pdf-sheet">
          <img
            src={watermark}
            alt=""
            className="pdf-watermark"
          />

          <div className="pdf-content">

            <Row
              justify="space-between"
              align="top"
              wrap
              gutter={[16, 16]}
            >
              <Col>
                {logo && (
                  <img
                    src={logo}
                    alt="logo"
                    className="pdf-logo"
                  />
                )}

                <div className="pdf-org">
                  {orgName || "Untitled Company"}
                </div>

                <div className="pdf-contact">
                  {email && (
                    <>
                      {email}
                      <br />
                    </>
                  )}

                  {phone}
                  <br />

                  {address &&
                    address
                      .split("\n")
                      .map((l, i) => (
                        <span key={i}>
                          {l}
                          <br />
                        </span>
                      ))}
                </div>
              </Col>

              <Col style={{ textAlign: "right" }}>
                <div className="pdf-title">
                  SRI VENKATESWARA STORES
                </div>

                <div className="pdf-sub-title">
                  INVOICE
                </div>

                <div className="pdf-meta">
                  {dayjs().format("DD/MM/YYYY")}
                </div>
              </Col>
            </Row>

            {serviceDesc && (
              <div className="pdf-service-box">
                <span className="pdf-service-label">
                  Service Details
                </span>

                {serviceDesc
                  .split("\n")
                  .map((l, i) => (
                    <span key={i}>
                      {l}
                      <br />
                    </span>
                  ))}
              </div>
            )}

            <div className="pdf-table-wrap">
              <table className="pdf-table">
                <thead>
                  <tr>
                    <th>S/No</th>
                    <th>Service</th>
                    <th>Paid Date</th>
                    <th>Mode</th>
                    <th
                      style={{
                        textAlign: "right",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx}>
                      <td
                        className="mono muted"
                        data-label="S/No"
                      >
                        {idx + 1}
                      </td>

                      <td data-label="Service">
                        {it.service || "—"}
                      </td>

                      <td data-label="Paid Date">
                        {it.date
                          ? dayjs(it.date).format(
                              "DD/MM/YYYY"
                            )
                          : "—"}
                      </td>

                      <td data-label="Mode">
                        {it.mode}
                      </td>

                      <td
                        style={{
                          textAlign: "right",
                        }}
                        className="mono"
                        data-label="Amount"
                      >
                        ₹
                        {(Number(it.amount) || 0).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Row
              justify="end"
              className="pdf-totals-row"
            >
              <Col xs={24} sm={10} md={8}>
                <div className="pdf-total-line">
                  <span>Total</span>

                  <span className="mono">
                    ₹
                    {(Number(total) || 0).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>
              </Col>
            </Row>

          </div>

          {/* TERMS */}
          <div className="pdf-footer">
            <span className="pdf-footer-label">
              Terms &amp; Conditions
            </span>

            <ol>
              {terms
                .split("\n")
                .filter(
                  (term) => term.trim()
                )
                .map((term, index) => (
                  <li key={index}>
                    {term.trim()}
                  </li>
                ))}
            </ol>
          </div>
        </div>

        {/* HIDDEN FIXED PDF SHEET */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: -9999,
            zIndex: -1,
          }}
        >
          <PdfSheet
            data={{
              ...state,
              terms,
            }}
            ref={sheetRef}
          />
        </div>

      </div>
    </div>
  );
}