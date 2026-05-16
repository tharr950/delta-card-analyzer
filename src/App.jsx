import { useState, useEffect, useRef } from "react";

/* ──────────────────────── CARD DATA ──────────────────────── */
const CARDS = {
  reserve: {
    name: "Delta SkyMiles® Reserve",
    short: "Reserve",
    annualFee: 650,
    firstYearFee: 650,
    signupBonus: { miles: 100000, spend: 5000, months: 6 },
    color: "#1B3A5C",
    accent: "#4A90D9",
    gradient: "linear-gradient(135deg, #1B3A5C 0%, #2C5F8A 50%, #1B3A5C 100%)",
    mqd: { headstart: 2500, boostPer: 10 },
    perks: {
      skyClub: { visits: 15, unlimitedAt: 75000 },
      centurion: true,
      companionCert: true,
      checkedBag: true,
      resyCredit: { monthly: 20, annual: 240 },
      rideshareCredit: { monthly: 10, annual: 120 },
      staysCredit: 100,
      uberOne: { monthly: 9.99, months: 12, annual: 120 },
      globalEntry: 30,
      takeoff15: true,
      upgradePriority: true,
    },
  },
  platinum: {
    name: "Delta SkyMiles® Platinum",
    short: "Platinum",
    annualFee: 350,
    firstYearFee: 350,
    signupBonus: { miles: 90000, spend: 3000, months: 6 },
    color: "#6B5B95",
    accent: "#9B8ACE",
    gradient: "linear-gradient(135deg, #6B5B95 0%, #8B7BB5 50%, #6B5B95 100%)",
    mqd: { headstart: 2500, boostPer: 20 },
    perks: {
      skyClub: false,
      centurion: false,
      companionCert: true,
      checkedBag: true,
      resyCredit: { monthly: 10, annual: 120 },
      rideshareCredit: { monthly: 10, annual: 120 },
      staysCredit: 150,
      uberOne: { monthly: 9.99, months: 12, annual: 120 },
      globalEntry: 30,
      takeoff15: true,
      upgradePriority: false,
    },
  },
  gold: {
    name: "Delta SkyMiles® Gold",
    short: "Gold",
    annualFee: 150,
    firstYearFee: 0,
    signupBonus: { miles: 80000, spend: 2000, months: 6 },
    color: "#8B6914",
    accent: "#D4A830",
    gradient: "linear-gradient(135deg, #8B6914 0%, #C49B20 50%, #8B6914 100%)",
    mqd: { headstart: 0, boostPer: 0 },
    perks: {
      skyClub: false,
      centurion: false,
      companionCert: false,
      checkedBag: true,
      resyCredit: null,
      rideshareCredit: null,
      staysCredit: 100,
      uberOne: { monthly: 9.99, months: 6, annual: 60 },
      globalEntry: null,
      takeoff15: true,
      upgradePriority: false,
      flightCredit: { amount: 200, spendReq: 10000 },
    },
  },
  amexPlatinum: {
    name: "The Platinum Card from American Express",
    short: "Amex Platinum",
    annualFee: 895,
    firstYearFee: 895,
    signupBonus: { miles: 100000, spend: 8000, months: 6 },
    color: "#8C8C8C",
    accent: "#C0C0C0",
    gradient: "linear-gradient(135deg, #6B6B6B 0%, #A8A8A8 50%, #6B6B6B 100%)",
    mqd: { headstart: 0, boostPer: 0 },
    rewardsType: "MR",
    perks: {
      skyClub: { visits: 10, unlimitedAt: 75000 },
      centurion: true,
      priorityPass: true,
      companionCert: false,
      checkedBag: false,
      resyCredit: { monthly: 20, annual: 240 },
      rideshareCredit: null,
      staysCredit: 0,
      uberOne: { monthly: 9.99, months: 12, annual: 120 },
      uberCash: { monthly: 15, annual: 200 },
      globalEntry: 100,
      takeoff15: false,
      upgradePriority: false,
      saksCredit: { semiAnnual: 50, annual: 100 },
      airlineCredit: 200,
      streamingCredit: { monthly: 20, annual: 240 },
      hotelCredit: 200,
      clearCredit: 209,
      equinoxCredit: { monthly: 25, annual: 300 },
      walmartPlus: 155,
    },
  },
};

const MILE_VALUE = 0.01;

