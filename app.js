/* ============================================================================
   app.js — Anzeige und Bedienung

   Hier wird das Gitter gezeichnet, auf Klicks und Tasten reagiert und der
   Spielstand sichtbar gemacht.
   ========================================================================== */

/* ---------- Elemente ---------- */

const elStart      = document.getElementById("start");
const elSpiel      = document.getElementById("spiel");
const elEnde       = document.getElementById("ende");

const elGitter     = document.getElementById("gitter");
const elFang       = document.getElementById("tastaturfang");
const elAktivNr    = document.getElementById("aktiv-nummer");
const elAktivText  = document.getElementById("aktiv-text");
const elListeW     = document.getElementById("liste-waagerecht");
const elListeS     = document.getElementById("liste-senkrecht");
const elFortschritt= document.getElementById("fortschritt");
const elLeisteGeb  = document.getElementById("leiste-gebiet");
const elLeisteStufe= document.getElementById("leiste-stufe");
const elStufenNotiz= document.getElementById("stufen-notiz");

const elHinweisKnopf = document.getElementById("hinweis-knopf");
const elPruefenKnopf = document.getElementById("pruefen-knopf");

/* ---------- Zustand der Anzeige ---------- */

let spiel = null;
let gewaehltesGebiet = "gemischt";
let gewaehlteStufe = "mittel";

let aktiverEintrag = null;   // Objekt aus spiel.eintraege
let cursor = null;           // { zeile, spalte }
let zellen = new Map();      // "z,s" -> { el, eintraege: [id] }

/* ============================================================================
   Startbildschirm
   ========================================================================== */

document.querySelectorAll("[data-gebiet]").forEach(knopf => {
  knopf.addEventListener("click", () => {
    document.querySelectorAll("[data-gebiet]").forEach(k =>
      k.setAttribute("aria-checked", String(k === knopf)));
    gewaehltesGebiet = knopf.dataset.gebiet;
  });
});

document.querySelectorAll("[data-stufe]").forEach(knopf => {
  knopf.addEventListener("click", () => {
    document.querySelectorAll("[data-stufe]").forEach(k =>
      k.setAttribute("aria-checked", String(k === knopf)));
    gewaehlteStufe = knopf.dataset.stufe;
    elStufenNotiz.textContent = gewaehlteStufe === "leicht"
      ? "Die ersten beiden Hinweisstufen sind gratis."
      : "Die erste Hinweisstufe ist gratis.";
  });
});

document.getElementById("starten").addEventListener("click", spielStarten);
document.getElementById("nochmal").addEventListener("click", () => {
  elEnde.hidden = true;
  elStart.hidden = false;
  bestenlisteZeichnen();
});

document.getElementById("liste-leeren").addEventListener("click", () => {
  if (!confirm("Alle gespeicherten Ergebnisse löschen?")) return;
  bestenlisteLeeren();
  bestenlisteZeichnen();
});

document.getElementById("aufgeben").addEventListener("click", () => {
  if (!confirm("Rätsel beenden und auswerten?")) return;
  beenden();
});

/* ============================================================================
   Ein Rätsel aufbauen
   ========================================================================== */

const elLade = document.getElementById("ladezustand");
const elQuelle = document.getElementById("quellenhinweis");
const elStartKnopf = document.getElementById("starten");

const elErneuern = document.getElementById("vorrat-erneuern");

elErneuern.addEventListener("click", async () => {
  // vorratVerwerfen sagt nein, wenn gerade schon ein Abruf läuft
  if (!vorratVerwerfen()) {
    elLade.hidden = false;
    elLade.textContent = "Es läuft bereits ein Ladevorgang. Einen Moment bitte.";
    return;
  }
  elQuelle.hidden = true;
  await vorratVorbereiten();
});

// Holt den Vorrat und hält dabei den Ladezustand aktuell.
async function vorratVorbereiten() {
  elStartKnopf.disabled = true;
  elErneuern.disabled = true;
  elLade.hidden = false;
  elLade.textContent = "Fragen werden geladen. Das dauert nur beim ersten Mal.";

  const vorrat = await vorratHolen((name, nummer, gesamt) => {
    elLade.textContent = `Fragen werden geladen (${nummer} von ${gesamt}): ${name}. ` +
                         `Das dauert nur beim ersten Mal.`;
  });

  elLade.hidden = true;
  elStartKnopf.disabled = false;
  elErneuern.disabled = false;

  if (vorrat.ausNotfall) {
    elQuelle.hidden = false;
    elQuelle.textContent =
      "Wikidata war gerade nicht erreichbar. Gespielt wird mit der eingebauten " +
      "Fragensammlung — etwas kleiner, aber vollständig spielbar.";
  } else {
    elQuelle.hidden = false;
    elQuelle.textContent = `${vorrat.length} Fragen bereit.`;
  }

  return vorrat;
}

