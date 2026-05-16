import { useState, useEffect } from "react";

const CARDS = {
  gold: {
    name: "Delta SkyMiles® Gold",
    shortName: "Gold",
    annualFee: 150,
    color: "#B8860B",
    colorLight: "#D4A830",
    colorGlow: "rgba(184,134,11,0.15)",
    mqd: { headstart: 0, boostRate: 0, boostLabel: null },
    skyClub: false,
    centurion: false,
    companionCert: false,
    earnRates: { delta: 2, restaurants: 2, supermarkets: 2, other: 1 },
    benefits: [
      { name: "Free checked bag", description: "First bag free for you + up to 8 companions", perUse: 45, key: "checkedBags" },
      { name: "Delta flight credit", description: "$200 credit after $10K spend in calendar year", fixed: 200, key: "flightCredit", conditional: "Requires $10K annual spend" },
      { name: "Delta Stays credit", description: "Up to $100/year on prepaid hotels via Delta Stays", fixed: 100, key: "staysCredit" },
      { name: "TakeOff 15", description: "15% off award flights booked with miles", percentage: true, key: "takeoff15" },
      { name: "Priority boarding", description: "Zone 5 priority boarding", fixed: 0, key: "priorityBoarding" },
      { name: "Uber One credit", description: "Up to $9.99/mo for 6 months", fixed: 60, key: "uberOne" },
    ],
  },
  platinum: {
    name: "Delta SkyMiles® Platinum",
    shortName: "Platinum",
    annualFee: 350,
    color: "#7B68AE",
    colorLight: "#9B8ACE",
    colorGlow: "rgba(123,104,174,0.15)",
    mqd: { headstart: 2500, boostRate: 20, boostLabel: "$1 MQD per $20 spent" },
    skyClub: false,
    centurion: false,
    companionCert: true,
    earnRates: { delta: 3, hotels: 3, restaurants: 2, supermarkets: 2, other: 1 },
    benefits: [
      { name: "Companion certificate", description: "Annual domestic round-trip Main Cabin companion fare", perUse: 0, key: "companionCert", requiresInput: true },
      { name: "Free checked bag", description: "First bag free for you + up to 8 companions", perUse: 45, key: "checkedBags" },
      { name: "Resy credit", description: "Up to $10/mo ($120/year) at U.S. Resy restaurants", fixed: 120, key: "resyCredit" },
      { name: "Rideshare credit", description: "Up to $10/mo ($120/year) on U.S. rideshare", fixed: 120, key: "rideshareCredit" },
      { name: "Delta Stays credit", description: "Up to $150/year on prepaid hotels via Delta Stays", fixed: 150, key: "staysCredit" },
      { name: "TakeOff 15", description: "15% off award flights booked with miles", percentage: true, key: "takeoff15" },
      { name: "MQD Headstart", description: "$2,500 MQDs deposited annually", fixed: 0, key: "mqdHeadstart", statusBenefit: true },
      { name: "Uber One credit", description: "Up to $9.99/mo for 12 months", fixed: 120, key: "uberOne" },
      { name: "Global Entry / TSA PreCheck credit", description: "Up to $120 every 4 years ($30/yr value)", fixed: 30, key: "globalEntry" },
    ],
  },
  reserve: {
    name: "Delta SkyMiles® Reserve",
    shortName: "Reserve",
    annualFee: 650,
    color: "#1a3a5c",
    colorLight: "#2a5a8c",
    colorGlow: "rgba(26,58,92,0.15)",
    mqd: { headstart: 2500, boostRate: 10, boostLabel: "$1 MQD per $10 spent" },
    skyClub: true,
    centurion: true,
    companionCert: true,
    earnRates: { delta: 3, other: 1 },
    earnNote: "Simpler earning structure: 3X Delta, 1X everything else",
    benefits: [
      { name: "Sky Club access", description: "15 visits/year when flying Delta (unlimited at $75K spend)", perUse: 0, key: "skyClub", requiresInput: true },
      { name: "Centurion Lounge access", description: "Access when flying Delta booked on this card", perUse: 0, key: "centurion", requiresInput: true },
      { name: "Companion certificate", description: "Annual domestic round-trip Main Cabin companion fare", perUse: 0, key: "companionCert", requiresInput: true },
      { name: "Free checked bag", description: "First bag free for you + up to 8 companions", perUse: 45, key: "checkedBags" },
      { name: "Resy credit", description: "Up to $20/mo ($240/year) at U.S. Resy restaurants", fixed: 240, key: "resyCredit" },
      { name: "Rideshare credit", description: "Up to $10/mo ($120/year) on U.S. rideshare", fixed: 120, key: "rideshareCredit" },
      { name: "Delta Stays credit", description: "$100/year on prepaid hotels via Delta Stays", fixed: 100, key: "staysCredit" },
      { name: "TakeOff 15", description: "15% off award flights booked with miles", percentage: true, key: "takeoff15" },
      { name: "MQD Headstart", description: "$2,500 MQDs deposited annually", fixed: 0, key: "mqdHeadstart", statusBenefit: true },
      { name: "Upgrade priority", description: "Priority over others in same Medallion tier", fixed: 0, key: "upgradePriority", statusBenefit: true },
      { name: "Uber One credit", description: "Up to $9.99/mo for 12 months", fixed: 120, key: "uberOne" },
      { name: "Global Entry / TSA PreCheck credit", description: "Up to $120 every 4 years ($30/yr value)", fixed: 30, key: "globalEntry" },
    ],
  },
};

