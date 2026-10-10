# PulseCheck — Stroke Risk Screening

A small Vite + React + Tailwind app with a home page, an intake form, and a
result screen that calls your Flask stroke-prediction backend.

## Setup

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Connect your backend

Open `src/App.jsx` and update the `API_URL` constant near the top to point
at your running Flask server, e.g.:

```js
const API_URL = "http://localhost:3000/predict";
```

Your Flask app needs CORS enabled for browser requests to reach it:

```bash
pip install flask-cors
```

```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
```

## Notes on prediction accuracy

The backend in this project loads the trained model directly but does not
re-apply the scaler/encoder used during training (this is flagged as a TODO
in the original Flask code). The frontend sends raw numeric values plus a
broad set of one-hot dummy columns; the Flask app reindexes to
`model.feature_names_in_` and zero-fills anything missing, which is safe —
but if numeric features were standardized (z-scored) before training, save
that `StandardScaler` with `joblib.dump` and apply it in `/predict` before
calling `predict_proba`, or predictions will be skewed.

## Build for production

```bash
npm run build
npm run preview
```
