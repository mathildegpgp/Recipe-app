import { useState, useRef } from 'react';
import { Ingredient, categorizeIngredient } from './FridgeInventory';

type ScannedItem = {
  name: string;
  quantity: string;
  unit: string;
  selected: boolean;
  existing: boolean;
};

type SampleReceipt = {
  store: string;
  date: string;
  items: { name: string; quantity: string; unit: string }[];
};

const sampleReceipts: SampleReceipt[] = [
  {
    store: 'Netto',
    date: '2026-06-14',
    items: [
      { name: 'Milk', quantity: '2', unit: 'L' },
      { name: 'Eggs', quantity: '12', unit: 'count' },
      { name: 'Chicken breast', quantity: '500', unit: 'g' },
      { name: 'Broccoli', quantity: '2', unit: 'heads' },
      { name: 'Garlic', quantity: '3', unit: 'count' },
      { name: 'Pasta', quantity: '500', unit: 'g' },
      { name: 'Tomato sauce', quantity: '400', unit: 'g' },
    ],
  },
  {
    store: 'Føtex',
    date: '2026-06-15',
    items: [
      { name: 'Salmon', quantity: '400', unit: 'g' },
      { name: 'Lemon', quantity: '2', unit: 'count' },
      { name: 'Butter', quantity: '250', unit: 'g' },
      { name: 'Sourdough bread', quantity: '1', unit: 'loaf' },
      { name: 'Coconut milk', quantity: '400', unit: 'ml' },
      { name: 'Basil', quantity: '20', unit: 'g' },
    ],
  },
  {
    store: 'Lidl',
    date: '2026-06-16',
    items: [
      { name: 'Ground beef', quantity: '500', unit: 'g' },
      { name: 'Tomato', quantity: '4', unit: 'count' },
      { name: 'Onion', quantity: '3', unit: 'count' },
      { name: 'Carrot', quantity: '500', unit: 'g' },
      { name: 'Potato', quantity: '2', unit: 'kg' },
      { name: 'Olive oil', quantity: '750', unit: 'ml' },
      { name: 'Salt', quantity: '1', unit: 'kg' },
      { name: 'Black pepper', quantity: '50', unit: 'g' },
    ],
  },
];

type SupermarketInvoiceProps = {
  ingredients: Ingredient[];
  onAddIngredients: (items: Ingredient[]) => void;
  onNavigateHome?: () => void;
};

