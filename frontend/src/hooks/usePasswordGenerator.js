import { useState, useCallback } from "react";
import { generatePasswords, evaluateStrength } from "../api/passwordApi";

const DEFAULT_SETTINGS = {
  length: 16,
  count: 1,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
  exclude_ambiguous: false,
  no_repeat: false,
  custom_exclude: "",
};

const MAX_HISTORY = 20;

export function usePasswordGenerator() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [liveStrength, setLiveStrength] = useState(null);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const passwords = await generatePasswords(settings);
      setResults(passwords);
      setHistory((prev) => {
        const entries = passwords.map((p) => ({
          password: p.password,
          timestamp: new Date().toLocaleTimeString(),
        }));
        return [...entries, ...prev].slice(0, MAX_HISTORY);
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate passwords");
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const checkStrength = useCallback(async (password) => {
    if (!password) { setLiveStrength(null); return; }
    try {
      const result = await evaluateStrength(password);
      setLiveStrength(result);
    } catch {
      // silently ignore live-check errors
    }
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);

  return {
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
    liveStrength,
    checkStrength,
  };
}
