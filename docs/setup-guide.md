# Liste der Abhängigkeiten & Schritte zur lokalen Installation

| Name                          | Version (Beispiel) | Zweck                                   |
| ----------------------------- | ------------------ | --------------------------------------- |
| expo                          | ^49.0.0            | Expo CLI & SDK                          |
| react                         | ^18.0.0            | Grundframework für React Native         |
| react-native                  | ^0.72.0            | Kern von React Native                   |
| firebase                      | ^9.0.0             | Firebase SDK (Auth, Firestore)          |
| nativewind                    | ^2.0.11            | Tailwind-Unterstützung für RN           |
| react-native-toast-message    | ^2.1.6             | Visuelle Toast-Meldungen                |
| expo-router                   | ^2.x.x             | Routing & Navigation                    |
| ...                           | ...                | ...                                     |

## Kurze Anleitung zur Installation und Ausführung

1. **Projekt klonen** (oder ZIP herunterladen und entpacken):

   ```bash
   git clone https://github.com/deinBenutzername/OrderApp.git
   cd OrderApp
   ```

2. **Abhängigkeiten installieren:**

    ```bash
    npm install
    ```

    oder

    ```bash
    yarn
    ```

    Starte Expo (Metro Bundler):

    ```bash
    npx expo start
    ```

Anschließend kann man den QR-Code mit der Expo Go App scannen (iOS/Android) oder im Emulator starten.
.env-Konfiguration (optional):
Da Firebase hier im Code hinterlegt ist, braucht man ggf. keine separate .env. Falls du eigene Keys verwendest, erstelle eine .env-Datei.

## Navigation

[Zurück zur Hauptseite](../README.md)
