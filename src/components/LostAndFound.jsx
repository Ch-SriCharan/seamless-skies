import { useState } from 'react';

const initialItems = [
  { id: 'SS-2048', item: 'Black cabin bag', flight: 'SKY 218', status: 'Located' },
  { id: 'SS-1973', item: 'Wireless headphones', flight: 'SKY 506', status: 'Searching' },
];

/* ─── Validation helpers ──────────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FLIGHT_RE = /^[A-Z]{2,3}\s?\d{1,4}$/i;

const validate = (form) => {
  const errors = {};
  if (!form.item || form.item.trim().length < 3) {
    errors.item = 'Please describe the item (at least 3 characters).';
  }
  if (!form.contact || !EMAIL_RE.test(form.contact)) {
    errors.contact = 'Please enter a valid email address.';
  }
  if (form.flight && !FLIGHT_RE.test(form.flight.trim())) {
    errors.flight = 'Flight number should look like SKY 218 or AI204.';
  }
  return errors;
};

const LostAndFound = ({ isOpen, onClose }) => {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState({ item: '', flight: '', contact: '', details: '' });
  const [errors, setErrors] = useState({});
  const [submittedId, setSubmittedId] = useState('');

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const submitReport = (event) => {
    event.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const id = `SS-${Math.floor(1000 + Math.random() * 9000)}`;
    setItems((current) => [
      { id, item: form.item, flight: form.flight || 'Flight pending', status: 'Reported' },
      ...current,
    ]);
    setSubmittedId(id);
    setErrors({});
    setForm({ item: '', flight: '', contact: '', details: '' });
  };

  return (
    <div className="lost-found-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="glass-panel lost-found-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Lost and found"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="lost-found-header">
          <div>
            <span className="eyebrow">PASSENGER CARE</span>
            <h2>Lost &amp; Found</h2>
            <p>Tell us what went missing. We will keep the search moving.</p>
          </div>
          <button className="panel-close" type="button" onClick={onClose} aria-label="Close lost and found panel">
            &times;
          </button>
        </header>

        {submittedId && (
          <div className="report-success" role="status" aria-live="polite">
            Report received. Your tracking ID is <strong>{submittedId}</strong>.
          </div>
        )}

        <form className="lost-found-form" onSubmit={submitReport} noValidate>
          <label htmlFor="laf-item">Item</label>
          <input
            id="laf-item"
            name="item"
            value={form.item}
            onChange={updateField}
            placeholder="e.g. blue passport wallet"
            aria-describedby={errors.item ? 'laf-item-error' : undefined}
            aria-invalid={!!errors.item}
          />
          {errors.item && (
            <span id="laf-item-error" className="field-error" role="alert">
              {errors.item}
            </span>
          )}

          <label htmlFor="laf-flight">Flight number</label>
          <input
            id="laf-flight"
            name="flight"
            value={form.flight}
            onChange={updateField}
            placeholder="e.g. SKY 218"
            aria-describedby={errors.flight ? 'laf-flight-error' : undefined}
            aria-invalid={!!errors.flight}
          />
          {errors.flight && (
            <span id="laf-flight-error" className="field-error" role="alert">
              {errors.flight}
            </span>
          )}

          <label htmlFor="laf-contact">Contact email</label>
          <input
            id="laf-contact"
            type="email"
            name="contact"
            value={form.contact}
            onChange={updateField}
            placeholder="you@example.com"
            aria-describedby={errors.contact ? 'laf-contact-error' : undefined}
            aria-invalid={!!errors.contact}
          />
          {errors.contact && (
            <span id="laf-contact-error" className="field-error" role="alert">
              {errors.contact}
            </span>
          )}

          <label htmlFor="laf-details">Helpful details</label>
          <textarea
            id="laf-details"
            name="details"
            value={form.details}
            onChange={updateField}
            placeholder="Seat, terminal, color, identifying marks..."
            rows="3"
          />

          <button className="report-button" type="submit">Submit report</button>
        </form>

        <div className="tracked-items">
          <div className="tracked-title">
            <h3>Recent items</h3>
            <span>{items.length} active</span>
          </div>
          {items.slice(0, 3).map((entry) => (
            <article className="item-card" key={entry.id}>
              <div>
                <strong>{entry.item}</strong>
                <small>{entry.flight} · {entry.id}</small>
              </div>
              <span className={`item-status status-${entry.status.toLowerCase()}`}>
                {entry.status}
              </span>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default LostAndFound;
