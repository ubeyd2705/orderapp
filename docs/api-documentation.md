# Hinweise zur Integration und Nutzung der Backend-API

Die „API“ der OrderApp läuft vollständig über **Firebase**:

- **Authentifizierung** per E-Mail/Passwort (Methode `signInWithEmailAndPassword` bzw. `createUserWithEmailAndPassword`).  
- **Firestore Collections** wie `AllOrders`, `CurrentOrder<UID>`, `myOrders<ID>` usw.  
- CRUD-Operationen (Create, Read, Update, Delete) geschehen über Firestore-Funktionen (`collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, …).

In der [API-Dokumentation](./docs/api-documentation.md) kann man genauer nachlesen, wie die Collections strukturiert sind, z. B.:

- **`AllOrders`** – Enthält sämtliche Bestellungen im System.  
- **`tables`** – Speichert, ob ein Tisch bereits gebucht wurde (und zu welcher Uhrzeit).  
- **`user`** – Enthält Infos zu jedem registrierten Benutzer (Vor-/Nachname, Vibrationseinstellungen, LoyaltyPoints etc.).

## Navigation

[Zurück zur Hauptseite](../README.md)
