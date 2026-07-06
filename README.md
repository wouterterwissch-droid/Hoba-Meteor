# Hoba-Meteor

First step of change to Data Driven Maintenance.

## FMECA tool voor Cargill Multiseed Amsterdam

Deze repository bevat een statische Nederlandstalige FMECA-tool waarmee maintenance- en productie-teams faalwijzen kunnen vastleggen, scoren en prioriteren.

### Gebruik

1. Open `index.html` in een browser of serveer de map lokaal:
   ```bash
   python3 -m http.server 4173
   ```
2. Vul per asset de functie, faalwijze, effecten en scores voor ernst, voorkomen en detectie in.
3. Gebruik de RPN-score en kriticiteitsklasse om onderhoudsacties te prioriteren.
4. Exporteer het register naar CSV voor rapportage of verdere analyse.

### Functionaliteit

- RPN-berekening op basis van ernst, voorkomen en detectie.
- Automatische indeling in lage, middelhoge en hoge kriticiteit.
- Voorbeelden passend bij multiseed-procesassets.
- Lokale opslag in de browser, zodat ingevoerde regels bewaard blijven.
- CSV-export voor analyse en opvolging.
