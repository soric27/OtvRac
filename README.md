# Skup otvorenih podataka: Sportski klubovi u Hrvatskoj

## Opis skupa podataka
Ovaj skup podataka prikazuje osnovne informacije o sportskim klubovima u Hrvatskoj iz različitih sportova (nogomet, košarka, odbojka, rukomet, vaterpolo, hokej). Svaki zapis opisuje jedan klub, njegove osnovne karakteristike, glavnog trenera i popis igrača.

## Struktura podataka
Svaki dokument (red) sadrži sljedeće atribute:
| Atribut | Opis |
|----------|------|
| ID | Jedinstveni identifikator kluba |
| Naziv | Naziv sportskog kluba |
| Grad | Grad u kojem klub djeluje |
| Država | Država u kojoj klub djeluje |
| Sport | Vrsta sporta |
| Liga | Liga u kojoj klub trenutno igra |
| Godina_osnutka | Godina osnutka kluba |
| Stadion_dvorana | Naziv glavnog stadiona ili dvorane |
| Kapacitet | Kapacitet gledališta |
| Web | Službena web stranica |
| Glavni_trener | Objekt s imenom i prezimenom trenera |
| Naslovi_prvaka | Broj osvojenih prvenstava |
| Igrači | Polje objekata koji predstavljaju igrače (ime, prezime, pozicija) |

## Formati podataka
Skup podataka dostupan je u dva otvorena formata:
- **JSON** – `sports_clubs_open_data.json`
- **CSV** – `klubovi_export.csv`

## Metapodaci
| Ključ | Vrijednost |
|-------|-------------|
| Naziv skupa | Sportski klubovi u Hrvatskoj |
| Broj instanci | 10 |
| Broj atributa | 13 |
| Verzija | 1.0 |
| Autor | Ivano Sorić |
| Datum izrade | 26. listopada 2025. |
| Jezik | hrvatski |
| Kodna stranica | UTF-8 |
| Izvor | Ručno izrađeni otvoreni podaci |
| Licenca | Creative Commons CC-BY 4.0 |
| Platforma za pohranu | MongoDB |
| Formati izvoza | JSON, CSV |

## Uvoz u MongoDB
```bash
mongoimport --db sport --collection klubovi --file "sports_clubs_open_data.json" --jsonArray --drop
