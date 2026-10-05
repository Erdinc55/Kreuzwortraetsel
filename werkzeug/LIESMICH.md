# werkzeug/

Hier entsteht `fragen-wikidata.js`. Nichts in diesem Ordner wird von der
Seite geladen — er ist nur für mich, wenn ich die Fragen erneuern will.

| Datei            | Was                                                  |
|------------------|------------------------------------------------------|
| `abfragen.md`    | die fünf SPARQL-Abfragen für query.wikidata.org      |
| `rohdaten.json`  | die Ergebnisse, kompakt als Listen                   |
| `bauen.js`       | macht daraus Fragen mit drei Hinweisstufen           |

## Warum so und nicht live?

Am Anfang hat das Rätsel Wikidata bei jedem ersten Besuch direkt abgefragt.
Meistens kamen nur ein bis drei von fünf Abfragen durch — Zeitlimit oder
„zu viele Anfragen“ (Issue #1). Jetzt wird einmal abgefragt und das
Ergebnis mitgeliefert (Issue #2). Fragen ändern sich ja nicht täglich.

## Fragen erneuern

1. Abfragen aus `abfragen.md` nacheinander auf https://query.wikidata.org
   ausführen.
2. Ergebnisse in `rohdaten.json` eintragen (Format steht bei jeder Abfrage).
3. Im Ordner `werkzeug`:

   ```
   node bauen.js
   ```

   Das schreibt `../fragen-wikidata.js` neu und zeigt an, wie viele Fragen
   pro Gebiet entstanden sind und welche aussortiert wurden.

4. Seite öffnen, ein paar Rätsel spielen, dann committen.

## Was bauen.js aufräumt

- Ländernamen kürzen („Königreich der Niederlande“ → „Niederlande“)
- Namen korrigieren, wo Wikidata den falschen Teil als Nachnamen liefert
  („Vinci“ → „Leonardo“, „Rijn“ → „Rembrandt“)
- Beruf → Fach („Komponist“ → „Musik“)
- doppelte Antworten raus
- **Verrät-Prüfung:** steht die Antwort in einem ihrer eigenen Hinweise,
  fliegt die Frage raus (z. B. „São Tomé“, Hauptstadt von São Tomé und
  Príncipe)

Lizenz der Daten: Wikidata, CC0.