const MILE_VALUE = 0.012;

function formatDollar(n) {
  if (n === undefined || n === null || isNaN(n)) return "$0";
  return (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString();
}

function Slider({ label, sublabel, value, onChange, min, max, step, prefix, suffix }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#e8e4df" }}>{label}</span>
        <span style={{ fontSize: "15px", fontWeight: 600, color: "#fff", fontFamily: "'IBM Plex Mono', monospace" }}>
          {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
        </span>
      </div>
      {sublabel && <div style={{ fontSize: "11px", color: "#8a8278", marginBottom: "8px" }}>{sublabel}</div>}
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#D4A830" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6a6258", marginTop: "2px" }}>
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
}

function Toggle({ label, sublabel, value, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
      <div>
        <div style={{ fontSize: "13px", fontWeight: 500, color: "#e8e4df" }}>{label}</div>
        {sublabel && <div style={{ fontSize: "11px", color: "#8a8278", marginTop: "2px" }}>{sublabel}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
          background: value ? "#D4A830" : "#3a3630",
          position: "relative", transition: "background 0.2s",
        }}
      >
        <div style={{
          width: "18px", height: "18px", borderRadius: "9px", background: "#fff",
          position: "absolute", top: "3px",
          left: value ? "23px" : "3px",
          transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}

export default function App() {
  const [selectedCard, setSelectedCard] = useState("reserve");
  const [inputs, setInputs] = useState({
    deltaFlights: 6,
    checkedBagTrips: 4,
    companionsPerTrip: 1,
    annualDeltaSpend: 3000,
    annualOtherSpend: 24000,
    annualRestaurantSpend: 3000,
    annualSupermarketSpend: 6000,
    skyClubVisits: 8,
    centurionVisits: 2,
    companionCertValue: 400,
    usesResyCredit: true,
    usesRideshareCredit: true,
    usesStaysCredit: true,
    usesUberOne: true,
    usesFlightCredit: false,
    caresAboutStatus: true,
  });
  const [showResults, setShowResults] = useState(false);
  const [activeSection, setActiveSection] = useState("travel");

  const update = (key, val) => setInputs((p) => ({ ...p, [key]: val }));

  const card = CARDS[selectedCard];

  function calculateValue() {
    let totalValue = 0;
    const breakdown = [];

    // Checked bag savings
    const bagSavings = inputs.checkedBagTrips * 2 * 45 * (1 + Math.min(inputs.companionsPerTrip, 8));
    if (bagSavings > 0) {
      breakdown.push({ name: "Free checked bags", value: bagSavings, detail: `${inputs.checkedBagTrips} round-trips × ${1 + Math.min(inputs.companionsPerTrip, 8)} people × $45/bag × 2` });
      totalValue += bagSavings;
    }

    // Miles earned
    const deltaMiles = inputs.annualDeltaSpend * (card.earnRates.delta || 1);
    const restaurantMiles = inputs.annualRestaurantSpend * (card.earnRates.restaurants || card.earnRates.other || 1);
    const supermarketMiles = inputs.annualSupermarketSpend * (card.earnRates.supermarkets || card.earnRates.other || 1);
    const otherMiles = inputs.annualOtherSpend * (card.earnRates.other || 1);
    const totalMiles = deltaMiles + restaurantMiles + supermarketMiles + otherMiles;
    const milesValue = totalMiles * MILE_VALUE;
    breakdown.push({ name: "SkyMiles earned", value: milesValue, detail: `${totalMiles.toLocaleString()} miles × 1.2¢ each`, miles: totalMiles });
    totalValue += milesValue;

    // Statement credits
    if (card.benefits.find((b) => b.key === "resyCredit") && inputs.usesResyCredit) {
      const v = card.benefits.find((b) => b.key === "resyCredit").fixed;
      breakdown.push({ name: "Resy dining credit", value: v, detail: "Monthly statement credits" });
      totalValue += v;
    }
    if (card.benefits.find((b) => b.key === "rideshareCredit") && inputs.usesRideshareCredit) {
      const v = card.benefits.find((b) => b.key === "rideshareCredit").fixed;
      breakdown.push({ name: "Rideshare credit", value: v, detail: "Monthly statement credits" });
      totalValue += v;
    }
    if (card.benefits.find((b) => b.key === "staysCredit") && inputs.usesStaysCredit) {
      const v = card.benefits.find((b) => b.key === "staysCredit").fixed;
      breakdown.push({ name: "Delta Stays credit", value: v, detail: "Annual statement credit" });
      totalValue += v;
    }
    if (card.benefits.find((b) => b.key === "uberOne") && inputs.usesUberOne) {
      const v = card.benefits.find((b) => b.key === "uberOne").fixed;
      breakdown.push({ name: "Uber One credit", value: v, detail: "Monthly membership credit" });
      totalValue += v;
    }
    if (card.benefits.find((b) => b.key === "flightCredit") && inputs.usesFlightCredit) {
      breakdown.push({ name: "Delta flight credit", value: 200, detail: "Requires $10K annual card spend" });
      totalValue += 200;
    }
    if (card.benefits.find((b) => b.key === "globalEntry")) {
      const v = card.benefits.find((b) => b.key === "globalEntry").fixed;
      breakdown.push({ name: "Global Entry/TSA PreCheck", value: v, detail: "~$30/year amortized" });
      totalValue += v;
    }

    // Companion certificate
    if (card.companionCert && inputs.companionCertValue > 0) {
      breakdown.push({ name: "Companion certificate", value: inputs.companionCertValue, detail: `Value of the companion's ticket you'd otherwise buy` });
      totalValue += inputs.companionCertValue;
    }

    // Sky Club
    if (card.skyClub && inputs.skyClubVisits > 0) {
      const skyClubValue = inputs.skyClubVisits * 50;
      breakdown.push({ name: "Sky Club access", value: skyClubValue, detail: `${inputs.skyClubVisits} visits × ~$50 value each` });
      totalValue += skyClubValue;
    }

    // Centurion
    if (card.centurion && inputs.centurionVisits > 0) {
      const centurionValue = inputs.centurionVisits * 50;
      breakdown.push({ name: "Centurion Lounge access", value: centurionValue, detail: `${inputs.centurionVisits} visits × ~$50 value each` });
      totalValue += centurionValue;
    }

    const netValue = totalValue - card.annualFee;
    return { totalValue, netValue, breakdown, annualFee: card.annualFee };
  }

  const result = calculateValue();

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'Libre Franklin', 'Helvetica Neue', sans-serif",
      background: "#1a1815",
      color: "#e8e4df",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid #2a2620" }}>
        <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#8a8278", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, marginBottom: "8px" }}>
          DELTA AMEX CARD ANALYZER
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 4px", lineHeight: 1.2 }}>
          Is your card worth keeping?
        </h1>
        <p style={{ fontSize: "13px", color: "#8a8278", margin: 0 }}>
          Input your habits. See the real math.
        </p>
      </div>

      {/* Card Selector */}
      <div style={{ padding: "16px 20px", display: "flex", gap: "8px" }}>
        {Object.entries(CARDS).map(([key, c]) => (
          <button
            key={key}
            onClick={() => { setSelectedCard(key); setShowResults(false); }}
            style={{
              flex: 1, padding: "12px 8px", borderRadius: "10px", cursor: "pointer",
              border: selectedCard === key ? `1.5px solid ${c.colorLight}` : "1.5px solid #2a2620",
              background: selectedCard === key ? c.colorGlow : "transparent",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "1px", color: selectedCard === key ? c.colorLight : "#6a6258", marginBottom: "4px" }}>
              {c.shortName.toUpperCase()}
            </div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: selectedCard === key ? "#fff" : "#8a8278" }}>
              {formatDollar(c.annualFee)}
              <span style={{ fontSize: "10px", fontWeight: 400, color: "#6a6258" }}>/yr</span>
            </div>
          </button>
        ))}
      </div>

      {/* Input Section Tabs */}
      <div style={{ padding: "0 20px", display: "flex", gap: "0", borderBottom: "1px solid #2a2620" }}>
        {[
          { id: "travel", label: "Travel" },
          { id: "spending", label: "Spending" },
          { id: "benefits", label: "Credits" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            style={{
              padding: "10px 16px", border: "none", cursor: "pointer", background: "transparent",
              fontSize: "12px", fontWeight: 600, fontFamily: "'Libre Franklin', sans-serif",
              color: activeSection === tab.id ? "#fff" : "#6a6258",
              borderBottom: activeSection === tab.id ? `2px solid ${card.colorLight}` : "2px solid transparent",
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Inputs */}
      <div style={{ padding: "20px" }}>
        {activeSection === "travel" && (
          <>
            <Slider label="Delta round-trip flights per year" value={inputs.deltaFlights} onChange={(v) => update("deltaFlights", v)} min={0} max={30} step={1} suffix=" flights" prefix="" />
            <Slider label="Trips where you check a bag" value={inputs.checkedBagTrips} onChange={(v) => update("checkedBagTrips", v)} min={0} max={30} step={1} suffix=" trips" prefix="" />
            <Slider label="Travel companions (same reservation)" value={inputs.companionsPerTrip} onChange={(v) => update("companionsPerTrip", v)} min={0} max={8} step={1} suffix="" prefix="" sublabel="They get free bags too" />
            {card.companionCert && (
              <Slider label="Companion cert ticket value" sublabel="What would the companion's ticket cost without the cert?" value={inputs.companionCertValue} onChange={(v) => update("companionCertValue", v)} min={0} max={1500} step={50} prefix="$" suffix="" />
            )}
            {card.skyClub && (
              <Slider label="Sky Club visits per year" sublabel="15 included, unlimited at $75K spend" value={inputs.skyClubVisits} onChange={(v) => update("skyClubVisits", v)} min={0} max={30} step={1} suffix=" visits" prefix="" />
            )}
            {card.centurion && (
              <Slider label="Centurion Lounge visits per year" value={inputs.centurionVisits} onChange={(v) => update("centurionVisits", v)} min={0} max={15} step={1} suffix=" visits" prefix="" />
            )}
          </>
        )}

        {activeSection === "spending" && (
          <>
            <Slider label="Annual Delta purchases" sublabel={`Earns ${card.earnRates.delta}X miles`} value={inputs.annualDeltaSpend} onChange={(v) => update("annualDeltaSpend", v)} min={0} max={20000} step={500} prefix="$" suffix="" />
            {card.earnRates.restaurants && (
              <Slider label="Annual restaurant spending" sublabel={`Earns ${card.earnRates.restaurants}X miles`} value={inputs.annualRestaurantSpend} onChange={(v) => update("annualRestaurantSpend", v)} min={0} max={20000} step={500} prefix="$" suffix="" />
            )}
            {card.earnRates.supermarkets && (
              <Slider label="Annual supermarket spending" sublabel={`Earns ${card.earnRates.supermarkets}X miles`} value={inputs.annualSupermarketSpend} onChange={(v) => update("annualSupermarketSpend", v)} min={0} max={20000} step={500} prefix="$" suffix="" />
            )}
            <Slider label="Annual other spending" sublabel={`Earns ${card.earnRates.other}X miles`} value={inputs.annualOtherSpend} onChange={(v) => update("annualOtherSpend", v)} min={0} max={100000} step={1000} prefix="$" suffix="" />
            {card.earnNote && <div style={{ fontSize: "11px", color: "#8a8278", fontStyle: "italic", marginTop: "-8px", marginBottom: "16px" }}>{card.earnNote}</div>}
          </>
        )}

        {activeSection === "benefits" && (
          <>
            <div style={{ fontSize: "12px", color: "#8a8278", marginBottom: "16px" }}>
              Toggle on the credits you'd actually use. Be honest — unused credits are worth $0.
            </div>
            {card.benefits.find((b) => b.key === "resyCredit") && (
              <Toggle label="Resy dining credit" sublabel={card.benefits.find((b) => b.key === "resyCredit").description} value={inputs.usesResyCredit} onChange={(v) => update("usesResyCredit", v)} />
            )}
            {card.benefits.find((b) => b.key === "rideshareCredit") && (
              <Toggle label="Rideshare credit" sublabel={card.benefits.find((b) => b.key === "rideshareCredit").description} value={inputs.usesRideshareCredit} onChange={(v) => update("usesRideshareCredit", v)} />
            )}
            {card.benefits.find((b) => b.key === "staysCredit") && (
              <Toggle label="Delta Stays credit" sublabel={card.benefits.find((b) => b.key === "staysCredit").description} value={inputs.usesStaysCredit} onChange={(v) => update("usesStaysCredit", v)} />
            )}
            {card.benefits.find((b) => b.key === "uberOne") && (
              <Toggle label="Uber One credit" sublabel={card.benefits.find((b) => b.key === "uberOne").description} value={inputs.usesUberOne} onChange={(v) => update("usesUberOne", v)} />
            )}
            {card.benefits.find((b) => b.key === "flightCredit") && (
              <Toggle label="Delta flight credit" sublabel="$200 after $10K annual spend" value={inputs.usesFlightCredit} onChange={(v) => update("usesFlightCredit", v)} />
            )}
          </>
        )}
      </div>

      {/* Calculate Button */}
      <div style={{ padding: "0 20px 20px" }}>
        <button
          onClick={() => setShowResults(true)}
          style={{
            width: "100%", padding: "14px", borderRadius: "10px", border: "none",
            background: `linear-gradient(135deg, ${card.color}, ${card.colorLight})`,
            color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer",
            fontFamily: "'Libre Franklin', sans-serif",
          }}
        >
          {showResults ? "Recalculate" : "Show me the math"}
        </button>
      </div>

      {/* Results */}
      {showResults && (
        <div style={{ padding: "0 20px 40px", animation: "fadeIn 0.4s ease" }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

          {/* Verdict Card */}
          <div style={{
            background: result.netValue >= 0
              ? "linear-gradient(135deg, rgba(34,120,60,0.2), rgba(34,120,60,0.05))"
              : "linear-gradient(135deg, rgba(180,50,50,0.2), rgba(180,50,50,0.05))",
            border: result.netValue >= 0 ? "1px solid rgba(34,120,60,0.3)" : "1px solid rgba(180,50,50,0.3)",
            borderRadius: "14px", padding: "24px", marginBottom: "16px", textAlign: "center",
          }}>
            <div style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "2px", color: "#8a8278", marginBottom: "8px" }}>
              YOUR NET VALUE
            </div>
            <div style={{ fontSize: "36px", fontWeight: 700, color: result.netValue >= 0 ? "#4ade80" : "#f87171", fontFamily: "'IBM Plex Mono', monospace" }}>
              {result.netValue >= 0 ? "+" : ""}{formatDollar(result.netValue)}
            </div>
            <div style={{ fontSize: "13px", color: "#8a8278", marginTop: "8px" }}>
              {formatDollar(result.totalValue)} in value — {formatDollar(card.annualFee)} annual fee
            </div>
            <div style={{
              display: "inline-block", marginTop: "12px", padding: "6px 16px",
              borderRadius: "20px", fontSize: "12px", fontWeight: 600,
              background: result.netValue >= 0 ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)",
              color: result.netValue >= 0 ? "#4ade80" : "#f87171",
            }}>
              {result.netValue >= 200 ? "Definitely keep it" : result.netValue >= 0 ? "Worth keeping — but close" : result.netValue >= -100 ? "Borderline — consider downgrading" : "Consider canceling or downgrading"}
            </div>
          </div>

          {/* Breakdown */}
          <div style={{
            background: "#221f1b", borderRadius: "14px", padding: "20px",
            border: "1px solid #2a2620",
          }}>
            <div style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "2px", color: "#8a8278", marginBottom: "16px" }}>
              VALUE BREAKDOWN
            </div>
            {result.breakdown.map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                padding: "10px 0",
                borderBottom: i < result.breakdown.length - 1 ? "1px solid #2a2620" : "none",
              }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#e8e4df" }}>{item.name}</div>
                  <div style={{ fontSize: "11px", color: "#6a6258", marginTop: "2px" }}>{item.detail}</div>
                </div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#4ade80", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap", marginLeft: "12px" }}>
                  +{formatDollar(item.value)}
                </div>
              </div>
            ))}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0 0", marginTop: "4px", borderTop: "2px solid #2a2620",
            }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#e8e4df" }}>Total value</span>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#fff", fontFamily: "'IBM Plex Mono', monospace" }}>
                {formatDollar(result.totalValue)}
              </span>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 0",
            }}>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "#f87171" }}>Annual fee</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#f87171", fontFamily: "'IBM Plex Mono', monospace" }}>
                -{formatDollar(card.annualFee)}
              </span>
            </div>
          </div>

          {/* MQD info for Platinum/Reserve */}
          {card.mqd.headstart > 0 && inputs.caresAboutStatus && (
            <div style={{
              background: "#221f1b", borderRadius: "14px", padding: "20px", marginTop: "12px",
              border: "1px solid #2a2620",
            }}>
              <div style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "2px", color: "#8a8278", marginBottom: "12px" }}>
                STATUS ACCELERATION
              </div>
              <div style={{ fontSize: "13px", color: "#e8e4df", lineHeight: 1.6 }}>
                This card contributes <strong style={{ color: card.colorLight }}>{formatDollar(card.mqd.headstart)}</strong> MQD Headstart plus <strong style={{ color: card.colorLight }}>{card.mqd.boostLabel}</strong> toward Medallion status. Based on your <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatDollar(inputs.annualDeltaSpend + inputs.annualOtherSpend + (inputs.annualRestaurantSpend || 0) + (inputs.annualSupermarketSpend || 0))}</span> total annual spend, that's roughly <strong style={{ color: card.colorLight }}>{formatDollar(card.mqd.headstart + Math.floor((inputs.annualDeltaSpend + inputs.annualOtherSpend + (inputs.annualRestaurantSpend || 0) + (inputs.annualSupermarketSpend || 0)) / card.mqd.boostRate))}</strong> MQDs from this card alone.
              </div>
              <div style={{ fontSize: "11px", color: "#6a6258", marginTop: "8px" }}>
                Not included in dollar value above — but critical if you're chasing status.
              </div>
            </div>
          )}

          {/* Compare nudge */}
          <div style={{
            textAlign: "center", padding: "20px 0 0", fontSize: "13px", color: "#6a6258",
          }}>
            Try switching cards above to compare all three.
          </div>
        </div>
      )}
    </div>
  );
}
