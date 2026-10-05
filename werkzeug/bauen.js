/* ============================================================================
   werkzeug/bauen.js — erzeugt ../fragen-wikidata.js aus rohdaten.json

   Aufruf (im Ordner werkzeug):   node bauen.js

   Die Rohdaten stammen aus den Abfragen in abfragen.md. Dieses Skript läuft
   nur auf dem eigenen Rechner, nie im Browser der Besucher. Es macht aus
   jeder Zeile eine Rätselfrage mit drei Hinweisstufen.

   Warum ein eigener Schritt statt Abfrage im Browser: Siehe Issue #1 und #2.
   Der Abfragedienst von Wikidata ist für Live-Anfragen aus fremden Browsern
   zu unzuverlässig. Einmal sauber abgefragt und als Datei mitgeliefert,
   funktioniert das Rätsel immer und sofort.
   ========================================================================== */

const fs = require("fs");
const path = require("path");

const roh = JSON.parse(fs.readFileSync(path.join(__dirname, "rohdaten.json"), "utf8"));

/* ---------------------------------------------------------------------------
   Hilfsfunktionen
   ------------------------------------------------------------------------- */

function normalisieren(text) {
  return text
    .replace(/Ä/g, "AE").replace(/ä/g, "ae")
    .replace(/Ö/g, "OE").replace(/ö/g, "oe")
    .replace(/Ü/g, "UE").replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toUpperCase().replace(/[^A-Z]/g, "");
}

function zahl(n) {
  return Math.round(n).toLocaleString("de-DE");
}

function einwohner(n) {
  if (n >= 1e6) {
    const mio = (n / 1e6).toLocaleString("de-DE", { maximumFractionDigits: 1 });
    return `Rund ${mio} Millionen Einwohner`;
  }
  if (n >= 10000) return `Rund ${zahl(Math.round(n / 1000) * 1000)} Einwohner`;
  return `Nur rund ${zahl(n)} Einwohner`;
}

function jahr(j) {
  return j < 0 ? `${-j} v. Chr.` : String(j);
}

function jahrhundert(j) {
  const n = Math.ceil(Math.abs(j) / 100) || 1;
  return j < 0 ? `${n}. Jahrhundert v. Chr.` : `${n}. Jahrhundert`;
}

function ordnungsBereich(n) {
  const von = Math.floor((n - 1) / 10) * 10 + 1;
  return `${von} bis ${von + 9}`;
}

/* Bekanntheit relativ zur eigenen Gruppe: das bekannteste Drittel ist
   Stufe 1, das mittlere Stufe 2, der Rest Stufe 3. Ein fester Schwellwert
   für alle Gebiete passt nicht — fast jede Hauptstadt hat über hundert
   Wikipedia-Artikel, kaum ein Nebenfluss. */
function bekanntheitNachRang(eintraege) {
  const sortiert = eintraege.slice().sort((a, b) => b._artikel - a._artikel);
  sortiert.forEach((e, i) => {
    const anteil = i / sortiert.length;
    e.bekanntheit = anteil < 0.35 ? 1 : anteil < 0.7 ? 2 : 3;
  });
  return eintraege;
}

/* Staatsnamen, die in den Daten amtlich-umständlich oder historisch sind */
const LAENDER = {
  "Königreich der Niederlande": "Niederlande",
  "Königreich Dänemark": "Dänemark",
  "Vereinigtes Königreich Großbritannien und Irland": "Vereinigtes Königreich",
  "NS-Staat": "Deutsches Reich",
  "Geschichte Pisas": "Republik Pisa",
  "Naoero": "Nauru"
};
const land = l => LAENDER[l] || l;

/* ---------------------------------------------------------------------------
   Elemente
   ------------------------------------------------------------------------- */

const elemente = roh.elemente.map(([name, oz, symbol, artikel]) => ({
  antwort: name,
  gebiet: "natur",
  hinweise: [
    `Ein chemisches Element, Ordnungszahl ${ordnungsBereich(oz)}`,
    `Ordnungszahl genau ${oz}`,
    `Chemisches Symbol ${symbol}`
  ],
  _artikel: artikel
}));

/* ---------------------------------------------------------------------------
   Hauptstädte
   ------------------------------------------------------------------------- */

