import { useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  Space,
} from "antd";

import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import html2pdf from "html2pdf.js";

import "./Invoice.css";
import JVS_LOGO from "../assets/Sri_Image.jpg";

const BUSINESS = {
  gstin: "33AEAFS2578D1Z8",

  tamilName: "ஸ்ரீ வெங்கடேஸ்வரா ஸ்டோர்ஸ் & சன்ஸ்",

  tamilLine:
    "அலுமினியம், இன்டாலியம், எவர்சில்வர், பித்தளை, செம்பு, கேஸ் ஸ்டவ்,",

  tamilLine2:
    "கல்யாண சீர்வரிசை பாத்திரங்கள் மொத்தம் - சில்லறை வியாபாரம்.",

  addressTamil:
    "நெ. 30, ஆர்யபவன் எதிரில், புல்லபேட்டை, வேலூர் - 632 001.",

  name: "SRI VENKATESHWARA STORES & SONS",

  address: "Vellore - 632 001",

  phones: [
    "90927 16131",
    "94427 30828",
    "99522 22018",
  ],

  bank: {
    accountNo: "50200108217615",
    ifsc: "HDFC0008160",
    bankName: "HDFC BANK LTD",
    branch: "BAGAYAM",
  },
};

const DEFAULT_TERMS = [
  "Goods once sold will not be taken back.",
  "Interest @ 24% p.a. will be charged if payment is not made within the stipulated time.",
  'Subject to "Vellore" Jurisdiction only.',
  "Payment should be made by NEFT / RTGS / Cheque.",
];

const DEFAULT_INVOICE = {
  number: "426",
  date: dayjs(),

  customerName: "",
  customerAddress: "",
  customerMobile: "",
  customerGstin: "",

  dispatchThrough: "",
  orderNo: "",
  orderDate: null,
  lrNo: "",

  amountInWords: "",
};

let itemId = 1;

const createItem = () => ({
  id: itemId++,
  item: "",
  hsn: "",
  qty: 1,
  price: 0,
});

