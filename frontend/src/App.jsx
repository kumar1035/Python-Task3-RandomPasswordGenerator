import { useEffect } from "react";
import { usePasswordGenerator } from "./hooks/usePasswordGenerator";
import GenerateButton from "./components/GenerateButton";
import PasswordDisplay from "./components/PasswordDisplay";
import MultiPassword from "./components/MultiPassword";
import SettingsPanel from "./components/SettingsPanel";
import PasswordHistory from "./components/PasswordHistory";
import "./styles/App.css";

export default function App() {
  const {
    settings,
    updateSetting,
    results,
    loading,
    error,
    generate,
    history,
    clearHistory,
    darkMode,
    toggleDarkMode,
  } = usePasswordGenerator();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">
          <span className="header-logo-icon">🔐</span>
          <div>
            <h1>SecurePass</h1>
            <span>CRYPTOGRAPHICALLY SECURE PASSWORD GENERATOR</span>
          </div>
        </div>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <main className="main-grid">
        {error && <div className="error-banner">⚠ {error}</div>}

        <GenerateButton onClick={generate} loading={loading} />

        {results.length > 0 && <PasswordDisplay entry={results[0]} />}
        <MultiPassword results={results} />

        <SettingsPanel settings={settings} onChange={updateSetting} />

        <PasswordHistory history={history} onClear={clearHistory} />
      </main>
    </div>
  );
}
