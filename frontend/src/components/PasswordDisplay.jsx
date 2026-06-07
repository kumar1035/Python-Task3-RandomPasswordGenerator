import { useState } from "react";
import { copyToClipboard } from "../utils/clipboard";
import StrengthIndicator from "./StrengthIndicator";
import "../styles/PasswordDisplay.css";

export default function PasswordDisplay({ entry }) {
  const [copied, setCopied] = useState(false);

  if (!entry) return null;

  const { password, strength } = entry;

  const handleCopy = async () => {
    await copyToClipboard(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="password-display card">
      <p className="section-title">Generated Password</p>

      <div className="password-box">
        <span className="password-text">{password}</span>
        <button className="copy-btn" onClick={handleCopy} aria-label="Copy password">
          {copied ? "✓ Copied" : "📋 Copy"}
        </button>
      </div>

      <StrengthIndicator strength={strength} />
    </div>
  );
}
