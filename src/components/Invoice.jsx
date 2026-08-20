import { useRef, useState } from "react";
import { Button, Space } from "antd";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { pdf } from "@react-pdf/renderer";

import "./Invoice.css";
import { BUSINESS, DEFAULT_INVOICE, DEFAULT_TERMS, createItem } from "./Invoicedata";
import { FaWhatsapp } from "react-icons/fa";
import InvoiceHeader from "./Invoiceheader";
import CustomerMeta from "./Customermeta";
import ItemsTable from "./Itemstable";
import TotalsBank from "./Totalsbank";
import TermsFooter from "./Termsfooter";
import InvoicePdfDocument from "./Invoicepdfdocument";
import WATERMARK_IMAGE from "../assets/Sri_Image.jpg";

export default function Invoice() {
  const printRef = useRef(null);

  const [invoice, setInvoice] = useState(DEFAULT_INVOICE);

  // Start with 2 blank rows already on screen instead of an empty table —
  // lazy initializer so createItem() only runs once on mount, not every
  // render.
  const [items, setItems] = useState(() => [createItem(), createItem()]);

  // Empty by default so the field shows a placeholder instead of a
  // pre-filled number — user types the % they want.
  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  const [igst, setIgst] = useState("");
  const [terms, setTerms] = useState(DEFAULT_TERMS);

  // PDF export now goes through @react-pdf/renderer (real vector text,
  // exact font control) instead of html2pdf/html2canvas screenshotting the
  // live DOM, so we no longer need to swap inputs for plain text just for
  // export. isExporting is kept only so Print (window.print, which still
  // screenshots the actual page) keeps looking clean.
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  /* ================================
     TOTALS
  ================================= */

  const lineTotal = (item) => Number(item.qty || 0) * Number(item.price || 0);

  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);

  const cgstAmount = subtotal * (Number(cgst || 0) / 100);
  const sgstAmount = subtotal * (Number(sgst || 0) / 100);
  const igstAmount = subtotal * (Number(igst || 0) / 100);

  const total = subtotal + cgstAmount + sgstAmount + igstAmount;

  /* ================================
     INVOICE HEADER / META FIELDS
  ================================= */

  const updateInvoice = (field, value) => {
    setInvoice((current) => ({ ...current, [field]: value }));
  };

  /* ================================
     LINE ITEMS
     addItem() always appends to the end of the array, so every
     new row renders directly under the previous one in the table.
  ================================= */

  const addItem = () => {
    const newItem = createItem();

    setItems((current) => [...current, newItem]);

    // Focus the new row's description field once it renders.
    requestAnimationFrame(() => {
      const node = document.querySelector(`[data-item-desc="${newItem.id}"]`);
      if (node) node.focus();
    });
  };

  const updateItem = (id, field, value) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  /* ================================
     PDF EXPORT (react-pdf — no screenshot, no font-load race,
     no html2canvas overlap/blank-page issues)
  ================================= */

  const handleDownloadPdf = async () => {

    const validItems = items.filter((item) => {
      return (
        item.item?.trim() ||
        item.hsn?.trim() ||
        Number(item.qty) > 1 ||
        Number(item.price) > 0
      );
    });

    if (validItems.length === 0) {
      alert("Please add at least one item before downloading the PDF.");
      return;
    }

    setIsGeneratingPdf(true);

    try {
      const blob = await pdf(
        <InvoicePdfDocument
          business={BUSINESS}
          invoice={invoice}
          items={items}
          cgst={cgst}
          sgst={sgst}
          igst={igst}
          items={validItems}
          cgstAmount={cgstAmount}
          sgstAmount={sgstAmount}
          igstAmount={igstAmount}
          total={total}
          terms={terms}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const customerName =
        invoice.customerName?.trim().replace(/[<>:"/\\|?*]/g, "-") || "SRI VENKATESHWARA STORES & SONS";

      link.download = `${customerName}-${dayjs().format("DD-MM-YYYY")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleWhatsAppSend = () => {
    let phone = invoice.customerMobile?.replace(/\D/g, "");

    if (!phone) {
      alert("Please enter customer mobile number.");
      return;
    }

    // Indian 10-digit number
    if (phone.length === 10) {
      phone = `91${phone}`;
    }

    const message = `Hello ${invoice.customerName || ""},

Please find your invoice details.

Invoice No: ${invoice.number || "-"}
Total Amount: ₹${total.toFixed(2)}

Thank you.`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="invoice-page">
      <div className="invoice-wrapper">
        {/* Printable invoice */}
        <main ref={printRef} className="invoice-card">
          <img
            src={WATERMARK_IMAGE}
            alt=""
            className="invoice-watermark"
          />

          <InvoiceHeader business={BUSINESS} />

          <CustomerMeta invoice={invoice} onChange={updateInvoice} isExporting={isExporting} />

          <ItemsTable
            items={items}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onAddItem={addItem}
            isExporting={isExporting}
          />

          <TotalsBank
            business={BUSINESS}
            amountInWords={invoice.amountInWords}
            onAmountWordsChange={(value) => updateInvoice("amountInWords", value)}
            cgst={cgst}
            sgst={sgst}
            igst={igst}
            onCgstChange={setCgst}
            onSgstChange={setSgst}
            onIgstChange={setIgst}
            cgstAmount={cgstAmount}
            sgstAmount={sgstAmount}
            igstAmount={igstAmount}
            total={total}
            isExporting={isExporting}
          />

          <TermsFooter terms={terms} onChange={setTerms} isExporting={isExporting} />
        </main>

        {/* Actions */}
        <Space className="invoice-actions no-print">
          <Button
            icon={<PrinterOutlined />}
            onClick={() => {
              setIsExporting(true);
              requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                  window.print();
                  setIsExporting(false);
                })
              );
            }}
          >
            Print
          </Button>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={isGeneratingPdf}
            onClick={handleDownloadPdf}
          >
            Download PDF
          </Button>
          {/* <Button
            style={{
              background: "#299329",
              color: "white"
            }}
            icon={<FaWhatsapp />}
            onClick={handleWhatsAppSend}
          >
            Send WhatsApp
          </Button> */}
        </Space>
      </div>
    </div>
  );
}