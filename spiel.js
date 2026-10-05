/* ============================================================================
   spiel.js — Spielstand, Punkte, Hinweisstufen, Bestenliste

   Diese Datei verwaltet, was im Spiel gerade gilt. Sie fasst die Seite nicht
   an; das Anzeigen übernimmt app.js.
   ========================================================================== */

const SPIEL_KONFIG = {
  woerterAnfragen: 24,        // etwas mehr als gebraucht, manche finden keinen Platz
  punkteProBuchstabe: 8,
  kostenStufe2: 15,
  kostenStufe3: 30,
  kostenPruefen: 25,
  bestenlisteLaenge: 10
};

const BESTENLISTE_SCHLUESSEL = "lesesaal-bestenliste";

const GEBIET_NAMEN = {
  gemischt: "Gemischt", geografie: "Geografie", natur: "Natur",
  geschichte: "Geschichte", kultur: "Kultur"
};
const STUFEN_NAMEN = { leicht: "Leicht", mittel: "Mittel", schwer: "Schwer" };

/* ---------------------------------------------------------------------------
   Der Spielstand
   ------------------------------------------------------------------------- */

function spielAnlegen(gitter, gebiet, schwierigkeit) {
  const eintraege = gitter.eintraege.map((e, i) => ({ ...e, id: i, stufe: 1 }));

  // Bei "leicht" ist die zweite Stufe von Anfang an sichtbar und gratis
  if (schwierigkeit === "leicht") {
    eintraege.forEach(e => { e.stufe = 2; });
  }

  return {
    gitter,
    eintraege,
    gebiet,
    schwierigkeit,
    eingaben: new Map(),      // "z,s" -> Buchstabe
    falschMarkiert: new Set(),// "z,s"
    geloest: new Set(),       // ids der als richtig bestätigten Wörter
    abzug: 0,
    hinweiseVerbraucht: 0,
    pruefungen: 0,
    beendet: false
  };
}

/* ---------------------------------------------------------------------------
   Hinweis schärfen
   ------------------------------------------------------------------------- */

function hinweisSchaerfen(spiel, eintragId) {
  const eintrag = spiel.eintraege[eintragId];
  if (!eintrag || eintrag.stufe >= 3) return false;

  eintrag.stufe++;
  spiel.hinweiseVerbraucht++;
  spiel.abzug += eintrag.stufe === 2 ? SPIEL_KONFIG.kostenStufe2 : SPIEL_KONFIG.kostenStufe3;
  return true;
}

/* ---------------------------------------------------------------------------
   Prüfen

   Markiert falsche Buchstaben und bestätigt vollständig richtige Wörter.
   Kostet Punkte, damit es nicht zum Durchprobieren einlädt.
   ------------------------------------------------------------------------- */

function pruefen(spiel) {
  spiel.pruefungen++;
  spiel.abzug += SPIEL_KONFIG.kostenPruefen;
  spiel.falschMarkiert.clear();

  for (const [feld, buchstabe] of spiel.eingaben) {
    const richtig = spiel.gitter.loesung.get(feld);
    if (buchstabe && richtig && buchstabe !== richtig) {
      spiel.falschMarkiert.add(feld);
    }
  }

  spiel.geloest.clear();
  for (const eintrag of spiel.eintraege) {
    if (wortRichtig(spiel, eintrag)) spiel.geloest.add(eintrag.id);
  }
}

function wortFelder(eintrag) {
  const dz = eintrag.waagerecht ? 0 : 1;
  const ds = eintrag.waagerecht ? 1 : 0;
  const felder = [];
  for (let i = 0; i < eintrag.wort.length; i++) {
    felder.push((eintrag.zeile + dz * i) + "," + (eintrag.spalte + ds * i));
  }
  return felder;
}

function wortRichtig(spiel, eintrag) {
  return wortFelder(eintrag).every((feld, i) => spiel.eingaben.get(feld) === eintrag.wort[i]);
}

function wortVollstaendig(spiel, eintrag) {
  return wortFelder(eintrag).every(feld => !!spiel.eingaben.get(feld));
}

/* ---------------------------------------------------------------------------
   Fortschritt und Abschluss
   ------------------------------------------------------------------------- */

function alleFelder(gitter) {
  return [...gitter.loesung.keys()];
}

function gitterVoll(spiel) {
  return alleFelder(spiel.gitter).every(feld => !!spiel.eingaben.get(feld));
}

function auswerten(spiel) {
  let punkte = 0;
  const richtige = [];
  const falsche = [];

  for (const eintrag of spiel.eintraege) {
    if (wortRichtig(spiel, eintrag)) {
      punkte += eintrag.wort.length * SPIEL_KONFIG.punkteProBuchstabe;
      richtige.push(eintrag);
    } else {
      falsche.push(eintrag);
    }
  }

  const gesamt = Math.max(0, punkte - spiel.abzug);

  return {
    gesamt,
    rohpunkte: punkte,
    abzug: spiel.abzug,
    richtige,
    falsche,
    hinweiseVerbraucht: spiel.hinweiseVerbraucht,
    pruefungen: spiel.pruefungen
  };
}

/* ---------------------------------------------------------------------------
   Bestenliste
   ------------------------------------------------------------------------- */

function bestenlisteLaden() {
  try {
    const roh = localStorage.getItem(BESTENLISTE_SCHLUESSEL);
    const liste = roh ? JSON.parse(roh) : [];
    return Array.isArray(liste) ? liste : [];
  } catch {
    return [];
  }
}

function bestenlisteEintragen(ergebnis, spiel) {
  const liste = bestenlisteLaden();
  const eintrag = {
    punkte: ergebnis.gesamt,
    gebiet: spiel.gebiet,
    schwierigkeit: spiel.schwierigkeit,
    woerter: ergebnis.richtige.length,
    gesamtWoerter: spiel.eintraege.length,
    hinweise: ergebnis.hinweiseVerbraucht,
    datum: new Date().toISOString().slice(0, 10)
  };

  liste.push(eintrag);
  liste.sort((a, b) => b.punkte - a.punkte);
  const gekuerzt = liste.slice(0, SPIEL_KONFIG.bestenlisteLaenge);

  try {
    localStorage.setItem(BESTENLISTE_SCHLUESSEL, JSON.stringify(gekuerzt));
  } catch { /* privates Fenster — Spiel läuft trotzdem */ }

  return gekuerzt.indexOf(eintrag);
}

function bestenlisteLeeren() {
  try { localStorage.removeItem(BESTENLISTE_SCHLUESSEL); } catch { /* egal */ }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    spielAnlegen, hinweisSchaerfen, pruefen, auswerten,
    wortFelder, wortRichtig, wortVollstaendig, gitterVoll,
    SPIEL_KONFIG, GEBIET_NAMEN, STUFEN_NAMEN
  };
}
