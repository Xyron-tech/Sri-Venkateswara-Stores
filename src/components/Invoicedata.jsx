import dayjs from "dayjs";

export const BUSINESS = {
  gstin: "33AEAFS2578D1Z8",
  tamilName: "ஸ்ரீ வெங்கடேஸ்வரா ஸ்டோர்ஸ் & சன்ஸ்",
  tamilLine: "அலுமினியம், இன்டாலியம், எவர்சில்வர், பித்தளை, செம்பு, கேஸ் ஸ்டவ்,",
  tamilLine2: "கல்யாண சீர்வரிசை பாத்திரங்கள் மொத்தம் - சில்லறை வியாபாரம்.",
  addressTamil: "நெ. 30, ஆர்யபவன் எதிரில், புல்லபேட்டை, வேலூர் - 632 001.",
  name: "SRI VENKATESHWARA STORES & SONS",
  address: "Vellore - 632 001",
  phones: ["90927 16131", "94427 30828", "99522 22018"],
  bank: {
    accountNo: "50200108217615",
    ifsc: "HDFC0008160",
    bankName: "HDFC BANK LTD",
    branch: "BAGAYAM",
  },
};

export const DEFAULT_TERMS = [
  "Goods once sold will not be taken back.",
  "Interest @ 24% p.a. will be charged if payment is not made within the stipulated time.",
  'Subject to "Vellore" Jurisdiction only.',
  "Payment should be made by NEFT / RTGS / Cheque.",
].join("\n");

export const DEFAULT_INVOICE = {
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

export const createItem = () => ({
  id: itemId++,
  item: "",
  hsn: "",
  qty: 1,
  price: 0,
});

export const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  