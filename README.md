# Portfolio + Admin

Ein statisches Portfolio mit eigener Admin-Seite auf Basis von Vanilla HTML, CSS und JavaScript.

## Features
- Portfolio-Inhalte direkt in `script.js` pflegen
- Admin Login mit Passwort-Hash
- Manager fuer Projekte, Skills, Ausbildung, Berufserfahrung und persoenliche Infos
- Hero/Logo Upload im Admin
- About-Tabs auf der Portfolio-Seite

## Projektstruktur
- `Index.html` - Portfolio-Seite
- `style.css` - Portfolio-Styles
- `script.js` - Portfolio-Inhalte, Rendering und Interaktion
- `admin.html` - Admin-Oberflaeche
- `admin.css` - Admin-Styles
- `admin.js` - Admin-Logik
- `portfolio-data.js` - Legacy-Datenmodell mit `localStorage` fuer den Admin-Bereich
- `images/` - Statische Bilder wie Logo und Projektbilder

## Lokal starten
Da es eine statische Seite ist:
1. `Index.html` im Browser oeffnen
2. Inhalte direkt in `script.js` im Block `portfolioContent` bearbeiten
3. `admin.html` ist optional und beeinflusst die Portfolio-Startseite nicht mehr

## Admin Zugang
- Das Passwort ist in `admin.js` als SHA-256-Hash gespeichert.
- Wenn du es aendern willst:
  1. Neues Passwort hashen
  2. `ADMIN_PASSWORD_HASH` in `admin.js` ersetzen

## Datenhaltung
- Storage Key: `portfolioDataV1`
- Der Admin nutzt weiter `localStorage`
- Die Portfolio-Startseite liest ihre Inhalte nicht mehr aus `localStorage`

## GitHub Upload
1. Repository auf GitHub erstellen
2. Lokal im Projektordner ausfuehren:
   - `git init`
   - `git add .`
   - `git commit -m "Initial portfolio version"`
   - `git branch -M main`
   - `git remote add origin <DEIN_REPO_URL>`
   - `git push -u origin main`

## Hinweise
- Grosse Bilder erhoehen weiterhin die `localStorage`-Groesse im Admin
- Das Upload-Limit im Admin liegt aktuell bei 2.5 MB
