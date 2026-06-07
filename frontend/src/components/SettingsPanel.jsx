import "../styles/SettingsPanel.css";

const CHAR_OPTIONS = [
  { key: "uppercase", label: "Uppercase (A-Z)" },
  { key: "lowercase", label: "Lowercase (a-z)" },
  { key: "numbers",   label: "Numbers (0-9)" },
  { key: "symbols",   label: "Symbols (!@#$%)" },
];

const ADVANCED_OPTIONS = [
  { key: "exclude_ambiguous", label: "Exclude ambiguous characters (l, 1, O, 0)" },
  { key: "no_repeat",         label: "No repeated characters" },
];

export default function SettingsPanel({ settings, onChange }) {
  return (
    <div className="settings-panel card">
      <p className="section-title">Settings</p>

      <div className="setting-row">
        <label htmlFor="length">Password Length</label>
        <span className="length-value">{settings.length}</span>
      </div>
      <input
        id="length"
        type="range"
        min={4}
        max={64}
        value={settings.length}
        onChange={(e) => onChange("length", Number(e.target.value))}
        className="length-slider"
      />

      <div className="setting-row">
        <label htmlFor="count">Number of Passwords</label>
        <span className="length-value">{settings.count}</span>
      </div>
      <input
        id="count"
        type="range"
        min={1}
        max={20}
        value={settings.count}
        onChange={(e) => onChange("count", Number(e.target.value))}
        className="length-slider"
      />

      <p className="settings-subtitle">Character Types</p>
      <div className="checkbox-grid">
        {CHAR_OPTIONS.map(({ key, label }) => (
          <label key={key} className="checkbox-item">
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={(e) => onChange(key, e.target.checked)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <p className="settings-subtitle">Advanced</p>
      <div className="checkbox-grid">
        {ADVANCED_OPTIONS.map(({ key, label }) => (
          <label key={key} className="checkbox-item">
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={(e) => onChange(key, e.target.checked)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <label className="custom-exclude">
        <span>Custom characters to exclude</span>
        <input
          type="text"
          value={settings.custom_exclude}
          onChange={(e) => onChange("custom_exclude", e.target.value)}
          placeholder="e.g. {}[]"
        />
      </label>
    </div>
  );
}