// Rawalpindi ist nicht die Hauptstadt Pakistans, Aden nur vorübergehend
// die des Jemen — beides Datenfehler, die im Rätsel falsch wären.
const KEINE_HAUPTSTADT = new Set(["Rawalpindi", "Aden"]);

const hauptstaedte = roh.hauptstaedte
  .filter(([name]) => !KEINE_HAUPTSTADT.has(name))
  .map(([name, l, kontinent, ew, artikel]) => {
    const staat = land(l);
    // Bei Stadtstaaten würde "Land: Singapur" die Antwort verraten
    const dritte = normalisieren(staat) === normalisieren(name)
      ? "Stadtstaat: Land und Hauptstadt tragen denselben Namen"
      : `Land: ${staat}`;
    return {
      antwort: name,
      gebiet: "geografie",
      hinweise: [`Eine Hauptstadt in ${kontinent}`, einwohner(ew), dritte],
      _artikel: artikel
    };
  });

/* ---------------------------------------------------------------------------
   Flüsse
   ------------------------------------------------------------------------- */

const fluesse = roh.fluesse.map(([name, laenge, muendung, l, laender, artikel]) => ({
  antwort: name,
  gebiet: "geografie",
  hinweise: [
    // Bei mehreren Ländern sagt die Zahl mehr als ein zufällig gezogenes Land.
    // Sonst würde die Garonne zum "Fluss in Spanien" und der Nil zum
    // "Fluss in Burundi" — formal richtig, als Hinweis aber irreführend.
    laender > 1 ? `Ein Fluss, der durch ${laender} Länder fließt` : `Ein Fluss in ${land(l)}`,
    `${zahl(laenge)} km lang`,
    `Mündung: ${muendung}`
  ],
  _artikel: artikel
}));

/* ---------------------------------------------------------------------------
   Personen und Kunstschaffende

   Für beide gilt: Lange Namen wurden schon bei der Abfrage auf den Nachnamen
   verkürzt, der Vorname liegt getrennt vor. Diese Regel liegt bei einigen
   Namen daneben — sie werden hier von Hand richtiggestellt.
   ------------------------------------------------------------------------- */

const NAMEN = {
  "Vinci": ["Leonardo", null],
  "Rijn": ["Rembrandt", null],
  "Hippo": ["Augustinus", null],
  "Ältere": ["Dumas", "Alexandre"],
  "Rotterdam": ["Erasmus", null],
  "Yasunari": ["Kawabata", "Yasunari"],
  "Bartholdy": ["Mendelssohn", "Felix"],
  "Shikibu": ["Murasaki", null],
  "Llosa": ["Vargas Llosa", "Mario"],
  "Márquez": ["García Márquez", "Gabriel"],
  "Lorca": ["García Lorca", "Federico"],
  "Große": ["Alexander", null],
  "Eresos": ["Theophrastos", null],
  "Saud": ["Ibn Saud", "Abd al-Aziz"],
  "Waals": ["van der Waals", "Johannes Diderik"],
  "Adulyadej": ["Bhumibol", null],
  "Montesquieu": ["Montesquieu", null]
};

/* Nicht verwertbar: nicht kurz genug benennbar, oder der Beruf in den Daten
   hat mit dem, wofür jemand bekannt ist, nichts zu tun. */
const AUSLASSEN = new Set(["Clairvaux", "Hoff", "Harry Houdini", "Chomeini"]);

/* Wikidata ordnet Menschen oft mehrere Berufe zu, und die Abfrage zieht einen
   davon. Für die bekanntesten Fehlgriffe steht hier das Fachgebiet, für das
   die Person tatsächlich bekannt ist. */
