import { Page, View, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";
import { registerInvoiceFonts } from "./pdffonts";
import { formatAmount } from "./invoicedata";
import JVS_LOGO from "../assets/Sri_Image.jpg";
import WATERMARK_IMAGE from "../assets/Sri_Image.jpg";

registerInvoiceFonts();

// Font sizes below are copied 1:1 from Invoice.css class-by-class so the
// PDF matches the on-screen invoice exactly instead of approximating it.
const styles = StyleSheet.create({
    page: {
        fontFamily: "Poppins",
        fontSize: 10,
        color: "#111111",
        paddingTop: 12,
        paddingBottom: 12,
    },
    watermark: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  opacity: 0.08,
},
    card: {
        borderWidth: 1,
        borderColor: "#202020",
        marginHorizontal: 12,
    },

    /* ---------- Header ---------- */
    header: {
        paddingTop: 10,
        paddingHorizontal: 13,
        paddingBottom: 13,
    },
    headerTop: {
        position: "relative",
        minHeight: 30,
    },
    gstin: {
        position: "absolute",
        left: 0,
        top: 0,
        fontSize: 12,
        fontWeight: 700,
    },
    taxTitleWrap: {
        alignItems: "center",
    },
    taxTitle: {
        fontSize: 12,
        fontWeight: 700,
        color: "#ffffff",
        backgroundColor: "#1e293b",
        paddingVertical: 3,
        paddingHorizontal: 18,
        letterSpacing: 0.8,
    },
    phoneList: {
        position: "absolute",
        right: 0,
        top: 0,
    },
    phoneLine: {
        fontSize: 10,
        fontWeight: 600,
        lineHeight: 1.45,
        textAlign: "right",
    },
    logoWrap: {
        alignItems: "center",
        marginTop: 4,
        marginBottom: 4,
    },
    logo: {
        width: 58,
        height: 58,
    },
    businessHeading: {
        textAlign: "center",
        paddingHorizontal: 20,
    },
    businessTamilName: {
        fontFamily: "Noto Sans Tamil",
        fontSize: 23,
        fontWeight: 700,
        lineHeight: 1.25,
        textAlign: "center",
    },
    businessTamilLine: {
        fontFamily: "Noto Sans Tamil",
        fontSize: 10,
        fontWeight: 500,
        lineHeight: 1.45,
        textAlign: "center",
    },
    businessAddressTamil: {
        fontFamily: "Noto Sans Tamil",
        fontSize: 10,
        fontWeight: 500,
        marginTop: 2,
        textAlign: "center",
    },
    businessName: {
        fontSize: 17,
        fontWeight: 700,
        marginTop: 3,
        textAlign: "center",
    },
    businessAddress: {
        fontSize: 10,
        fontWeight: 500,
        color: "#333333",
        textAlign: "center",
    },

    /* ---------- Customer + meta ---------- */
    topDetails: {
        flexDirection: "row",
        marginHorizontal: 12,
        borderWidth: 1,
        borderColor: "#111111",
    },
    customerBox: {
        flex: 1.05,
        borderRightWidth: 1,
        borderRightColor: "#111111",
    },
    customerLine: {
        flexDirection: "row",
        minHeight: 36,
        borderBottomWidth: 1,
        borderBottomColor: "#111111",
        fontSize: 10,
    },
    customerLineNoBorder: {
        flexDirection: "row",
        minHeight: 36,
        fontSize: 10,
    },
    customerLabel: {
        width: 72,
        fontWeight: 700,
        padding: 8,
    },
    customerValue: {
        flex: 1,
        padding: 8,
    },
    metaBox: {
        flex: 1,
    },
    metaRow: {
        flexDirection: "row",
        minHeight: 36,
        borderBottomWidth: 1,
        borderBottomColor: "#111111",
    },
    metaCell: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 6,
        fontSize: 9,
    },
    metaCellBorder: {
        borderRightWidth: 1,
        borderRightColor: "#111111",
    },
    metaLabel: {
        fontWeight: 700,
        marginRight: 4,
    },
    metaValue: {
        flex: 1,
        flexShrink: 1,
    },
    metaSingle: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 36,
        padding: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#111111",
        fontSize: 9,
    },
    metaSingleLast: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 36,
        padding: 6,
        fontSize: 9,
    },

    /* ---------- Items table ---------- */
    itemsWrap: {
        marginHorizontal: 12,
        marginTop: 0,
    },
    table: {
        borderWidth: 1,
        borderColor: "#111111",
        marginTop: 12,
    },
    tableHead: {
        flexDirection: "row",
        minHeight: 28,
        backgroundColor: "#f2f3f3",
        borderBottomWidth: 1,
        borderBottomColor: "#111111",
        fontSize: 9,
        fontWeight: 700,
    },
    tableRow: {
        flexDirection: "row",
        minHeight: 30,
        borderBottomWidth: 1,
        borderBottomColor: "#111111",
        fontSize: 10,
    },
    colSNo: { width: 45 },
    colDesc: {
        flex: 1,
    },

    colHsn: {
        width: 110,
        flexShrink: 0,
    },

    colQty: {
        width: 50,
    },
    colRate: { width: 88 },
    colAmount: { width: 100 },
    headCell: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 6,
        borderRightWidth: 1,
        borderRightColor: "#111111",
    },
    bodyCell: {
        padding: 6,
        borderRightWidth: 1,
        borderRightColor: "#111111",
    },
    noBorderRight: {
        borderRightWidth: 0,
    },
    center: {
        textAlign: "center",
    },
    right: {
        textAlign: "right",
    },
    emptyRow: {
        minHeight: 40,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
    },
    emptyText: {
        fontSize: 10,
        color: "#777777",
        textAlign: "center",
    },

    /* ---------- Bottom: amount words / bank / gst / total ---------- */
    bottom: {
        flexDirection: "row",
        marginHorizontal: 12,
        marginTop: 15,
        borderWidth: 1,
        borderColor: "#111111",
        minHeight: '260px'
    },
    bottomLeft: {
        flex: 1.15,
        borderRightWidth: 1,
        borderRightColor: "#111111",
    },
    amountWordsBox: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#111111",
        fontSize: 9,
        minHeight: 55,
    },
    amountWordsLabel: {
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 7,
    },
    bankBox: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#111111",
        fontSize: 9,
        lineHeight: 1.55,
    },
    bankLabel: {
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 3,
    },
    commonSeal: {
        fontSize: 10,
        fontWeight: 500,
        padding: 8,
        textAlign: "right",
        position: "absolute",
        right: "8px",
        bottom: "8px",
    },
    gstTotalBox: {
        flex: 1,
    },
    gstRow: {
        flexDirection: "row",
        minHeight: 30,
        borderBottomWidth: 1,
        borderBottomColor: "#111111",
        fontSize: 9,
    },
    gstLabelCell: {
        width: 80,
        padding: 6,
        borderRightWidth: 1,
        borderRightColor: "#111111",
        fontWeight: 700,
        justifyContent: "center",
    },
    gstPercentCell: {
        width: 70,
        padding: 6,
        borderRightWidth: 1,
        borderRightColor: "#111111",
        flexDirection: "row",
        alignItems: "center",
    },
    gstAmountCell: {
        flex: 1,
        padding: 6,
        justifyContent: "center",
        alignItems: "flex-end",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 40,
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#111111",
        backgroundColor: "#f8faf8",
        fontSize: 13,
    },
    totalAmount: {
        fontSize: 15,
        fontWeight: 700,
    },
    authorizedBox: {
        flex: 1,
        padding: 8,
        alignItems: "center",
        fontSize: 9,
    },
    authorizedLabel: {
        fontSize: 10,
        fontWeight: 700,
    },
    signatureSpace: {
        height: 37,
    },

    /* ---------- Footer ---------- */
    footer: {
        marginHorizontal: 12,
        marginTop: 15,
        borderWidth: 1,
        borderColor: "#111111",
        padding: 10,
    },
    termsTitle: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 6,
    },
    termsLine: {
        fontSize: 12,
        lineHeight: 1.7,
    },
});

