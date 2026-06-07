import "../styles/StrengthIndicator.css";

const COLORS = {
  "Very Weak":  "var(--danger)",
  "Weak":       "#f97316",
  "Fair":       "var(--warning)",
  "Strong":     "#22c55e",
  "Very Strong": "var(--success)",
};

export default function StrengthIndicator({ strength }) {
  if (!strength) return null;

  const { label, score, entropy, warnings } = strength;
  const color = COLORS[label] || "var(--text-muted)";

  return (
    <div className="strength-indicator">
      <div className="strength-meta">
        <span className="strength-label" style={{ color }}>{label}</span>
        <span className="strength-entropy">{entropy} bits of entropy</span>
      </div>

      <div className="strength-bar-track">
        <div
          className="strength-bar-fill"
          style={{ width: `${Math.min(score, 100)}%`, background: color }}
        />
      </div>

      {warnings?.length > 0 && (
        <ul className="strength-warnings">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
