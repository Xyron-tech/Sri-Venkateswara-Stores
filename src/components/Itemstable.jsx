import { Button } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { formatAmount } from "./Invoicedata";

export default function ItemsTable({
  items,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
  isExporting,
}) {
  const lineTotal = (item) => Number(item.qty || 0) * Number(item.price || 0);

  return (
    <section className="invoice-items">
      <div className="invoice-table">
        <div className="invoice-table-head">
          <span>S.No</span>
          <span>Description</span>
          <span>HSN Code</span>
          <span>Qty.</span>
          <span>Rate</span>
          <span>Amount</span>
          <span className="action-column no-print">Action</span>
        </div>

        <div className="invoice-table-body">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div className="invoice-table-row" key={item.id}>
                <span>{index + 1}</span>

                <span className="description">
                  {isExporting ? (
                    <span className="field-input" style={{ whiteSpace: "pre-wrap" }}>
                      {item.item || ""}
                    </span>
                  ) : (
                    <textarea
                      className="field-input"
                      rows={1}
                      placeholder="Item description"
                      data-item-desc={item.id}
                      value={item.item}
                      onChange={(e) => onUpdateItem(item.id, "item", e.target.value)}
                    />
                  )}
                </span>

                <span>
                  {isExporting ? (
                    <span className="field-input">{item.hsn || ""}</span>
                  ) : (
                    <input
                      className="field-input"
                      value={item.hsn}
                      onChange={(e) => onUpdateItem(item.id, "hsn", e.target.value)}
                    />
                  )}
                </span>

                <span className="center">
                  {isExporting ? (
                    <span className="field-input center">{item.qty}</span>
                  ) : (
                    <input
                      min={0}
                      className="field-input center"
                      value={item.qty}
                      onChange={(e) =>
                        onUpdateItem(item.id, "qty", Number(e.target.value) || 0)
                      }
                    />
                  )}
                </span>

                <span className="right">
                  ₹{" "}
                  {isExporting ? (
                    <span className="field-input right">{item.price}</span>
                  ) : (
                    <input
                      min={0}
                      className="field-input right"
                      value={item.price}
                      onChange={(e) =>
                        onUpdateItem(item.id, "price", Number(e.target.value) || 0)
                      }
                    />
                  )}
                </span>

                <span className="right">₹ {formatAmount(lineTotal(item))}</span>

                <span className="item-actions action-column no-print">
                  <button
                    type="button"
                    className="delete-item"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Delete item"
                  >
                    <DeleteOutlined />
                  </button>
                </span>
              </div>
            ))
          ) : (
            <div className="invoice-empty">
              No items added — click &quot;Add Item&quot; below to create the first
              line item.
            </div>
          )}

          {/* Blank filler so the printed bill always fills the page nicely */}
          <div className="invoice-blank-space" />
        </div>
      </div>

      {/* Add Item sits right under the table, lined up over the Amount column */}
      <div className="add-item-row no-print">
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddItem}>
          Add Item
        </Button>
      </div>
    </section>
  );
}