# O projekcie

http://miastojestnasze.org/warszawska-mapa-reprywatyzacji/

# Technologie

- d3.js
- npm do pobierania zależności (zamiast bower) oraz jako buildtool (zamiast gulp czy grunt)
- browserify (do obsługi modułów i paczkowania kodu)  

# HOWTO

## Wymagania

- node.js (w wersji 0.10 lub wyższej)
- npm (w wersji 1.4.28 lub wyższej)
- UNIX'owy bash


## Praca lokalna nad projektem

Zainstaluj zależności zdefiniowane w package.json:

```bash
npm install
```

Odpal projekt lokalnie przy pomocy:

```bash
npm run dev
```

Skopiuje to pliki statyczne do folderu `dist`, przekonwertuje pliki LESS do CSS, skompiluje Javascript wraz z source-mapami przy pomocy browserify i uruchomi lokalny serwer http. Projekt jest dostępny w przeglądarce pod adresem http://localhost:8000. Dzięki mechanizmowi watch'y oraz live-reload strona projekt jest automatycznie przebudowywany po zmianach, a strona automatycznie przeładowywana.

## Wersja produkcyjna

```bash
npm run clean
npm run build
```

Tak przygotowany folder `dist` można wysłać na serwer np. przy pomocy rsync'a. Dzięki skryptowi zdefiniowanym w `package.json` wystarczy do tego alias:

```bash
npm run deploy
```

# Licencja

Creative Commons Attribution-NonCommercial-ShareAlike
