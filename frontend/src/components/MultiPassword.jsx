import { useState } from "react";
import { copyToClipboard, downloadAsText } from "../utils/clipboard";
import "../styles/MultiPassword.css";

export default function MultiPassword({ results }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (results.length < 2) return null;

  const handleCopy = async (password, index) => {
    await copyToClipboard(password);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  const handleDownload = () => downloadAsText(results.map((r) => r.password));

  return (
    <div className="multi-password card">
      <div className="multi-header">
        <p className="section-title">Generated Batch ({results.length})</p>
        <button className="download-btn" onClick={handleDownload}>⬇ Download .txt</button>
      </div>

      <ul className="multi-list">
        {results.map((entry, i) => (
          <li key={`${entry.password}-${i}`} className="multi-item">
            <span className="multi-password-text">{entry.password}</span>
            <span className="multi-strength-label">{entry.strength?.label}</span>
            <button
              className="multi-copy-btn"
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
