/* ============================================================================
   gitter.js — erzeugt aus einer Wortliste ein freies Kreuzworträtsel-Gitter

   Diese Datei weiß NICHTS über die Seite. Kein document, kein Klick, keine
   Farbe. Rein gehen Wörter, raus kommt eine Datenstruktur. Das hat einen
   praktischen Grund: So lässt sich der Algorithmus für sich allein prüfen,
   bevor es überhaupt eine Oberfläche gibt.

   Der Kern ist Backtracking. Die Idee dahinter in einem Satz: Man setzt
   Schritt für Schritt Wörter, und wenn es nicht weitergeht, nimmt man einen
   Schritt zurück und probiert eine andere Möglichkeit.

   In dieser Fassung ist das Zurückgehen bewusst einfach gehalten: Ein Wort,
   für das gerade kein Platz ist, wird zurückgestellt und später erneut
   versucht. Zusätzlich läuft der gesamte Aufbau mehrfach mit anders
   gemischter Reihenfolge — von allen Versuchen wird der beste behalten.
   Das ist in der Praxis wirksamer als ein einzelner Durchlauf, der sich
   tief in eine Sackgasse hineinarbeitet.
   ========================================================================== */

const GITTER_KONFIG = {
  versuche: 60,          // so viele komplette Durchläufe mit anderer Reihenfolge
  runden: 4,             // so oft werden zurückgestellte Wörter erneut versucht
  zielWoerter: 18,       // ab hier ist ein Gitter gut genug
  gewichtKreuzung: 14,   // wie stark zählen zusätzliche Kreuzungen
  gewichtFlaeche: 0.045, // wie stark stört ein größer werdendes Gitter
  gewichtForm: 0.35      // wie stark stört ein sehr längliches Gitter
};

/* ---------------------------------------------------------------------------
   Hilfsfunktionen
   ------------------------------------------------------------------------- */

// Ein Feld wird über "zeile,spalte" angesprochen. Die Zahlen dürfen negativ
// sein — das Gitter wächst zunächst in alle Richtungen und wird erst am Ende
// auf die belegte Fläche zugeschnitten.
function schluessel(zeile, spalte) {
  return zeile + "," + spalte;
}

