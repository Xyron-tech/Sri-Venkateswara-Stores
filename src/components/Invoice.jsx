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
import WATERMARK_SRC from "../assets/Sri_Image.jpg";

const BUSINESS = {
  name: "Sri Venkateswara Stores",
  address: "No.1/1,3,4,5, Ondikkal Market, Vellore - 4",
  phone: "99522 22018",
};

const DEFAULT_TERMS = [
  "Good Once sold will not be taken back",
  "Interest @ 24% p.a. will be charged if the payment is not made with in the stipulated time.",
  'Subject to "Vellore" Jurisdiction only',
  "Payment should be made by NEFT / RTGS / Cheque",
];

let itemId = 1;

const createItem = () => ({
  id: itemId++,
  item: "",
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

  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    date: dayjs(),
  });

  const [items, setItems] = useState([]);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [igst, setIgst] = useState(0);
  const [terms, setTerms] = useState(DEFAULT_TERMS.join("\n"));

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [draftItem, setDraftItem] = useState(createItem);

  const lineTotal = (item) =>
    Number(item.qty || 0) * Number(item.price || 0);

  const subtotal = items.reduce(
    (sum, item) => sum + lineTotal(item),
    0
  );

  const cgstAmount = subtotal * (Number(cgst) / 100);
  const sgstAmount = subtotal * (Number(sgst) / 100);
  const igstAmount = subtotal * (Number(igst) / 100);

  const total =
    subtotal + cgstAmount + sgstAmount + igstAmount;

  const saveItem = () => {
    const name = draftItem.item.trim();

    if (!name || Number(draftItem.qty) <= 0) return;

    setItems((current) => [
      ...current,
      {
        ...draftItem,
        item: name,
      },
    ]);

    setDraftItem(createItem());
    setItemOpen(false);
  };

  const removeItem = (id) => {
    setItems((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const waitForFonts = async () => {
    if (!document.fonts) return;

    await Promise.all([
      document.fonts.load('400 14px "Poppins"'),
      document.fonts.load('500 14px "Poppins"'),
      document.fonts.load('600 14px "Poppins"'),
      document.fonts.load('700 14px "Poppins"'),
    ]);

    await document.fonts.ready;
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;

    const deleteButtons =
      printRef.current.querySelectorAll(".delete-item");

    deleteButtons.forEach((button) => {
      button.style.display = "none";
    });

    try {
      await waitForFonts();

      await new Promise((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(resolve)
        )
      );

      await html2pdf()
        .set({
          margin: 0.25,
          filename: `invoice-${dayjs().format(
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
          },
          jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait",
          },
        })
        .from(printRef.current)
        .save();
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      deleteButtons.forEach((button) => {
        button.style.display = "";
      });
    }
  };

  return (
    <div className="invoice-page">
      <div className="invoice-wrapper">

        <div className="invoice-editor no-print">
          <Button
            icon={<EditOutlined />}
            onClick={() => setDetailsOpen(true)}
          >
            Invoice details
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setItemOpen(true)}
          >
            Add item
          </Button>
        </div>

        <main className="invoice-card" ref={printRef}>
          <div className="invoice-watermark">
            <img src={WATERMARK_SRC} alt="" />
          </div>

          <div className="invoice-content">

            <header className="invoice-header">
              <div>
                <h1>{BUSINESS.name}</h1>
                <p>{BUSINESS.address}</p>
                <p>Ph: {BUSINESS.phone}</p>
              </div>
            </header>

            <section className="bill-details">
              <div>
                <label>Bill To</label>

                <b>
                  {customer.name || "Customer"}
                </b>

                {customer.mobile && (
                  <span>
                    Mobile: {customer.mobile}
                  </span>
                )}
              </div>

              <div className="bill-date">
                <label>Invoice Date</label>
                <b>
                  {customer.date?.format("DD MMM YYYY")}
                </b>
              </div>
            </section>

            <section className="items-section">
              <h2>Item Details</h2>

              <div className="invoice-table">
                <div className="invoice-table-head">
                  <span>#</span>
                  <span>Item Description</span>
                  <span>Qty</span>
                  <span>Rate</span>
                  <span>Amount</span>
                  <span className="no-print" />
                </div>

                {items.length ? (
                  items.map((item, index) => (
                    <div
                      className="invoice-table-row"
                      key={item.id}
                    >
                      <span>{index + 1}</span>

                      <span className="item-name">
                        {item.item}
                      </span>

                      <span className="text-right">
                        {item.qty}
                      </span>

                      <span className="text-right">
                        ₹ {formatAmount(item.price)}
                      </span>

                      <span className="text-right">
                        ₹ {formatAmount(lineTotal(item))}
                      </span>

                      <button
                        type="button"
                        className="delete-item no-print"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.item}`}
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="invoice-empty">
                    No items added
                  </div>
                )}
              </div>
            </section>

            <section className="amount-section">
              <h2>Amount Details</h2>

              <div className="amount-card">
                <div>
                  <span>Subtotal</span>
                  <b>₹ {formatAmount(subtotal)}</b>
                </div>

                <div>
                  <span>CGST ({cgst}%)</span>
                  <b>₹ {formatAmount(cgstAmount)}</b>
                </div>

                <div>
                  <span>SGST ({sgst}%)</span>
                  <b>₹ {formatAmount(sgstAmount)}</b>
                </div>

                <div>
                  <span>IGST ({igst}%)</span>
                  <b>₹ {formatAmount(igstAmount)}</b>
                </div>

                <div className="grand-total">
                  <span>Total</span>
                  <b>₹ {formatAmount(total)}</b>
                </div>
              </div>
            </section>

            <footer className="invoice-footer">
              <div className="terms-card">
                <div className="terms-title">
                  Terms &amp; Conditions
                </div>

                <ol>
                  {terms
                    .split("\n")
                    .filter((term) => term.trim())
                    .map((term, index) => (
                      <li key={index}>
                        {term.trim()}
                      </li>
                    ))}
                </ol>
              </div>
            </footer>

          </div>
        </main>

        <Space className="invoice-actions no-print">
          <Button
            icon={<PrinterOutlined />}
            onClick={() => window.print()}
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

        <Modal
          title="Invoice Details"
          open={detailsOpen}
          onCancel={() => setDetailsOpen(false)}
          onOk={() => setDetailsOpen(false)}
          okText="Save"
        >
          <div className="modal-fields">

            <label>
              Customer Name
              <Input
                value={customer.name}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    name: e.target.value,
                  })
                }
                placeholder="Enter customer name"
              />
            </label>

            <label>
              Mobile Number
              <Input
                value={customer.mobile}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    mobile: e.target.value,
                  })
                }
                placeholder="Enter mobile number"
                maxLength={15}
              />
            </label>

            <label>
              Invoice Date
              <DatePicker
                value={customer.date}
                onChange={(date) =>
                  setCustomer({
                    ...customer,
                    date,
                  })
                }
                format="DD/MM/YYYY"
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

            <label className="terms-field">
              Terms &amp; Conditions

              <Input.TextArea
                rows={7}
                value={terms}
                onChange={(e) =>
                  setTerms(e.target.value)
                }
                placeholder="Enter each term on a new line"
              />
            </label>

          </div>
        </Modal>

        <Modal
          title="Add Item"
          open={itemOpen}
          onCancel={() => setItemOpen(false)}
          onOk={saveItem}
          okText="Add Item"
        >
          <div className="modal-fields">

            <label>
              Item Name
              <Input
                autoFocus
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