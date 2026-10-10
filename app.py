"""
Sahayak - Government Scheme Finder Chatbot
--------------------------------------------
A guided (tap-to-answer) chatbot that helps people discover Indian
government schemes they may be eligible for, without typing anything.

Core SerpApi usage: Google Search API, queried with terms built from the
user's button selections, restricted to official government domains.
"""

import os
from flask import Flask, render_template, request, jsonify
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

SERPAPI_KEY = os.environ.get("SERPAPI_KEY")
SERPAPI_URL = "https://serpapi.com/search"

# Official Indian government domains we prefer to trust.
GOV_DOMAINS = ["gov.in", "nic.in", "india.gov.in"]

# Domains that ARE .gov.in/.nic.in but are NOT scheme pages (tenders,
# procurement portals, audit reports, etc.) - these pollute generic
# keyword searches, so we exclude them explicitly.
EXCLUDED_DOMAINS = [
    "gem.gov.in",          # Government e-Marketplace: tenders/procurement, not schemes
    "sebi.gov.in",         # Securities regulator filings, not schemes
    "saiindia.gov.in",     # Audit reports
    "publicationsdivision.nic.in",  # Government magazines/journals
]

# Each combination maps directly to a well-formed query built around a
# recognizable scheme-portal phrase, instead of loose keywords that also
# match unrelated PDFs (tenders, audit reports, etc.).
QUERY_TEMPLATES = {
    ("student", "money"): '"scholarship scheme" eligibility apply students',
    ("student", "education"): '"scholarship scheme" education students apply',
    ("student", "housing"): "student hostel accommodation scheme apply",
    ("student", "health"): "student health insurance scheme apply",
    ("student", "business"): "student startup entrepreneurship scheme apply",

    ("farmer", "money"): '"PM-KISAN" OR "farmer subsidy scheme" apply eligibility',
    ("farmer", "education"): "farmer children scholarship scheme apply",
    ("farmer", "housing"): "rural housing scheme farmer apply eligibility",
    ("farmer", "health"): "farmer health insurance scheme apply",
    ("farmer", "business"): "farmer agri business loan scheme apply",

    ("woman", "money"): '"women empowerment scheme" financial assistance apply',
    ("woman", "education"): "women education scholarship scheme apply",
    ("woman", "housing"): "women housing scheme apply eligibility",
    ("woman", "health"): "women health scheme apply eligibility",
    ("woman", "business"): '"women entrepreneurship scheme" loan apply',

    ("senior_citizen", "money"): '"senior citizen pension scheme" apply eligibility',
    ("senior_citizen", "education"): "senior citizen skill training scheme apply",
    ("senior_citizen", "housing"): "senior citizen housing scheme apply",
    ("senior_citizen", "health"): '"senior citizen health scheme" apply eligibility',
    ("senior_citizen", "business"): "senior citizen self employment scheme apply",

    ("worker", "money"): '"labour welfare scheme" financial assistance apply',
    ("worker", "education"): "worker children scholarship scheme apply",
    ("worker", "housing"): '"worker housing scheme" apply eligibility',
    ("worker", "health"): '"worker health insurance scheme" apply',
    ("worker", "business"): "worker skill development loan scheme apply",
}


def build_query(who: str, need: str, state: str | None) -> str:
    """Turn guided button selections into a targeted Google search query
    aimed at real scheme/portal pages rather than tenders or reports."""
    base_query = QUERY_TEMPLATES.get(
        (who, need),
        f"{who.replace('_', ' ')} {need} government scheme apply eligibility",
    )

    parts = [base_query]

    if state and state.lower() != "skip":
        parts.append(state)

    query = " ".join(parts)

    # Restrict to official domains, but exclude ones known to be noisy.
    site_filter = " OR ".join(f"site:{d}" for d in GOV_DOMAINS)
    exclude_filter = " ".join(f"-site:{d}" for d in EXCLUDED_DOMAINS)
    query += f" ({site_filter}) {exclude_filter} -filetype:pdf"

    return query


def is_official_link(link: str) -> bool:
    return any(domain in link for domain in GOV_DOMAINS)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/search")
def search_schemes():
    who = request.args.get("who", "")
    need = request.args.get("need", "")
    state = request.args.get("state", "")
    free_text = request.args.get("text", "").strip()

    if not SERPAPI_KEY:
        return jsonify({"error": "SerpApi key is not configured on the server."}), 500

    if not free_text and (not who or not need):
        return jsonify({"error": "Missing required selections."}), 400

    if free_text:
        # User typed or spoke their need directly instead of tapping buttons.
        site_filter = " OR ".join(f"site:{d}" for d in GOV_DOMAINS)
        exclude_filter = " ".join(f"-site:{d}" for d in EXCLUDED_DOMAINS)
        state_part = f" {state}" if state and state.lower() != "skip" else ""
        query = f"{free_text} government scheme apply eligibility{state_part} ({site_filter}) {exclude_filter} -filetype:pdf"
    else:
        query = build_query(who, need, state)

    params = {
        "engine": "google",
        "q": query,
        "google_domain": "google.co.in",
        "gl": "in",
        "hl": "en",
        "num": "10",
        "api_key": SERPAPI_KEY,
    }

    try:
        response = requests.get(SERPAPI_URL, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as exc:
        return jsonify({"error": f"SerpApi request failed: {exc}"}), 502

    organic_results = data.get("organic_results", [])

    schemes = []
    for result in organic_results:
        link = result.get("link", "")
        schemes.append({
            "title": result.get("title", "Untitled"),
            "snippet": result.get("snippet", "No description available."),
            "link": link,
            "displayed_link": result.get("displayed_link", link),
            "official": is_official_link(link),
        })

    # Show official government results first.
    schemes.sort(key=lambda s: not s["official"])

    return jsonify({
        "query_used": query,
        "count": len(schemes),
        "schemes": schemes[:8],
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