function mischen(liste, zufall) {
  const kopie = liste.slice();
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

// Ein einfacher, aussaatbarer Zufallsgenerator. Mit derselben Aussaat kommt
// dasselbe Gitter heraus — praktisch zum Nachstellen von Fehlern.
function zufallsGenerator(aussaat) {
  let zustand = aussaat >>> 0;
  return function () {
    zustand = (zustand + 0x6D2B79F5) >>> 0;
    let t = zustand;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------------------------------------------------------------------
   Prüfen, ob ein Wort an einer Stelle liegen darf

   Drei Regeln, alle nötig, damit kein Unsinn entsteht:

   1. Wo das neue Wort ein belegtes Feld überdeckt, muss der Buchstabe
      übereinstimmen. Solche Felder sind die Kreuzungen.
   2. Direkt vor dem ersten und direkt hinter dem letzten Buchstaben muss
      ein Feld frei sein. Sonst würde das neue Wort ein vorhandenes
      verlängern und beide unlesbar machen.
   3. An jedem Feld, das KEINE Kreuzung ist, müssen die beiden seitlichen
      Nachbarn frei sein. Sonst entstünden nebenher Buchstabenfolgen, die
      wie Wörter aussehen, aber keine sind.
      An einer Kreuzung ist das erlaubt — dort gehören die seitlichen
      Nachbarn ja zum kreuzenden Wort.
   ------------------------------------------------------------------------- */

function passt(belegt, wort, zeile, spalte, waagerecht) {
  const dz = waagerecht ? 0 : 1;
  const ds = waagerecht ? 1 : 0;

  let kreuzungen = 0;

  // Regel 2: Felder vor und hinter dem Wort
  if (belegt.has(schluessel(zeile - dz, spalte - ds))) return null;
  if (belegt.has(schluessel(zeile + dz * wort.length, spalte + ds * wort.length))) return null;

  for (let i = 0; i < wort.length; i++) {
    const z = zeile + dz * i;
    const s = spalte + ds * i;
    const vorhanden = belegt.get(schluessel(z, s));

    if (vorhanden !== undefined) {
      // Regel 1
      if (vorhanden !== wort[i]) return null;
      kreuzungen++;
    } else {
      // Regel 3 — seitliche Nachbarn quer zur Laufrichtung
      const seiteA = schluessel(z + ds, s + dz);
      const seiteB = schluessel(z - ds, s - dz);
      if (belegt.has(seiteA) || belegt.has(seiteB)) return null;
    }
  }

  // Ohne Kreuzung hinge das Wort frei im Raum
  if (kreuzungen === 0) return null;

  return kreuzungen;
}

/* ---------------------------------------------------------------------------
   Bewertung einer möglichen Platzierung

   Mehr Kreuzungen sind gut: Das Gitter hält besser zusammen und das Rätsel
   ist interessanter. Ein größer werdendes Gitter ist schlecht, ein sehr
   längliches besonders — ein Rätsel, das 40 Felder breit und 6 hoch ist,
   passt auf keinen Bildschirm.
   ------------------------------------------------------------------------- */

function bewerten(kreuzungen, rahmen, wort, zeile, spalte, waagerecht) {
  const dz = waagerecht ? 0 : 1;
  const ds = waagerecht ? 1 : 0;

  const endZeile = zeile + dz * (wort.length - 1);
  const endSpalte = spalte + ds * (wort.length - 1);

  const neu = {
    oben:   Math.min(rahmen.oben, zeile),
    unten:  Math.max(rahmen.unten, endZeile),
    links:  Math.min(rahmen.links, spalte),
    rechts: Math.max(rahmen.rechts, endSpalte)
  };

  const alteFlaeche = (rahmen.unten - rahmen.oben + 1) * (rahmen.rechts - rahmen.links + 1);
  const neueFlaeche = (neu.unten - neu.oben + 1) * (neu.rechts - neu.links + 1);

  const hoehe = neu.unten - neu.oben + 1;
  const breite = neu.rechts - neu.links + 1;
  const unform = Math.abs(hoehe - breite);

  return kreuzungen * GITTER_KONFIG.gewichtKreuzung
       - (neueFlaeche - alteFlaeche) * GITTER_KONFIG.gewichtFlaeche
       - unform * GITTER_KONFIG.gewichtForm;
}

/* ---------------------------------------------------------------------------
   Ein einzelner Aufbauversuch
   ------------------------------------------------------------------------- */

function einVersuch(woerter, zufall) {
  const belegt = new Map();       // "zeile,spalte" -> Buchstabe
  const gesetzt = [];             // { wort, zeile, spalte, waagerecht }
  const rahmen = { oben: 0, unten: 0, links: 0, rechts: 0 };

  // Das längste Wort kommt zuerst, waagerecht, als Anker
  const sortiert = woerter.slice().sort((a, b) => b.wort.length - a.wort.length);
  const anker = sortiert[0];

  for (let i = 0; i < anker.wort.length; i++) {
    belegt.set(schluessel(0, i), anker.wort[i]);
  }
  gesetzt.push({ ...anker, zeile: 0, spalte: 0, waagerecht: true });
  rahmen.rechts = anker.wort.length - 1;

  // Die übrigen Wörter in gemischter Reihenfolge
  let offen = mischen(sortiert.slice(1), zufall);

  for (let runde = 0; runde < GITTER_KONFIG.runden && offen.length > 0; runde++) {
    const zurueckgestellt = [];

    for (const eintrag of offen) {
      const wort = eintrag.wort;
      let beste = null;

      // Jede Kreuzungsmöglichkeit mit jedem bereits gesetzten Wort prüfen
      for (const vorhanden of gesetzt) {
        const vdz = vorhanden.waagerecht ? 0 : 1;
        const vds = vorhanden.waagerecht ? 1 : 0;

        for (let vi = 0; vi < vorhanden.wort.length; vi++) {
          const buchstabe = vorhanden.wort[vi];
          const z = vorhanden.zeile + vdz * vi;
          const s = vorhanden.spalte + vds * vi;

          // Wo taucht dieser Buchstabe im neuen Wort auf?
          for (let ni = 0; ni < wort.length; ni++) {
            if (wort[ni] !== buchstabe) continue;

            // Das neue Wort läuft quer zum vorhandenen
            const neuWaagerecht = !vorhanden.waagerecht;
            const startZeile = neuWaagerecht ? z : z - ni;
            const startSpalte = neuWaagerecht ? s - ni : s;

            const kreuzungen = passt(belegt, wort, startZeile, startSpalte, neuWaagerecht);
            if (kreuzungen === null) continue;

            const punkte = bewerten(kreuzungen, rahmen, wort, startZeile, startSpalte, neuWaagerecht);
            if (!beste || punkte > beste.punkte) {
              beste = { punkte, zeile: startZeile, spalte: startSpalte, waagerecht: neuWaagerecht };
            }
          }
        }
      }

      if (!beste) {
        // Kein Platz — zurückstellen und in der nächsten Runde erneut versuchen.
        // Bis dahin sind andere Wörter gesetzt, die neue Kreuzungen anbieten.
        zurueckgestellt.push(eintrag);
        continue;
      }

      const dz = beste.waagerecht ? 0 : 1;
      const ds = beste.waagerecht ? 1 : 0;
      for (let i = 0; i < wort.length; i++) {
        belegt.set(schluessel(beste.zeile + dz * i, beste.spalte + ds * i), wort[i]);
      }
      gesetzt.push({ ...eintrag, zeile: beste.zeile, spalte: beste.spalte, waagerecht: beste.waagerecht });

      rahmen.oben = Math.min(rahmen.oben, beste.zeile);
      rahmen.links = Math.min(rahmen.links, beste.spalte);
      rahmen.unten = Math.max(rahmen.unten, beste.zeile + dz * (wort.length - 1));
      rahmen.rechts = Math.max(rahmen.rechts, beste.spalte + ds * (wort.length - 1));
    }

    offen = zurueckgestellt;
  }

  return { gesetzt, rahmen, belegt };
}

/* ---------------------------------------------------------------------------
   Zuschneiden und Nummerieren

   Nach dem Aufbau liegen die Felder in einem Koordinatensystem mit negativen
   Zahlen. Hier wird alles so verschoben, dass links oben (0,0) liegt.

   Die Nummerierung folgt der üblichen Regel: Das Gitter wird zeilenweise von
   links oben nach rechts unten durchgegangen. Beginnt an einem Feld ein Wort
   (waagerecht oder senkrecht), bekommt es die nächste freie Nummer. Ein Feld,
   an dem beide Richtungen beginnen, bekommt nur EINE Nummer für beide.
   ------------------------------------------------------------------------- */

function fertigstellen(versuch) {
  const { gesetzt, rahmen } = versuch;

  const zeilen = rahmen.unten - rahmen.oben + 1;
  const spalten = rahmen.rechts - rahmen.links + 1;

  const verschoben = gesetzt.map(e => ({
    ...e,
    zeile: e.zeile - rahmen.oben,
    spalte: e.spalte - rahmen.links
  }));

  // Nummern vergeben
  const startFelder = new Map();  // "z,s" -> Nummer
  const sortiert = verschoben.slice().sort((a, b) =>
    a.zeile - b.zeile || a.spalte - b.spalte);

  let naechsteNummer = 1;
  for (const eintrag of sortiert) {
    const k = schluessel(eintrag.zeile, eintrag.spalte);
    if (!startFelder.has(k)) {
      startFelder.set(k, naechsteNummer++);
    }
    eintrag.nummer = startFelder.get(k);
  }

  // Buchstabenkarte für die Lösung
  const loesung = new Map();
  for (const e of verschoben) {
    const dz = e.waagerecht ? 0 : 1;
    const ds = e.waagerecht ? 1 : 0;
    for (let i = 0; i < e.wort.length; i++) {
      loesung.set(schluessel(e.zeile + dz * i, e.spalte + ds * i), e.wort[i]);
    }
  }

  return {
    zeilen,
    spalten,
    eintraege: verschoben.sort((a, b) => a.nummer - b.nummer),
    loesung
  };
}

/* ---------------------------------------------------------------------------
   Die eigentliche Schnittstelle nach außen
   ------------------------------------------------------------------------- */

function gitterBauen(woerter, aussaat = Date.now()) {
  if (!woerter || woerter.length < 3) {
    throw new Error("Mindestens drei Wörter nötig.");
  }

  let bestes = null;

  for (let v = 0; v < GITTER_KONFIG.versuche; v++) {
    const zufall = zufallsGenerator(aussaat + v * 7919);
    const versuch = einVersuch(woerter, zufall);

    const anzahl = versuch.gesetzt.length;
    const hoehe = versuch.rahmen.unten - versuch.rahmen.oben + 1;
    const breite = versuch.rahmen.rechts - versuch.rahmen.links + 1;
    const flaeche = hoehe * breite;

    // Bewertung eines ganzen Versuchs: zuerst zählt die Zahl der Wörter,
    // bei Gleichstand das kompaktere Gitter.
    const guete = anzahl * 1000 - flaeche;

    if (!bestes || guete > bestes.guete) {
      bestes = { versuch, guete, anzahl };
    }

    // Früher Abbruch, sobald das Ziel erreicht und das Gitter kompakt ist
    if (anzahl >= GITTER_KONFIG.zielWoerter && flaeche < anzahl * 26) break;
  }

  return fertigstellen(bestes.versuch);
}

/* Damit die Datei sowohl im Browser als auch in einer Prüfumgebung läuft */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { gitterBauen, GITTER_KONFIG, schluessel };
}
