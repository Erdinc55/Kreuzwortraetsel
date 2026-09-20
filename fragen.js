const FRAGEN = [

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

,

  /* ================= Erweiterung ================= */

  /* ---------------- Geografie ---------------- */
  { antwort: "Amazonas", gebiet: "geografie", bekanntheit: 1, hinweise: [
    "Ein Fluss in Südamerika",
    "Rund 6.400 km lang, führt mehr Wasser als jeder andere Fluss",
    "Mündet in den Atlantik, durchquert das größte Regenwaldgebiet" ]},

  { antwort: "Nil", gebiet: "geografie", bekanntheit: 1, hinweise: [
    "Ein Fluss in Afrika",
    "Rund 6.650 km lang, fließt von Süden nach Norden",
    "Mündet ins Mittelmeer, prägte das alte Ägypten" ]},

  { antwort: "Ganges", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Ein Fluss in Südasien",
    "Rund 2.500 km lang, entspringt im Himalaya",
    "Gilt im Hinduismus als heilig" ]},

  { antwort: "Seine", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Ein Fluss in Frankreich",
    "776 km lang, mündet in den Ärmelkanal",
    "Fließt mitten durch Paris" ]},

  { antwort: "Mississippi", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Ein Fluss in Nordamerika",
    "Rund 3.700 km lang, mündet in den Golf von Mexiko",
    "Teilt die Vereinigten Staaten in Ost und West" ]},

  { antwort: "Tokio", gebiet: "geografie", bekanntheit: 1, hinweise: [
    "Eine Hauptstadt in Asien",
    "Der größte Ballungsraum der Welt",
    "Hauptstadt Japans" ]},

  { antwort: "Canberra", gebiet: "geografie", bekanntheit: 3, hinweise: [
    "Eine Hauptstadt in Ozeanien",
    "Wurde eigens als Hauptstadt geplant und gebaut",
    "Hauptstadt Australiens, nicht Sydney" ]},

  { antwort: "Brasilia", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Eine Hauptstadt in Südamerika",
    "1960 auf dem Reißbrett entworfen, im Landesinneren",
    "Hauptstadt Brasiliens" ]},

  { antwort: "Ottawa", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Eine Hauptstadt in Nordamerika",
    "Liegt an der Grenze zweier Provinzen",
    "Hauptstadt Kanadas, nicht Toronto" ]},

  { antwort: "Bern", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Eine Hauptstadt in Mitteleuropa",
    "Die Altstadt gehört zum Weltkulturerbe",
    "Regierungssitz der Schweiz" ]},

  { antwort: "Kilimandscharo", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Ein Berg in Afrika",
    "5.895 Meter hoch, ein erloschener Vulkan",
    "Der höchste Berg Afrikas, liegt in Tansania" ]},

  { antwort: "Matterhorn", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Ein Berg in den Alpen",
    "4.478 Meter hoch, markante Pyramidenform",
    "Steht an der Grenze zwischen Schweiz und Italien" ]},

  { antwort: "Fuji", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Ein Berg in Ostasien",
    "3.776 Meter hoch, ein fast perfekt geformter Vulkan",
    "Der höchste Berg Japans" ]},

  { antwort: "Himalaya", gebiet: "geografie", bekanntheit: 1, hinweise: [
    "Ein Gebirge in Asien",
    "Enthält alle vierzehn Achttausender der Erde",
    "Entstand durch den Zusammenstoß zweier Kontinentalplatten" ]},

  { antwort: "Gobi", gebiet: "geografie", bekanntheit: 3, hinweise: [
    "Eine Wüste in Asien",
    "Eine Kältewüste mit Frost im Winter",
    "Erstreckt sich über die Mongolei und Nordchina" ]},

  { antwort: "Grönland", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Eine Insel im Nordatlantik",
    "Die größte Insel der Erde, fast ganz von Eis bedeckt",
    "Gehört zum Königreich Dänemark" ]},

  { antwort: "Madagaskar", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Eine Insel im Indischen Ozean",
    "Viertgrößte Insel der Erde, vor Ostafrika gelegen",
    "Beherbergt Tierarten, die sonst nirgends vorkommen" ]},

  { antwort: "Baikalsee", gebiet: "geografie", bekanntheit: 3, hinweise: [
    "Ein See in Sibirien",
    "Über 1.600 Meter tief",
    "Der tiefste See der Erde, enthält ein Fünftel allen Süßwassers" ]},

  { antwort: "Panamakanal", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Ein Bauwerk in Mittelamerika",
    "1914 eröffnet, rund 80 km lang",
    "Verbindet Atlantik und Pazifik" ]},

  { antwort: "Vatikan", gebiet: "geografie", bekanntheit: 2, hinweise: [
    "Ein Staat in Südeuropa",
    "Der kleinste Staat der Erde, weniger als ein Quadratkilometer",
    "Liegt vollständig innerhalb von Rom" ]},

  /* ---------------- Naturwissenschaft ---------------- */
  { antwort: "Wasserstoff", gebiet: "natur", bekanntheit: 1, hinweise: [
    "Ein chemisches Element, Ordnungszahl 1 bis 10",
    "Ordnungszahl genau 1, das leichteste Element",
    "Chemisches Symbol H, häufigstes Element im Universum" ]},

  { antwort: "Kohlenstoff", gebiet: "natur", bekanntheit: 1, hinweise: [
    "Ein chemisches Element, Ordnungszahl 1 bis 10",
    "Ordnungszahl genau 6",
    "Chemisches Symbol C, Grundlage allen bekannten Lebens" ]},

  { antwort: "Gold", gebiet: "natur", bekanntheit: 1, hinweise: [
    "Ein chemisches Element, Ordnungszahl 71 bis 80",
    "Ordnungszahl genau 79",
    "Chemisches Symbol Au, läuft an der Luft nicht an" ]},

  { antwort: "Quecksilber", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein chemisches Element, Ordnungszahl 71 bis 80",
    "Ordnungszahl genau 80, bei Zimmertemperatur flüssig",
    "Chemisches Symbol Hg, früher in Thermometern" ]},

  { antwort: "Uran", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein chemisches Element, Ordnungszahl 91 bis 100",
    "Ordnungszahl genau 92, radioaktiv",
    "Chemisches Symbol U, Brennstoff in Kernkraftwerken" ]},

  { antwort: "Stickstoff", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein chemisches Element, Ordnungszahl 1 bis 10",
    "Ordnungszahl genau 7",
    "Chemisches Symbol N, macht 78 Prozent der Luft aus" ]},

  { antwort: "Aluminium", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein chemisches Element, Ordnungszahl 11 bis 20",
    "Ordnungszahl genau 13, sehr leicht",
    "Chemisches Symbol Al, häufigstes Metall der Erdkruste" ]},

  { antwort: "Kalzium", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein chemisches Element, Ordnungszahl 11 bis 20",
    "Ordnungszahl genau 20",
    "Chemisches Symbol Ca, Baustoff von Knochen und Zähnen" ]},

  { antwort: "Mond", gebiet: "natur", bekanntheit: 1, hinweise: [
    "Ein Himmelskörper in Erdnähe",
    "Rund 384.000 km entfernt, braucht 27 Tage für einen Umlauf",
    "Der einzige natürliche Trabant der Erde" ]},

  { antwort: "Europa", gebiet: "natur", bekanntheit: 3, hinweise: [
    "Ein Mond im äußeren Sonnensystem",
    "Von einer dicken Eisschicht bedeckt",
    "Umkreist Jupiter, darunter wird ein Ozean vermutet" ]},

  { antwort: "Halleyscher", gebiet: "natur", bekanntheit: 3, hinweise: [
    "Ein Himmelskörper mit langer Umlaufbahn",
    "Kehrt etwa alle 76 Jahre wieder",
    "Der bekannteste Komet, zuletzt 1986 zu sehen" ]},


  { antwort: "Kolibri", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein sehr kleiner Vogel",
    "Schlägt bis zu achtzigmal je Sekunde mit den Flügeln",
    "Kann als einziger Vogel rückwärts fliegen" ]},

  { antwort: "Krake", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein Meerestier ohne Skelett",
    "Hat acht Arme und drei Herzen",
    "Kann Farbe und Struktur der Haut blitzschnell ändern" ]},

  { antwort: "Ameise", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein staatenbildendes Insekt",
    "Trägt ein Vielfaches des eigenen Gewichts",
    "Lebt in Kolonien mit strenger Arbeitsteilung" ]},

  { antwort: "Schwerkraft", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Eine Grundkraft der Physik",
    "Die schwächste der vier Grundkräfte, aber unendlich weit reichend",
    "Newton beschrieb sie, Einstein deutete sie als gekrümmten Raum" ]},

  { antwort: "Erosion", gebiet: "natur", bekanntheit: 3, hinweise: [
    "Ein Vorgang an der Erdoberfläche",
    "Wasser, Wind und Eis tragen Gestein ab",
    "Formte über Jahrmillionen Täler und Schluchten" ]},

  { antwort: "Evolution", gebiet: "natur", bekanntheit: 1, hinweise: [
    "Ein Vorgang in der Biologie",
    "Beruht auf Vererbung, Variation und Auslese",
    "Darwin beschrieb sie 1859 in seinem Hauptwerk" ]},

  { antwort: "Tsunami", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Ein Naturereignis im Meer",
    "Entsteht meist durch Seebeben, breitet sich sehr schnell aus",
    "Auf offener See kaum spürbar, türmt sich erst an der Küste auf" ]},

  { antwort: "Magnetfeld", gebiet: "natur", bekanntheit: 2, hinweise: [
    "Eine Eigenschaft der Erde",
    "Entsteht durch Strömungen im flüssigen äußeren Erdkern",
    "Lenkt geladene Teilchen ab und lässt Polarlichter entstehen" ]},

  /* ---------------- Geschichte und Personen ---------------- */
  { antwort: "Alexander", gebiet: "geschichte", bekanntheit: 1, hinweise: [
    "Ein Herrscher aus dem 4. Jahrhundert v. Chr.",
    "Schüler des Aristoteles, König von Makedonien",
    "Zog bis nach Indien und starb mit 32 Jahren" ]},

  { antwort: "Karl", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Herrscher aus dem Frühmittelalter",
    "Wurde im Jahr 800 in Rom zum Kaiser gekrönt",
    "Sein Beiname lautet der Große, Residenz war Aachen" ]},

  { antwort: "Konfuzius", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Denker aus dem alten China",
    "Lehrte vor rund 2.500 Jahren",
    "Seine Lehre prägt Ostasien bis heute" ]},

  { antwort: "Sokrates", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Philosoph aus dem 5. Jahrhundert v. Chr.",
    "Schrieb selbst nichts, bekannt durch seinen Schüler Platon",
    "Wurde in Athen zum Tod durch den Schierlingsbecher verurteilt" ]},

  { antwort: "Platon", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Philosoph aus dem 4. Jahrhundert v. Chr.",
    "Gründete in Athen die Akademie",
    "Schrieb das Höhlengleichnis, Lehrer des Aristoteles" ]},

  { antwort: "Kopernikus", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Astronom aus dem 16. Jahrhundert",
    "Stammte aus Thorn im heutigen Polen",
    "Stellte die Sonne statt der Erde in den Mittelpunkt" ]},

  { antwort: "Galilei", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Naturforscher aus dem 17. Jahrhundert",
    "Beobachtete als einer der Ersten mit dem Fernrohr",
    "Entdeckte die vier großen Jupitermonde" ]},

  { antwort: "Kepler", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Astronom aus dem 17. Jahrhundert",
    "Wirkte unter anderem in Prag und Linz",
    "Fand heraus, dass Planeten sich auf Ellipsen bewegen" ]},

  { antwort: "Pythagoras", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Mathematiker aus dem 6. Jahrhundert v. Chr.",
    "Gründete eine Gemeinschaft in Süditalien",
    "Nach ihm ist ein Satz über rechtwinklige Dreiecke benannt" ]},

  { antwort: "Euklid", gebiet: "geschichte", bekanntheit: 3, hinweise: [
    "Ein Mathematiker aus dem alten Alexandria",
    "Lebte um 300 v. Chr.",
    "Ordnete die Geometrie in seinem Werk Die Elemente" ]},

  { antwort: "Archimedes", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Gelehrter aus dem 3. Jahrhundert v. Chr.",
    "Lebte in Syrakus auf Sizilien",
    "Fand das Auftriebsgesetz, angeblich in der Badewanne" ]},

  { antwort: "Gandhi", gebiet: "geschichte", bekanntheit: 1, hinweise: [
    "Ein Politiker aus dem 20. Jahrhundert",
    "Setzte auf gewaltfreien Widerstand",
    "Führte Indien in die Unabhängigkeit von Großbritannien" ]},

  { antwort: "Mandela", gebiet: "geschichte", bekanntheit: 1, hinweise: [
    "Ein Politiker aus dem 20. Jahrhundert",
    "Saß 27 Jahre im Gefängnis",
    "Wurde erster schwarzer Präsident Südafrikas" ]},

  { antwort: "Elisabeth", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Eine Herrscherin aus dem 16. Jahrhundert",
    "Regierte England 45 Jahre lang",
    "Unter ihr scheiterte die spanische Armada" ]},


  { antwort: "Vasco", gebiet: "geschichte", bekanntheit: 3, hinweise: [
    "Ein Seefahrer aus Portugal",
    "Segelte um das Kap der Guten Hoffnung",
    "Erreichte 1498 als Erster Indien auf dem Seeweg" ]},

  { antwort: "Cook", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Seefahrer aus dem 18. Jahrhundert",
    "Unternahm drei große Reisen in den Pazifik",
    "Kartierte Neuseeland und die Ostküste Australiens" ]},

  { antwort: "Hammurabi", gebiet: "geschichte", bekanntheit: 3, hinweise: [
    "Ein Herrscher aus Mesopotamien",
    "Regierte Babylon vor rund 3.700 Jahren",
    "Ließ eine der ältesten bekannten Gesetzessammlungen in Stein hauen" ]},

  { antwort: "Tutanchamun", gebiet: "geschichte", bekanntheit: 2, hinweise: [
    "Ein Herrscher aus dem alten Ägypten",
    "Starb sehr jung, regierte nur wenige Jahre",
    "Sein weitgehend unversehrtes Grab wurde 1922 gefunden" ]},


  /* ---------------- Kultur ---------------- */
  { antwort: "Vivaldi", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Komponist aus dem 18. Jahrhundert",
    "Wirkte in Venedig, war auch Priester",
    "Schrieb Die vier Jahreszeiten" ]},

  { antwort: "Haydn", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Komponist aus dem 18. Jahrhundert",
    "Arbeitete lange am Hof der Fürsten Esterházy",
    "Gilt als Wegbereiter der Sinfonie und des Streichquartetts" ]},

  { antwort: "Wagner", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Komponist aus dem 19. Jahrhundert",
    "Baute in Bayreuth ein eigenes Festspielhaus",
    "Schrieb den vierteiligen Ring des Nibelungen" ]},

  { antwort: "Verdi", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Komponist aus dem 19. Jahrhundert",
    "Stammte aus Italien, schrieb vor allem Opern",
    "Verfasste Aida, Rigoletto und La Traviata" ]},

  { antwort: "Rembrandt", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Maler aus dem 17. Jahrhundert",
    "Arbeitete in Amsterdam, berühmt für Licht und Schatten",
    "Malte Die Nachtwache" ]},

  { antwort: "Michelangelo", gebiet: "kultur", bekanntheit: 1, hinweise: [
    "Ein Künstler aus dem 16. Jahrhundert",
    "Arbeitete als Bildhauer, Maler und Baumeister",
    "Schuf den David und die Decke der Sixtinischen Kapelle" ]},

  { antwort: "Leonardo", gebiet: "kultur", bekanntheit: 1, hinweise: [
    "Ein Künstler aus der Renaissance",
    "Zeichnete Flugmaschinen und anatomische Studien",
    "Malte die Mona Lisa und das Abendmahl" ]},

  { antwort: "Klimt", gebiet: "kultur", bekanntheit: 3, hinweise: [
    "Ein Maler aus Wien",
    "Arbeitete um 1900, verwendete oft Blattgold",
    "Malte Der Kuss" ]},

  { antwort: "Dali", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Maler aus dem 20. Jahrhundert",
    "Stammte aus Katalonien, bekannt für seinen Schnurrbart",
    "Malte die zerfließenden Uhren" ]},

  { antwort: "Frida", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Eine Malerin aus dem 20. Jahrhundert",
    "Stammte aus Mexiko, malte viele Selbstbildnisse",
    "Ihr Werk verarbeitet schwere körperliche Leiden" ]},

  { antwort: "Dostojewski", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Schriftsteller aus dem 19. Jahrhundert",
    "Stammte aus Russland, war zeitweise in Sibirien verbannt",
    "Schrieb Schuld und Sühne sowie Die Brüder Karamasow" ]},

  { antwort: "Cervantes", gebiet: "kultur", bekanntheit: 3, hinweise: [
    "Ein Schriftsteller aus Spanien",
    "Lebte um 1600, war zeitweise in Gefangenschaft",
    "Schrieb Don Quijote" ]},

  { antwort: "Dante", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Dichter aus dem Mittelalter",
    "Stammte aus Florenz, starb im Exil",
    "Schrieb Die Göttliche Komödie" ]},

  { antwort: "Homer", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Dichter der Antike",
    "Über sein Leben ist fast nichts gesichert",
    "Ihm werden Ilias und Odyssee zugeschrieben" ]},

  { antwort: "Ilias", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Werk der antiken Literatur",
    "Erzählt vom Zorn des Achilles",
    "Handelt vom Krieg um Troja" ]},

  { antwort: "Macbeth", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Theaterstück aus Schottland",
    "Beginnt mit einer Prophezeiung dreier Hexen",
    "Shakespeare erzählt darin von Machtgier und Schuld" ]},

  { antwort: "Fidelio", gebiet: "kultur", bekanntheit: 3, hinweise: [
    "Eine Oper aus dem 19. Jahrhundert",
    "Eine Frau verkleidet sich als Mann, um ihren Mann zu befreien",
    "Die einzige Oper Beethovens" ]},

  { antwort: "Guernica", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Gemälde aus dem 20. Jahrhundert",
    "Entstand 1937, ausschließlich in Grau- und Schwarztönen",
    "Picasso verarbeitete darin die Bombardierung einer Stadt" ]},

  { antwort: "Louvre", gebiet: "kultur", bekanntheit: 2, hinweise: [
    "Ein Museum in Europa",
    "Liegt in Paris, war früher ein Königspalast",
    "Vor dem Eingang steht eine gläserne Pyramide" ]},

  { antwort: "Sixtinische", gebiet: "kultur", bekanntheit: 3, hinweise: [
    "Ein Bauwerk im Vatikan",
    "Hier wählen die Kardinäle den Papst",
    "Berühmt für die Deckenmalerei Michelangelos" ]}

];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { FRAGEN };
}
