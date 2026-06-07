import "../styles/GenerateButton.css";

export default function GenerateButton({ onClick, loading }) {
  return (
    <button className={`generate-btn ${loading ? "is-loading" : ""}`} onClick={onClick} disabled={loading}>
      <span className="generate-btn-icon">{loading ? "⟳" : "🔐"}</span>
      {loading ? "Generating..." : "Generate Password"}
    </button>
  );
}
