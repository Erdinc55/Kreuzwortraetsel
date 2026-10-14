const DATEN_KONFIG = {
  minLaenge: 3,
  maxLaenge: 14
};

function antwortNormalisieren(text) {
  let s = text;

  s = s
    .replace(/Ä/g, "AE").replace(/ä/g, "ae")
    .replace(/Ö/g, "OE").replace(/ö/g, "oe")
    .replace(/Ü/g, "UE").replace(/ü/g, "ue")
    .replace(/ß/g, "ss");

  s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  s = s.toUpperCase().replace(/[^A-Z]/g, "");

  return s;
}

function antwortTauglich(gitterwort) {
  return gitterwort.length >= DATEN_KONFIG.minLaenge
      && gitterwort.length <= DATEN_KONFIG.maxLaenge;
}

function vorratAufbereiten(rohEintraege) {
  const fertig = [];
  const gesehen = new Set();

  for (const eintrag of rohEintraege) {
    if (!eintrag || !eintrag.antwort) continue;
    if (!eintrag.hinweise || eintrag.hinweise.length < 3) continue;

    const wort = antwortNormalisieren(eintrag.antwort);
    if (!antwortTauglich(wort)) continue;
    if (gesehen.has(wort)) continue;
    gesehen.add(wort);

    fertig.push({
      wort,
      antwort: eintrag.antwort,
      gebiet: eintrag.gebiet,
      bekanntheit: eintrag.bekanntheit,
      hinweise: eintrag.hinweise
    });
  }

  return fertig;
}


let vorratImSpeicher = null;

async function vorratHolen() {
  if (vorratImSpeicher) return vorratImSpeicher;

  const ausWikidata = typeof WIKIDATA_FRAGEN !== "undefined" ? WIKIDATA_FRAGEN : [];
  vorratImSpeicher = vorratAufbereiten([...FRAGEN, ...ausWikidata]);
  return vorratImSpeicher;
}

try { localStorage.removeItem("lesesaal-vorrat"); } catch {}


function fragenWaehlen(vorrat, gebiet, schwierigkeit, anzahl) {
  const grundmenge = gebiet === "gemischt"
    ? vorrat.slice()
    : vorrat.filter(f => f.gebiet === gebiet);

  let auswahl = grundmenge;

  if (schwierigkeit === "leicht") {
    auswahl = grundmenge.filter(f => f.bekanntheit <= 2 && f.wort.length <= 10);
  } else if (schwierigkeit === "schwer") {
    auswahl = grundmenge.filter(f => f.bekanntheit >= 2 || f.wort.length >= 7);
  }

  if (auswahl.length < anzahl) auswahl = grundmenge;

  auswahl = auswahl.slice();
  for (let i = auswahl.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [auswahl[i], auswahl[j]] = [auswahl[j], auswahl[i]];
  }

  const HOECHSTENS_GLEICH = 2;
  const zaehler = new Map();
  const genommen = [];
  const zurueckgestellt = [];

  for (const frage of auswahl) {
    if (genommen.length >= anzahl) break;
    const schluessel = frage.hinweise[0];
    const bisher = zaehler.get(schluessel) || 0;

    if (bisher < HOECHSTENS_GLEICH) {
      zaehler.set(schluessel, bisher + 1);
      genommen.push(frage);
    } else {
      zurueckgestellt.push(frage);
    }
  }

  while (genommen.length < anzahl && zurueckgestellt.length > 0) {
    genommen.push(zurueckgestellt.shift());
  }

  return genommen;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { antwortNormalisieren, vorratAufbereiten, fragenWaehlen, DATEN_KONFIG };
}