const FACH = {
  // Personen
  "Edison": "Erfindungen", "James Watt": "Technik", "Max Planck": "Physik",
  "Gregor Mendel": "Biologie", "Wallace": "Biologie", "Buffon": "Biologie",
  "Ernst Haeckel": "Biologie", "Huxley": "Biologie", "Konrad Lorenz": "Biologie",
  "Leeuwenhoek": "Biologie", "Mendelejew": "Chemie", "Joliot-Curie": "Chemie",
  "Hodgkin": "Chemie", "Arrhenius": "Chemie", "Priestley": "Chemie",
  "Gandhi": "Politik", "Jefferson": "Politik", "James Madison": "Politik",
  "Hamilton": "Politik", "Kwame Nkrumah": "Politik", "Sun Yat-sen": "Politik",
  "Lee Kuan Yew": "Politik", "Hammarskjöld": "Politik", "Mazzini": "Politik",
  "Senghor": "Politik", "Rosa Luxemburg": "Politik", "Ambedkar": "Politik",
  "Clausewitz": "Militärtheorie", "Montessori": "Pädagogik", "Comenius": "Pädagogik",
  "Franziskus": "Kirche", "Martin Luther": "Theologie", "Jan Hus": "Theologie",
  "Galenos": "Medizin", "Ronald Ross": "Medizin",
  "Fernando Pessoa": "Literatur", "Halldór Laxness": "Literatur",
  "Octavio Paz": "Literatur", "Sully Prudhomme": "Literatur",
  "Alexander Pope": "Literatur", "Li Bai": "Literatur", "Leopardi": "Literatur",
  "Blok": "Literatur", "José Martí": "Literatur", "Susan Sontag": "Literatur",
  "Charrière": "Literatur", "Muhammad Iqbal": "Literatur", "Ayn Rand": "Literatur",
  "Thomas Carlyle": "Geschichte", "Sima Qian": "Geschichte",
  "Hayek": "Wirtschaft", "David Ricardo": "Wirtschaft",
  "Charles Babbage": "Mathematik", "Kurt Gödel": "Mathematik",
  "David Hilbert": "Mathematik", "Riemann": "Mathematik",
  "Leonhard Euler": "Mathematik", "Gauß": "Mathematik",
  "Laplace": "Mathematik", "Lagrange": "Mathematik",
  "Max Born": "Physik", "Schrödinger": "Physik", "Maxwell": "Physik",
  "Thomas Young": "Physik", "Robert Hooke": "Physik", "Ernst Mach": "Physik",
  "Bragg": "Physik", "van der Waals": "Physik", "Edison ": "Erfindungen",
  "Heraklit": "Philosophie", "Anaximander": "Philosophie",
  "Ockham": "Philosophie", "Theophrastos": "Philosophie",
  "Ziolkowski": "Raumfahrt", "Braun": "Raumfahrt",
  // Kunstschaffende
  "Lavoisier": "Chemie", "Ptolemäus": "Astronomie", "Humboldt": "Naturforschung",
  "Leibniz": "Philosophie", "Engels": "Politik", "Bismarck": "Politik",
  "Kasparow": "Schach", "Caesar": "Politik", "Mao Zedong": "Politik",
  "Aung San Suu Kyi": "Politik", "Stephen Hawking": "Physik",
  "Carl Sagan": "Astronomie", "Konfuzius": "Philosophie", "Laozi": "Philosophie",
  "Platon": "Philosophie", "Russell": "Philosophie", "Schopenhauer": "Philosophie",
  "Kierkegaard": "Philosophie", "Thomas von Aquin": "Theologie",
  "Johannes Calvin": "Theologie", "Augustinus": "Theologie", "Erasmus": "Theologie",
  "Averroës": "Philosophie", "Francis Bacon": "Philosophie",
  "Blaise Pascal": "Mathematik", "Mark Aurel": "Politik",
  "Thukydides": "Geschichte", "Tacitus": "Geschichte", "Titus Livius": "Geschichte",
  "Theodor Mommsen": "Geschichte", "Hannah Arendt": "Philosophie",
  "Karl Popper": "Philosophie", "William James": "Philosophie",
  "Chanakya": "Politik", "Zamenhof": "Sprache", "Thomas Paine": "Politik",
  "Thomas Morus": "Politik", "Emma Goldman": "Politik", "Bakunin": "Politik",
  "Leo Trotzki": "Politik", "Wollstonecraft": "Philosophie", "David": "Religion",
  "Montaigne": "Philosophie"
};

/* Berufe als Fachgebiet — das ist geschlechtsneutral und für einen Hinweis
   genauso aussagekräftig: "Physik, 19. Jahrhundert" statt "Physiker aus …". */
const BERUF_ZU_FACH = {
  "Komponist": "Musik", "Maler": "Malerei", "Dichter": "Literatur",
  "Schriftsteller": "Literatur", "Monarch": "Herrschaft", "Philosoph": "Philosophie",
  "Astronom": "Astronomie", "Mathematiker": "Mathematik", "Physiker": "Physik"
};

