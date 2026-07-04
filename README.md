# SecurePass

A full-stack password generator and strength analyzer. A Python/Flask API
generates cryptographically secure passwords and scores their strength; a
React/Vite frontend gives users a clean interface to configure, generate,
copy, and track them.

Password generation uses Python's [`secrets`](https://docs.python.org/3/library/secrets.html)
module (backed by the OS CSPRNG via `os.urandom`) rather than the `random`
module, which is a predictable PRNG unsuitable for anything
security-sensitive.

## Features

- Configurable generation: length (4–64), character types (uppercase,
  lowercase, numbers, symbols), batch count (1–20)
- Advanced options: exclude ambiguous characters (`0`, `O`, `1`, `l`, ...),
  disallow repeated characters, custom character exclusion
- Guaranteed category coverage — every selected character type is present
  in the result, placed at a random position via a CSPRNG Fisher–Yates shuffle
- Strength analysis: entropy in bits, a Very Weak → Very Strong label, a
  color-coded strength bar, and warnings for common passwords, repeated
  runs, or sequential patterns (`abc`, `123`)
- Live strength checking for any arbitrary password typed by the user
- Copy-to-clipboard, a recent-passwords history (last 20), and a bulk view
  with `.txt` export for batch-generated passwords
- Dark/light theme toggle

## Objective

Build a tool that generates strong, random passwords based on user-defined
criteria, with a beginner command-line tier and an advanced tier adding a
GUI, complexity controls, and clipboard integration. SecurePass implements
the **advanced tier**, using a browser-based GUI (React) talking to a
Python API (Flask) in place of a desktop tkinter/PyQt5 app — the same
requirements, delivered as a web app instead of a native one.

### Beginner tier — done

- [x] Prompt for desired password length — `SettingsPanel` length slider,
      enforced server-side by `validators.py` (`MIN_LENGTH = 4`,
      `MAX_LENGTH = 128`)
- [x] Choose which character types to include — uppercase / lowercase /
      numbers / symbols checkboxes in `SettingsPanel`; `validators.py`
      requires at least one type selected
- [x] Generate and display a password matching the criteria — `POST
      /api/generate` → `generator.py` → `PasswordDisplay`
- [x] Input validation — invalid length, invalid count, or no character
      type selected all return `400` with a descriptive error
      (`validators.py`)
- [x] Generate another password without restarting — `GenerateButton` can
      be clicked repeatedly against the running app; batch generation
      (`count` up to 20) produces several in one call

### Advanced tier — done

- [x] GUI with sliders/checkboxes for length and character types —
      `SettingsPanel.jsx` (range sliders for length/count, checkbox grids
      for character types and advanced options)
- [x] `secrets` module for cryptographically secure generation —
      `generator.py` uses `secrets.choice` / `secrets.randbelow`
      (`os.urandom`-backed CSPRNG), never `random`
- [x] Password strength indicator (Weak/Medium/Strong style) —
      `strength.py` computes entropy and maps it to a label
      (`StrengthIndicator.jsx` renders it as a color-coded bar with the
      exact bits-of-entropy value)
- [x] Guaranteed at least one character from each selected type —
      `generator.py`'s `_guaranteed_chars` + CSPRNG `_secure_shuffle` so
      the guaranteed characters land at a random position
- [x] Copy to clipboard — `PasswordDisplay.jsx` / `PasswordHistory.jsx`
      copy buttons via `utils/clipboard.js` (`navigator.clipboard`, with a
      `document.execCommand` fallback for non-secure contexts)
- [x] Exclude ambiguous characters checkbox — `exclude_ambiguous` option in
      `SettingsPanel`, applied in `generator.py`'s `_build_pool`
- [x] Generation history for the session — `PasswordHistory.jsx`, backed
      by the `history` array in `usePasswordGenerator.js` (newest first,
      timestamped, in-memory only — never persisted to disk/storage)

**Bonus, beyond the original checklist**: live strength-checking of
arbitrary typed passwords, a bulk-generation view with `.txt` export,
custom character exclusion, a "no repeated characters" mode, and a
dark/light theme toggle.

## Project structure

```
SecurePass/
├── backend/                  # Flask API
│   ├── app.py                # Routes: /api/health, /api/generate, /api/strength
│   ├── generator.py          # CSPRNG-based password generation logic
│   ├── strength.py           # Entropy calculation + strength scoring/labels
│   ├── validators.py         # Server-side input validation
│   ├── requirements.txt      # flask, flask-cors, python-dotenv
│   └── .env.example          # Template for environment variables
│
└── frontend/                 # React + Vite UI
    ├── index.html             # Vite entry HTML
    ├── vite.config.js         # Dev server config + proxy to Flask on :5000
    └── src/
        ├── main.jsx                        # React bootstrap
        ├── App.jsx                         # Top-level layout
        ├── api/passwordApi.js              # Axios calls to the Flask backend
        ├── hooks/usePasswordGenerator.js   # All state + business logic
        ├── utils/clipboard.js              # Copy-to-clipboard + download-as-text
        ├── components/
        │   ├── GenerateButton.jsx          # Animated CTA button w/ loading state
        │   ├── PasswordDisplay.jsx         # Primary generated password + copy
        │   ├── StrengthIndicator.jsx       # Color-coded entropy bar + warnings
        │   ├── SettingsPanel.jsx           # Sliders + checkboxes for all options
        │   ├── PasswordHistory.jsx         # Recent passwords list (max 20)
        │   └── MultiPassword.jsx           # Bulk-generated batch view + download
        └── styles/                         # One CSS file per component + globals
```

Architecturally, Flask only knows about generating and scoring strings (no
UI concerns), and React only knows about calling two endpoints and
rendering the response (no cryptographic logic) — either side can be
tested, swapped, or scaled independently.

## Tech stack

**Backend**
- [Flask](https://flask.palletsprojects.com/) 3.0 — HTTP API
- [flask-cors](https://flask-cors.readthedocs.io/) — CORS for the frontend dev server
- [python-dotenv](https://pypi.org/project/python-dotenv/) — environment variable loading
- Python's `secrets` / `os.urandom` — CSPRNG password generation
- `re` — pattern-based strength penalty checks (repeats, sequences)

**Frontend**
- [React](https://react.dev/) 18
- [Vite](https://vitejs.dev/) 5 — dev server and build tooling
- [Axios](https://axios-http.com/) — HTTP client
- Plain CSS with custom properties (design tokens) for dark/light theming — no CSS framework

## Getting started

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The API runs at `http://localhost:5000`.

```bash
# Health check
curl http://localhost:5000/api/health

# Generate passwords
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"length":16,"uppercase":true,"lowercase":true,"numbers":true,"symbols":true,"count":3}'

# Check strength of an arbitrary password
curl -X POST http://localhost:5000/api/strength \
  -H "Content-Type: application/json" \
  -d '{"password":"MyP@ssw0rd123!"}'
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` (Vite default) and proxies `/api/*`
requests to the Flask server on `:5000` in development (see
`vite.config.js`). For a deployed backend, set `VITE_API_URL` to point the
frontend at the real API URL.

## API reference

| Method | Route            | Purpose                                              |
|--------|------------------|-------------------------------------------------------|
| GET    | `/api/health`    | Liveness check → `{"status": "ok"}`                    |
| POST   | `/api/generate`  | Generate 1–20 passwords with the given options, each scored |
| POST   | `/api/strength`  | Score the strength of any password string             |

## THANK YOU!!
