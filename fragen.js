/* ============================================================================
   fragen.js — die fest eingebaute Fragensammlung

   Sie hat zwei Aufgaben. Jetzt ist sie die einzige Quelle, damit das Spiel
   gebaut und geprüft werden kann. Später wird sie zur Notfallsammlung: Sie
   greift, wenn Wikidata nicht erreichbar ist und noch kein Vorrat im Browser
   liegt. Die Seite muss in jedem Fall spielbar sein.

   Aufbau eines Eintrags:
     antwort      die richtige Schreibweise, so wird sie beim Auflösen gezeigt
     gebiet       geografie | natur | geschichte | kultur
     bekanntheit  1 sehr bekannt, 2 mittel, 3 eher entlegen
     hinweise     drei Stufen, von vage nach fast verraten
   ========================================================================== */

const FRAGEN = [

  /* ---------------- Geografie ---------------- */
  { antwort: "Donau", gebiet: "geografie", bekanntheit: 1, hinweise: [
    "Ein Fluss in Europa",
    "2.857 km lang, fließt durch zehn Länder",
    "Kommt aus dem Schwarzwald und mündet ins Schwarze Meer" ]},

  { antwort: "Rhein", gebiet: "geografie", bekanntheit: 1, hinweise: [
    "Ein Fluss in Westeuropa",
    "1.233 km lang, entspringt in den Schweizer Alpen",
    "Mündet bei Rotterdam in die Nordsee" ]},

  { antwort: "Lissabon", gebiet: "geografie", bekanntheit: 1, hinweise: [
    "Eine Hauptstadt an der Atlantikküste",
    "Liegt an der Atlantikküste am Fluss Tejo",
    "Hauptstadt Portugals" ]},

  { antwort: "Madrid", gebiet: "geografie", bekanntheit: 1, hinweise: [
    "Eine Hauptstadt auf der Iberischen Halbinsel",
    "Liegt fast genau in der Mitte der Iberischen Halbinsel",
    "Hauptstadt Spaniens" ]},

  { antwort: "Everest", gebiet: "geografie", bekanntheit: 1, hinweise: [
    "Ein Berg in Asien",
    "8.849 Meter hoch, liegt im Himalaya",
    "Der höchste Berg der Erde, auf der Grenze Nepal–Tibet" ]},

  { antwort: "Anden", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Ein Gebirge",
    "Rund 7.500 km lang, das längste Gebirge der Welt",
    "Zieht sich durch Südamerika von Venezuela bis Feuerland" ]},

  { antwort: "Oslo", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Eine nordeuropäische Hauptstadt",
    "Liegt am Ende eines langen Fjords",
    "Hauptstadt Norwegens" ]},

  { antwort: "Themse", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Ein Fluss in England",
    "346 km lang, mündet in die Nordsee",
    "Fließt mitten durch London" ]},

  { antwort: "Etna", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Ein Vulkan",
    "Rund 3.350 Meter hoch, sehr häufig aktiv",
    "Der höchste aktive Vulkan Europas, auf Sizilien" ]},

  { antwort: "Alpen", gebiet: "geografie", bekanntheit: 1, hinweise: [
    "Ein Gebirge in Mitteleuropa",
    "Erstreckt sich über acht Länder",
    "Höchster Gipfel ist der Mont Blanc mit 4.806 Metern" ]},

  { antwort: "Wolga", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Ein Fluss in Osteuropa",
    "3.530 km lang, der längste Fluss Europas",
    "Mündet ins Kaspische Meer" ]},

  { antwort: "Athen", gebiet: "geografie", bekanntheit: 1, hinweise: [
    "Eine südeuropäische Hauptstadt",
    "Eine der ältesten Städte der Welt",
    "Hauptstadt Griechenlands, bekannt für die Akropolis" ]},

  { antwort: "Sahara", gebiet: "geografie", bekanntheit: 1, hinweise: [
    "Eine Wüste",
    "Rund 9 Millionen km², die größte Trockenwüste der Erde",
    "Erstreckt sich über den Norden Afrikas" ]},

  { antwort: "Island", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Ein Inselstaat",
    "Liegt im Nordatlantik, bekannt für Vulkane und Geysire",
    "Hauptstadt ist Reykjavík" ]},

  { antwort: "Kairo", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Eine afrikanische Hauptstadt",
    "Größte Stadt der arabischen Welt, liegt am Nil",
    "Hauptstadt Ägyptens, nahe den Pyramiden von Gizeh" ]},

  /* ---------------- Naturwissenschaft ---------------- */
  { antwort: "Sauerstoff", gebiet: "natur", bekanntheit: 1, hinweise: [
    "Ein chemisches Element, Ordnungszahl 1 bis 10",
    "Ordnungszahl 8, Symbol O",
    "Macht rund 21 Prozent der Luft aus" ]},

  { antwort: "Eisen", gebiet: "natur", bekanntheit: 1, hinweise: [
    "Ein chemisches Element, Ordnungszahl 21 bis 30",
    "Ordnungszahl 26, Symbol Fe",
    "Hauptbestandteil von Stahl, rostet an feuchter Luft" ]},

  { antwort: "Helium", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein chemisches Element, Ordnungszahl 1 bis 10",
    "Ordnungszahl 2, ein Edelgas",
    "Leichter als Luft, füllt Ballons" ]},

  { antwort: "Jupiter", gebiet: "natur", bekanntheit: 1, hinweise: [
    "Der größte Planet des Sonnensystems",
    "Der größte Planet im Sonnensystem",
    "Bekannt für den Großen Roten Fleck, einen riesigen Sturm" ]},

  { antwort: "Saturn", gebiet: "natur", bekanntheit: 1, hinweise: [
    "Ein Planet mit auffälligem Ringsystem",
    "Der sechste Planet von der Sonne aus",
    "Berühmt für sein ausgeprägtes Ringsystem" ]},

  { antwort: "Venus", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Der heißeste Planet des Sonnensystems",
    "Der zweite Planet von der Sonne aus",
    "Der heißeste Planet, rund 460 Grad an der Oberfläche" ]},

  { antwort: "Merkur", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Der kleinste Planet des Sonnensystems",
    "Der kleinste Planet des Sonnensystems",
    "Der sonnennächste Planet" ]},

  { antwort: "Neptun", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Der äußerste Planet des Sonnensystems",
    "Der äußerste Planet des Sonnensystems",
    "Wurde 1846 anhand von Bahnberechnungen entdeckt" ]},

  { antwort: "Gepard", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein Raubtier",
    "Lebt vor allem in den Savannen Afrikas",
    "Das schnellste Landtier, bis rund 100 km/h" ]},

  { antwort: "Blauwal", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein Meeressäuger",
    "Wird bis zu 30 Meter lang",
    "Das größte Tier, das jemals auf der Erde gelebt hat" ]},

  { antwort: "Kupfer", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein chemisches Element, Ordnungszahl 21 bis 30",
    "Ordnungszahl 29, Symbol Cu",
    "Rötliches Metall, leitet Strom sehr gut" ]},

  { antwort: "Neon", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein chemisches Element, Ordnungszahl 1 bis 10",
    "Ordnungszahl 10, ein Edelgas",
    "Leuchtet rot-orange in Gasentladungsröhren" ]},

  { antwort: "Titan", gebiet: "natur", bekanntheit: 3, hinweise: [
    "Ein Himmelskörper",
    "Der größte Mond des Saturn",
    "Der einzige Mond mit dichter Atmosphäre und Methanseen" ]},

  { antwort: "Diamant", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein Mineral",
    "Besteht ausschließlich aus Kohlenstoff",
    "Der härteste natürlich vorkommende Stoff" ]},

  { antwort: "Chlorophyll", gebiet: "natur", bekanntheit: 3, hinweise: [
    "Ein Farbstoff in Lebewesen",
    "Sorgt dafür, dass Pflanzen grün aussehen",
    "Fängt das Sonnenlicht für die Photosynthese ein" ]},

  /* ---------------- Geschichte und Personen ---------------- */
  { antwort: "Napoleon", gebiet: "geschichte", bekanntheit: 1, hinweise: [
    "Ein Herrscher des 19. Jahrhunderts",
    "Krönte sich 1804 selbst zum Kaiser der Franzosen",
    "Verlor 1815 die Schlacht bei Waterloo" ]},

  { antwort: "Caesar", gebiet: "geschichte", bekanntheit: 1, hinweise: [
    "Ein römischer Staatsmann",
    "Eroberte Gallien und überschritt den Rubikon",
    "Wurde 44 v. Chr. im Senat ermordet" ]},

  { antwort: "Luther", gebiet: "geschichte", bekanntheit: 1, hinweise: [
    "Ein Theologe des 16. Jahrhunderts",
    "Übersetzte die Bibel ins Deutsche",
    "Löste mit seinen Thesen die Reformation aus" ]},

  { antwort: "Gutenberg", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Erfinder des 15. Jahrhunderts",
    "Stammte aus Mainz",
    "Erfand den Buchdruck mit beweglichen Lettern" ]},

  { antwort: "Einstein", gebiet: "geschichte", bekanntheit: 1, hinweise: [
    "Ein Physiker des 20. Jahrhunderts",
    "Erhielt 1921 den Nobelpreis für Physik",
    "Entwickelte die Relativitätstheorie" ]},

  { antwort: "Curie", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Eine Wissenschaftlerin",
    "Die erste Frau mit einem Nobelpreis",
    "Erforschte die Radioaktivität, entdeckte Polonium und Radium" ]},

  { antwort: "Kolumbus", gebiet: "geschichte", bekanntheit: 1, hinweise: [
    "Ein Seefahrer",
    "Segelte 1492 im Auftrag Spaniens nach Westen",
    "Erreichte Amerika, hielt es aber für Indien" ]},

  { antwort: "Cleopatra", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Eine Herrscherin der Antike",
    "Die letzte Pharaonin Ägyptens",
    "Verbündet mit Caesar und später mit Marcus Antonius" ]},

  { antwort: "Bismarck", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein deutscher Staatsmann des 19. Jahrhunderts",
    "Erster Reichskanzler des Deutschen Reiches",
    "Trieb 1871 die Reichsgründung voran" ]},

  { antwort: "Magellan", gebiet: "geschichte", bekanntheit: 3, hinweise: [
    "Ein Seefahrer des 16. Jahrhunderts",
    "Startete 1519 eine Fahrt um die Welt",
    "Nach ihm ist die Meerenge an der Südspitze Südamerikas benannt" ]},

  { antwort: "Newton", gebiet: "geschichte", bekanntheit: 1, hinweise: [
    "Ein Naturforscher des 17. Jahrhunderts",
    "Beschrieb die Gesetze der Bewegung",
    "Formulierte das Gravitationsgesetz" ]},

  { antwort: "Darwin", gebiet: "geschichte", bekanntheit: 1, hinweise: [
    "Ein Naturforscher des 19. Jahrhunderts",
    "Reiste mit der Beagle zu den Galapagosinseln",
    "Begründete die Evolutionstheorie" ]},

  { antwort: "Aristoteles", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Philosoph der Antike",
    "Schüler Platons und Lehrer Alexanders des Großen",
    "Schrieb über Logik, Naturkunde und Ethik" ]},

  { antwort: "Hannibal", gebiet: "geschichte", bekanntheit: 3, hinweise: [
    "Ein Feldherr der Antike",
    "Kämpfte gegen Rom im Zweiten Punischen Krieg",
    "Überquerte mit Kriegselefanten die Alpen" ]},

  { antwort: "Marco Polo", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Händler und Reisender des Mittelalters",
    "Stammte aus Venedig",
    "Berichtete über seine Reise nach China zum Hof Kublai Khans" ]},

  /* ---------------- Kultur ---------------- */
  { antwort: "Mozart", gebiet: "kultur", bekanntheit: 1, hinweise: [
    "Ein Komponist aus dem 18. Jahrhundert",
    "Geboren 1756 in Salzburg, gestorben mit 35 Jahren",
    "Schrieb die Zauberflöte und die Kleine Nachtmusik" ]},

  { antwort: "Beethoven", gebiet: "kultur", bekanntheit: 1, hinweise: [
    "Ein Komponist aus dem 19. Jahrhundert",
    "Geboren in Bonn, ertaubte im Lauf seines Lebens",
    "Seine neunte Sinfonie enthält die Ode an die Freude" ]},

  { antwort: "Picasso", gebiet: "kultur", bekanntheit: 1, hinweise: [
    "Ein Maler des 20. Jahrhunderts",
    "Stammte aus Málaga, arbeitete in Frankreich",
    "Mitbegründer des Kubismus, malte Guernica" ]},

  { antwort: "Monet", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein französischer Maler",
    "Gab dem Impressionismus mit einem Bildtitel den Namen",
    "Malte immer wieder Seerosen in seinem Garten in Giverny" ]},

  { antwort: "Hamlet", gebiet: "kultur", bekanntheit: 1, hinweise: [
    "Ein Theaterstück aus England",
    "Spielt am dänischen Königshof",
    "Enthält die Frage: Sein oder Nichtsein" ]},

  { antwort: "Faust", gebiet: "kultur", bekanntheit: 1, hinweise: [
    "Ein Theaterstück aus Deutschland",
    "Ein Gelehrter schließt einen Pakt mit dem Teufel",
    "Hauptwerk Goethes, erschienen in zwei Teilen" ]},

  { antwort: "Odyssee", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Werk der antiken Literatur",
    "Erzählt von einer zehnjährigen Irrfahrt übers Meer",
    "Homer schrieb sie über die Heimkehr des Odysseus nach Ithaka" ]},

  { antwort: "Bach", gebiet: "kultur", bekanntheit: 1, hinweise: [
    "Ein Komponist des Barock",
    "Arbeitete lange als Thomaskantor in Leipzig",
    "Schrieb die Matthäuspassion und die Brandenburgischen Konzerte" ]},

  { antwort: "Chopin", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Komponist des 19. Jahrhunderts",
    "Stammte aus Polen, lebte in Paris",
    "Schrieb fast ausschließlich für Klavier" ]},

  { antwort: "Kafka", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Schriftsteller des 20. Jahrhunderts",
    "Lebte in Prag und arbeitete in einer Versicherung",
    "Schrieb Die Verwandlung und Der Prozess" ]},

  { antwort: "Vermeer", gebiet: "kultur", bekanntheit: 3, hinweise: [
    "Ein niederländischer Maler",
    "Lebte im 17. Jahrhundert in Delft",
    "Malte Das Mädchen mit dem Perlenohrring" ]},

  { antwort: "Shakespeare", gebiet: "kultur", bekanntheit: 1, hinweise: [
    "Ein englischer Dichter",
    "Lebte um 1600, schrieb für das Globe Theatre",
    "Verfasste Romeo und Julia, Macbeth und Hamlet" ]},

  { antwort: "Orwell", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein englischer Schriftsteller",
    "Schrieb über Überwachung und Machtmissbrauch",
    "Verfasste 1984 und die Farm der Tiere" ]},

  { antwort: "Tolstoi", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein russischer Schriftsteller",
    "Lebte im 19. Jahrhundert",
    "Schrieb Krieg und Frieden und Anna Karenina" ]},

  { antwort: "Rodin", gebiet: "kultur", bekanntheit: 3, hinweise: [
    "Ein französischer Bildhauer",
    "Arbeitete um 1900 vor allem in Bronze",
    "Schuf Der Denker und Der Kuss" ]}

];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { FRAGEN };
}
