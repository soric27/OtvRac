#  Skup otvorenih podataka: Poznati nogometni klubovi

##  Opis skupa podataka
Ovaj skup podataka prikazuje osnovne informacije o **poznatim europskim nogometnim klubovima**.  
Svaki zapis opisuje jedan klub te uključuje osnovne podatke o njegovu nazivu, gradu, stadionu, treneru, broju naslova i nekoliko istaknutih igrača.  
Podaci su izrađeni ručno u okviru kolegija **Otvoreno računarstvo** i predstavljaju primjer strukturiranih **otvorenih podataka**.

---

##  Struktura podataka
Svaki dokument (redak u JSON/CSV datoteci) sadrži sljedeće atribute:

| Atribut | Opis |
|----------|------|
| Naziv | Naziv nogometnog kluba |
| Grad | Grad u kojem klub djeluje |
| Država | Država u kojoj klub djeluje |
| Sport | Vrsta sporta (u ovom slučaju nogomet) |
| Liga | Liga u kojoj klub trenutno nastupa |
| Godina_osnutka | Godina osnutka kluba |
| Stadion_dvorana | Naziv glavnog stadiona |
| Kapacitet | Kapacitet stadiona |
| Glavni_trener | Objekt koji sadrži ime i prezime trenera |
| Naslovi_prvaka | Broj osvojenih nacionalnih prvenstava |
| Igrači | Polje objekata koji predstavljaju igrače (ime, prezime, pozicija) |

---

##  Formati podataka
Skup podataka dostupan je u dva otvorena formata:
- **JSON** – `sports_clubs_open_data.json`  
- **CSV** – `klubovi_export.csv` (generiran iz MongoDB baze pomoću `mongoexport` alata)

---

##  Metapodaci
| Ključ | Vrijednost |
|-------|-------------|
| **Naziv skupa** | Poznati nogometni klubovi |
| **Broj instanci** | 10 |
| **Broj atributa** | 11 |
| **Verzija** | 1.0 |
| **Autor** | Ivano Sorić |
| **Datum izrade** | 26. listopada 2025. |
| **Jezik** | Hrvatski |
| **Kôdna stranica** | UTF-8 |
| **Izvor** | Ručno izrađeni otvoreni podaci temeljeni na javno dostupnim informacijama o nogometnim klubovima |
| **Licenca** | Creative Commons Attribution 4.0 International (CC BY 4.0) |
| **Platforma za pohranu** | MongoDB |
| **Formati izvoza** | JSON, CSV |
| **Svrha skupa** | Primjer strukturiranih otvorenih podataka i demonstracija uvoza/izvoza u MongoDB sustavu |

---



## Uvoz u MongoDB
```bash
mongoimport --db sport --collection klubovi --file "sports_clubs_open_data.json" --jsonArray --drop