function nameKlaeren(name, vorname) {
  if (AUSLASSEN.has(name)) return null;
  if (NAMEN[name]) return NAMEN[name];
  return [name, vorname];
}

const personen = roh.personen.map(([n, v, beruf, geb, tod, herkunft, artikel]) => {
  const geklaert = nameKlaeren(n, v);
  if (!geklaert) return null;
  const [antwort, vorname] = geklaert;
  const fach = FACH[antwort] || BERUF_ZU_FACH[beruf] || beruf;
  return {
    antwort,
    gebiet: "geschichte",
    hinweise: [
      `${fach}, ${jahrhundert(geb != null ? geb : tod)}`,
      geb != null ? `Lebte von ${jahr(geb)} bis ${jahr(tod)}` : `Gestorben ${jahr(tod)}`,
      vorname ? `Vorname: ${vorname}` : `Herkunft: ${land(herkunft)}`
    ],
    _artikel: artikel
  };
}).filter(Boolean);

const kunst = roh.kunst.map(([n, v, beruf, geb, werk, artikel]) => {
  const geklaert = nameKlaeren(n, v);
  if (!geklaert) return null;
  const [antwort, vorname] = geklaert;
  const fach = FACH[antwort] || BERUF_ZU_FACH[beruf] || beruf;
  return {
    antwort,
    gebiet: "kultur",
    hinweise: [
      `${fach}, ${jahrhundert(geb)}`,
      vorname ? `Geboren ${jahr(geb)}, Vorname ${vorname}` : `Geboren ${jahr(geb)}`,
      `Bekannt für: ${werk}`
    ],
    _artikel: artikel
  };
}).filter(Boolean);

/* ---------------------------------------------------------------------------
   Zusammenführen, prüfen, schreiben
   ------------------------------------------------------------------------- */

const gruppen = { elemente, hauptstaedte, fluesse, personen, kunst };
const alle = [];
const gesehen = new Set();
const aussortiert = [];

for (const [gruppe, eintraege] of Object.entries(gruppen)) {
  for (const e of bekanntheitNachRang(eintraege)) {
    const wort = normalisieren(e.antwort);
    if (wort.length < 3 || wort.length > 14) { aussortiert.push(`${gruppe}: ${e.antwort} (Länge ${wort.length})`); continue; }
    if (gesehen.has(wort)) { aussortiert.push(`${gruppe}: ${e.antwort} (doppelt)`); continue; }
    // Die Antwort darf in keinem Hinweis stehen
    if (e.hinweise.some(h => normalisieren(h).includes(wort) && wort.length >= 4)) {
      aussortiert.push(`${gruppe}: ${e.antwort} (steht im Hinweis)`); continue;
    }
    gesehen.add(wort);
    alle.push({ antwort: e.antwort, gebiet: e.gebiet, bekanntheit: e.bekanntheit, hinweise: e.hinweise });
  }
}

const kopf = `/* ============================================================================
   fragen-wikidata.js — ${alle.length} Fragen aus Wikidata

   NICHT VON HAND BEARBEITEN. Diese Datei wird von werkzeug/bauen.js erzeugt.
   Wie man sie neu erzeugt, steht in werkzeug/LIESMICH.md.

   Daten: Wikidata (CC0), abgefragt am ${new Date().toISOString().slice(0, 10)}.
   ========================================================================== */

const WIKIDATA_FRAGEN = `;

const zeilen = alle.map(e => "  " + JSON.stringify(e)).join(",\n");
const fuss = `;

if (typeof module !== "undefined" && module.exports) {
  module.exports = { WIKIDATA_FRAGEN };
}
`;

fs.writeFileSync(path.join(__dirname, "..", "fragen-wikidata.js"), kopf + "[\n" + zeilen + "\n]" + fuss);

const zaehlung = {};
alle.forEach(e => zaehlung[e.gebiet] = (zaehlung[e.gebiet] || 0) + 1);
console.log(`Geschrieben: ${alle.length} Fragen`, zaehlung);
if (aussortiert.length) console.log(`Aussortiert (${aussortiert.length}):\n  ` + aussortiert.join("\n  "));