/* ──────────────────────── ALL US AIRPORTS WITH SKY CLUBS ──────────────────────── */
const ALL_AIRPORTS = [
  { code: "ANC", city: "Anchorage", state: "AK", skyClub: true, centurion: false },
  { code: "ATL", city: "Atlanta", state: "GA", skyClub: true, skyClubCount: 7, centurion: false },
  { code: "AUS", city: "Austin", state: "TX", skyClub: true, centurion: false },
  { code: "BOS", city: "Boston", state: "MA", skyClub: true, centurion: false },
  { code: "CLT", city: "Charlotte", state: "NC", skyClub: true, centurion: true },
  { code: "ORD", city: "Chicago", state: "IL", skyClub: true, skyClubCount: 2, centurion: true },
  { code: "CVG", city: "Cincinnati", state: "OH", skyClub: true, centurion: false },
  { code: "DFW", city: "Dallas-Fort Worth", state: "TX", skyClub: true, centurion: true },
  { code: "DEN", city: "Denver", state: "CO", skyClub: true, centurion: true },
  { code: "DTW", city: "Detroit", state: "MI", skyClub: true, skyClubCount: 3, centurion: false },
  { code: "FLL", city: "Fort Lauderdale", state: "FL", skyClub: true, centurion: false },
  { code: "HNL", city: "Honolulu", state: "HI", skyClub: true, centurion: true },
  { code: "IAH", city: "Houston", state: "TX", skyClub: false, centurion: true },
  { code: "IND", city: "Indianapolis", state: "IN", skyClub: true, centurion: false },
  { code: "JAX", city: "Jacksonville", state: "FL", skyClub: true, centurion: false },
  { code: "MCI", city: "Kansas City", state: "MO", skyClub: true, centurion: false },
  { code: "LAS", city: "Las Vegas", state: "NV", skyClub: true, centurion: true },
  { code: "LAX", city: "Los Angeles", state: "CA", skyClub: true, skyClubCount: 2, centurion: true },
  { code: "MEM", city: "Memphis", state: "TN", skyClub: true, centurion: false },
  { code: "MIA", city: "Miami", state: "FL", skyClub: true, centurion: true },
  { code: "MKE", city: "Milwaukee", state: "WI", skyClub: true, centurion: false },
  { code: "MSP", city: "Minneapolis", state: "MN", skyClub: true, skyClubCount: 3, centurion: false },
  { code: "BNA", city: "Nashville", state: "TN", skyClub: true, centurion: false },
  { code: "MSY", city: "New Orleans", state: "LA", skyClub: true, centurion: false },
  { code: "JFK", city: "New York JFK", state: "NY", skyClub: true, skyClubCount: 3, centurion: true },
  { code: "LGA", city: "New York LaGuardia", state: "NY", skyClub: true, centurion: false },
  { code: "EWR", city: "Newark", state: "NJ", skyClub: true, centurion: false },
  { code: "MCO", city: "Orlando", state: "FL", skyClub: true, centurion: false },
  { code: "PBI", city: "Palm Beach", state: "FL", skyClub: true, centurion: false },
  { code: "PHL", city: "Philadelphia", state: "PA", skyClub: true, centurion: true },
  { code: "PHX", city: "Phoenix", state: "AZ", skyClub: true, centurion: true },
  { code: "PIT", city: "Pittsburgh", state: "PA", skyClub: true, centurion: false },
  { code: "PDX", city: "Portland", state: "OR", skyClub: true, centurion: false },
  { code: "RDU", city: "Raleigh-Durham", state: "NC", skyClub: true, centurion: false },
  { code: "SLC", city: "Salt Lake City", state: "UT", skyClub: true, skyClubCount: 2, centurion: false },
  { code: "SAN", city: "San Diego", state: "CA", skyClub: true, centurion: false },
  { code: "SFO", city: "San Francisco", state: "CA", skyClub: true, centurion: true },
  { code: "SEA", city: "Seattle", state: "WA", skyClub: true, skyClubCount: 2, centurion: true },
  { code: "STL", city: "St. Louis", state: "MO", skyClub: true, centurion: false },
  { code: "TPA", city: "Tampa", state: "FL", skyClub: true, centurion: false },
  { code: "DCA", city: "Washington Reagan", state: "VA", skyClub: true, centurion: false },
  // Common airports WITHOUT Sky Clubs (so users can still select them)
  { code: "BWI", city: "Baltimore", state: "MD", skyClub: false, centurion: false },
  { code: "BUF", city: "Buffalo", state: "NY", skyClub: false, centurion: false },
  { code: "CLE", city: "Cleveland", state: "OH", skyClub: false, centurion: false },
  { code: "CMH", city: "Columbus", state: "OH", skyClub: false, centurion: false },
  { code: "DAL", city: "Dallas Love Field", state: "TX", skyClub: false, centurion: false },
  { code: "IAD", city: "Washington Dulles", state: "VA", skyClub: false, centurion: false },
  { code: "MDW", city: "Chicago Midway", state: "IL", skyClub: false, centurion: false },
  { code: "OAK", city: "Oakland", state: "CA", skyClub: false, centurion: false },
  { code: "PVD", city: "Providence", state: "RI", skyClub: false, centurion: false },
  { code: "RIC", city: "Richmond", state: "VA", skyClub: false, centurion: false },
  { code: "RSW", city: "Fort Myers", state: "FL", skyClub: false, centurion: false },
  { code: "SAT", city: "San Antonio", state: "TX", skyClub: false, centurion: false },
  { code: "SJC", city: "San Jose", state: "CA", skyClub: false, centurion: false },
  { code: "SMF", city: "Sacramento", state: "CA", skyClub: false, centurion: false },
  { code: "SNA", city: "Santa Ana / Orange County", state: "CA", skyClub: false, centurion: false },
  { code: "MHT", city: "Manchester", state: "NH", skyClub: false, centurion: false },
  { code: "BDL", city: "Hartford / Bradley", state: "CT", skyClub: false, centurion: false },
  { code: "PWM", city: "Portland", state: "ME", skyClub: false, centurion: false },
  { code: "BTV", city: "Burlington", state: "VT", skyClub: false, centurion: false },
  { code: "ACK", city: "Nantucket", state: "MA", skyClub: false, centurion: false },
  { code: "MVY", city: "Martha's Vineyard", state: "MA", skyClub: false, centurion: false },
];