const lineTotal = (item) => Number(item.qty || 0) * Number(item.price || 0);
const fmtDate = (d) => (d ? d.format("DD/MM/YYYY") : "");

// L.R./R.R. No., HSN Code, etc.) use CSS white-space:nowrap +
// text-overflow:ellipsis — they truncate, they don't wrap. Multi-line wrap
// inside react-pdf's nested flex rows is fragile (wrapped lines can overlap
// a fixed-height row instead of growing it), so mirroring the UI's
// truncate-with-"…" behavior here is both more correct and more reliable.
const truncate = (value, maxChars) => {
    const str = value == null ? "" : String(value);
    if (str.length <= maxChars) return str;
    return `${str.slice(0, maxChars - 1)}\u2026`;
};

const breakLongText = (value, chunkSize = 18) => {
    const str = value == null ? "" : String(value);

    return str.replace(
        new RegExp(`(.{${chunkSize}})`, "g"),
        "$1\n"
    );
};
const isItemFilled = (item) => {
    return Boolean(
        item.item?.trim() ||
        item.hsn?.trim() ||
        String(item.qty ?? "").trim() ||
        String(item.price ?? "").trim()
    );
};
export default function InvoicePdfDocument({
    business,
    invoice,
    items,
    cgst,
    sgst,
    igst,
    cgstAmount,
    sgstAmount,
    igstAmount,
    total,
    terms,
}) {
    const pdfItems = items.filter(isItemFilled);
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                 <Image
    src={WATERMARK_IMAGE}
    style={styles.watermark}
    fixed
  />
                <View style={styles.card}>
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <Text style={styles.gstin}>GSTIN : {business.gstin}</Text>
                            <View style={styles.taxTitleWrap}>
                                <Text style={styles.taxTitle}>TAX INVOICE</Text>
                            </View>
                            <View style={styles.phoneList}>
                                {business.phones.map((phone) => (
                                    <Text style={styles.phoneLine} key={phone}>
                                        Ph : {phone}
                                    </Text>
                                ))}
                            </View>
                        </View>

                        <View style={styles.logoWrap}>
                            <Image src={JVS_LOGO} style={styles.logo} />
                        </View>

                        <View style={styles.businessHeading}>
                            <Text style={styles.businessTamilName}>{business.tamilName}</Text>
                            <Text style={styles.businessTamilLine}>{business.tamilLine}</Text>
                            <Text style={styles.businessTamilLine}>{business.tamilLine2}</Text>
                            <Text style={styles.businessAddressTamil}>{business.addressTamil}</Text>
                            <Text style={styles.businessName}>{business.name}</Text>
                            <Text style={styles.businessAddress}>{business.address}</Text>
                        </View>
                    </View>

                    {/* ---------- Customer + meta ---------- */}
                    <View style={styles.topDetails}>
                        <View style={styles.customerBox}>
                            <View style={styles.customerLine}>
                                <Text style={styles.customerLabel}>Mr/Ms.</Text>
                                <Text style={styles.customerValue}>{truncate(invoice.customerName, 45)}</Text>
                            </View>
                            <View style={styles.customerLine}>
                                <Text style={styles.customerLabel}>Address</Text>
                                <Text style={styles.customerValue}>{invoice.customerAddress || ""}</Text>
                            </View>
                            <View style={styles.customerLine}>
                                <Text style={styles.customerLabel}>Ph.</Text>
                                <Text style={styles.customerValue}>{truncate(invoice.customerMobile, 22)}</Text>
                            </View>
                            <View style={styles.customerLineNoBorder}>
                                <Text style={styles.customerLabel}>GSTIN</Text>
                                <Text style={styles.customerValue}>{truncate(invoice.customerGstin, 38)}</Text>
                            </View>
                        </View>

                        <View style={styles.metaBox}>
                            <View style={styles.metaRow}>
                                <View style={[styles.metaCell, styles.metaCellBorder]}>
                                    <Text style={styles.metaLabel}>No.</Text>
                                    <Text style={styles.metaValue}>{truncate(invoice.number, 14)}</Text>
                                </View>
                                <View style={styles.metaCell}>
                                    <Text style={styles.metaLabel}>Date</Text>
                                    <Text style={styles.metaValue}>{fmtDate(invoice.date)}</Text>
                                </View>
                            </View>

                            <View style={styles.metaSingle}>
                                <Text style={styles.metaLabel}>Despatch thro</Text>
                                <Text style={styles.metaValue}>{truncate(invoice.dispatchThrough, 100)}</Text>
                            </View>

                            <View style={styles.metaRow}>
                                <View style={[styles.metaCell, styles.metaCellBorder]}>
                                    <Text style={styles.metaLabel}>Order No.</Text>
                                    <Text style={styles.metaValue}>{truncate(invoice.orderNo, 100)}</Text>
                                </View>
                                <View style={styles.metaCell}>
                                    <Text style={styles.metaLabel}>Dated</Text>
                                    <Text style={styles.metaValue}>{fmtDate(invoice.orderDate)}</Text>
                                </View>
                            </View>

                            <View style={styles.metaSingleLast}>
                                <Text style={styles.metaLabel}>L.R. / R.R. No.</Text>
                                <Text style={styles.metaValue}>{truncate(invoice.lrNo, 100)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* ---------- Items table ---------- */}
                    <View style={styles.itemsWrap}>
                        <View style={styles.table}>
                            <View style={styles.tableHead}>
                                <Text style={[styles.headCell, styles.colSNo]}>S.No</Text>
                                <Text style={[styles.headCell, styles.colDesc]}>Description</Text>
                                <Text style={[styles.headCell, styles.colHsn]}>HSN Code</Text>
                                <Text style={[styles.headCell, styles.colQty]}>Qty.</Text>
                                <Text style={[styles.headCell, styles.colRate]}>Rate</Text>
                                <Text style={[styles.headCell, styles.colAmount, styles.noBorderRight]}>
                                    Amount
                                </Text>
                            </View>

                            {pdfItems.length > 0 ? (
                                pdfItems.map((item, index) => (
                                    <View style={styles.tableRow} key={item.id} wrap={false}>
                                        <Text style={[styles.bodyCell, styles.colSNo]}>
                                            {index + 1}
                                        </Text>

                                        <Text style={[styles.bodyCell, styles.colDesc]}>
                                            {breakLongText(item.item, 45)}
                                        </Text>

                                        <Text style={[styles.bodyCell, styles.colHsn]}>
                                            {breakLongText(item.hsn, 18)}
                                        </Text>

                                        <Text style={[styles.bodyCell, styles.colQty, styles.center]}>
                                            {item.qty}
                                        </Text>

                                        <Text style={[styles.bodyCell, styles.colRate, styles.right]}>
                                            Rs. {item.price}
                                        </Text>

                                        <Text
                                            style={[
                                                styles.bodyCell,
                                                styles.colAmount,
                                                styles.right,
                                                styles.noBorderRight,
                                            ]}
                                        >
                                            Rs. {formatAmount(lineTotal(item))}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyRow}>
                                    <Text style={styles.emptyText}>No items added.</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* ---------- Bottom: amount words / bank / gst / total ---------- */}
                    <View style={styles.bottom} wrap={false}>
                        <View style={styles.bottomLeft}>
                            <View style={styles.amountWordsBox}>
                                <Text style={styles.amountWordsLabel}>Amount Chargeable In Words</Text>
                                <Text>{invoice.amountInWords || ""}</Text>
                            </View>

                            <View style={styles.bankBox}>
                                <Text style={styles.bankLabel}>BANK DETAILS</Text>
                                <Text>A/c No. : {business.bank.accountNo}</Text>
                                <Text>IFSC : {business.bank.ifsc}</Text>
                                <Text>Bank : {business.bank.bankName}</Text>
                                <Text>Branch : {business.bank.branch}</Text>
                            </View>

                            <Text style={styles.commonSeal}>Common Seal</Text>
                        </View>

                        <View style={styles.gstTotalBox}>
                            <View style={styles.gstRow}>
                                <Text style={styles.gstLabelCell}>CGST</Text>
                                <View style={styles.gstPercentCell}>
                                    <Text>{cgst || "0"} %</Text>
                                </View>
                                <Text style={styles.gstAmountCell}>Rs. {formatAmount(cgstAmount)}</Text>
                            </View>

                            <View style={styles.gstRow}>
                                <Text style={styles.gstLabelCell}>SGST</Text>
                                <View style={styles.gstPercentCell}>
                                    <Text>{sgst || "0"} %</Text>
                                </View>
                                <Text style={styles.gstAmountCell}>Rs. {formatAmount(sgstAmount)}</Text>
                            </View>

                            <View style={styles.gstRow}>
                                <Text style={styles.gstLabelCell}>IGST</Text>
                                <View style={styles.gstPercentCell}>
                                    <Text>{igst || "0"} %</Text>
                                </View>
                                <Text style={styles.gstAmountCell}>Rs. {formatAmount(igstAmount)}</Text>
                            </View>

                            <View style={styles.totalRow}>
                                <Text style={{ fontWeight: 700 }}>TOTAL</Text>
                                <Text style={styles.totalAmount}>Rs. {formatAmount(total)}</Text>
                            </View>

                            <View style={styles.authorizedBox}>
                                <Text style={styles.authorizedLabel}>For {business.name}</Text>
                                <View style={styles.signatureSpace} />
                                <Text style={{ fontWeight: 700 }}>Authorised Signatory</Text>
                            </View>
                        </View>
                    </View>

                    {/* ---------- Footer ---------- */}
                    <View style={styles.footer} wrap={false}>
                        <Text style={styles.termsTitle}>Terms & Conditions</Text>
                        {(terms || "").split("\n").map((line, i) => (
                            <Text style={styles.termsLine} key={i}>
                                {line}
                            </Text>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
}