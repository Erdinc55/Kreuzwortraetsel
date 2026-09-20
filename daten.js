const DATEN_KONFIG = {
  minLaenge: 3,
  maxLaenge: 14,
  endpunkt: "https://query.wikidata.org/sparql",
  zeitlimitMs: 55000,
  haltbarkeitTage: 7,
  pauseZwischenAbfragen: 5000,
  wartenVorZweitemVersuch: 2000
};

const VORRAT_SCHLUESSEL = "lesesaal-vorrat";

function antwortNormalisieren(text) {
  let s = text;

  s = s
    .replace(/Ä/g, "AE").replace(/ä/g, "ae")
    .replace(/Ö/g, "OE").replace(/ö/g, "oe")
    .replace(/Ü/g, "UE").replace(/ü/g, "ue")
    .replace(/ß/g, "ss");

  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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

function bekanntheitAus(sprachversionen) {
  const n = Number(sprachversionen) || 0;
  if (n >= 120) return 1;
  if (n >= 45) return 2;
  return 3;
}

function brauchbar(text) {
  return typeof text === "string" && text.length > 0 && !/^Q\d+$/.test(text);
}

function jahrAus(datumstext) {
  if (!datumstext) return null;
  const treffer = String(datumstext).match(/^(-?\d{1,4})-/);
  if (!treffer) return null;
  const jahr = Number(treffer[1]);
  return Number.isFinite(jahr) ? jahr : null;
}

function jahrSchreiben(jahr) {
  if (jahr === null) return null;
  return jahr < 0 ? Math.abs(jahr) + " v. Chr." : String(jahr);
}

function zahlSchreiben(wert, stellen = 0) {
  const n = Number(wert);
  if (!Number.isFinite(n)) return null;
  return n.toLocaleString("de-DE", { maximumFractionDigits: stellen });
}

function jahrhundertAus(jahr) {
  if (jahr === null || !Number.isFinite(jahr)) return null;
  const n = Math.ceil(Math.abs(jahr) / 100);
  return jahr < 0 ? `${n}. Jahrhundert v. Chr.` : `${n}. Jahrhundert`;
}

function ordnungsBereich(zahl) {
  const n = Number(zahl);
  if (!Number.isFinite(n)) return null;
  const von = Math.floor((n - 1) / 10) * 10 + 1;
  return `${von} bis ${von + 9}`;
}

const ABFRAGEN = [

{
    name: "Flüsse",
    gebiet: "geografie",
    sparql: `
SELECT ?itemLabel ?laenge ?muendungLabel ?landLabel ?anzahl WHERE {
  ?item wdt:P31 wd:Q4022 ;
        wdt:P2043 ?laenge ;
        wdt:P403 ?muendung ;
        wdt:P17 ?land ;
        wikibase:sitelinks ?anzahl .
  FILTER(?anzahl > 55)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
LIMIT 120`,
    bauen: z => ({
      antwort: z.itemLabel,
      gebiet: "geografie",
      bekanntheit: bekanntheitAus(z.anzahl),
      hinweise: [
        brauchbar(z.landLabel) ? `Ein Fluss in ${z.landLabel}` : null,
        zahlSchreiben(z.laenge) ? `${zahlSchreiben(z.laenge)} km lang` : null,
        brauchbar(z.muendungLabel) ? `Mündung: ${z.muendungLabel}` : null
      ]
    })
  },

  {
    name: "Hauptstädte",
    gebiet: "geografie",
    sparql: `
SELECT ?itemLabel ?landLabel ?kontinentLabel ?einwohner ?anzahl WHERE {
  ?land wdt:P31 wd:Q3624078 ;
        wdt:P36 ?item ;
        wdt:P30 ?kontinent .
  ?item wikibase:sitelinks ?anzahl .
  OPTIONAL { ?item wdt:P1082 ?einwohner }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
LIMIT 220`,
    bauen: z => ({
      antwort: z.itemLabel,
      gebiet: "geografie",
      bekanntheit: bekanntheitAus(z.anzahl),
      hinweise: [
        brauchbar(z.kontinentLabel) ? `Eine Hauptstadt in ${z.kontinentLabel}` : null,
        zahlSchreiben(z.einwohner) ? `Rund ${zahlSchreiben(z.einwohner)} Einwohner` : null,
        brauchbar(z.landLabel) ? `Land: ${z.landLabel}` : null
      ]
    })
  },

  {
    name: "Berge",
    aktiv: false,
    gebiet: "geografie",
    sparql: `
SELECT ?itemLabel ?hoehe ?ketteLabel ?landLabel ?anzahl WHERE {
  ?item wdt:P31 wd:Q8502 ;
        wdt:P2044 ?hoehe ;
        wikibase:sitelinks ?anzahl .
  FILTER(?anzahl > 55)
  OPTIONAL { ?item wdt:P4552 ?kette }
  OPTIONAL { ?item wdt:P17 ?land }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
LIMIT 120`,
    bauen: z => ({
      antwort: z.itemLabel,
      gebiet: "geografie",
      bekanntheit: bekanntheitAus(z.anzahl),
      hinweise: [
        "Ein Berg",
        zahlSchreiben(z.hoehe) ? `${zahlSchreiben(z.hoehe)} Meter hoch` : null,
        brauchbar(z.ketteLabel) ? `Gebirge: ${z.ketteLabel}`
          : (brauchbar(z.landLabel) ? `Land: ${z.landLabel}` : null)
      ]
    })
  },

  {
    name: "Elemente",
    gebiet: "natur",
    sparql: `
SELECT ?itemLabel ?ordnungszahl ?symbol ?anzahl WHERE {
  ?item wdt:P31 wd:Q11344 ;
        wdt:P1086 ?ordnungszahl ;
        wdt:P246 ?symbol ;
        wikibase:sitelinks ?anzahl .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
ORDER BY ?ordnungszahl
LIMIT 120`,
    bauen: z => ({
      antwort: z.itemLabel,
      gebiet: "natur",
      bekanntheit: bekanntheitAus(z.anzahl),
      hinweise: [
        ordnungsBereich(z.ordnungszahl)
          ? `Ein chemisches Element, Ordnungszahl ${ordnungsBereich(z.ordnungszahl)}`
          : null,
        z.ordnungszahl ? `Ordnungszahl genau ${z.ordnungszahl}` : null,
        z.symbol ? `Chemisches Symbol ${z.symbol}` : null
      ]
    })
  },

  {
    name: "Himmelskörper",
    aktiv: false,
    gebiet: "natur",
    sparql: `
SELECT ?itemLabel ?elternLabel ?entdeckt ?anzahl WHERE {
  ?item wdt:P397 ?eltern ;
        wdt:P575 ?entdeckt ;
        wikibase:sitelinks ?anzahl .
  FILTER(?anzahl > 50)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
LIMIT 120`,
    bauen: z => {
      const jahr = jahrSchreiben(jahrAus(z.entdeckt));
      return {
        antwort: z.itemLabel,
        gebiet: "natur",
        bekanntheit: bekanntheitAus(z.anzahl),
        hinweise: [
          "Ein Himmelskörper im Sonnensystem",
          jahr ? `Entdeckt im Jahr ${jahr}` : null,
          brauchbar(z.elternLabel) ? `Umkreist ${z.elternLabel}` : null
        ]
      };
    }
  },

  {
    name: "Historische Personen",
    gebiet: "geschichte",
    sparql: `
SELECT ?itemLabel ?berufLabel ?geburt ?tod ?landLabel ?anzahl WHERE {
  VALUES ?beruf { wd:Q116 wd:Q4964182 wd:Q189290 wd:Q11063 wd:Q170790 }
  ?item wdt:P106 ?beruf ;
        wdt:P570 ?tod ;
        wikibase:sitelinks ?anzahl .
  FILTER(?anzahl > 100)
  OPTIONAL { ?item wdt:P569 ?geburt }
  OPTIONAL { ?item wdt:P27 ?land }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
LIMIT 150`,
    bauen: z => {
      const geb = jahrSchreiben(jahrAus(z.geburt));
      const tod = jahrSchreiben(jahrAus(z.tod));
      const beruf = brauchbar(z.berufLabel) ? z.berufLabel : null;
      const jh = jahrhundertAus(jahrAus(z.tod));
      return {
        antwort: z.itemLabel,
        gebiet: "geschichte",
        bekanntheit: bekanntheitAus(z.anzahl),
        hinweise: [
          beruf && jh ? `${beruf} aus dem ${jh}` : null,
          geb && tod ? `Lebte von ${geb} bis ${tod}` : (tod ? `Gestorben ${tod}` : null),
          brauchbar(z.landLabel) ? `Herkunft: ${z.landLabel}` : null
        ]
      };
    }
  },

  {
    name: "Gemälde",
    aktiv: false,
    gebiet: "kultur",
    sparql: `
SELECT ?itemLabel ?schoepferLabel ?entstanden ?anzahl WHERE {
  ?item wdt:P31 wd:Q3305213 ;
        wdt:P170 ?schoepfer ;
        wdt:P571 ?entstanden ;
        wikibase:sitelinks ?anzahl .
  FILTER(?anzahl > 30)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
LIMIT 120`,
    bauen: z => {
      const jahr = jahrSchreiben(jahrAus(z.entstanden));
      return {
        antwort: z.itemLabel,
        gebiet: "kultur",
        bekanntheit: bekanntheitAus(z.anzahl),
        hinweise: [
          "Ein Gemälde",
          jahr ? `Entstanden ${jahr}` : null,
          brauchbar(z.schoepferLabel) ? `Gemalt von ${z.schoepferLabel}` : null
        ]
      };
    }
  },

  {
    name: "Kunstschaffende",
    gebiet: "kultur",
    sparql: `
SELECT ?itemLabel ?berufLabel ?geburt ?werkLabel ?anzahl WHERE {
  VALUES ?beruf { wd:Q1028181 wd:Q36834 wd:Q36180 }
  ?item wdt:P106 ?beruf ;
        wdt:P800 ?werk ;
        wikibase:sitelinks ?anzahl .
  FILTER(?anzahl > 80)
  OPTIONAL { ?item wdt:P569 ?geburt }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
LIMIT 140`,
    bauen: z => {
      const geb = jahrSchreiben(jahrAus(z.geburt));
      const beruf = brauchbar(z.berufLabel) ? z.berufLabel : "Kunstschaffende Person";
      const jh = jahrhundertAus(jahrAus(z.geburt));
      return {
        antwort: z.itemLabel,
        gebiet: "kultur",
        bekanntheit: bekanntheitAus(z.anzahl),
        hinweise: [
          jh ? `${beruf} aus dem ${jh}` : null,
          geb ? `Geboren ${geb}` : null,
          brauchbar(z.werkLabel) ? `Bekannt für ${z.werkLabel}` : null
        ]
      };
    }
  }

];


async function abfrageAusfuehren(abfrage, signal) {
  const url = DATEN_KONFIG.endpunkt + "?format=json&query=" +
              encodeURIComponent(abfrage.sparql.trim());

  const antwort = await fetch(url, {
    signal,
    headers: { "Accept": "application/sparql-results+json" }
  });

  if (!antwort.ok) {
    const fehler = new Error("HTTP " + antwort.status);
    fehler.status = antwort.status;
    throw fehler;
  }

  const daten = await antwort.json();
  const zeilen = daten.results?.bindings || [];

  return zeilen.map(zeile => {
    const flach = {};
    for (const [feld, inhalt] of Object.entries(zeile)) flach[feld] = inhalt.value;
    return flach;
  });
}

async function abfrageMitZweitemVersuch(abfrage, signal) {
  try {
    return await abfrageAusfuehren(abfrage, signal);
  } catch (fehler) {
    const nochmalSinnvoll = fehler.status === 429 || fehler.status === 502 ||
                            fehler.status === 503 || fehler.status === 504;
    if (!nochmalSinnvoll) throw fehler;

    console.info(`${abfrage.name}: Dienst überlastet (${fehler.status}), zweiter Versuch …`);
    await new Promise(r => setTimeout(r, DATEN_KONFIG.wartenVorZweitemVersuch));
    return abfrageAusfuehren(abfrage, signal);
  }
}


function zeilenUmwandeln(abfrage, zeilen) {
  const eintraege = [];
  const gesehen = new Set();

  for (const zeile of zeilen) {
    if (!brauchbar(zeile.itemLabel)) continue;
    if (gesehen.has(zeile.itemLabel)) continue;

    const eintrag = abfrage.bauen(zeile);
    if (!eintrag.hinweise.every(h => brauchbar(h))) continue;

    gesehen.add(zeile.itemLabel);
    eintraege.push(eintrag);
  }

  return eintraege;
}

function gespeichertenVorratLesen() {
  try {
    const roh = localStorage.getItem(VORRAT_SCHLUESSEL);
    if (!roh) return null;

    const abgelegt = JSON.parse(roh);
    if (!abgelegt || !Array.isArray(abgelegt.eintraege)) return null;
    if (abgelegt.eintraege.length < 40) return null;

    const alterTage = (Date.now() - abgelegt.zeitstempel) / (1000 * 60 * 60 * 24);
    if (alterTage > DATEN_KONFIG.haltbarkeitTage) return null;

    return abgelegt.eintraege;
  } catch {
    return null;
  }
}

function vorratSpeichern(eintraege) {
  try {
    localStorage.setItem(VORRAT_SCHLUESSEL, JSON.stringify({
      zeitstempel: Date.now(),
      eintraege
    }));
  } catch {
  }
}

async function wikidataVorratHolen(melden) {
  const alle = [];
  let erfolge = 0;

  const laufen = ABFRAGEN.filter(a => a.aktiv !== false);

  for (let i = 0; i < laufen.length; i++) {
    const abfrage = laufen[i];
    if (melden) melden(abfrage.name, i + 1, laufen.length);

    const abbruch = new AbortController();
    const wecker = setTimeout(() => abbruch.abort(), DATEN_KONFIG.zeitlimitMs);

    try {
      const zeilen = await abfrageMitZweitemVersuch(abfrage, abbruch.signal);
      alle.push(...zeilenUmwandeln(abfrage, zeilen));
      erfolge++;
    } catch (fehler) {
      const grund = fehler.name === "AbortError"
        ? `zu langsam, nach ${DATEN_KONFIG.zeitlimitMs / 1000} s abgebrochen`
        : fehler.message;
      console.warn(`Abfrage fehlgeschlagen — ${abfrage.name}: ${grund}`);
    } finally {
      clearTimeout(wecker);
    }

    if (i < laufen.length - 1) {
      await new Promise(r => setTimeout(r, DATEN_KONFIG.pauseZwischenAbfragen));
    }
  }

  if (erfolge === 0) throw new Error("Keine einzige Abfrage erfolgreich");
  console.info(`Wikidata: ${erfolge} von ${laufen.length} Abfragen erfolgreich, ${alle.length} Einträge.`);
  return alle;
}


let vorratImSpeicher = null;
let laufenderAbruf = null;

function zusammenfuehren(wikidataEintraege) {
  return vorratAufbereiten([...wikidataEintraege, ...FRAGEN]);
}

function gebieteZaehlen(vorrat) {
  const zaehler = {};
  for (const f of vorrat) zaehler[f.gebiet] = (zaehler[f.gebiet] || 0) + 1;
  return zaehler;
}

async function vorratHolen(melden) {
  if (vorratImSpeicher) return vorratImSpeicher;

  if (laufenderAbruf) return laufenderAbruf;

  laufenderAbruf = vorratBeschaffen(melden);
  try {
    return await laufenderAbruf;
  } finally {
    laufenderAbruf = null;
  }
}

async function vorratBeschaffen(melden) {
  const gespeichert = gespeichertenVorratLesen();
  if (gespeichert) {
    vorratImSpeicher = zusammenfuehren(gespeichert);
    console.info("Vorrat aus dem Browser:", gebieteZaehlen(vorratImSpeicher));
    return vorratImSpeicher;
  }

  try {
    const roh = await wikidataVorratHolen(melden);
    const fertig = zusammenfuehren(roh);

    if (fertig.length >= 80) {
      vorratSpeichern(roh);
      vorratImSpeicher = fertig;
      console.info("Vorrat nach Gebieten:", gebieteZaehlen(fertig));
      return vorratImSpeicher;
    }
    console.warn("Zu wenige brauchbare Einträge von Wikidata:", fertig.length);
  } catch (fehler) {
    console.warn("Wikidata nicht erreichbar:", fehler);
  }
  vorratImSpeicher = vorratAufbereiten(FRAGEN);
  vorratImSpeicher.ausNotfall = true;
  return vorratImSpeicher;
}

function vorratVerwerfen() {
  if (laufenderAbruf) return false;
  vorratImSpeicher = null;
  try { localStorage.removeItem(VORRAT_SCHLUESSEL); } catch { /* egal */ }
  return true;
}

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
  module.exports = {
    antwortNormalisieren, vorratAufbereiten, fragenWaehlen,
    zeilenUmwandeln, bekanntheitAus, jahrAus, jahrSchreiben, brauchbar,
    ABFRAGEN, DATEN_KONFIG
  };
}
