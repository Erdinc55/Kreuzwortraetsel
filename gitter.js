const GITTER_KONFIG = {
  versuche: 60, 
  runden: 4,            
  zielWoerter: 18,       
  gewichtKreuzung: 14,  
  gewichtFlaeche: 0.045, 
  gewichtForm: 0.35    
};

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

function passt(belegt, wort, zeile, spalte, waagerecht) {
  const dz = waagerecht ? 0 : 1;
  const ds = waagerecht ? 1 : 0;

  let kreuzungen = 0;

  if (belegt.has(schluessel(zeile - dz, spalte - ds))) return null;
  if (belegt.has(schluessel(zeile + dz * wort.length, spalte + ds * wort.length))) return null;

  for (let i = 0; i < wort.length; i++) {
    const z = zeile + dz * i;
    const s = spalte + ds * i;
    const vorhanden = belegt.get(schluessel(z, s));

    if (vorhanden !== undefined) {
      if (vorhanden !== wort[i]) return null;
      kreuzungen++;
    } else {
      const seiteA = schluessel(z + ds, s + dz);
      const seiteB = schluessel(z - ds, s - dz);
      if (belegt.has(seiteA) || belegt.has(seiteB)) return null;
    }
  }

  if (kreuzungen === 0) return null;

  return kreuzungen;
}

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

function einVersuch(woerter, zufall) {
  const belegt = new Map();  
  const gesetzt = [];          
  const rahmen = { oben: 0, unten: 0, links: 0, rechts: 0 };

  const sortiert = woerter.slice().sort((a, b) => b.wort.length - a.wort.length);
  const anker = sortiert[0];

  for (let i = 0; i < anker.wort.length; i++) {
    belegt.set(schluessel(0, i), anker.wort[i]);
  }
  gesetzt.push({ ...anker, zeile: 0, spalte: 0, waagerecht: true });
  rahmen.rechts = anker.wort.length - 1;

  let offen = mischen(sortiert.slice(1), zufall);

  for (let runde = 0; runde < GITTER_KONFIG.runden && offen.length > 0; runde++) {
    const zurueckgestellt = [];

    for (const eintrag of offen) {
      const wort = eintrag.wort;
      let beste = null;

      for (const vorhanden of gesetzt) {
        const vdz = vorhanden.waagerecht ? 0 : 1;
        const vds = vorhanden.waagerecht ? 1 : 0;

        for (let vi = 0; vi < vorhanden.wort.length; vi++) {
          const buchstabe = vorhanden.wort[vi];
          const z = vorhanden.zeile + vdz * vi;
          const s = vorhanden.spalte + vds * vi;

          for (let ni = 0; ni < wort.length; ni++) {
            if (wort[ni] !== buchstabe) continue;

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

function fertigstellen(versuch) {
  const { gesetzt, rahmen } = versuch;

  const zeilen = rahmen.unten - rahmen.oben + 1;
  const spalten = rahmen.rechts - rahmen.links + 1;

  const verschoben = gesetzt.map(e => ({
    ...e,
    zeile: e.zeile - rahmen.oben,
    spalte: e.spalte - rahmen.links
  }));

  const startFelder = new Map();
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

    const guete = anzahl * 1000 - flaeche;

    if (!bestes || guete > bestes.guete) {
      bestes = { versuch, guete, anzahl };
    }

    if (anzahl >= GITTER_KONFIG.zielWoerter && flaeche < anzahl * 26) break;
  }

  return fertigstellen(bestes.versuch);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { gitterBauen, GITTER_KONFIG, schluessel };
}
