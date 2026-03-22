# Portfolio + Admin

Ein statisches Portfolio mit eigenem Admin-Bereich (Vanilla HTML/CSS/JavaScript).

## Features
- Portfolio-Inhalte aus `localStorage` rendern
- Admin Login mit Passwort-Hash
- Visuelle Manager für:
  - Projekte (Titel, Beschreibung, Tags, Link, Bild)
  - Skills
  - Ausbildung
  - Berufserfahrung
  - Persönliche Infos
- Hero/Logo Upload
- About-Tabs auf der Portfolio-Seite

## Projektstruktur
- `Index.html` – Portfolio Seite
- `style.css` – Portfolio Styles
- `script.js` – Portfolio Rendering & Interaktion
- `admin.html` – Admin Oberfläche
- `admin.css` – Admin Styles
- `admin.js` – Admin Logik
- `portfolio-data.js` – Datenmodell + Persistenz (`localStorage`)
- `images/` – Statische Bilder (Logo, Projektbilder)

## Lokal starten
Da es eine statische Seite ist:
1. `Index.html` im Browser öffnen
2. `admin.html` öffnen für Bearbeitung

## Admin Zugang
- Passwort ist in `admin.js` als SHA-256 Hash gespeichert.
- Bei Bedarf Passwort ändern:
  1. Neues Passwort hashen
  2. `ADMIN_PASSWORD_HASH` in `admin.js` ersetzen

## Datenhaltung
- Storage Key: `portfolioDataV1`
- Reset auf Standarddaten über Button im Admin

## GitHub Upload (Kurz)
1. Repository auf GitHub erstellen
2. Lokal im Projektordner ausführen:
   - `git init`
   - `git add .`
   - `git commit -m "Initial portfolio version"`
   - `git branch -M main`
   - `git remote add origin <DEIN_REPO_URL>`
   - `git push -u origin main`

## Hinweise
- Große Bilder erhöhen `localStorage`-Größe.
- Upload-Limit im Admin ist aktuell auf 2.5 MB gesetzt.