async function spielStarten() {
  const vorrat = await vorratVorbereiten();

  const fragen = fragenWaehlen(vorrat, gewaehltesGebiet, gewaehlteStufe,
                               SPIEL_KONFIG.woerterAnfragen);

  if (fragen.length < 3) {
    elQuelle.hidden = false;
    elQuelle.textContent = "Für diese Auswahl liegen zu wenige Fragen vor. Wähl ein anderes Gebiet.";
    return;
  }

  const gitter = gitterBauen(fragen);
  spiel = spielAnlegen(gitter, gewaehltesGebiet, gewaehlteStufe);

  elLeisteGeb.textContent = GEBIET_NAMEN[spiel.gebiet];
  elLeisteStufe.textContent = STUFEN_NAMEN[spiel.schwierigkeit];

  elStart.hidden = true;
  elEnde.hidden = true;
  elSpiel.hidden = false;

  gitterZeichnen();
  hinweiseZeichnen();
  ersteZelleWaehlen();
  fortschrittZeigen();
}

/* ---------------------------------------------------------------------------
   Gitter zeichnen
   ------------------------------------------------------------------------- */

function gitterZeichnen() {
  elGitter.innerHTML = "";
  zellen.clear();

  const g = spiel.gitter;
  elGitter.style.setProperty("--spalten", g.spalten);
  elGitter.style.setProperty("--zeilen", g.zeilen);

  // Welche Wörter laufen durch welches Feld?
  const zuordnung = new Map();
  for (const eintrag of spiel.eintraege) {
    for (const feld of wortFelder(eintrag)) {
      if (!zuordnung.has(feld)) zuordnung.set(feld, []);
      zuordnung.get(feld).push(eintrag.id);
    }
  }

  // Nummern an den Wortanfängen
  const nummern = new Map();
  for (const eintrag of spiel.eintraege) {
    const k = eintrag.zeile + "," + eintrag.spalte;
    if (!nummern.has(k)) nummern.set(k, eintrag.nummer);
  }

  for (let z = 0; z < g.zeilen; z++) {
    for (let s = 0; s < g.spalten; s++) {
      const feld = z + "," + s;
      const gehoert = zuordnung.get(feld);

      const zelle = document.createElement("div");

      if (!gehoert) {
        zelle.className = "zelle leer";
        zelle.setAttribute("aria-hidden", "true");
        elGitter.appendChild(zelle);
        continue;
      }

      zelle.className = "zelle";
      zelle.dataset.feld = feld;
      zelle.setAttribute("role", "gridcell");

      if (nummern.has(feld)) {
        const nr = document.createElement("span");
        nr.className = "zellnummer";
        nr.textContent = nummern.get(feld);
        zelle.appendChild(nr);
      }

      const buchstabe = document.createElement("span");
      buchstabe.className = "zellbuchstabe";
      zelle.appendChild(buchstabe);

      zelle.addEventListener("pointerdown", e => {
        e.preventDefault();
        zelleAnklicken(z, s);
      });

      elGitter.appendChild(zelle);
      zellen.set(feld, { el: zelle, eintraege: gehoert });
    }
  }

  zellgroesseSetzen();
}

// Die Schriftgröße im Gitter richtet sich nach der tatsächlichen Feldgröße.
function zellgroesseSetzen() {
  if (!spiel) return;
  const breite = elGitter.clientWidth;
  const feld = breite / spiel.gitter.spalten;
  elGitter.style.setProperty("--zellschrift", (feld * 0.52).toFixed(1) + "px");
  elGitter.style.setProperty("--nummerschrift", Math.max(7, feld * 0.26).toFixed(1) + "px");
}

window.addEventListener("resize", zellgroesseSetzen);

/* ---------------------------------------------------------------------------
   Auswahl und Cursor
   ------------------------------------------------------------------------- */

function ersteZelleWaehlen() {
  const ersterWaagerecht = spiel.eintraege.find(e => e.waagerecht) || spiel.eintraege[0];
  aktiverEintrag = ersterWaagerecht;
  cursor = { zeile: ersterWaagerecht.zeile, spalte: ersterWaagerecht.spalte };
  anzeigeAuffrischen();
}