const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function Invoice() {
  const printRef = useRef(null);

  const [invoice, setInvoice] =
    useState(DEFAULT_INVOICE);

  const [items, setItems] = useState([]);

  const [cgst, setCgst] = useState(9);
  const [sgst, setSgst] = useState(9);
  const [igst, setIgst] = useState(0);

  const [terms, setTerms] = useState(
    DEFAULT_TERMS.join("\n")
  );

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [itemOpen, setItemOpen] =
    useState(false);

  const [editingItemId, setEditingItemId] =
    useState(null);

  const [draftItem, setDraftItem] =
    useState(createItem);

  /* ================================
     INVOICE CALCULATIONS
  ================================= */

  const lineTotal = (item) =>
    Number(item.qty || 0) *
    Number(item.price || 0);

  const subtotal = items.reduce(
    (sum, item) =>
      sum + lineTotal(item),
    0
  );

  const cgstAmount =
    subtotal * (Number(cgst) / 100);

  const sgstAmount =
    subtotal * (Number(sgst) / 100);

  const igstAmount =
    subtotal * (Number(igst) / 100);

  const total =
    subtotal +
    cgstAmount +
    sgstAmount +
    igstAmount;

  /* ================================
     UPDATE INVOICE
  ================================= */

  const updateInvoice = (
    field,
    value
  ) => {
    setInvoice((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ================================
     ADD ITEM
  ================================= */

  const openAddItem = () => {
    setEditingItemId(null);
    setDraftItem(createItem());
    setItemOpen(true);
  };

  /* ================================
     EDIT ITEM
  ================================= */

  const openEditItem = (item) => {
    setEditingItemId(item.id);

    setDraftItem({
      ...item,
    });

    setItemOpen(true);
  };

  /* ================================
     SAVE ITEM
  ================================= */

  const saveItem = () => {
    const name =
      draftItem.item.trim();

    if (
      !name ||
      Number(draftItem.qty) <= 0
    ) {
      return;
    }

    const updatedItem = {
      ...draftItem,
      item: name,
      hsn: draftItem.hsn || "",
      qty: Number(
        draftItem.qty || 0
      ),
      price: Number(
        draftItem.price || 0
      ),
    };

    if (editingItemId) {
      setItems((current) =>
        current.map((item) =>
          item.id === editingItemId
            ? updatedItem
            : item
        )
      );
    } else {
      setItems((current) => [
        ...current,
        updatedItem,
      ]);
    }

    setDraftItem(createItem());
    setEditingItemId(null);
    setItemOpen(false);
  };

  /* ================================
     DELETE ITEM
  ================================= */

  const removeItem = (id) => {
    setItems((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  };

  /* ================================
     FONT WAIT
  ================================= */

  const waitForFonts = async () => {
    if (!document.fonts) return;

    await Promise.all([
      document.fonts.load(
        '400 14px "Poppins"'
      ),
      document.fonts.load(
        '500 14px "Poppins"'
      ),
      document.fonts.load(
        '600 14px "Poppins"'
      ),
      document.fonts.load(
        '700 14px "Poppins"'
      ),
    ]);

    await document.fonts.ready;
  };

  /* ================================
     DOWNLOAD PDF
  ================================= */

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;

    const invoiceElement =
      printRef.current;

    invoiceElement.classList.add(
      "pdf-export"
    );

    try {
      await waitForFonts();

      await new Promise((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(resolve)
        )
      );

      await html2pdf()
        .set({
          margin: 0,

          filename:
            `tax-invoice-${invoice.number || "invoice"}-${dayjs().format(
              "DDMMYYYY-HHmm"
            )}.pdf`,

          image: {
            type: "jpeg",
            quality: 0.98,
          },

          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            letterRendering: true,

            scrollX: 0,
            scrollY: 0,

            windowWidth:
              invoiceElement.scrollWidth,
          },

          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },

          pagebreak: {
            mode: [
              "avoid-all",
              "css",
              "legacy",
            ],
          },
        })
        .from(invoiceElement)
        .save();
    } catch (error) {
      console.error(
        "PDF generation failed:",
        error
      );
    } finally {
      invoiceElement.classList.remove(
        "pdf-export"
      );
    }
  };

  return (
    <div className="invoice-page">

      <div className="invoice-wrapper">

        {/* ================================
            EDITOR
        ================================= */}

        <div className="invoice-editor no-print">

          <Button
            icon={<EditOutlined />}
            onClick={() =>
              setDetailsOpen(true)
            }
          >
            Invoice Details
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAddItem}
          >
            Add Item
          </Button>

        </div>

        {/* ================================
            TAX INVOICE
        ================================= */}

        <main
          ref={printRef}
          className="invoice-card"
        >

          {/* ==============================
              HEADER
          ============================== */}

          <header className="tax-header">

            <div className="header-top">

              <div className="gstin">
                GSTIN : {BUSINESS.gstin}
              </div>

              <div className="tax-title">
                TAX INVOICE
              </div>

              <div className="phone-list">
                {BUSINESS.phones.map(
                  (phone) => (
                    <div key={phone}>
                      Ph : {phone}
                    </div>
                  )
                )}
              </div>

            </div>

            {/* JVS LOGO
                TAX INVOICE KEEZHA
            */}

            <div className="jvs-logo-wrapper">

              <img
                src={JVS_LOGO}
                alt="JVS"
                className="jvs-logo"
              />

            </div>

            <div className="business-heading">

              <div className="business-tamil-name">
                {BUSINESS.tamilName}
              </div>

              <div className="business-tamil-line">
                {BUSINESS.tamilLine}
              </div>

              <div className="business-tamil-line">
                {BUSINESS.tamilLine2}
              </div>

              <div className="business-address-tamil">
                {BUSINESS.addressTamil}
              </div>

              <div className="business-name">
                {BUSINESS.name}
              </div>

              <div className="business-address">
                {BUSINESS.address}
              </div>

            </div>

          </header>

          {/* ==============================
              CUSTOMER + INVOICE DETAILS
          ============================== */}

          <section className="top-details">

            <div className="customer-box">

              <div className="customer-line">
                <strong>M/s.</strong>

                <span>
                  {invoice.customerName ||
                    " "}
                </span>
              </div>

              <div className="customer-line address-line">
                <strong>Address</strong>

                <span>
                  {invoice.customerAddress ||
                    " "}
                </span>
              </div>

              <div className="customer-line">
                <strong>Ph.</strong>

                <span>
                  {invoice.customerMobile ||
                    " "}
                </span>
              </div>

              <div className="customer-line">
                <strong>GSTIN</strong>

                <span>
                  {invoice.customerGstin ||
                    " "}
                </span>
              </div>

            </div>

            <div className="invoice-meta-box">

              <div className="meta-row">

                <div>
                  <strong>No.</strong>

                  <span>
                    {invoice.number}
                  </span>
                </div>

                <div>
                  <strong>Date</strong>

                  <span>
                    {invoice.date
                      ? invoice.date.format(
                          "DD/MM/YYYY"
                        )
                      : ""}
                  </span>
                </div>

              </div>

              <div className="meta-single">

                <strong>
                  Despatch thro
                </strong>

                <span>
                  {invoice.dispatchThrough}
                </span>

              </div>

              <div className="meta-row">

                <div>
                  <strong>
                    Order No.
                  </strong>

                  <span>
                    {invoice.orderNo}
                  </span>
                </div>

                <div>
                  <strong>Dated</strong>

                  <span>
                    {invoice.orderDate
                      ? invoice.orderDate.format(
                          "DD/MM/YYYY"
                        )
                      : ""}
                  </span>
                </div>

              </div>

              <div className="meta-single">

                <strong>
                  L.R. / R.R. No.
                </strong>

                <span>
                  {invoice.lrNo}
                </span>

              </div>

            </div>

          </section>

          {/* ==============================
              ITEMS
          ============================== */}

          <section className="invoice-items">

            <div className="invoice-table">

              <div className="invoice-table-head">

                <span>S.No</span>

                <span>Description</span>

                <span>HSN Code</span>

                <span>Qty.</span>

                <span>Rate</span>

                <span>Amount</span>

                <span className="action-column no-print">
                  Action
                </span>

              </div>

              <div className="invoice-table-body">

                {items.length > 0 ? (
                  items.map(
                    (item, index) => (
                      <div
                        className="invoice-table-row"
                        key={item.id}
                      >

                        <span>
                          {index + 1}
                        </span>

                        <span className="description">
                          {item.item}
                        </span>

                        <span>
                          {item.hsn || ""}
                        </span>

                        <span className="center">
                          {item.qty}
                        </span>

                        <span className="right">
                          ₹{" "}
                          {formatAmount(
                            item.price
                          )}
                        </span>

                        <span className="right">
                          ₹{" "}
                          {formatAmount(
                            lineTotal(item)
                          )}
                        </span>

                        <span className="item-actions action-column no-print">

                          <button
                            type="button"
                            className="edit-item"
                            onClick={() =>
                              openEditItem(item)
                            }
                            aria-label="Edit item"
                          >
                            <EditOutlined />
                          </button>

                          <button
                            type="button"
                            className="delete-item"
                            onClick={() =>
                              removeItem(item.id)
                            }
                            aria-label="Delete item"
                          >
                            <DeleteOutlined />
                          </button>

                        </span>

                      </div>
                    )
                  )
                ) : (
                  <div className="invoice-empty">
                    No items added
                  </div>
                )}

                {/* Blank billing space */}
                <div className="invoice-blank-space" />

              </div>

            </div>

          </section>

          {/* ==============================
              TOTAL + BANK
          ============================== */}

          <section className="invoice-bottom">

            <div className="bottom-left">

              <div className="amount-words-box">

                <strong>
                  Amount Chargeable In Words
                </strong>

                <div>
                  {invoice.amountInWords}
                </div>

              </div>

              <div className="bank-box">

                <strong>
                  BANK DETAILS
                </strong>

                <div>
                  A/c No. :{" "}
                  {BUSINESS.bank.accountNo}
                </div>

                <div>
                  IFSC :{" "}
                  {BUSINESS.bank.ifsc}
                </div>

                <div>
                  Bank :{" "}
                  {BUSINESS.bank.bankName}
                </div>

                <div>
                  Branch :{" "}
                  {BUSINESS.bank.branch}
                </div>

              </div>

              <div className="common-seal">
                Common Seal
              </div>

            </div>

            <div className="gst-total-box">

              <div className="gst-row">

                <strong>CGST</strong>

                <span>
                  {cgst}%
                </span>

                <b>
                  ₹{" "}
                  {formatAmount(
                    cgstAmount
                  )}
                </b>

              </div>

              <div className="gst-row">

                <strong>SGST</strong>

                <span>
                  {sgst}%
                </span>

                <b>
                  ₹{" "}
                  {formatAmount(
                    sgstAmount
                  )}
                </b>

              </div>

              <div className="gst-row">

                <strong>IGST</strong>

                <span>
                  {igst}%
                </span>

                <b>
                  ₹{" "}
                  {formatAmount(
                    igstAmount
                  )}
                </b>

              </div>

              <div className="total-row">

                <strong>
                  TOTAL
                </strong>

                <b>
                  ₹ {formatAmount(total)}
                </b>

              </div>

              <div className="authorized-box">

                <strong>
                  For{" "}
                  {BUSINESS.name}
                </strong>

                <div className="signature-space" />

                <b>
                  Authorised Signatory
                </b>

              </div>

            </div>

          </section>

          {/* ==============================
              TERMS
          ============================== */}

          <footer className="invoice-footer">

            <div className="terms-box">

              <div className="terms-title">
                Terms &amp; Conditions
              </div>

              <ol>

                {terms
                  .split("\n")
                  .filter(
                    (term) =>
                      term.trim()
                  )
                  .map(
                    (term, index) => (
                      <li key={index}>
                        {term.trim()}
                      </li>
                    )
                  )}

              </ol>

            </div>

          </footer>

        </main>

        {/* ==============================
            ACTION BUTTONS
        ============================== */}

        <Space className="invoice-actions no-print">

          <Button
            icon={<PrinterOutlined />}
            onClick={() =>
              window.print()
            }
          >
            Print
          </Button>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadPdf}
          >
            Download PDF
          </Button>

        </Space>

        {/* ==============================
            INVOICE DETAILS MODAL
        ============================== */}

        <Modal
          title="Invoice Details"
          open={detailsOpen}
          onCancel={() =>
            setDetailsOpen(false)
          }
          onOk={() =>
            setDetailsOpen(false)
          }
          okText="Save"
          width={720}
        >

          <div className="modal-fields">

            <label>
              Invoice Number

              <Input
                value={invoice.number}
                onChange={(e) =>
                  updateInvoice(
                    "number",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Invoice Date

              <DatePicker
                value={invoice.date}
                onChange={(date) =>
                  updateInvoice(
                    "date",
                    date
                  )
                }
                format="DD/MM/YYYY"
              />
            </label>

            <label>
              Customer Name

              <Input
                value={
                  invoice.customerName
                }
                onChange={(e) =>
                  updateInvoice(
                    "customerName",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Customer Mobile

              <Input
                value={
                  invoice.customerMobile
                }
                onChange={(e) =>
                  updateInvoice(
                    "customerMobile",
                    e.target.value
                  )
                }
              />
            </label>

            <label className="full-field">
              Customer Address

              <Input.TextArea
                rows={2}
                value={
                  invoice.customerAddress
                }
                onChange={(e) =>
                  updateInvoice(
                    "customerAddress",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Customer GSTIN

              <Input
                value={
                  invoice.customerGstin
                }
                onChange={(e) =>
                  updateInvoice(
                    "customerGstin",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Despatch Through

              <Input
                value={
                  invoice.dispatchThrough
                }
                onChange={(e) =>
                  updateInvoice(
                    "dispatchThrough",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Order Number

              <Input
                value={invoice.orderNo}
                onChange={(e) =>
                  updateInvoice(
                    "orderNo",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Order Date

              <DatePicker
                value={invoice.orderDate}
                onChange={(date) =>
                  updateInvoice(
                    "orderDate",
                    date
                  )
                }
                format="DD/MM/YYYY"
              />
            </label>

            <label>
              L.R. / R.R. Number

              <Input
                value={invoice.lrNo}
                onChange={(e) =>
                  updateInvoice(
                    "lrNo",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              CGST %

              <InputNumber
                min={0}
                max={100}
                value={cgst}
                onChange={(value) =>
                  setCgst(value || 0)
                }
              />
            </label>

            <label>
              SGST %

              <InputNumber
                min={0}
                max={100}
                value={sgst}
                onChange={(value) =>
                  setSgst(value || 0)
                }
              />
            </label>

            <label>
              IGST %

              <InputNumber
                min={0}
                max={100}
                value={igst}
                onChange={(value) =>
                  setIgst(value || 0)
                }
              />
            </label>

            <label className="full-field">
              Amount Chargeable In Words

              <Input
                value={
                  invoice.amountInWords
                }
                onChange={(e) =>
                  updateInvoice(
                    "amountInWords",
                    e.target.value
                  )
                }
                placeholder="Enter amount in words"
              />
            </label>

            <label className="full-field">
              Terms &amp; Conditions

              <Input.TextArea
                rows={7}
                value={terms}
                onChange={(e) =>
                  setTerms(
                    e.target.value
                  )
                }
              />
            </label>

          </div>

        </Modal>

        {/* ==============================
            ADD / EDIT ITEM
        ============================== */}

        <Modal
          title={
            editingItemId
              ? "Edit Item"
              : "Add Item"
          }
          open={itemOpen}
          onCancel={() => {
            setItemOpen(false);
            setEditingItemId(null);
          }}
          onOk={saveItem}
          okText={
            editingItemId
              ? "Update Item"
              : "Add Item"
          }
        >

          <div className="modal-fields">

            <label className="full-field">
              Item Description

              <Input.TextArea
                autoFocus
                rows={3}
                value={draftItem.item}
                onChange={(e) =>
                  setDraftItem({
                    ...draftItem,
                    item: e.target.value,
                  })
                }
              />
            </label>

            <label>
              HSN Code

              <Input
                value={draftItem.hsn}
                onChange={(e) =>
                  setDraftItem({
                    ...draftItem,
                    hsn: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Quantity

              <InputNumber
                min={1}
                value={draftItem.qty}
                onChange={(value) =>
                  setDraftItem({
                    ...draftItem,
                    qty: value || 0,
                  })
                }
              />
            </label>

            <label>
              Rate

              <InputNumber
                min={0}
                value={draftItem.price}
                onChange={(value) =>
                  setDraftItem({
                    ...draftItem,
                    price: value || 0,
                  })
                }
              />
            </label>

          </div>

        </Modal>

      </div>
    </div>
  );
}