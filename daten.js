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

/* ============================================================================
   Bekanntheit

   Wikidata sagt nicht, wie bekannt etwas ist. Aber jeder Eintrag weiß, in
   wie vielen Wikipedia-Sprachversionen es einen Artikel dazu gibt. Genau das
   ist ein guter Anhaltspunkt: Über den Mount Everest schreiben fast alle
   Sprachen, über einen Nebenfluss der Weser kaum eine.

   Daraus werden die drei Stufen:
     1 sehr bekannt   ab 120 Sprachversionen
     2 mittel         ab 45
     3 eher entlegen  darunter
   ========================================================================== */

function bekanntheitAus(sprachversionen) {
  const n = Number(sprachversionen) || 0;
  if (n >= 120) return 1;
  if (n >= 45) return 2;
  return 3;
}

/* ============================================================================
   Hilfsfunktionen für die Hinweistexte
   ========================================================================== */

// Wikidata gibt ohne deutsche Bezeichnung die Kennnummer zurück, etwa "Q7251".
// Solche Werte sind für Hinweise unbrauchbar.
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

/* Aus einer Jahreszahl wird das Jahrhundert. Das ist für die erste
   Hinweisstufe wertvoll: „Ein Philosoph aus dem 4. Jahrhundert v. Chr."
   grenzt ein, ohne zu verraten — und unterscheidet sich von anderen
   Einträgen derselben Sorte. */
function jahrhundertAus(jahr) {
  if (jahr === null || !Number.isFinite(jahr)) return null;
  const n = Math.ceil(Math.abs(jahr) / 100);
  return jahr < 0 ? `${n}. Jahrhundert v. Chr.` : `${n}. Jahrhundert`;
}

/* Die Ordnungszahl in Zehnerschritte einteilen. Ein Element allein über
   „Ein chemisches Element" zu beschreiben, führt bei mehreren Elementen im
   selben Rätsel zu wortgleichen Hinweisen. */
function ordnungsBereich(zahl) {
  const n = Number(zahl);
  if (!Number.isFinite(n)) return null;
  const von = Math.floor((n - 1) / 10) * 10 + 1;
  return `${von} bis ${von + 9}`;
}

/* ============================================================================
   Die Abfragen

   Jede besteht aus einem SPARQL-Text und einer Funktion, die aus einer
   Ergebniszeile einen Eintrag mit drei Hinweisstufen baut. Die Stufen gehen
   von vage nach fast verraten — genau dafür sind die strukturierten
   Eigenschaften gut: Sie liegen schon in Schichten vor.
   ========================================================================== */