function zelleAnklicken(zeile, spalte) {
  const feld = zeile + "," + spalte;
  const info = zellen.get(feld);
  if (!info) return;

  const moegliche = info.eintraege.map(id => spiel.eintraege[id]);

  if (cursor && cursor.zeile === zeile && cursor.spalte === spalte && moegliche.length > 1) {
    // Erneuter Klick auf dasselbe Feld wechselt die Richtung
    const andere = moegliche.find(e => e !== aktiverEintrag);
    if (andere) aktiverEintrag = andere;
  } else {
    // Wenn möglich die bisherige Richtung beibehalten
    const gleicheRichtung = moegliche.find(e =>
      aktiverEintrag && e.waagerecht === aktiverEintrag.waagerecht);
    aktiverEintrag = gleicheRichtung || moegliche[0];
  }

  cursor = { zeile, spalte };
  anzeigeAuffrischen();
  tastaturHolen();
}

function tastaturHolen() {
  // Auf dem Handy öffnet das die Bildschirmtastatur
  elFang.focus({ preventScroll: true });
}

function cursorVerschieben(schritte) {
  if (!aktiverEintrag) return;
  const felder = wortFelder(aktiverEintrag);
  const jetzt = felder.indexOf(cursor.zeile + "," + cursor.spalte);
  const ziel = Math.min(felder.length - 1, Math.max(0, jetzt + schritte));
  const [z, s] = felder[ziel].split(",").map(Number);
  cursor = { zeile: z, spalte: s };
}

function naechstesFreiesFeld() {
  const felder = wortFelder(aktiverEintrag);
  const jetzt = felder.indexOf(cursor.zeile + "," + cursor.spalte);
  for (let i = jetzt + 1; i < felder.length; i++) {
    if (!spiel.eingaben.get(felder[i])) {
      const [z, s] = felder[i].split(",").map(Number);
      cursor = { zeile: z, spalte: s };
      return;
    }
  }
  cursorVerschieben(1);
}

function wortWechseln(richtung) {
  const liste = spiel.eintraege;
  const jetzt = liste.indexOf(aktiverEintrag);
  const naechster = liste[(jetzt + richtung + liste.length) % liste.length];
  aktiverEintrag = naechster;
  cursor = { zeile: naechster.zeile, spalte: naechster.spalte };
}

function freiBewegen(dz, ds) {
  let z = cursor.zeile, s = cursor.spalte;
  for (let i = 0; i < 40; i++) {
    z += dz; s += ds;
    if (z < 0 || s < 0 || z >= spiel.gitter.zeilen || s >= spiel.gitter.spalten) return;
    const info = zellen.get(z + "," + s);
    if (info) {
      cursor = { zeile: z, spalte: s };
      // Richtung passend zur Bewegung wählen, wenn möglich
      const wunsch = dz === 0;
      const passend = info.eintraege.map(id => spiel.eintraege[id])
                                    .find(e => e.waagerecht === wunsch);
      if (passend) aktiverEintrag = passend;
      else if (!info.eintraege.includes(aktiverEintrag.id)) {
        aktiverEintrag = spiel.eintraege[info.eintraege[0]];
      }
      return;
    }
  }
}

/* ---------------------------------------------------------------------------
   Tastatur

   Zwei Wege, weil sich Rechner und Handy unterscheiden. Am Rechner liefert
   keydown den Buchstaben direkt. Auf dem Handy melden viele Bildschirm-
   tastaturen dort nur "Unidentified" — dort greift stattdessen das
   input-Ereignis des versteckten Eingabefelds.
   ------------------------------------------------------------------------- */

elFang.addEventListener("keydown", e => {
  if (!spiel || spiel.beendet) return;

  if (e.key === "Backspace") {
    e.preventDefault();
    const feld = cursor.zeile + "," + cursor.spalte;
    if (spiel.eingaben.get(feld)) {
      spiel.eingaben.delete(feld);
    } else {
      cursorVerschieben(-1);
      spiel.eingaben.delete(cursor.zeile + "," + cursor.spalte);
    }
    spiel.falschMarkiert.delete(cursor.zeile + "," + cursor.spalte);
    anzeigeAuffrischen();
    return;
  }

  if (e.key === "Tab") {
    e.preventDefault();
    wortWechseln(e.shiftKey ? -1 : 1);
    anzeigeAuffrischen();
    return;
  }

  if (e.key === "ArrowLeft")  { e.preventDefault(); freiBewegen(0, -1); anzeigeAuffrischen(); return; }
  if (e.key === "ArrowRight") { e.preventDefault(); freiBewegen(0,  1); anzeigeAuffrischen(); return; }
  if (e.key === "ArrowUp")    { e.preventDefault(); freiBewegen(-1, 0); anzeigeAuffrischen(); return; }
  if (e.key === "ArrowDown")  { e.preventDefault(); freiBewegen( 1, 0); anzeigeAuffrischen(); return; }

  if (e.key === " ") {
    // Leertaste wechselt die Richtung, wie in gedruckten Rätseln üblich
    e.preventDefault();
    const info = zellen.get(cursor.zeile + "," + cursor.spalte);
    if (info && info.eintraege.length > 1) {
      const andere = info.eintraege.map(id => spiel.eintraege[id])
                                   .find(e2 => e2 !== aktiverEintrag);
      if (andere) aktiverEintrag = andere;
    }
    anzeigeAuffrischen();
    return;
  }

  if (/^[a-zA-ZäöüÄÖÜ]$/.test(e.key)) {
    e.preventDefault();
    buchstabeSetzen(e.key);
  }
});

