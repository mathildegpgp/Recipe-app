import { useState } from 'react';

type Invoice = {
  id: string;
  name: string;
  dataUrl: string;
  uploadedAt: Date;
};

function InvoiceUpload() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setInvoices((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          name: file.name,
          dataUrl,
          uploadedAt: new Date(),
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const removeInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    if (invoices.length <= 1) setPreview(null);
  };

  return (
    <div className="invoice-upload">
      <h2>Supermarket Invoices</h2>
      <p>Upload a picture of your supermarket invoice to keep track of your purchases.</p>

      <div className="invoice-actions">
        <label className="upload-btn">
          Choose file
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        <label className="upload-btn camera-btn">
          Take picture
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      </div>

      {preview && (
        <div className="invoice-preview">
          <img src={preview} alt="Invoice preview" />
        </div>
      )}

      {invoices.length > 0 && (
        <div className="invoice-list">
          <h3>Uploaded invoices ({invoices.length})</h3>
          {invoices.map((inv) => (
            <div key={inv.id} className="invoice-item">
              <img src={inv.dataUrl} alt={inv.name} />
              <div className="invoice-item-info">
                <span className="invoice-item-name">{inv.name}</span>
                <span className="invoice-item-date">
                  {inv.uploadedAt.toLocaleString()}
                </span>
              </div>
              <button onClick={() => removeInvoice(inv.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InvoiceUpload;
