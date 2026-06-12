import { useState } from 'react';

const initialItems = [
  { id: 'SS-2048', item: 'Black cabin bag', flight: 'SKY 218', status: 'Located' },
  { id: 'SS-1973', item: 'Wireless headphones', flight: 'SKY 506', status: 'Searching' },
];

const LostAndFound = ({ isOpen, onClose }) => {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState({ item: '', flight: '', contact: '', details: '' });
  const [submittedId, setSubmittedId] = useState('');

  if (!isOpen) return null;

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitReport = (event) => {
    event.preventDefault();
    const id = `SS-${Math.floor(1000 + Math.random() * 9000)}`;
    setItems((current) => [
      { id, item: form.item, flight: form.flight || 'Flight pending', status: 'Reported' },
      ...current,
    ]);
    setSubmittedId(id);
    setForm({ item: '', flight: '', contact: '', details: '' });
  };

  return (
    <div className="lost-found-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="glass-panel lost-found-panel"
        aria-label="Lost and found"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="lost-found-header">
          <div>
            <span className="eyebrow">PASSENGER CARE</span>
            <h2>Lost &amp; Found</h2>
            <p>Tell us what went missing. We will keep the search moving.</p>
          </div>
          <button className="panel-close" type="button" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </header>

        {submittedId && (
          <div className="report-success">
            Report received. Your tracking ID is <strong>{submittedId}</strong>.
          </div>
        )}

        <form className="lost-found-form" onSubmit={submitReport}>
          <label>
            Item
            <input name="item" value={form.item} onChange={updateField} placeholder="e.g. blue passport wallet" required />
          </label>
          <label>
            Flight number
            <input name="flight" value={form.flight} onChange={updateField} placeholder="e.g. SKY 218" />
          </label>
          <label>
            Contact email
            <input type="email" name="contact" value={form.contact} onChange={updateField} placeholder="you@example.com" required />
          </label>
          <label>
            Helpful details
            <textarea name="details" value={form.details} onChange={updateField} placeholder="Seat, terminal, color, identifying marks..." rows="3" />
          </label>
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
