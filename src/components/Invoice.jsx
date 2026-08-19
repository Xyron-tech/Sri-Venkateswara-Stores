import { useState, useRef } from "react";
import {
  Input,
  Button,
  DatePicker,
  Row,
  Col,
  Card,
  Divider,
  Typography,
  InputNumber,
  Space,
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined, DownloadOutlined, PrinterOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import html2pdf from "html2pdf.js";
import "./Invoice.css";
import WATERMARK_SRC from "../assets/Sri_Image.jpg";

const { Title, Text } = Typography;

const BUSINESS = {
  name: "Sri Venkateswara Stores",
  address: "No.1/1,3,4,5, Ondikkal Market, Vellore - 4",
  phone: "99522 22018",
};

let idCounter = 1;
const newItem = () => ({ id: idCounter++, item: "", qty: 0, price: 0 });

export default function Invoice() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(dayjs());
  const [invoiceNo] = useState(() => Math.floor(1000 + Math.random() * 9000));
  const [items, setItems] = useState([newItem(), newItem()]);
  const [touched, setTouched] = useState({});
  const [discount, setDiscount] = useState(0);
  const printRef = useRef(null);

  const markTouched = (id, field) =>
    setTouched((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: true },
    }));

  const getError = (it, field) => {
    if (!touched[it.id]?.[field]) return "";
    if (field === "item") {
      return it.item.trim() === "" ? "Enter item name" : "";
    }
    if (field === "qty") {
      return !it.qty || Number(it.qty) <= 0 ? "Enter valid quantity" : "";
    }
    if (field === "price") {
      return it.price === null || it.price === undefined || Number(it.price) < 0
        ? "Enter valid price"
        : "";
    }
    return "";
  };

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const addItem = () => setItems((prev) => [...prev, newItem()]);
  const removeItem = (id) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));

  const validateAllItems = () => {
    const allTouched = {};
    let valid = true;
    items.forEach((it) => {
      allTouched[it.id] = { item: true, qty: true, price: true };
      if (
        it.item.trim() === "" ||
        !it.qty ||
        Number(it.qty) <= 0 ||
        it.price === null ||
        it.price === undefined ||
        Number(it.price) < 0
      ) {
        valid = false;
      }
    });
    setTouched(allTouched);
    if (!valid) {
      message.error("Fix the highlighted item fields before continuing.");
    }
    return valid;
  };

  const lineTotal = (it) => (Number(it.qty) || 0) * (Number(it.price) || 0);
  const subtotal = items.reduce((sum, it) => sum + lineTotal(it), 0);
  const discountAmount = subtotal * ((Number(discount) || 0) / 100);
  const total = subtotal - discountAmount;

  const fmt = (n) =>
    Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

  const handlePrint = () => {
    if (!validateAllItems()) return;
    window.print();
  };

  const handleDownloadPdf = () => {
    if (!validateAllItems()) return;
    const element = printRef.current;
    const opt = {
      margin: 0.3,
      filename: `invoice-${invoiceNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const initials = BUSINESS.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="invoice-page">
      <div className="invoice-wrapper" ref={printRef}>
        <Card className="invoice-card" bordered={false}>
          <div className="invoice-watermark">
            <img src={WATERMARK_SRC} alt="" />
          </div>
          <div className="invoice-content">
          {/* Header */}
          <div className="invoice-header">
            <div className="invoice-header-left">
              <div className="invoice-badge">{initials}</div>
              <div>
                <Title level={4} className="invoice-business-name">
                  {BUSINESS.name}
                </Title>
                <Text className="invoice-muted">{BUSINESS.address}</Text>
                <br />
                <Text className="invoice-muted">Ph: {BUSINESS.phone}</Text>
              </div>
            </div>
            <div className="invoice-header-right">
              <Title level={3} className="invoice-title-tag">
                INVOICE
              </Title>
              <Text className="invoice-muted">
                {invoiceDate ? invoiceDate.format("DD/MM/YYYY") : ""}
              </Text>
              <br />
              <Text className="invoice-muted invoice-customer-tag">
                {customerName ? customerName : "Customer name"}
              </Text>
            </div>
          </div>

          <Divider className="invoice-divider" />

          {/* Customer + date */}
          <Row gutter={16} className="invoice-meta-row">
            <Col xs={24} sm={8}>
              <Text className="invoice-label">Customer name</Text>
              <Input
                placeholder="Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Text className="invoice-label">Email</Text>
              <Input
                placeholder="Email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Text className="invoice-label">Date</Text>
              <DatePicker
                className="invoice-date-picker"
                value={invoiceDate}
                onChange={(d) => setInvoiceDate(d)}
                format="DD/MM/YYYY"
              />
            </Col>
          </Row>

          {/* Items table */}
          <div className="invoice-table-wrap">
            <div className="invoice-table-head">
              <span className="col-item">Item</span>
              <span className="col-qty">Quantity</span>
              <span className="col-price">Price</span>
              <span className="col-amount">Amount</span>
              <span className="col-action" />
            </div>
            {items.map((it) => (
              <div className="invoice-table-row" key={it.id}>
                <span className="col-item">
                  <span className="mobile-label">Item</span>
                  <Input
                    placeholder="Item name"
                    value={it.item}
                    status={getError(it, "item") ? "error" : ""}
                    onChange={(e) => updateItem(it.id, "item", e.target.value)}
                    onBlur={() => markTouched(it.id, "item")}
                  />
                  {getError(it, "item") && (
                    <div className="field-error">{getError(it, "item")}</div>
                  )}
                </span>
                <span className="col-qty">
                  <span className="mobile-label">Quantity</span>
                  <InputNumber
                    min={0}
                    placeholder="Quantity"
                    value={it.qty}
                    status={getError(it, "qty") ? "error" : ""}
                    onChange={(v) => updateItem(it.id, "qty", v)}
                    onBlur={() => markTouched(it.id, "qty")}
                    style={{ width: "100%" }}
                  />
                  {getError(it, "qty") && (
                    <div className="field-error">{getError(it, "qty")}</div>
                  )}
                </span>
                <span className="col-price">
                  <span className="mobile-label">Price</span>
                  <InputNumber
                    min={0}
                    value={it.price}
                    status={getError(it, "price") ? "error" : ""}
                    onChange={(v) => updateItem(it.id, "price", v)}
                    onBlur={() => markTouched(it.id, "price")}
                    style={{ width: "100%" }}
                  />
                  {getError(it, "price") && (
                    <div className="field-error">{getError(it, "price")}</div>
                  )}
                </span>
                <span className="col-amount">
                  <span className="mobile-label">Amount</span>
                  Rs. {fmt(lineTotal(it))}
                </span>
                <span className="col-action">
                  <Popconfirm
                    title="Delete this item?"
                    description="Are you sure you want to delete this line item?"
                    icon={<ExclamationCircleFilled style={{ color: "#ef4444" }} />}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => removeItem(it.id)}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      className="invoice-remove-btn"
                    />
                  </Popconfirm>
                </span>
              </div>
            ))}
          </div>

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addItem}
            className="invoice-add-btn"
          >
            Add item
          </Button>

          {/* Totals */}
          <div className="invoice-totals">
            <div className="invoice-totals-row">
              <Text className="invoice-muted">Subtotal</Text>
              <Text>Rs. {fmt(subtotal)}</Text>
            </div>

            <div className="invoice-discount-row">
              <div className="invoice-discount-input">
                <span>Discount</span>
                <InputNumber
                  min={0}
                  max={100}
                  value={discount}
                  onChange={(v) => setDiscount(v || 0)}
                  style={{ width: 70 }}
                  suffix="%"
                  size="small"
                />
              </div>
              <span>- Rs. {fmt(discountAmount)}</span>
            </div>

            <div className="invoice-total-final">
              <Text className="invoice-total-label">Total</Text>
              <Text className="invoice-total-value">Rs. {fmt(total)}</Text>
            </div>
          </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Space className="invoice-actions">
        <Button icon={<PrinterOutlined />} onClick={handlePrint}>
          Print
        </Button>
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadPdf}>
          Download PDF
        </Button>
      </Space>
    </div>
  );
}