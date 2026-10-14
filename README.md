# Lesesaal

Ein Kreuzworträtsel über Allgemeinwissen. Jedes Rätsel wird beim Start neu
gebaut, es gibt also keine zwei gleichen. Die Hinweise lassen sich zweimal
nachschärfen, das kostet Punkte.

**Live:** https://erdinc55.github.io/Kreuzwortraetsel/

## Spielen

Du wählst ein Gebiet (Geografie, Natur, Geschichte, Kultur oder gemischt) und
eine Schwierigkeit. Dann steht ein Gitter vor dir, und zu jedem Wort gibt es
erst nur einen groben Hinweis, zum Beispiel „Philosophie, 16. Jahrhundert".

Kommst du nicht weiter, schärfst du den Hinweis: Stufe zwei kostet 15 Punkte,
Stufe drei 30. Dort steht dann fast schon die Antwort („Vorname: Michel"). Wer
mit der Prüfen-Taste nachsehen will, welche Felder falsch sind, zahlt 25. Jeder
richtige Buchstabe bringt 8 Punkte.

Am Ende stehen Punkte und Fehler da, und im Gitter lässt sich die Lösung
einblenden. Dort steht bei jedem falschen Feld klein dein eigener Versuch.
Die letzten Rätsel werden im Browser gespeichert.

## Woher die Fragen kommen

Gut 1.000 Fragen: 137 habe ich selbst geschrieben, der Rest stammt aus
[Wikidata](https://www.wikidata.org) (Elemente, Hauptstädte, Flüsse, Philosophen,
Maler, Komponisten, Schriftsteller und so weiter).

Zuerst hat die Seite Wikidata bei jedem ersten Besuch live abgefragt. Das hat
oft nicht geklappt: Der Abfragedienst begrenzt die Rechenzeit, und von fünf
Abfragen kamen je nach Tageszeit nur eine bis drei durch. Jetzt frage ich
einmal in Ruhe ab, räume die Daten auf und liefere sie als Datei mit
(`fragen-wikidata.js`). Die Seite braucht beim Spielen gar keine Verbindung
mehr.

Wie man die Fragen erneuert, steht in [`werkzeug/LIESMICH.md`](werkzeug/LIESMICH.md).

## Das Gitter

Die schwierigste Stelle war das Gitter selbst. `gitter.js` bekommt eine Liste
Wörter und legt sie so übereinander, dass sich gemeinsame Buchstaben kreuzen.
Das längste Wort kommt zuerst, die anderen werden einzeln an eine Stelle gesetzt,
die möglichst viele Kreuzungen und möglichst wenig zusätzliche Fläche bringt.

Dabei gelten drei Regeln: An einer Kreuzung müssen beide Wörter denselben
Buchstaben haben. Vor und hinter einem Wort darf nichts stehen. Und neben einem
Wort darf kein zweites verlaufen, sonst entstünden Buchstabenpaare, die wie
Wörter aussehen, aber keine sind.

Findet ein Wort keinen Platz, wird es zurückgestellt und später noch einmal
versucht. Insgesamt läuft der Aufbau 60-mal mit anderer Reihenfolge, und das
beste Ergebnis gewinnt.

## Handy

Auf dem Handy war das Gitter anfangs bis zu 23 Felder breit, dadurch blieben
pro Feld rund 13 Pixel. Zum Tippen viel zu klein. Jetzt bekommt der
Aufbau eine Höchstbreite: Auf schmalen Bildschirmen sind es höchstens 12
Spalten und 16 Wörter, die Felder sind dann etwa doppelt so groß. Dafür wird
das Gitter höher und man scrollt.

Das zweite Problem war die Tastatur. Auf dem iPhone legt sie sich über die
Seite, statt sie zu verkleinern, und der Hinweis verschwand dahinter. Über
`visualViewport` erkennt die Seite, wie viel wirklich sichtbar ist, und setzt
den Hinweis direkt über die Tastatur.

## Umlaute

Im Gitter gibt es nur A bis Z. Ä wird zu AE, ß zu SS und so weiter. Die
Reihenfolge ist wichtig: Die Umlaute müssen zuerst ersetzt werden. Würde man
vorher die allgemeine Zeichenzerlegung anwenden, zerfiele das Ä in A und ein
Strichlein, übrig bliebe ein A statt AE.

## Was drin steckt

Reines HTML, CSS und JavaScript, keine Bibliotheken.

- `index.html`, `style.css`: Aufbau und dunkle Optik
- `gitter.js`: baut das Gitter
- `daten.js`: macht aus den Fragen rätseltaugliche Wörter und wählt aus
- `spiel.js`: Punkte, Prüfen, Auswertung, Liste der letzten Rätsel
- `app.js`: Anzeige, Tippen, Tastatur
- `fragen.js`, `fragen-wikidata.js`: die Fragen
- `werkzeug/`: Abfragen und Skript, mit denen `fragen-wikidata.js` entsteht

## Ausprobieren

Einfach `index.html` im Browser öffnen. Ein Server ist nicht nötig.

Die Daten stammen aus Wikidata und stehen unter CC0.
