import JVS_LOGO from "../assets/Sri_Image.jpg";

export default function InvoiceHeader({ business }) {
  return (
    <header className="tax-header">
      <div className="header-top">
        <div className="gstin">GSTIN : {business.gstin}</div>
        <div className="tax-title">TAX INVOICE</div>

        <div className="phone-list">
          {business.phones.map((phone) => (
            <div key={phone}>Ph : {phone}</div>
          ))}
        </div>
      </div>

      <div className="jvs-logo-wrapper">
        <img src={JVS_LOGO} alt="JVS" className="jvs-logo" />
      </div>

      <div className="business-heading">
        <div className="business-tamil-name">{business.tamilName}</div>
        <div className="business-tamil-line">{business.tamilLine}</div>
        <div className="business-tamil-line">{business.tamilLine2}</div>
        <div className="business-address-tamil">{business.addressTamil}</div>
        <div className="business-name">{business.name}</div>
        <div className="business-address">{business.address}</div>
      </div>
    </header>
  );
}