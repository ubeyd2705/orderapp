# Projektstruktur

## Frontend (React Native / Expo)

- **`app/`** (Hauptordner für Expo Router und Screens)

  - **`(stuffTabs)/`**
    - [**\_layout.tsx**](<../app/(stuffTabs)/_layout.tsx>): Definiert das Tab-Layout für Mitarbeiter
    - [**delivered.tsx**](<../app/(stuffTabs)/delivered.tsx>): Zeigt bereits servierte Bestellungen an
    - [**index.tsx**](<../app/(stuffTabs)/index.tsx>): Übersicht über eingehende Bestellungen
  - **`(tabs)/`**
    - [**\_layout.tsx**](<../app/(tabs)/_layout.tsx>): Definiert das Tab-Layout für Endnutzer
    - [**bewertungTab.tsx**](<../app/(tabs)/bewertungTab.tsx>): Tab für Produktbewertungen
    - [**einkaufswagen.tsx**](<../app/(tabs)/einkaufswagen.tsx>): Einkaufswagenansicht
    - [**index.tsx**](<../app/(tabs)/index.tsx>): Hauptstartseite (Kunden-Sicht)
    - [**profil.tsx**](<../app/(tabs)/profil.tsx>): Profilseite mit Einstellungen & Favoriten
  - [**\_layout.tsx**](../app/_layout.tsx): Globales Stack-/Layout-File für die gesamte Router-Hierarchie
  - [**+not-found.tsx**](../app/+not-found.tsx): 404-Seite für ungültige Routen
  - [**chooseOfTable.tsx**](../app/chooseOfTable.tsx): Ermöglicht die Tischreservierung
  - [**impressum.tsx**](../app/impressum.tsx): Impressums- / rechtliche Hinweise
  - [**landing.tsx**](../app/landing.tsx): Login- und Gast-Startseite
  - [**ListofFavoriteFoods.tsx**](../app/ListofFavoriteFoods.tsx): Liste der favorisierten Speisen
  - [**redeemPoints.tsx**](../app/redeemPoints.tsx): Screen zum Einlösen von Treuepunkten
  - [**s_changeData.tsx**](../app/s_changeData.tsx): Screen zum Ändern von Benutzerdaten (z. B. Name, E-Mail)
  - [**signUp.tsx**](../app/signUp.tsx): Registrierungsseite für neue Benutzer

- **`components/`** (Wiederverwendbare UI-Komponenten und benutzerdefinierte Bausteine)

  - [**IncomingOrders.tsx**](../components/IncomingOrders.tsx): Zeigt eingehende Bestellungen (Mitarbeiter-Sicht)
  - [**IncomingOrders.tsx**](../components/IncomingOrders.tsx): Zeigt eingehende Bestellungen in der Mitarbeiter-Sicht

- **`constants/`** (Globale Zustände, Konstants und Typdefinitionen)
- [**\_AllOrders.tsx**](../constants/_AllOrders.tsx): Funktion um die Bestellungen aus der Collection "AllOrders" zu laden
- [**\_products.tsx**](../constants/_products.tsx): lädt die Produkte aus der Collection "products"
- [**\_themeContext.tsx**](../constants/_themeContext.tsx): Eigener Kontext, um Dark/Light-Mode zu verwalten
- [**authprovider.tsx**](../constants/authprovider.tsx): Enthält den Auth-Context (Login, Logout, Signup, Firestore-Integration, etc)
- [**Colors.ts**](../constants/Colors.ts): Definiert ein Objekt mit hellen/dunklen Farben
- [**data.tsx**](../constants/data.tsx): wierverwendbare lokale Daten
- [**orderIdContext.tsx**](../constants/orderIdContext.tsx): Context zum Verwalten einer Bestell-ID
- [**types.ts**](../constants/types.ts): TypeScript-Interfaces für Bestellungen, Produkte, User etc.

- **`chelpfullfunctions/`** (Utility-Funktionen)
  - [**a_sizeOfCollection.tsx**](../chelpfullfunctions/a_sizeOfCollection.tsx): Funktion, um die Größe einer Firestore-Collection zu ermitteln
  - [**addToOrder.tsx**](../chelpfullfunctions/addToOrder.tsx): Fügt Produkte einer laufenden Bestellung hinzu
  - [**b_DeleteDocInCollection.tsx**](../chelpfullfunctions/b_DeleteDocInCollection.tsx): Entfernt Dokumente aus einer Collection
  - [**getAllTables.tsx**](../chelpfullfunctions/getAllTables.tsx): Holt die Tischinformationen aus der Firestore-Collection `tables`
  - [**getUserInitials.tsx**](../chelpfullfunctions/getUserInitials.tsx): Erzeugt Initialen aus dem Benutzernamen (z. B. „Max Mustermann“ → „MM“)

---

## Backend (Firebase)

- **`firebase/`**
  - [**firebase.ts**](../firebase/firebase.ts): Firebase-Konfiguration (API-Keys, `initializeApp`, `getFirestore`, `initializeAuth`)

Da das Projekt auf **Firebase** als Serverless-Backend setzt, existieren **keine** typischen Node.js- oder Express-Ordner wie `controllers`, `routes` oder `models`. Stattdessen werden Daten direkt via Firestore (CRUD-Operationen) und Auth (Anmeldung, Registrierung) verwaltet.

- **Firestore**
  - Collections wie `AllOrders`, `user`, `tables` etc.
- **Firebase Auth**
  - E-Mail/Passwort-Login in `authprovider.tsx`.

---

## Weitere relevante Dateien

- [**.gitignore**](../.gitignore): Ignoriert build-/config-Dateien (z. B. `node_modules/`, `.expo/`)
- [**README.md**](../README.md): Hauptdokumentation des Projekts
- [**app.json**](../app.json): Expo-spezifische Konfiguration (App-Name, Icon, Plugins)
- [**babel.config.js**](../babel.config.js): Babel-Konfiguration (z. B. `babel-preset-expo`, `nativewind/babel`)
- [**global.css**](../global.css): Enthält die Tailwind-Definitionen (`@tailwind base; @tailwind components; @tailwind utilities;`)
- [**metro.config.js**](../metro.config.js): Metro-Bundler-Einstellungen für das Projekt (inkl. `withNativeWind`)
- [**nativewind-env.d.ts**](../nativewind-env.d.ts): TypeScript-Definitionen für NativeWind
- [**package-lock.json**](../package-lock.json): Lock-Datei von npm, um exakte Paketversionen festzuhalten
- [**package.json**](../package.json): Enthält alle Dependencies (Expo, RN, Firebase usw.) und Scripts (z. B. `expo start`)
- [**tailwind.config.js**](../tailwind.config.js): Konfiguration für Tailwind CSS / NativeWind
- [**tsconfig.json**](../tsconfig.json): TypeScript-Einstellungen und Pfad-Aliases

---

## Navigation

[Zurück zur Hauptseite](../README.md)