const ABFRAGEN = [

  /* Zwei Regeln halten diese Abfragen schnell:

     Kein ORDER BY. Eine Sortierung zwingt den Server, erst ALLE Treffer zu
     ermitteln und zu ordnen, bevor er den ersten herausgibt. Ohne Sortierung
     darf er aufhören, sobald das LIMIT erreicht ist. Wir brauchen keine
     Rangfolge, nur einen Vorrat — die Auswahl fürs einzelne Rätsel erfolgt
     ohnehin später im Browser.

     Was für einen Hinweis gebraucht wird, ist Pflicht statt OPTIONAL. Ein
     Fluss ohne bekannte Mündung wird später sowieso aussortiert; ihn gar
     nicht erst zu laden, verkleinert die Treffermenge von Anfang an. */

  /* ---------------- Geografie: Flüsse ---------------- */
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

  /* ---------------- Geografie: Hauptstädte ----------------
     Die kleinste Abfrage von allen: Es gibt nur rund 200 Staaten. */
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

  /* ---------------- Geografie: Berge ---------------- */
  {
    name: "Berge",
    aktiv: false,   // vorerst abgeschaltet, siehe Kommentar oben
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

  /* ---------------- Natur: chemische Elemente ----------------
     118 Datensätze. Hier ist eine Sortierung unbedenklich. */
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

  /* ---------------- Natur: Himmelskörper ----------------
     Anker ist P397, der Körper, den etwas umkreist. Das haben nur
     Planeten, Monde und Kleinkörper — eine von vornherein kleine Menge. */
  {
    name: "Himmelskörper",
    aktiv: false,   // vorerst abgeschaltet, siehe Kommentar oben
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

  /* ---------------- Geschichte: Personen ----------------
     Die alte Fassung suchte über ALLE Menschen in Wikidata, mehrere
     Millionen Datensätze — der Server brach ab. Jetzt ist der Anker der
     Beruf: Monarchen, Philosophen, Feldherren, Astronomen und
     Mathematiker sind zusammen ein Bruchteil davon. */
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

  /* ---------------- Kultur: Gemälde ---------------- */
  {
    name: "Gemälde",
    aktiv: false,   // vorerst abgeschaltet, siehe Kommentar oben
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

  /* ---------------- Kultur: Kunstschaffende ----------------
     Das Hauptwerk ist Pflicht, weil die dritte Hinweisstufe darauf
     aufbaut. Das macht die Abfrage nebenbei deutlich schneller. */
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

/* ============================================================================
   Eine Abfrage ausführen
   ========================================================================== */

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

  // SPARQL liefert jede Spalte als Objekt mit einem value-Feld. Hier wird
  // daraus ein flaches Objekt, damit die bauen-Funktion einfach bleibt.
  return zeilen.map(zeile => {
    const flach = {};
    for (const [feld, inhalt] of Object.entries(zeile)) flach[feld] = inhalt.value;
    return flach;
  });
}

/* Ein 502 oder 429 heißt meist nur, dass der Dienst gerade viel zu tun hat.
   Nach kurzem Warten klappt es oft beim zweiten Mal. Bei allen anderen
   Fehlern hat ein zweiter Versuch keinen Sinn. */
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

/* ---------------------------------------------------------------------------
   Aus Ergebniszeilen werden Einträge

   Unvollständige Datensätze werden aussortiert: Wenn eine Hinweisstufe leer
   bliebe, wäre der Eintrag als Rätselfrage wertlos.
   ------------------------------------------------------------------------- */

function zeilenUmwandeln(abfrage, zeilen) {
  const eintraege = [];
  const gesehen = new Set();

  for (const zeile of zeilen) {
    if (!brauchbar(zeile.itemLabel)) continue;
    if (gesehen.has(zeile.itemLabel)) continue;   // OPTIONAL kann doppeln

    const eintrag = abfrage.bauen(zeile);
    if (!eintrag.hinweise.every(h => brauchbar(h))) continue;

    gesehen.add(zeile.itemLabel);
    eintraege.push(eintrag);
  }

  return eintraege;
}

/* ============================================================================
   Vorrat beschaffen
   ========================================================================== */

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
    // Kein Speicherplatz oder privates Fenster. Das Spiel läuft trotzdem,
    // der Vorrat wird beim nächsten Besuch eben neu geholt.
  }
}

async function wikidataVorratHolen(melden) {
  const alle = [];
  let erfolge = 0;

  /* Nur die als aktiv markierten Abfragen laufen. Acht Abfragen hintereinander
     sprengen das Zeitbudget des Dienstes; fünf reichen, um alle vier Gebiete
     abzudecken. Die abgeschalteten bleiben im Code stehen — wer mehr Vorrat
     will, setzt aktiv wieder auf true und verlängert die Pause. */
  const laufen = ABFRAGEN.filter(a => a.aktiv !== false);

  for (let i = 0; i < laufen.length; i++) {
    const abfrage = laufen[i];
    if (melden) melden(abfrage.name, i + 1, laufen.length);

    /* Jede Abfrage bekommt ihr EIGENES Abbruchsignal mit eigenem Wecker.
       Ein gemeinsames Signal für alle wäre ein Fehler: Eine einzige lahme
       Abfrage würde dann auch alle anderen abbrechen — auch die, die längst
       erfolgreich waren. So scheitert höchstens eine, und die übrigen
       Ergebnisse bleiben erhalten. */
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

/* ---------------------------------------------------------------------------
   Die Schnittstelle, die der Rest des Programms benutzt
   ------------------------------------------------------------------------- */

let vorratImSpeicher = null;
let laufenderAbruf = null;   // teilt sich alle gleichzeitigen Anfragen

/* Die eingebaute Sammlung wird IMMER beigemischt, nicht nur im Notfall.
   Grund: Wenn einzelne Abfragen scheitern, fehlt sonst ein ganzes Gebiet.
   Kommen etwa nur die Abfragen zur Geografie durch, gäbe es unter „Natur"
   kein einziges Rätsel. Die 60 eingebauten Fragen decken alle vier Gebiete
   ab und füllen solche Lücken.

   Die Reihenfolge ist wichtig: Wikidata zuerst, die eingebauten danach.
   vorratAufbereiten wirft doppelte Antworten weg und behält die erste —
   so gewinnen die frisch geholten Einträge. */
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

  /* Läuft bereits ein Abruf, geben wir dieselbe Zusage zurück, statt einen
     zweiten zu starten. Ohne diese Sperre konnte die Seite zwei Durchgänge
     gleichzeitig starten — einen beim Öffnen, einen durch „Fragen neu
     laden". Doppelt so viele Abfragen bedeuten hier aber nicht doppelt so
     schnell, sondern das Gegenteil: Das Zeitbudget des Dienstes ist dann
     sofort erschöpft und ALLE Abfragen laufen ins Leere. */
  if (laufenderAbruf) return laufenderAbruf;

  laufenderAbruf = vorratBeschaffen(melden);
  try {
    return await laufenderAbruf;
  } finally {
    laufenderAbruf = null;
  }
}

async function vorratBeschaffen(melden) {
  // 1. Gespeicherter Vorrat
  const gespeichert = gespeichertenVorratLesen();
  if (gespeichert) {
    vorratImSpeicher = zusammenfuehren(gespeichert);
    console.info("Vorrat aus dem Browser:", gebieteZaehlen(vorratImSpeicher));
    return vorratImSpeicher;
  }

  // 2. Wikidata
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

  // 3. Nur die eingebaute Sammlung
  vorratImSpeicher = vorratAufbereiten(FRAGEN);
  vorratImSpeicher.ausNotfall = true;
  return vorratImSpeicher;
}

function vorratVerwerfen() {
  // Während ein Abruf läuft, darf nichts verworfen werden — sonst startet
  // ein zweiter Durchgang parallel zum ersten.
  if (laufenderAbruf) return false;
  vorratImSpeicher = null;
  try { localStorage.removeItem(VORRAT_SCHLUESSEL); } catch { /* egal */ }
  return true;
}

/* ============================================================================
   Fragen für ein Rätsel auswählen
   ========================================================================== */

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

  // Bleiben zu wenige übrig, die Einschränkung lockern
  if (auswahl.length < anzahl) auswahl = grundmenge;

  auswahl = auswahl.slice();
  for (let i = auswahl.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [auswahl[i], auswahl[j]] = [auswahl[j], auswahl[i]];
  }

  /* Abwechslung erzwingen.

     Ohne diese Begrenzung konnte ein Rätsel sechsmal „Ein chemisches
     Element" enthalten — wortgleiche Hinweise, zwischen denen nichts zu
     unterscheiden war. Deshalb dürfen höchstens zwei Wörter denselben
     ersten Hinweis tragen. Die Begrenzung greift über den Hinweistext
     selbst, nicht über die Herkunft: So wirkt sie auch dann, wenn zwei
     Einträge aus ganz verschiedenen Quellen zufällig gleich anfangen. */
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

  // Reicht es so nicht für ein volles Rätsel, wird aufgefüllt. Ein etwas
  // eintönigeres Rätsel ist immer noch besser als ein zu kleines.
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