function SupermarketInvoice({ ingredients, onAddIngredients, onNavigateHome }: SupermarketInvoiceProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [scanning, setScanning] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeStore, setActiveStore] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingNames = new Set(ingredients.map((i) => i.name.toLowerCase()));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setScannedItems([]);
    setAdded(false);
    setActiveStore(null);
  };

  const handleScan = () => {
    setScanning(true);
    setAdded(false);

    setTimeout(() => {
      const items = getRandomReceipt().map((item) => ({
        ...item,
        selected: true,
        existing: existingNames.has(item.name.toLowerCase()),
      }));
      setScannedItems(items);
      setActiveStore(null);
      setScanning(false);
    }, 800 + Math.random() * 600);
  };

  const handleSampleScan = (receipt: SampleReceipt) => {
    setScannedItems([]);
    setAdded(false);
    setActiveStore(receipt.store);

    setScanning(true);
    setTimeout(() => {
      const items = receipt.items.map((item) => ({
        ...item,
        selected: true,
        existing: existingNames.has(item.name.toLowerCase()),
      }));
      setScannedItems(items);
      setScanning(false);
    }, 500 + Math.random() * 400);
  };

  const toggleItem = (index: number) => {
    setScannedItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const addSelectedToFridge = () => {
    const toAdd: Ingredient[] = scannedItems
      .filter((item) => item.selected)
      .map((item) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: categorizeIngredient(item.name),
        addedDate: new Date(),
      }));

    if (toAdd.length === 0) return;
    onAddIngredients(toAdd);
    setAdded(true);
    setScannedItems([]);
    setSelectedFile(null);
    setPreviewUrl(null);
    setActiveStore(null);
  };

  const resetAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScannedItems([]);
    setAdded(false);
    setActiveStore(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fridge-page">
      <header className="fridge-header">
        <div className="fridge-header-content">
          <div>
            <h1>🧾 Supermarket Invoice</h1>
            <p>Upload a receipt photo or use a sample receipt to scan items into your fridge.</p>
          </div>
          {onNavigateHome && (
            <button className="btn-back-home" onClick={onNavigateHome}>
              ← Back to home
            </button>
          )}
        </div>
      </header>

      <main className="fridge-main">
        {added && (
          <div className="success-banner">
            <span>✓ Ingredients added to your fridge!</span>
            <button className="btn-dismiss" onClick={resetAll}>Scan another</button>
          </div>
        )}

        <section className="sample-receipts-section">
          <h2>Sample receipts</h2>
          <p className="section-subtitle">Click a receipt to simulate scanning it</p>
          <div className="sample-receipts-grid">
            {sampleReceipts.map((receipt) => (
              <button
                key={receipt.store}
                className={`sample-receipt-card ${activeStore === receipt.store ? 'scanning' : ''}`}
                onClick={() => handleSampleScan(receipt)}
                disabled={scanning}
              >
                <span className="receipt-store">{receipt.store}</span>
                <span className="receipt-date">{receipt.date}</span>
                <span className="receipt-items">{receipt.items.length} items</span>
                <span className="receipt-items-list">
                  {receipt.items.map((i) => i.name).join(', ')}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="scan-section">
          <div className="scan-card">
            <h2>Upload a real receipt</h2>
            <p className="section-subtitle">Or take a photo of your own receipt</p>
            <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
              {previewUrl ? (
                <img src={previewUrl} alt="Receipt preview" className="receipt-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📄</span>
                  <p>Click to select a receipt image</p>
                  <span className="upload-hint">PNG, JPG or WEBP</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                hidden
              />
            </div>

            {previewUrl && !scanning && scannedItems.length === 0 && (
              <button className="btn-scan" onClick={handleScan}>
                🔍 Scan receipt
              </button>
            )}

            {scanning && (
              <div className="scanning-indicator">
                <span className="spinner"></span>
                <p>Scanning receipt{activeStore ? ` from ${activeStore}` : ''}...</p>
              </div>
            )}
          </div>
        </section>

        {scannedItems.length > 0 && !scanning && (
          <section className="scan-results-section">
            <div className="scan-card">
              <h2>Scanned items{activeStore ? ` — ${activeStore}` : ''}</h2>
              <p className="scan-subtitle">
                {scannedItems.filter((i) => i.selected).length} of {scannedItems.length} items selected
              </p>

              <div className="scanned-list">
                {scannedItems.map((item, index) => (
                  <label key={index} className={`scanned-item ${item.selected ? '' : 'deselected'}`}>
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleItem(index)}
                    />
                    <div className="scanned-item-info">
                      <span className="scanned-name">
                        {item.name}
                        {item.existing && <span className="already-badge">Already in fridge</span>}
                      </span>
                      <span className="scanned-qty">{item.quantity} {item.unit}</span>
                    </div>
                  </label>
                ))}
              </div>

              <button
                className="btn-add-fridge"
                onClick={addSelectedToFridge}
                disabled={scannedItems.filter((i) => i.selected).length === 0}
              >
                + Add selected to fridge
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function getRandomReceipt(): { name: string; quantity: string; unit: string }[] {
  const pool = [
    { name: 'Milk', quantity: '1', unit: 'L' },
    { name: 'Eggs', quantity: '12', unit: 'count' },
    { name: 'Butter', quantity: '250', unit: 'g' },
    { name: 'Chicken breast', quantity: '500', unit: 'g' },
    { name: 'Salmon', quantity: '400', unit: 'g' },
    { name: 'Tomato', quantity: '4', unit: 'count' },
    { name: 'Broccoli', quantity: '1', unit: 'head' },
    { name: 'Carrot', quantity: '500', unit: 'g' },
    { name: 'Onion', quantity: '3', unit: 'count' },
    { name: 'Garlic', quantity: '2', unit: 'count' },
    { name: 'Potato', quantity: '2', unit: 'kg' },
    { name: 'Lettuce', quantity: '1', unit: 'count' },
    { name: 'Avocado', quantity: '2', unit: 'count' },
    { name: 'Mushroom', quantity: '250', unit: 'g' },
    { name: 'Cucumber', quantity: '1', unit: 'count' },
    { name: 'Bell pepper', quantity: '3', unit: 'count' },
    { name: 'Spinach', quantity: '200', unit: 'g' },
    { name: 'Cheese', quantity: '200', unit: 'g' },
    { name: 'Yogurt', quantity: '4', unit: 'count' },
    { name: 'Sourdough bread', quantity: '1', unit: 'loaf' },
    { name: 'Bagel', quantity: '4', unit: 'count' },
    { name: 'Pasta', quantity: '500', unit: 'g' },
    { name: 'Rice', quantity: '1', unit: 'kg' },
    { name: 'Olive oil', quantity: '750', unit: 'ml' },
    { name: 'Salt', quantity: '1', unit: 'kg' },
    { name: 'Black pepper', quantity: '50', unit: 'g' },
    { name: 'Sugar', quantity: '1', unit: 'kg' },
    { name: 'Flour', quantity: '500', unit: 'g' },
    { name: 'Honey', quantity: '250', unit: 'g' },
    { name: 'Oatmeal', quantity: '500', unit: 'g' },
    { name: 'Cereal', quantity: '375', unit: 'g' },
    { name: 'Orange juice', quantity: '1', unit: 'L' },
    { name: 'Apple', quantity: '6', unit: 'count' },
    { name: 'Banana', quantity: '5', unit: 'count' },
    { name: 'Lemon', quantity: '3', unit: 'count' },
    { name: 'Lime', quantity: '2', unit: 'count' },
    { name: 'Ground beef', quantity: '500', unit: 'g' },
    { name: 'Pork chops', quantity: '400', unit: 'g' },
    { name: 'Ice cream', quantity: '1', unit: 'L' },
    { name: 'Cream', quantity: '200', unit: 'ml' },
    { name: 'Tofu', quantity: '300', unit: 'g' },
    { name: 'Coconut milk', quantity: '400', unit: 'ml' },
    { name: 'Tomato sauce', quantity: '400', unit: 'g' },
    { name: 'Peanut butter', quantity: '350', unit: 'g' },
    { name: 'Jam', quantity: '300', unit: 'g' },
  ];
  const count = 4 + Math.floor(Math.random() * 6);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default SupermarketInvoice;
