/* ============================================================================
   daten.js — Fragen bereitstellen und rätseltauglich machen

   Die Fragen kommen aus zwei Dateien, die beide mit der Seite ausgeliefert
   werden:

     fragen-wikidata.js   rund 990 Fragen, einmalig aus Wikidata erzeugt
     fragen.js            137 von Hand geschriebene Fragen

   Früher hat die Seite Wikidata bei jedem ersten Besuch live abgefragt. Das
   scheiterte regelmäßig: Der Abfragedienst ist ausdrücklich nicht für hohe
   Verfügbarkeit gebaut und begrenzt die Rechenzeit je Nutzer. Je nach
   Tageszeit kamen nur eine bis drei von fünf Abfragen durch (Issue #1).

   Jetzt werden die Abfragen einmal in Ruhe ausgeführt, das Ergebnis wird
   aufbereitet und als Datei mitgeliefert (Issue #2). Wie das geht, steht in
   werkzeug/LIESMICH.md. Für Besucher heißt das: kein Warten, keine
   Abhängigkeit von einem fremden Dienst, immer alle vier Gebiete gut gefüllt.
   ========================================================================== */

const DATEN_KONFIG = {
  minLaenge: 3,
  maxLaenge: 14
};

/* ============================================================================
   Antworten aufbereiten
   ========================================================================== */

/* Reihenfolge ist hier wichtig. Die Umlaute müssen ZUERST ersetzt werden.
   Würde man vorher die allgemeine Zeichenzerlegung anwenden, zerfiele Ä in
   A plus Strichlein — übrig bliebe A statt des gewünschten AE. */
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

/* ============================================================================
   Der Vorrat

   Die von Hand geschriebenen Fragen kommen ZUERST. Doppelte Antworten werden
   verworfen, die erste gewinnt — bei Überschneidungen setzen sich also die
   sorgfältig formulierten Hinweise durch.

   Die Funktion bleibt async, obwohl nichts mehr nachgeladen wird. So muss
   app.js nicht wissen, woher die Fragen kommen, und eine spätere Quelle
   könnte wieder asynchron sein, ohne dass sich dort etwas ändert.
   ========================================================================== */

let vorratImSpeicher = null;

async function vorratHolen() {
  if (vorratImSpeicher) return vorratImSpeicher;

  const ausWikidata = typeof WIKIDATA_FRAGEN !== "undefined" ? WIKIDATA_FRAGEN : [];
  vorratImSpeicher = vorratAufbereiten([...FRAGEN, ...ausWikidata]);
  return vorratImSpeicher;
}

/* Frühere Fassungen haben einen Vorrat im Browser gespeichert. Der wird nicht
   mehr gebraucht — einmal aufräumen, damit er keinen Speicher belegt. */
try { localStorage.removeItem("lesesaal-vorrat"); } catch { /* egal */ }

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

  /* Abwechslung erzwingen: höchstens zwei Wörter pro Rätsel dürfen denselben
     ersten Hinweis tragen. Sonst stünde womöglich sechsmal "Ein chemisches
     Element" untereinander. */
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
