# Wichtige Komponenten

In diesem Dokument werden zentrale Bausteine der **OrderApp** aufgeführt und kurz erklärt.

## 1. AuthProvider (authprovider.tsx)

- **Funktion**: Verwaltet Benutzerzustand (Login, Logout, Signup, Firestore-Daten).
- **Wichtigste Methoden**:
  - `login(email, password)`: Meldet einen Nutzer per E-Mail/Passwort an.
  - `signup(...)`: Legt neuen Benutzer an.
  - `logout()`: Meldet Benutzer ab.

## 2. OrderIDContext (orderIdContext.tsx)

- **Funktion**: Hält eine fortlaufende Bestell-ID oder einen Zähler bereit.
- **Typischer Einsatz**: Erstellen einer neuen Bestellnummer, wenn ein Kunde bestellt.

## 3. ShoppingCartNumberContext (shoppingCartNumberContext.tsx)

- **Funktion**: Speichert global die Anzahl von Artikeln im Einkaufswagen.
- **Typischer Einsatz**: Um sofort z. B. in der Tab-Navigation anzuzeigen, wie viele Artikel im Warenkorb sind.

## 4. useThemeColor / ThemeContext

- **Funktion**: Unterstützt Dark-/Lightmode via React Native-Funktion `useColorScheme` und eigenem Kontext `_themeContext.tsx`.
- **Vorteil**: Alle Komponenten können dynamisch die „richtige“ Farbe wählen.

## 5. Firebase (firebase.ts)

- **Funktion**: Enthält die Firebase-Konfiguration (API-Key, Project-ID etc.).
- **Auth**: `initializeAuth` (für React Native) bzw. `getAuth` (für Web).
- **Firestore**: `getFirestore` für CRUD-Operationen.

## 6. Weitere UI-Komponenten

- **ShoppingCart**: Popup oder Modal, um alle Artikel im Warenkorb zu sehen und ggf. anzupassen.
- **DeliveredOrders**: Zeigt bereits servierte Bestellungen an.
- **IncomingOrders**: Zeigt Bestellungen, die noch nicht serviert sind.

## Navigation

[Zurück zur Hauptseite](../README.md)