elFang.addEventListener("input", () => {
  const wert = elFang.value;
  elFang.value = "";
  if (!wert || !spiel || spiel.beendet) return;
  const letzter = wert[wert.length - 1];
  if (/^[a-zA-ZäöüÄÖÜ]$/.test(letzter)) buchstabeSetzen(letzter);
});

function buchstabeSetzen(zeichen) {
  // Ein getipptes Ä wird zu AE — im Gitter steht also A, dann E.
  const umgewandelt = antwortNormalisieren(zeichen);
  if (!umgewandelt) return;

  for (const buchstabe of umgewandelt) {
    const feld = cursor.zeile + "," + cursor.spalte;
    spiel.eingaben.set(feld, buchstabe);
    spiel.falschMarkiert.delete(feld);
    naechstesFreiesFeld();
  }

  anzeigeAuffrischen();

  if (gitterVoll(spiel)) beenden();
}

/* ---------------------------------------------------------------------------
   Anzeige auffrischen
   ------------------------------------------------------------------------- */

function anzeigeAuffrischen() {
  const aktiveFelder = new Set(aktiverEintrag ? wortFelder(aktiverEintrag) : []);
  const cursorFeld = cursor ? cursor.zeile + "," + cursor.spalte : null;

  for (const [feld, info] of zellen) {
    const el = info.el;
    const buchstabe = spiel.eingaben.get(feld) || "";
    el.querySelector(".zellbuchstabe").textContent = buchstabe;

    el.classList.toggle("gefuellt", !!buchstabe);
    el.classList.toggle("wortaktiv", aktiveFelder.has(feld));
    el.classList.toggle("feldaktiv", feld === cursorFeld);
    el.classList.toggle("falsch", spiel.falschMarkiert.has(feld));

    const geloest = info.eintraege.some(id => spiel.geloest.has(id));
    el.classList.toggle("geloest", geloest);
  }

  // Aktiver Hinweis
  if (aktiverEintrag) {
    elAktivNr.textContent = aktiverEintrag.nummer +
      (aktiverEintrag.waagerecht ? " waagerecht" : " senkrecht");
    elAktivText.textContent = aktiverEintrag.hinweise[aktiverEintrag.stufe - 1];
    elHinweisKnopf.disabled = aktiverEintrag.stufe >= 3;
    elHinweisKnopf.textContent = aktiverEintrag.stufe >= 3
      ? "Kein weiterer Hinweis"
      : `Hinweis schärfen (−${aktiverEintrag.stufe === 1
          ? SPIEL_KONFIG.kostenStufe2 : SPIEL_KONFIG.kostenStufe3})`;
  }

  hinweiseAuffrischen();
  fortschrittZeigen();

  // Aktives Feld sichtbar halten, wichtig bei offener Bildschirmtastatur
  const aktiveZelle = cursorFeld && zellen.get(cursorFeld);
  if (aktiveZelle) aktiveZelle.el.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function fortschrittZeigen() {
  const felder = [...spiel.gitter.loesung.keys()];
  const gefuellt = felder.filter(f => spiel.eingaben.get(f)).length;
  elFortschritt.textContent = `${gefuellt} von ${felder.length} Feldern`;
}

/* ---------------------------------------------------------------------------
   Hinweislisten
   ------------------------------------------------------------------------- */

function hinweiseZeichnen() {
  elListeW.innerHTML = "";
  elListeS.innerHTML = "";

  for (const eintrag of spiel.eintraege) {
    const li = document.createElement("li");
    li.dataset.id = eintrag.id;

    const nr = document.createElement("span");
    nr.className = "hinweis-nummer";
    nr.textContent = eintrag.nummer;

    const text = document.createElement("span");
    text.className = "hinweis-text";

    const stufen = document.createElement("span");
    stufen.className = "hinweis-stufen";

    li.append(nr, text, stufen);
    li.addEventListener("click", () => {
      aktiverEintrag = eintrag;
      cursor = { zeile: eintrag.zeile, spalte: eintrag.spalte };
      anzeigeAuffrischen();
      tastaturHolen();
    });

    (eintrag.waagerecht ? elListeW : elListeS).appendChild(li);
  }

  hinweiseAuffrischen();
}

function hinweiseAuffrischen() {
  document.querySelectorAll(".hinweisliste li").forEach(li => {
    const eintrag = spiel.eintraege[Number(li.dataset.id)];
    li.querySelector(".hinweis-text").textContent = eintrag.hinweise[eintrag.stufe - 1];
    li.classList.toggle("aktiv", eintrag === aktiverEintrag);
    li.classList.toggle("fertig", spiel.geloest.has(eintrag.id));

    // Punkte statt Sterne: gefüllte Punkte zeigen die erreichte Stufe
    const stufen = li.querySelector(".hinweis-stufen");
    stufen.textContent = "•".repeat(eintrag.stufe) + "◦".repeat(3 - eintrag.stufe);
    stufen.title = `Hinweisstufe ${eintrag.stufe} von 3`;
  });
}

/* ---------------------------------------------------------------------------
   Werkzeuge
   ------------------------------------------------------------------------- */

elHinweisKnopf.addEventListener("click", () => {
  if (!aktiverEintrag) return;
  if (hinweisSchaerfen(spiel, aktiverEintrag.id)) anzeigeAuffrischen();
  tastaturHolen();
});

elPruefenKnopf.addEventListener("click", () => {
  pruefen(spiel);
  anzeigeAuffrischen();
  tastaturHolen();
});

elPruefenKnopf.textContent = "Prüfen";

/* ---------------------------------------------------------------------------
   Abschluss
   ------------------------------------------------------------------------- */

function beenden() {
  spiel.beendet = true;
  const ergebnis = auswerten(spiel);
  const platz = bestenlisteEintragen(ergebnis, spiel);

  document.getElementById("ende-zeile").textContent =
    ergebnis.falsche.length === 0 ? "Vollständig gelöst" : "Rätsel beendet";

  document.getElementById("ende-punkte").textContent = ergebnis.gesamt;

  const teile = [
    `${ergebnis.richtige.length} von ${spiel.eintraege.length} Wörtern richtig`,
    `${ergebnis.rohpunkte} Punkte erspielt`,
    `${ergebnis.abzug} abgezogen für ${ergebnis.hinweiseVerbraucht} Hinweise und ${ergebnis.pruefungen} Prüfungen`
  ];
  if (platz === 0) teile.push("Das ist dein bestes Ergebnis bisher.");
  document.getElementById("ende-notiz").textContent = teile.join(" · ");

  const fehlerliste = document.getElementById("fehlerliste");
  fehlerliste.innerHTML = "";
  for (const eintrag of ergebnis.falsche) {
    const li = document.createElement("li");
    const wort = document.createElement("b");
    wort.textContent = eintrag.antwort;
    const hinweis = document.createElement("span");
    hinweis.textContent = " — " + eintrag.hinweise[2];
    li.append(wort, hinweis);
    fehlerliste.appendChild(li);
  }

  elSpiel.hidden = true;
  elEnde.hidden = false;
}

/* ---------------------------------------------------------------------------
   Bestenliste anzeigen
   ------------------------------------------------------------------------- */

function bestenlisteZeichnen() {
  const liste = bestenlisteLaden();
  const kasten = document.getElementById("bestenliste-start");
  const ol = document.getElementById("bestenliste-liste");

  if (liste.length === 0) { kasten.hidden = true; return; }

  kasten.hidden = false;
  ol.innerHTML = "";

  liste.forEach(e => {
    const li = document.createElement("li");
    const punkte = document.createElement("b");
    punkte.textContent = e.punkte;
    const info = document.createElement("span");
    info.textContent = `${GEBIET_NAMEN[e.gebiet]}, ${STUFEN_NAMEN[e.schwierigkeit]} · ` +
                       `${e.woerter} von ${e.gesamtWoerter} Wörtern · ${e.datum}`;
    li.append(punkte, info);
    ol.appendChild(li);
  });
}

/* ---------------------------------------------------------------------------
   Start
   ------------------------------------------------------------------------- */

bestenlisteZeichnen();

// Den Vorrat gleich beim Öffnen holen, nicht erst beim Klick auf Start.
// Wer sich den Startbildschirm noch ansieht, wartet dadurch nicht.
vorratVorbereiten();
