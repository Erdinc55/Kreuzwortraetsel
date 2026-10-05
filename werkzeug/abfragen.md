# Die fünf Wikidata-Abfragen

Ausgeführt am 5. Oktober 2026 auf https://query.wikidata.org.
Jede Abfrage einzeln einfügen, ausführen, kurz warten, dann die nächste —
der Dienst begrenzt die Rechenzeit pro Minute.

Alle Abfragen holen nur deutsche Namen (`FILTER(LANG(...) = "de")`).
`wikibase:sitelinks` zählt, in wie vielen Wikipedia-Sprachen es einen Artikel
gibt. Daraus wird später die Bekanntheit (leicht / mittel / schwer).

## Elemente → `elemente: [name, ordnungszahl, symbol, artikel]`

```sparql
SELECT ?n (SAMPLE(?o) AS ?a) (SAMPLE(?sy) AS ?b) (MAX(?s) AS ?z) WHERE {
  ?i wdt:P31 wd:Q11344 ; wdt:P1086 ?o ; wdt:P246 ?sy ; wikibase:sitelinks ?s .
  FILTER(?o <= 118)
  ?i rdfs:label ?n . FILTER(LANG(?n) = "de")
} GROUP BY ?i ?n LIMIT 200
```

## Hauptstädte → `hauptstaedte: [name, land, kontinent, einwohner, artikel]`

Nur Staaten, die es heute noch gibt (kein P576 „aufgelöst“).

```sparql
SELECT ?n (SAMPLE(?lL) AS ?a) (SAMPLE(?kL) AS ?b) (MAX(?ew) AS ?c) (MAX(?s) AS ?z) WHERE {
  ?l wdt:P31 wd:Q3624078 ; wdt:P36 ?i ; wdt:P30 ?k .
  FILTER NOT EXISTS { ?l wdt:P576 ?aufgeloest }
  ?i wikibase:sitelinks ?s ; wdt:P1082 ?ew .
  FILTER(?ew > 0)
  ?i rdfs:label ?n .  FILTER(LANG(?n) = "de")
  ?l rdfs:label ?lL . FILTER(LANG(?lL) = "de")
  ?k rdfs:label ?kL . FILTER(LANG(?kL) = "de")
} GROUP BY ?i ?n LIMIT 400
```

## Flüsse → `fluesse: [name, laenge, muendung, land, laenderAnzahl, artikel]`

Die Zahl der Länder wird mitgezählt. Bei mehreren Ländern ist sie ein
besserer Hinweis als ein zufällig herausgegriffenes Land.

```sparql
SELECT ?n (SAMPLE(?len) AS ?a) (SAMPLE(?mL) AS ?b) (SAMPLE(?lL) AS ?c)
       (COUNT(DISTINCT ?l) AS ?d) (MAX(?s) AS ?z) WHERE {
  ?i wdt:P31 wd:Q4022 ; wdt:P2043 ?len ; wdt:P403 ?m ; wdt:P17 ?l ; wikibase:sitelinks ?s .
  FILTER(?s > 40)
  ?i rdfs:label ?n .  FILTER(LANG(?n) = "de")
  ?m rdfs:label ?mL . FILTER(LANG(?mL) = "de")
  ?l rdfs:label ?lL . FILTER(LANG(?lL) = "de")
} GROUP BY ?i ?n LIMIT 400
```

## Personen → `personen: [antwort, vorname, beruf, geburt, tod, herkunft, artikel]`

Philosophen, Physiker, Chemiker, Mathematiker, Monarchen.

```sparql
SELECT ?n (SAMPLE(?bL) AS ?a) (SAMPLE(?g) AS ?b) (SAMPLE(?t) AS ?c)
       (SAMPLE(?lL) AS ?d) (MAX(?s) AS ?z) WHERE {
  VALUES ?beruf { wd:Q116 wd:Q4964182 wd:Q11063 wd:Q170790 wd:Q169470 }
  ?i wdt:P106 ?beruf ; wdt:P570 ?t ; wikibase:sitelinks ?s .
  FILTER(?s > 90)
  OPTIONAL { ?i wdt:P569 ?g }
  ?i wdt:P27 ?l .     ?l rdfs:label ?lL . FILTER(LANG(?lL) = "de")
  ?i rdfs:label ?n .  FILTER(LANG(?n) = "de")
  ?beruf rdfs:label ?bL . FILTER(LANG(?bL) = "de")
} GROUP BY ?i ?n LIMIT 500
```

## Kunst → `kunst: [antwort, vorname, beruf, geburt, werk, artikel]`

Beruf und Werk werden **gemeinsam** gruppiert (`GROUP BY ... ?bL`). Mit zwei
getrennten `SAMPLE` würden sonst Beruf und Werk aus verschiedenen Zeilen
stammen — dann wird aus einem Maler plötzlich der Autor eines Romans.

```sparql
SELECT ?n ?bL (SAMPLE(?wL) AS ?c) (SAMPLE(?g) AS ?b) (MAX(?s) AS ?z) WHERE {
  VALUES (?beruf ?typ) {
    (wd:Q1028181 wd:Q3305213)
    (wd:Q36834  wd:Q105543609)
    (wd:Q36180  wd:Q7725634)
    (wd:Q49757  wd:Q7725634)
  }
  ?i wdt:P106 ?beruf ; wdt:P800 ?w ; wikibase:sitelinks ?s .
  FILTER(?s > 70)
  ?w wdt:P31/wdt:P279? ?typ .
  OPTIONAL { ?i wdt:P569 ?g }
  ?i rdfs:label ?n .      FILTER(LANG(?n) = "de")
  ?beruf rdfs:label ?bL . FILTER(LANG(?bL) = "de")
  ?w rdfs:label ?wL .     FILTER(LANG(?wL) = "de")
} GROUP BY ?i ?n ?bL LIMIT 700
```

## Von der Tabelle zu rohdaten.json

Bei Personen und Kunst wird der volle Name zerlegt: Der Nachname wird die
Antwort, der Rest der Vorname (`null`, wenn es keinen gibt — z. B. „Platon“).
Namen mit Punkt (römische Ziffern, Abkürzungen) wurden weggelassen. Daten
als Jahreszahl, Einwohner und Längen als Zahl.
