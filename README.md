# Sahayak — Government Scheme Finder Chatbot

A guided, tap-to-answer chatbot that helps people in India discover government
schemes, scholarships, and subsidies they may be eligible for — without typing
anything.

Built for the **SerpApi India Hackathon 2026** — Track: *Knowledge & Public Interest*.

## The problem

India runs thousands of government schemes, but most eligible citizens never
find them — not because the schemes don't exist, but because people don't
know the right search terms, and typing/reading long English queries is a
barrier for many users.

## The solution

Sahayak asks 2–3 simple tap-to-answer questions (who you are, what you need,
your state), converts those answers into a targeted search query, and uses
**SerpApi's Google Search API** — restricted toward official `.gov.in` and
`.nic.in` domains — to surface real, official scheme results. No typing, no
knowing official scheme names required.

## How it uses SerpApi

The Flask backend (`app.py`) builds a search query from the user's button
selections and calls SerpApi's `engine=google` endpoint. Results are filtered
and sorted so official government sources appear first, then returned to the
chatbot UI as structured JSON.

## Tech stack

- Python (Flask) backend
- Vanilla HTML/CSS/JavaScript frontend (no build step needed)
- SerpApi Google Search API

## Setup instructions

1. **Clone this repository**
   ```bash
   git clone <your-repo-url>
   cd sahayak-scheme-finder
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate        # on Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Add your SerpApi key**
   - Get a free key at [serpapi.com](https://serpapi.com) (250 free searches/month)
   - Copy `.env.example` to `.env`
   - Paste your key into `.env`:
     ```
     SERPAPI_KEY=your_actual_key_here
     ```

5. **Run the app**
   ```bash
   python app.py
   ```

6. **Open the app**
   Visit `http://127.0.0.1:5000` in your browser.

## Project structure

```
sahayak-scheme-finder/
├── app.py               # Flask backend + SerpApi query logic
├── templates/
│   └── index.html       # Chatbot page shell
├── static/
│   ├── style.css         # Visual design
│   └── script.js         # Guided chat flow + rendering results
├── requirements.txt
├── .env.example
└── README.md
```

## Scope note

This version is built for smartphone/web access. Extending reach to users
without a smartphone (via SMS or IVR) is a meaningful real-world next step,
but is out of scope for this hackathon build.

## AI tools disclosure

Built with the help of Claude (Anthropic) for planning, code scaffolding, and
UI copy.
