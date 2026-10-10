# Sahayak — Government Scheme Finder Chatbot

A multilingual, voice-enabled chatbot that helps people in India discover government schemes, scholarships, and subsidies they may be eligible for. Users can **tap, type, or speak** in their own language.

Built for the **SerpApi India Hackathon 2026**. Track: *Knowledge & Public Interest*.

## The problem

India runs thousands of government schemes, but many eligible citizens never find them. The schemes exist, but people don't know the official scheme names to search for, and typing or reading long English queries is a barrier for many users.

## The solution

Sahayak lets a user describe who they are and what help they need in the way that is easiest for them:

- **Tap**: guided questions (who you are, what you need, your state)
- **Type**: write your need in the text box
- **Speak**: use the microphone (browser speech recognition)

Their input is converted into a targeted search query and sent to **SerpApi's Google Search API**, restricted toward official `.gov.in` and `.nic.in` domains, to return real scheme pages.

## Features

- Interface in 5 languages: English, Hindi, Tamil, Kannada, Marathi
- Voice input in the selected language
- **Listen** button on every result to hear it read aloud (tap again to stop)
- **Translate results** bar (Google Website Translator) to translate the result text into the user's language
- Results limited toward official government domains; noisy sources (tenders, audit reports, PDFs) are excluded

## How it uses SerpApi

The Flask backend (`app.py`) builds a search query from the user's selections or typed/spoken text and calls SerpApi's `engine=google` endpoint. The `organic_results` (title, snippet, link) are filtered, sorted so official government sources appear first, and returned to the chatbot UI as JSON. Without SerpApi the app has no data source: search is the core of the product.

## Tech stack

- Python (Flask) backend
- Vanilla HTML/CSS/JavaScript frontend (no build step)
- SerpApi Google Search API
- Browser Web Speech API (voice input and output)
- Google Website Translator widget (result translation)

## Setup instructions

1. Clone this repository
```
   git clone https://github.com/Madhumitha2012/sahayak-scheme-finder-.git
   cd sahayak-scheme-finder-
```
2. Create and activate a virtual environment
```
   python -m venv venv
   venv\Scripts\activate        # on Mac/Linux: source venv/bin/activate
```
3. Install dependencies
```
   python -m pip install -r requirements.txt
```
4. Add your SerpApi key
   - Get a free key at [serpapi.com](https://serpapi.com) (250 free searches per month)
   - Copy `.env.example` to `.env`
   - Put your key in `.env`:
```
   SERPAPI_KEY=your_actual_key_here
```
5. Run the app
```
   python app.py
```
6. Open `http://127.0.0.1:5000` in Chrome or Edge.

## Notes and limitations

- Voice input and output depend on the browser and the voices installed on the device. Chrome and Edge work best; for Tamil, Kannada and Marathi speech, the device needs a voice for that language.
- Most government scheme pages are published in English. The translate bar translates the result text on screen, and the Listen button reads the text shown on screen.
- The translate bar needs an internet connection.
- This version is built for smartphone and web access. Reaching users without a smartphone (via SMS or IVR) is a possible next step, outside the scope of this build.

## Project structure

```
sahayak-scheme-finder/
├── app.py               # Flask backend + SerpApi query logic
├── templates/
│   └── index.html       # Chatbot page
├── static/
│   ├── style.css        # Styling
│   └── script.js        # Chat flow, languages, voice, results
├── requirements.txt
├── .env.example
└── README.md
```

## AI tools disclosure

Built with the help of Claude (Anthropic) for planning, code scaffolding, debugging, and UI copy.
