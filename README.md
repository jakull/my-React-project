# Quiz-App Editor

In Kooperation mit der Hochschule RheinMain sollte in diesem Projekt ein User-Interface erstellt werden, welches es Lehrenden erlaubt den Fragenkatalog einer Quiz-App zu verwalten.
Dabei sollen Fragen multimedial aufbereitet werden können. Etwa durch das einbinden von Text, Image, Video oder Audio-Dateien.

---


## Installation

1. Projekt initialisieren

Initialisiere ein neues Expo-Projekt mit dem Befehl:

```bash
expo init dein-expo-projekt
cd dein-expo-projekt
```

2. js-Dateien übertragen

Kopiere die relevanten .js-Dateien aus dem GitHub-Repository in das Projektverzeichnis.

3. Abhängigkeiten installieren

installiere die nötigen Abhängigkeiten aus der package.json:

```bash
npm install
```
4. Expo-App starten

```bash
npx expo start
```
Drücke dann w um die Anwendung im Web-modus zu starten.

---
## Einbindung der Firebase Datenbank

Dieses Projekt verwendet die Firebase Realtime Database von Google. Um auf den Datensatz des Projekts zuzugreifen erstellen sie zuerst einen Firebase Account und legen dort eine neue Realtime Database an.
Prüfen Sie die Zugriffsregelungen. Zu Testzwecken können diese auf
```bash
{
  "rules": {
    ".read": "auth == null",
    ".write": "auth == null"
  }
}

```
gestellt werden.
Importieren Sie dann die JSON-Datei aus dem Repositorie in die neu erstellte Datenbank.


Um die Firebase-Datenbank in dieses Projekt zu integrieren, müssen Sie zuletzt noch Ihre Firebase-Projektkonfigurationsdaten in einer .env-Datei speichern. Erstellen Sie eine .env-Datei im Stammverzeichnis Ihres Projekts und fügen Sie Ihre Firebase-Konfigurationsvariablen hinzu, wie im folgenden Beispiel gezeigt:

```plaintext
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_DATABASE_URL=your-database-url
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```
---
## Projektbeschreibung

Nach dem Login soll der Editor zunächst einen Kurs auswählen, um die Kompetenzen/Fakten/Quellen von diesem bearbeiten zu können. Erst nach Auswahl des Kurses sind diese Optionen im
Drawer-Menü auswählbar. Selbe Logik gilt für die Auswahl des Spiels, welche das editieren von Challenges und Achievements ermöglichen soll.
Mit dem jetzigen Stand der Anwendung können bislang nur die Kompetenzen des Kurses "Klimawandel" bearbeitet werden.

Wird der Kurs Klimawandel gewählt, so sind in der Folge im Drawer die Auswahlmöglichkeiten Kompetenzen/Fakten/Quellen auswählbar. Unter Kompetenzen kann der Aufbau einer Frage definiert werden.

Im KompetenzenWahlScreen kann nun, bei korrekter Einbindung der Firebase Datenbank, eine bestehende Frage zum Editieren gewählt werden. Mit einem Suchfeld können die angezeigten Optionen im Picker
eingegrenzt werden. Außerdem können an dieser Stelle neue Kompetenzen (Fragen/Storyelemente) hinzugefügt oder entfernt werden.

Wird eine Kompetenz gewählt oder neu hinzugefügt, so gelangt man auf den KategorienWahlScreen. Hier kann der Aufbau einer Frage definiert werden.
Unter "Answers" können hier die Antwortmöglichkeiten(grün richtig/ rot falsch) aufgelistet werden. Diese Antwortmöglichkeiten können selbst wieder aus verschiedenen Content-Elementen (Text,Image,Video,Audio.. ) bestehen. Der Aufbau einer Antwort kann mit dem Edit-Icon
rechts neben dem beschreibenden Antwort-Text definiert werden. Im EditScreen kann auch die Validity (true/false) der Antwortmöglichkeit geändert werden.