const fmt = (n) => (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString();
const fmtK = (n) => (n >= 1000 ? (n / 1000).toFixed(0) + "K" : n.toString());

/* ──────────────────────── AIRPORT SEARCH COMPONENT ──────────────────────── */
function AirportSearch({ selected, onSelect, onRemove, max, accent }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = query.length >= 1
    ? ALL_AIRPORTS.filter(
        (a) =>
          !selected.find((s) => s.code === a.code) &&
          (a.code.toLowerCase().includes(query.toLowerCase()) ||
            a.city.toLowerCase().includes(query.toLowerCase()) ||
            a.state.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : [];

  return (
    <div>
      {/* Selected airports */}
      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          {selected.map((a) => (
            <div key={a.code} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 12px", borderRadius: "8px",
              background: "#1A1815", border: "1px solid #2A2620",
            }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff", fontFamily: "'IBM Plex Mono', monospace" }}>{a.code}</span>
              <span style={{ fontSize: "12px", color: "#8A8278" }}>{a.city}</span>
              <div style={{ display: "flex", gap: "4px", marginLeft: "4px" }}>
                {a.skyClub && <span style={{ fontSize: "8px", padding: "2px 5px", borderRadius: "3px", background: "rgba(74,222,128,0.12)", color: "#4ade80", fontFamily: "'IBM Plex Mono', monospace" }}>SC</span>}
                {a.centurion && <span style={{ fontSize: "8px", padding: "2px 5px", borderRadius: "3px", background: "rgba(147,130,220,0.15)", color: "#9B8ACE", fontFamily: "'IBM Plex Mono', monospace" }}>CL</span>}
                {!a.skyClub && !a.centurion && <span style={{ fontSize: "8px", padding: "2px 5px", borderRadius: "3px", background: "rgba(248,113,113,0.12)", color: "#f87171", fontFamily: "'IBM Plex Mono', monospace" }}>No lounge</span>}
              </div>
              <button onClick={() => onRemove(a.code)} style={{ background: "none", border: "none", color: "#6A6258", fontSize: "14px", cursor: "pointer", padding: "0 0 0 4px", lineHeight: 1 }}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Search input */}
      {selected.length < max && (
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search by city or airport code..."
            style={{
              width: "100%", padding: "12px 16px", borderRadius: "10px",
              border: `1.5px solid ${focused ? accent : "#2A2620"}`,
              background: "#151310", color: "#E8E4DF", fontSize: "14px",
              fontFamily: "'DM Sans', sans-serif", outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
          />

          {/* Dropdown */}
          {focused && results.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
              background: "#1A1815", border: "1px solid #2A2620", borderRadius: "10px",
              overflow: "hidden", zIndex: 10, maxHeight: "240px", overflowY: "auto",
            }}>
              {results.map((a) => (
                <button
                  key={a.code}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { onSelect(a); setQuery(""); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "10px 14px", border: "none",
                    background: "transparent", cursor: "pointer", textAlign: "left",
                    borderBottom: "1px solid #1F1C18",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#222018")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff", fontFamily: "'IBM Plex Mono', monospace", minWidth: "36px" }}>{a.code}</span>
                    <span style={{ fontSize: "13px", color: "#C8C4BF" }}>{a.city}, {a.state}</span>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {a.skyClub && <span style={{ fontSize: "8px", padding: "2px 5px", borderRadius: "3px", background: "rgba(74,222,128,0.12)", color: "#4ade80", fontFamily: "'IBM Plex Mono', monospace" }}>Sky Club</span>}
                    {a.centurion && <span style={{ fontSize: "8px", padding: "2px 5px", borderRadius: "3px", background: "rgba(147,130,220,0.15)", color: "#9B8ACE", fontFamily: "'IBM Plex Mono', monospace" }}>Centurion</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: "12px", marginTop: "8px", fontSize: "10px", color: "#6A6258", fontFamily: "'IBM Plex Mono', monospace" }}>
        <span><span style={{ color: "#4ade80" }}>SC</span> = Sky Club</span>
        <span><span style={{ color: "#9B8ACE" }}>CL</span> = Centurion Lounge</span>
      </div>
    </div>
  );
}

/* ──────────────────────── MAIN APP ──────────────────────── */
export default function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [userCity, setUserCity] = useState("");
  const containerRef = useRef(null);

  // Try to get user's city from geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
          const data = await r.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "";
          if (city) setUserCity(city);
        } catch (e) { /* silent */ }
      }, () => {});
    }
  }, []);

  const card = selectedCard ? CARDS[selectedCard] : null;

  const goNext = () => {
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  };
  const goBack = () => {
    setAnimating(true);
    setTimeout(() => {
      if (step === 0) {
        setSelectedCard(null);
        setAnswers({});
        setShowResults(false);
      } else {
        setStep((s) => s - 1);
      }
      setAnimating(false);
    }, 200);
  };
  const answer = (key, val) => setAnswers((p) => ({ ...p, [key]: val }));

  /* ──────────────── BUILD QUESTIONS ──────────────── */
  const getQuestions = () => {
    if (!card) return [];
    const q = [];

    // ── TRAVEL ──
    q.push({
      id: "flights", section: "Your Travel",
      question: card.perks.checkedBag ? "How many round-trip Delta flights do you take per year?" : "How many round-trip flights do you take per year?",
      sub: card.perks.checkedBag ? "Include personal and business travel" : "Include all airlines — this helps us estimate lounge usage",
      type: "choice",
      options: [
        { label: "1–3 flights", value: 2 },
        { label: "4–8 flights", value: 6 },
        { label: "9–15 flights", value: 12 },
        { label: "16+ flights", value: 20 },
      ],
    });

    if (card.perks.checkedBag) {
      q.push({
        id: "checkedBags", section: "Your Travel",
        question: "Do you typically check a bag when you fly?",
        sub: "This card gives you and up to 8 companions a free first checked bag ($45 value each way)",
        type: "choice",
        options: [
          { label: "Always", value: "always" },
          { label: "Sometimes", value: "sometimes" },
          { label: "Never — carry-on only", value: "never" },
        ],
      });
    }

    if (card.perks.checkedBag) { q.push({
      id: "companions", section: "Your Travel",
      question: "How many people typically travel with you on the same reservation?",
      sub: "They get free checked bags too",
      type: "choice",
      options: [
        { label: "Just me", value: 0 },
        { label: "1 companion", value: 1 },
        { label: "2–3", value: 2.5 },
        { label: "4+", value: 4 },
      ],
    }); }

    // ── AIRPORTS (for lounge cards) ──
    if (card.perks.skyClub) {
      q.push({
        id: "airports", section: "Your Airports",
        question: "Which airports do you fly through most?",
        sub: "Add your home airport plus any you connect through or fly to regularly. We'll check which ones have lounges.",
        type: "airports",
      });

      q.push({
        id: "loungeFrequency", section: "Lounge Access",
        question: "When a Sky Club is available, how often would you use it?",
        sub: "The Reserve gives you 15 Sky Club visits per year when flying Delta",
        type: "choice",
        showIf: () => {
          const airports = answers.airports || [];
          return airports.some((a) => a.skyClub);
        },
        options: [
          { label: "Every time — it's a must", value: "every" },
          { label: "Most of the time", value: "most" },
          { label: "When I have time before my flight", value: "sometimes" },
          { label: "Rarely", value: "rarely" },
        ],
      });

      q.push({
        id: "noLoungeNote", section: "Lounge Access",
        question: "None of your airports have a Delta Sky Club",
        sub: "Sky Club access is one of the Reserve's biggest perks. Since you don't fly through airports with Sky Clubs, this benefit won't add much value for you. You may want to consider the Platinum or Gold card instead.",
        type: "info",
        showIf: () => {
          const airports = answers.airports || [];
          return airports.length > 0 && !airports.some((a) => a.skyClub);
        },
      });
    }

    // Centurion question
    if (card.perks.centurion) {
      q.push({
        id: "centurionUse", section: "Lounge Access",
        question: (() => {
          const airports = answers.airports || [];
          const withCenturion = airports.filter((a) => a.centurion);
          if (withCenturion.length > 0) {
            return `You also get Centurion Lounge access! ${withCenturion.map((a) => a.code).join(", ")} ${withCenturion.length === 1 ? "has" : "have"} one. Would you use it?`;
          }
          return "The Reserve includes Centurion Lounge access. Would you use it at other airports?";
        })(),
        sub: "Centurion Lounges are premium Amex lounges with restaurant-quality food and craft cocktails",
        type: "choice",
        showIf: () => {
          const airports = answers.airports || [];
          return airports.some((a) => a.skyClub);
        },
        options: [
          { label: "Yes — love them", value: "yes" },
          { label: "A few times a year", value: "sometimes" },
          { label: "Probably not", value: "no" },
        ],
      });
    }

    // ── COMPANION CERT ──
    if (card.perks.companionCert) {
      q.push({
        id: "companionCertUse", section: "Companion Certificate",
        question: "Would you use an annual companion certificate?",
        sub: "You get a free round-trip ticket for a companion on domestic flights (they pay taxes only — usually $12–$250). Best used on expensive routes.",
        type: "choice",
        options: [
          { label: "Definitely — I travel with someone", value: "yes" },
          { label: "Maybe — depends on the trip", value: "maybe" },
          { label: "Unlikely — I fly solo", value: "no" },
        ],
      });
      q.push({
        id: "companionCertValue", section: "Companion Certificate",
        question: "What would your companion's ticket typically cost?",
        sub: "Think about the route you'd use it on. Cross-country = $400–600+, short domestic = $150–300",
        type: "choice",
        showIf: () => answers.companionCertUse !== "no",
        options: [
          { label: "Under $200", value: 150 },
          { label: "$200–$400", value: 300 },
          { label: "$400–$600", value: 500 },
          { label: "$600+", value: 700 },
        ],
      });
    }

    // ── DINING — RESY ──
    if (card.perks.resyCredit) {
      q.push({
        id: "diningFrequency", section: "Dining & Lifestyle",
        question: "How often do you dine out at sit-down restaurants?",
        sub: `This card gives you up to $${card.perks.resyCredit.monthly}/month back at Resy partner restaurants`,
        type: "choice",
        options: [
          { label: "Multiple times a week", value: "high" },
          { label: "About once a week", value: "medium" },
          { label: "A few times a month", value: "low" },
          { label: "Rarely or never", value: "rarely" },
        ],
      });
      q.push({
        id: "resyFamiliarity", section: "Dining & Lifestyle",
        question: "Are you familiar with Resy restaurants in your area?",
        sub: "Resy partners with thousands of restaurants. Check if your favorites are on there.",
        type: "resy",
        showIf: () => answers.diningFrequency && answers.diningFrequency !== "rarely",
      });
    }

    // ── RIDESHARE ──
    if (card.perks.rideshareCredit) {
      q.push({
        id: "rideshare", section: "Dining & Lifestyle",
        question: "How often do you use rideshare (Uber, Lyft)?",
        sub: `You get up to $${card.perks.rideshareCredit.monthly}/month back on rideshare purchases`,
        type: "choice",
        options: [
          { label: "Weekly or more", value: "high" },
          { label: "A few times a month", value: "medium" },
          { label: "Occasionally", value: "low" },
          { label: "Never", value: "never" },
        ],
      });
    }

    // ── UBER ONE ──
    q.push({
      id: "uberOne", section: "Dining & Lifestyle",
      question: "Do you use Uber One (or would you)?",
      sub: `The card covers up to $9.99/mo for ${card.perks.uberOne.months} months (~${fmt(card.perks.uberOne.annual)}/yr value)`,
      type: "choice",
      options: [
        { label: "Yes — I use Uber regularly", value: "yes" },
        { label: "I would if it was free", value: "maybe" },
        { label: "No — don't use Uber much", value: "no" },
      ],
    });

    // ── DELTA STAYS ──
    if (card.perks.staysCredit) {
      q.push({
        id: "deltaStays", section: "Dining & Lifestyle",
      question: "Would you book hotels through Delta Stays?",
      sub: `You get a ${fmt(card.perks.staysCredit)} annual credit. Delta Stays earns MQDs and SkyMiles on hotel bookings.`,
      type: "choice",
      options: [
        { label: "Yes — I book hotels for travel anyway", value: "yes" },
        { label: "Maybe for some trips", value: "maybe" },
        { label: "No — I'm loyal to hotel programs", value: "no" },
        ],
      });
    }

    // ── GOLD FLIGHT CREDIT ──
    if (card.perks.flightCredit) {
      q.push({
        id: "hitsTenK", section: "Spending",
        question: "Would you spend $10,000+ on this card in a year?",
        sub: "The Gold card gives you a $200 Delta flight credit when you hit $10K in annual spending",
        type: "choice",
        options: [
          { label: "Easily", value: "yes" },
          { label: "Probably", value: "maybe" },
          { label: "Unlikely", value: "no" },
        ],
      });
    }


    // __ AMEX PLATINUM CREDITS __
    if (card.perks.saksCredit) {
      q.push({
        id: "saksUse", section: "Shopping & Lifestyle",
        question: "Do you shop at Saks Fifth Avenue?",
        sub: "You get $50 in Saks credit twice a year ($100/yr total)",
        type: "choice",
        options: [
          { label: "Yes - I shop there regularly", value: "yes" },
          { label: "Occasionally or for gifts", value: "sometimes" },
          { label: "Never", value: "no" },
        ],
      });
    }

    if (card.perks.airlineCredit) {
      q.push({
        id: "airlineCreditUse", section: "Travel Credits",
        question: "Would you use a $200 annual airline incidental credit?",
        sub: "Covers baggage fees, seat upgrades, in-flight purchases on your selected airline",
        type: "choice",
        options: [
          { label: "Easily - I fly often", value: "yes" },
          { label: "Probably on a few trips", value: "sometimes" },
          { label: "Unlikely", value: "no" },
        ],
      });
    }

    if (card.perks.hotelCredit) {
      q.push({
        id: "hotelCreditUse", section: "Travel Credits",
        question: "Would you book prepaid hotels through Amex Travel?",
        sub: "You get $200/yr back on prepaid hotel bookings through the Amex Travel portal",
        type: "choice",
        options: [
          { label: "Yes - I book hotels for travel anyway", value: "yes" },
          { label: "Maybe for some trips", value: "sometimes" },
          { label: "No - I book direct or use other portals", value: "no" },
        ],
      });
    }

    if (card.perks.streamingCredit) {
      q.push({
        id: "streamingUse", section: "Dining & Lifestyle",
        question: "Do you pay for streaming services?",
        sub: "You get up to $20/month back on eligible streaming (Disney+, Hulu, ESPN+, Peacock, NYT, etc.)",
        type: "choice",
        options: [
          { label: "Yes - multiple subscriptions", value: "high" },
          { label: "One or two services", value: "medium" },
          { label: "No", value: "no" },
        ],
      });
    }

    if (card.perks.clearCredit) {
      q.push({
        id: "clearUse", section: "Travel Credits",
        question: "Do you use or would you use CLEAR Plus?",
        sub: "You get up to $209/yr back on a CLEAR Plus membership for faster airport security",
        type: "choice",
        options: [
          { label: "Yes - I use it already", value: "yes" },
          { label: "I would if it was covered", value: "maybe" },
          { label: "Not interested", value: "no" },
        ],
      });
    }

    if (card.perks.walmartPlus) {
      q.push({
        id: "walmartUse", section: "Dining & Lifestyle",
        question: "Do you use or would you use Walmart+?",
        sub: "You get up to $155/yr back on a Walmart+ membership (free delivery, fuel discounts, Paramount+)",
        type: "choice",
        options: [
          { label: "Yes - I shop at Walmart regularly", value: "yes" },
          { label: "I would if it was covered", value: "maybe" },
          { label: "Not interested", value: "no" },
        ],
      });
    }

    if (card.perks.equinoxCredit) {
      q.push({
        id: "equinoxUse", section: "Dining & Lifestyle",
        question: "Are you an Equinox member or interested in joining?",
        sub: "You get up to $25/month ($300/yr) back on an Equinox+ membership",
        type: "choice",
        options: [
          { label: "Yes - I am a member", value: "yes" },
          { label: "I would consider it", value: "maybe" },
          { label: "No", value: "no" },
        ],
      });
    }

    if (card.perks.priorityPass) {
      q.push({
        id: "priorityPassUse", section: "Lounge Access",
        question: "Would you use Priority Pass lounge access?",
        sub: "The Amex Platinum includes Priority Pass Select with 1,400+ lounges worldwide beyond just Sky Clubs and Centurion",
        type: "choice",
        options: [
          { label: "Yes - great for international travel", value: "yes" },
          { label: "Occasionally", value: "sometimes" },
          { label: "Probably not", value: "no" },
        ],
      });
    }

    if (card.perks.uberCash) {
      q.push({
        id: "uberCashUse", section: "Dining & Lifestyle",
        question: "Would you use $15-35/month in Uber Cash?",
        sub: "You get $15/month in Uber Cash for rides or Uber Eats ($200/yr total, with a $20 bonus in December)",
        type: "choice",
        options: [
          { label: "Yes - I use Uber or Uber Eats regularly", value: "yes" },
          { label: "Sometimes", value: "sometimes" },
          { label: "Rarely or never", value: "no" },
        ],
      });
    }

    // ── STATUS ──
    if (card.mqd.headstart > 0) {
      q.push({
        id: "chasingStatus", section: "Medallion Status",
        question: "Are you chasing or maintaining Delta Medallion status?",
        sub: `This card gives you a ${fmt(card.mqd.headstart)} MQD Headstart + earns $1 MQD per $${card.mqd.boostPer} spent`,
        type: "choice",
        options: [
          { label: "Yes — actively chasing", value: "yes" },
          { label: "I have status, want to keep it", value: "maintaining" },
          { label: "Not interested in status", value: "no" },
        ],
      });
    }

    return q.filter((q) => !q.showIf || q.showIf());
  };

  const questions = getQuestions();
  const currentQ = questions[step];
  const progress = questions.length > 0 ? ((step + 1) / questions.length) * 100 : 0;
  const isLastStep = step >= questions.length - 1;

  /* ──────────────── CALCULATE ──────────────── */
  const calculate = () => {
    const b = [];
    const a = answers;
    let total = 0;

    // Signup bonus
    const bonusValue = card.signupBonus.miles * MILE_VALUE;
    b.push({ name: "Welcome bonus", value: bonusValue, detail: `${fmtK(card.signupBonus.miles)} miles × 1¢ each (spend ${fmt(card.signupBonus.spend)} in ${card.signupBonus.months} mo)`, year1: true, icon: "✦" });
    total += bonusValue;

    // Checked bags
    const flights = a.flights || 0;
    const bagRate = a.checkedBags === "always" ? 1 : a.checkedBags === "sometimes" ? 0.5 : 0;
    const companions = a.companions || 0;
    const bagValue = flights * 2 * 45 * bagRate * (1 + companions);
    if (bagValue > 0) {
      b.push({ name: "Free checked bags", value: bagValue, detail: `${flights} round-trips × ${1 + companions} people × $45/bag × 2 ways`, icon: "🧳" });
      total += bagValue;
    }

    // Companion cert
    if (card.perks.companionCert && a.companionCertUse !== "no") {
      const certMult = a.companionCertUse === "yes" ? 1 : 0.5;
      const certVal = (a.companionCertValue || 0) * certMult;
      if (certVal > 0) {
        b.push({ name: "Companion certificate", value: certVal, detail: a.companionCertUse === "maybe" ? "50% likelihood applied" : "Annual companion fare savings", icon: "🎫" });
        total += certVal;
      }
    }

    // Sky Club
    if (card.perks.skyClub) {
      const airports = a.airports || [];
      const airportsWithSC = airports.filter((ap) => ap.skyClub);
      const scCoverage = airports.length > 0 ? airportsWithSC.length / airports.length : 0;
      const visitRate = a.loungeFrequency === "every" ? 0.9 : a.loungeFrequency === "most" ? 0.7 : a.loungeFrequency === "sometimes" ? 0.4 : 0.1;
      const estimatedVisits = Math.min(Math.round(flights * 1.3 * scCoverage * visitRate), 15);
      const skyClubValue = estimatedVisits * 50;
      if (skyClubValue > 0) {
        b.push({
          name: "Sky Club access",
          value: skyClubValue,
          detail: `~${estimatedVisits} visits × $50 value (${airportsWithSC.length} of ${airports.length} airports have clubs)`,
          icon: "🍸",
        });
        total += skyClubValue;
      }
    }

    // Centurion
    if (card.perks.centurion && a.centurionUse !== "no") {
      const airports = a.airports || [];
      const withCenturion = airports.filter((ap) => ap.centurion);
      const centurionVisits = a.centurionUse === "yes" ? Math.min(withCenturion.length * 3, 10) : a.centurionUse === "sometimes" ? Math.min(withCenturion.length * 1.5, 5) : 0;
      const centurionValue = Math.round(centurionVisits) * 55;
      if (centurionValue > 0) {
        b.push({ name: "Centurion Lounge access", value: centurionValue, detail: `~${Math.round(centurionVisits)} visits at ${withCenturion.map((x) => x.code).join(", ")}`, icon: "🥂" });
        total += centurionValue;
      }
    }

    // Resy
    if (card.perks.resyCredit) {
      const resyRate = a.diningFrequency === "high" ? 1 : a.diningFrequency === "medium" ? 0.85 : a.diningFrequency === "low" ? 0.5 : 0.05;
      const resyFamiliar = a.resyFamiliarity === "many" ? 1 : a.resyFamiliarity === "some" ? 0.8 : a.resyFamiliarity === "few" ? 0.5 : 1;
      const adjustedRate = a.diningFrequency === "rarely" ? 0.05 : resyRate * resyFamiliar;
      const resyValue = Math.round(card.perks.resyCredit.annual * adjustedRate);
      b.push({ name: "Resy dining credit", value: resyValue, detail: `~${Math.round(adjustedRate * 100)}% of ${fmt(card.perks.resyCredit.annual)}/yr used`, icon: "🍽" });
      total += resyValue;
    }

    // Rideshare
    if (card.perks.rideshareCredit) {
      const rideRate = a.rideshare === "high" ? 1 : a.rideshare === "medium" ? 0.7 : a.rideshare === "low" ? 0.3 : 0;
      const rideValue = Math.round(card.perks.rideshareCredit.annual * rideRate);
      if (rideValue > 0) {
        b.push({ name: "Rideshare credit", value: rideValue, detail: `~${Math.round(rideRate * 100)}% utilization`, icon: "🚗" });
        total += rideValue;
      }
    }

    // Uber One
    const uberRate = a.uberOne === "yes" ? 1 : a.uberOne === "maybe" ? 0.6 : 0;
    const uberValue = Math.round(card.perks.uberOne.annual * uberRate);
    if (uberValue > 0) {
      b.push({ name: "Uber One credit", value: uberValue, detail: `${card.perks.uberOne.months} months covered`, icon: "📱" });
      total += uberValue;
    }

    // Delta Stays
    const staysRate = a.deltaStays === "yes" ? 1 : a.deltaStays === "maybe" ? 0.5 : 0;
    const staysValue = Math.round(card.perks.staysCredit * staysRate);
    if (staysValue > 0) {
      b.push({ name: "Delta Stays credit", value: staysValue, detail: "Annual hotel booking credit", icon: "🏨" });
      total += staysValue;
    }

    // Global Entry
    if (card.perks.globalEntry) {
      b.push({ name: "Global Entry / TSA PreCheck", value: card.perks.globalEntry, detail: "~$30/year amortized", icon: "🛂" });
      total += card.perks.globalEntry;
    }

    // Gold flight credit
    if (card.perks.flightCredit) {
      const hitRate = a.hitsTenK === "yes" ? 1 : a.hitsTenK === "maybe" ? 0.5 : 0;
      const creditValue = Math.round(card.perks.flightCredit.amount * hitRate);
      if (creditValue > 0) {
        b.push({ name: "Delta flight credit", value: creditValue, detail: "$200 after $10K annual spend", icon: "✈️" });
        total += creditValue;
      }
    }


    // Saks credit
    if (card.perks.saksCredit) {
      const saksRate = a.saksUse === "yes" ? 1 : a.saksUse === "sometimes" ? 0.6 : 0;
      const saksValue = Math.round(card.perks.saksCredit.annual * saksRate);
      if (saksValue > 0) {
        b.push({ name: "Saks Fifth Avenue credit", value: saksValue, detail: "$50 twice a year", icon: "🛍" });
        total += saksValue;
      }
    }

    // Airline incidental credit
    if (card.perks.airlineCredit) {
      const airlineRate = a.airlineCreditUse === "yes" ? 1 : a.airlineCreditUse === "sometimes" ? 0.6 : 0;
      const airlineValue = Math.round(card.perks.airlineCredit * airlineRate);
      if (airlineValue > 0) {
        b.push({ name: "Airline incidental credit", value: airlineValue, detail: "Baggage, seat upgrades, in-flight purchases", icon: "✈" });
        total += airlineValue;
      }
    }

    // Hotel credit
    if (card.perks.hotelCredit) {
      const hotelRate = a.hotelCreditUse === "yes" ? 1 : a.hotelCreditUse === "sometimes" ? 0.5 : 0;
      const hotelValue = Math.round(card.perks.hotelCredit * hotelRate);
      if (hotelValue > 0) {
        b.push({ name: "Amex Travel hotel credit", value: hotelValue, detail: "Prepaid hotels through Amex Travel", icon: "🏨" });
        total += hotelValue;
      }
    }

    // Streaming credit
    if (card.perks.streamingCredit) {
      const streamRate = a.streamingUse === "high" ? 1 : a.streamingUse === "medium" ? 0.5 : 0;
      const streamValue = Math.round(card.perks.streamingCredit.annual * streamRate);
      if (streamValue > 0) {
        b.push({ name: "Streaming credit", value: streamValue, detail: "Disney+, Hulu, ESPN+, Peacock, NYT, etc.", icon: "📺" });
        total += streamValue;
      }
    }

    // CLEAR credit
    if (card.perks.clearCredit) {
      const clearRate = a.clearUse === "yes" ? 1 : a.clearUse === "maybe" ? 0.8 : 0;
      const clearValue = Math.round(card.perks.clearCredit * clearRate);
      if (clearValue > 0) {
        b.push({ name: "CLEAR Plus credit", value: clearValue, detail: "Faster airport security", icon: "🔍" });
        total += clearValue;
      }
    }

    // Walmart+
    if (card.perks.walmartPlus) {
      const walmartRate = a.walmartUse === "yes" ? 1 : a.walmartUse === "maybe" ? 0.7 : 0;
      const walmartValue = Math.round(card.perks.walmartPlus * walmartRate);
      if (walmartValue > 0) {
        b.push({ name: "Walmart+ credit", value: walmartValue, detail: "Free delivery, fuel discounts, Paramount+", icon: "🛒" });
        total += walmartValue;
      }
    }

    // Equinox
    if (card.perks.equinoxCredit) {
      const eqRate = a.equinoxUse === "yes" ? 1 : a.equinoxUse === "maybe" ? 0.3 : 0;
      const eqValue = Math.round(card.perks.equinoxCredit.annual * eqRate);
      if (eqValue > 0) {
        b.push({ name: "Equinox+ credit", value: eqValue, detail: "$25/month membership credit", icon: "💪" });
        total += eqValue;
      }
    }

    // Uber Cash (separate from Uber One)
    if (card.perks.uberCash) {
      const uberCashRate = a.uberCashUse === "yes" ? 1 : a.uberCashUse === "sometimes" ? 0.6 : 0;
      const uberCashValue = Math.round(card.perks.uberCash.annual * uberCashRate);
      if (uberCashValue > 0) {
        b.push({ name: "Uber Cash", value: uberCashValue, detail: "$15/mo + $20 bonus in December", icon: "🚕" });
        total += uberCashValue;
      }
    }

    // Priority Pass
    if (card.perks.priorityPass) {
      const ppVisits = a.priorityPassUse === "yes" ? 8 : a.priorityPassUse === "sometimes" ? 3 : 0;
      const ppValue = ppVisits * 40;
      if (ppValue > 0) {
        b.push({ name: "Priority Pass lounges", value: ppValue, detail: "~" + ppVisits + " visits x $40 value (1,400+ lounges)", icon: "🌍" });
        total += ppValue;
      }
    }

    const fee = card.firstYearFee;
    const ongoingFee = card.annualFee;

    return {
      breakdown: b,
      year1: { total, fee, net: total - fee },
      ongoing: { total: total - bonusValue, fee: ongoingFee, net: total - bonusValue - ongoingFee },
    };
  };

  /* ══════════════════════════════════════════════════════════ */
  /* ──────────────── CARD SELECTION ──────────────── */
  /* ══════════════════════════════════════════════════════════ */
  if (!selectedCard) {
    return (
      <div ref={containerRef} style={{ minHeight: "100vh", background: "#0D0B08", fontFamily: "'Newsreader', Georgia, serif", color: "#E8E4DF" }}>
        <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500;6..72,600;6..72,700&family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <div style={{ padding: "48px 24px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#8A8278", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, marginBottom: "16px" }}>DELTA AMEX CARD ANALYZER</div>
          <h1 style={{ fontSize: "32px", fontWeight: 300, color: "#fff", margin: "0 0 12px", lineHeight: 1.2, fontStyle: "italic" }}>Is your card worth it?</h1>
          <p style={{ fontSize: "15px", color: "#8A8278", margin: "0 0 40px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
            Answer a few questions about how you travel and live.<br />We'll show you the real math.
          </p>
        </div>
        <div style={{ padding: "0 20px 60px" }}>
          <div style={{ fontSize: "12px", color: "#6A6258", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginBottom: "12px", letterSpacing: "1px" }}>SELECT A CARD TO ANALYZE</div>
          {Object.entries(CARDS).map(([key, c]) => (
            <button key={key} onClick={() => { setSelectedCard(key); setStep(0); setAnswers({}); setShowResults(false); }}
              style={{ display: "block", width: "100%", padding: "20px", marginBottom: "12px", borderRadius: "14px", border: "1px solid #2A2620", background: "#151310", cursor: "pointer", textAlign: "left", transition: "all 0.3s", position: "relative", overflow: "hidden" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.background = `${c.color}15`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2A2620"; e.currentTarget.style.background = "#151310"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>{c.short}</div>
                  <div style={{ fontSize: "12px", color: "#8A8278", fontFamily: "'DM Sans', sans-serif" }}>
                    {c.firstYearFee === 0 ? "$0 first year, then " : ""}{fmt(c.annualFee)}/yr · Up to {fmtK(c.signupBonus.miles)} bonus miles
                  </div>
                </div>
                <div style={{ width: "48px", height: "32px", borderRadius: "6px", background: c.gradient, boxShadow: `0 2px 12px ${c.color}66` }} />
              </div>
              <div style={{ display: "flex", gap: "6px", marginTop: "12px", flexWrap: "wrap" }}>
                {c.perks.skyClub && <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "4px", background: `${c.accent}20`, color: c.accent, fontFamily: "'IBM Plex Mono', monospace" }}>Sky Club</span>}
                {c.perks.centurion && <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "4px", background: `${c.accent}20`, color: c.accent, fontFamily: "'IBM Plex Mono', monospace" }}>Centurion</span>}
                {c.perks.priorityPass && <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "4px", background: `${c.accent}20`, color: c.accent, fontFamily: "'IBM Plex Mono', monospace" }}>Priority Pass</span>}
                {c.perks.companionCert && <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "4px", background: `${c.accent}20`, color: c.accent, fontFamily: "'IBM Plex Mono', monospace" }}>Companion Cert</span>}
                {c.perks.resyCredit && <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "4px", background: `${c.accent}20`, color: c.accent, fontFamily: "'IBM Plex Mono', monospace" }}>Resy Credit</span>}
                {c.mqd.headstart > 0 && <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "4px", background: `${c.accent}20`, color: c.accent, fontFamily: "'IBM Plex Mono', monospace" }}>MQD Boost</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ──────────────── RESULTS ──────────────── */
  /* ══════════════════════════════════════════════════════════ */
  if (showResults) {
    const result = calculate();
    const y1 = result.year1;
    const og = result.ongoing;

    return (
      <div ref={containerRef} style={{ minHeight: "100vh", background: "#0D0B08", fontFamily: "'DM Sans', sans-serif", color: "#E8E4DF", overflowY: "auto" }}>
        <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500;6..72,600;6..72,700&family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <div style={{ padding: "24px 20px 16px" }}>
          <button onClick={() => setShowResults(false)} style={{ background: "none", border: "none", color: "#8A8278", fontSize: "13px", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif" }}>← Back to questions</button>
        </div>
        <div style={{ padding: "0 20px", textAlign: "center", marginBottom: "24px" }}>
          <div style={{ width: "56px", height: "36px", borderRadius: "8px", background: card.gradient, margin: "0 auto 16px", boxShadow: `0 4px 20px ${card.color}88` }} />
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#8A8278", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "8px" }}>YOUR {card.short.toUpperCase()} ANALYSIS</div>
        </div>

        {/* Year 1 */}
        <div style={{ padding: "0 20px", marginBottom: "16px" }}>
          <div style={{
            borderRadius: "16px", padding: "28px 24px", textAlign: "center",
            background: y1.net >= 0 ? "linear-gradient(145deg, rgba(34,120,60,0.15), rgba(34,120,60,0.03))" : "linear-gradient(145deg, rgba(180,50,50,0.15), rgba(180,50,50,0.03))",
            border: y1.net >= 0 ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(248,113,113,0.2)",
          }}>
            <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#8A8278", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "6px" }}>YEAR 1 NET VALUE</div>
            <div style={{ fontSize: "42px", fontWeight: 700, color: y1.net >= 0 ? "#4ade80" : "#f87171", fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>
              {y1.net >= 0 ? "+" : ""}{fmt(y1.net)}
            </div>
            <div style={{ fontSize: "13px", color: "#8A8278", marginTop: "8px" }}>{fmt(y1.total)} in value — {fmt(y1.fee)} annual fee</div>
            <div style={{
              display: "inline-block", marginTop: "14px", padding: "6px 18px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
              background: y1.net >= 500 ? "rgba(74,222,128,0.12)" : y1.net >= 0 ? "rgba(250,204,21,0.12)" : "rgba(248,113,113,0.12)",
              color: y1.net >= 500 ? "#4ade80" : y1.net >= 0 ? "#facc15" : "#f87171",
            }}>
              {y1.net >= 500 ? "The card pays for itself and then some" : y1.net >= 200 ? "Solid return on the annual fee" : y1.net >= 0 ? "Borderline — close call" : y1.net >= -100 ? "Tight — consider a lower-tier card" : "Hard to justify at your usage level"}
            </div>
          </div>
        </div>

        {/* Ongoing */}
        <div style={{ padding: "0 20px", marginBottom: "24px" }}>
          <div style={{ borderRadius: "12px", padding: "16px 20px", textAlign: "center", background: "#151310", border: "1px solid #2A2620" }}>
            <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#6A6258", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "4px" }}>ONGOING VALUE (YEAR 2+)</div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: og.net >= 0 ? "#4ade80" : "#f87171", fontFamily: "'IBM Plex Mono', monospace" }}>
              {og.net >= 0 ? "+" : ""}{fmt(og.net)}
            </div>
            <div style={{ fontSize: "12px", color: "#6A6258", marginTop: "4px" }}>Without the welcome bonus</div>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#6A6258", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "12px" }}>VALUE BREAKDOWN</div>
          {result.breakdown.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < result.breakdown.length - 1 ? "1px solid #1A1815" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "16px", width: "24px", textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#E8E4DF" }}>
                    {item.name}
                    {item.year1 && <span style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "3px", background: "rgba(74,222,128,0.12)", color: "#4ade80", marginLeft: "6px", fontFamily: "'IBM Plex Mono', monospace" }}>YEAR 1</span>}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6A6258", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis" }}>{item.detail}</div>
                </div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#4ade80", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap", marginLeft: "12px" }}>+{fmt(item.value)}</div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", marginTop: "8px", borderTop: "2px solid #2A2620" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#f87171" }}>Annual fee</span>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#f87171", fontFamily: "'IBM Plex Mono', monospace" }}>-{fmt(card.annualFee)}</span>
          </div>
        </div>

        <div style={{ padding: "12px 20px 40px", textAlign: "center" }}>
          <button onClick={() => { setSelectedCard(null); setStep(0); setAnswers({}); setShowResults(false); }}
            style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #2A2620", background: "#151310", color: "#E8E4DF", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Compare another card
          </button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ──────────────── QUESTION SCREEN ──────────────── */
  /* ══════════════════════════════════════════════════════════ */
  const handleContinue = () => {
    if (isLastStep) {
      setShowResults(true);
    } else {
      goNext();
    }
  };

  const canContinue = (() => {
    if (!currentQ) return false;
    if (currentQ.type === "choice") return answers[currentQ.id] !== undefined;
    if (currentQ.type === "airports") return (answers.airports || []).length > 0;
    if (currentQ.type === "resy") return answers[currentQ.id] !== undefined;
    if (currentQ.type === "info") return true;
    return true;
  })();

  return (
    <div ref={containerRef} style={{ minHeight: "100vh", background: "#0D0B08", fontFamily: "'DM Sans', sans-serif", color: "#E8E4DF", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500;6..72,600;6..72,700&family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Top bar */}
      <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={goBack} style={{ background: "none", border: "none", color: "#8A8278", fontSize: "18px", cursor: "pointer", padding: "4px" }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ height: "3px", background: "#1A1815", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: card.accent, borderRadius: "2px", transition: "width 0.4s ease" }} />
          </div>
        </div>
        <span style={{ fontSize: "11px", color: "#6A6258", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>{step + 1}/{questions.length}</span>
      </div>

      {/* Card badge */}
      <div style={{ padding: "8px 20px 0", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "28px", height: "18px", borderRadius: "4px", background: card.gradient }} />
        <span style={{ fontSize: "11px", color: "#6A6258", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "1px" }}>{card.short.toUpperCase()}</span>
      </div>

      {/* Question content */}
      <div style={{
        flex: 1, padding: "24px 20px 120px",
        opacity: animating ? 0 : 1, transform: animating ? "translateX(20px)" : "translateX(0)",
        transition: "all 0.2s ease",
      }}>
        {currentQ && (
          <>
            <div style={{ fontSize: "10px", letterSpacing: "2px", color: card.accent, fontFamily: "'IBM Plex Mono', monospace", marginBottom: "12px" }}>
              {currentQ.section?.toUpperCase()}
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#fff", margin: "0 0 8px", lineHeight: 1.3 }}>{currentQ.question}</h2>
            {currentQ.sub && <p style={{ fontSize: "13px", color: "#8A8278", margin: "0 0 28px", lineHeight: 1.5 }}>{currentQ.sub}</p>}

            {/* Choice type */}
            {currentQ.type === "choice" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.value;
                  return (
                    <button key={opt.label} onClick={() => {
                      answer(currentQ.id, opt.value);
                      // Auto-advance for simple choices
                      setTimeout(() => {
                        if (isLastStep) setShowResults(true);
                        else goNext();
                      }, 300);
                    }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "16px 18px", borderRadius: "12px",
                        border: isSelected ? `1.5px solid ${card.accent}` : "1.5px solid #2A2620",
                        background: isSelected ? `${card.color}20` : "#151310",
                        cursor: "pointer", transition: "all 0.2s", textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: "15px", fontWeight: 500, color: isSelected ? "#fff" : "#C8C4BF" }}>{opt.label}</span>
                      {isSelected && <span style={{ fontSize: "14px", color: card.accent }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Airport search type */}
            {currentQ.type === "airports" && (
              <>
                <AirportSearch
                  selected={answers.airports || []}
                  onSelect={(a) => answer("airports", [...(answers.airports || []), a])}
                  onRemove={(code) => answer("airports", (answers.airports || []).filter((a) => a.code !== code))}
                  max={6}
                  accent={card.accent}
                />
                {(answers.airports || []).length > 0 && (
                  <button onClick={handleContinue}
                    style={{
                      width: "100%", padding: "14px", borderRadius: "10px", border: "none",
                      background: card.accent, color: "#fff", fontSize: "14px", fontWeight: 600,
                      cursor: "pointer", marginTop: "20px", fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Continue
                  </button>
                )}
              </>
            )}

            {/* Resy type */}
            {currentQ.type === "resy" && (
              <div>
                <a
                  href={`https://resy.com/cities/${encodeURIComponent((userCity || "new-york").toLowerCase().replace(/\s+/g, "-"))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block", padding: "16px 18px", borderRadius: "12px",
                    background: "#151310", border: "1.5px solid #2A2620",
                    textDecoration: "none", marginBottom: "16px", textAlign: "center",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = card.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2A2620")}
                >
                  <div style={{ fontSize: "14px", fontWeight: 600, color: card.accent, marginBottom: "4px" }}>
                    Browse Resy restaurants {userCity ? `in ${userCity}` : "near you"} →
                  </div>
                  <div style={{ fontSize: "11px", color: "#6A6258" }}>Opens in a new tab — come back here when you're done</div>
                </a>

                <div style={{ fontSize: "13px", color: "#C8C4BF", marginBottom: "14px" }}>
                  How many of those restaurants do you recognize or visit?
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { label: "A lot — I see my regular spots", value: "many" },
                    { label: "Some — a few I recognize", value: "some" },
                    { label: "Not many — mostly unfamiliar", value: "few" },
                    { label: "I'll skip checking — just estimate for me", value: "skip" },
                  ].map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.value;
                    return (
                      <button key={opt.value} onClick={() => {
                        answer(currentQ.id, opt.value);
                        setTimeout(() => {
                          if (isLastStep) setShowResults(true);
                          else goNext();
                        }, 300);
                      }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "14px 16px", borderRadius: "10px",
                          border: isSelected ? `1.5px solid ${card.accent}` : "1.5px solid #2A2620",
                          background: isSelected ? `${card.color}20` : "#151310",
                          cursor: "pointer", transition: "all 0.2s", textAlign: "left",
                        }}
                      >
                        <span style={{ fontSize: "14px", fontWeight: 500, color: isSelected ? "#fff" : "#C8C4BF" }}>{opt.label}</span>
                        {isSelected && <span style={{ fontSize: "14px", color: card.accent }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Info type */}
            {currentQ.type === "info" && (
              <button onClick={handleContinue}
                style={{
                  width: "100%", padding: "14px", borderRadius: "10px", border: "none",
                  background: card.accent, color: "#fff", fontSize: "14px", fontWeight: 600,
                  cursor: "pointer", marginTop: "8px", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Continue
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}