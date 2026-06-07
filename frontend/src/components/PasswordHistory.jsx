import { useState } from "react";
import { copyToClipboard } from "../utils/clipboard";
import "../styles/PasswordHistory.css";

export default function PasswordHistory({ history, onClear }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!history.length) return null;

  const handleCopy = async (password, index) => {
    await copyToClipboard(password);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  return (
    <div className="password-history card">
      <div className="history-header">
        <p className="section-title">Recent History</p>
        <button className="clear-history-btn" onClick={onClear}>Clear</button>
      </div>

      <ul className="history-list">
        {history.map((entry, i) => (
          <li key={`${entry.timestamp}-${i}`} className="history-item">
            <span className="history-password">{entry.password}</span>
            <span className="history-time">{entry.timestamp}</span>
            <button
              className="history-copy-btn"
              onClick={() => handleCopy(entry.password, i)}
              aria-label="Copy password"
            >
              {copiedIndex === i ? "✓" : "📋"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
