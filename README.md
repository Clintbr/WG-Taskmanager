# WG TaskManager - Aufgabenverwaltung für Wohngemeinschaften

![WG TaskManager Preview]("assets/images/prjkt9.png")
Eine moderne, benutzerfreundliche Webanwendung zur Verwaltung von Aufgaben in Wohngemeinschaften. Mit dem WG TaskManager können Mitbewohner Aufgaben erstellen, zuweisen, verfolgen und verwalten – alles an einem zentralen Ort.

## ✨ Funktionen

- **📋 Aufgabenverwaltung**: Erstellen, bearbeiten und löschen Sie Aufgaben mit Titel, Beschreibung, Kategorie, Priorität und Fälligkeitsdatum
- **👥 Mitbewohner-Verwaltung**: Fügen Sie Mitbewohner hinzu und weisen Sie ihnen Aufgaben zu
- **🎯 Intelligente Filter**: Filtern Sie Aufgaben nach Status, Mitbewohner oder Kategorie
- **📊 Dashboard**: Übersichtliche Statistiken und anstehende Aufgaben
- **🔔 Benachrichtigungen**: Erinnerungen für überfällige und bald fällige Aufgaben
- **💾 Datenexport**: Sichern Sie Ihre Daten als JSON-Datei
- **📱 Responsive Design**: Optimiert für Desktop und Mobilgeräte
- **🎨 Modernes UI**: Ansprechendes Design mit der Hauptfarbe #8e0b76

## 🚀 Schnellstart

### Voraussetzungen

- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Optional: Lokaler Webserver (für erweiterte Funktionen)

### Installation

1. Repository klonen oder herunterladen
2. Alle Dateien in einem Verzeichnis ablegen
3. `index.html` im Browser öffnen

```bash
# Beispiel mit integriertem Python-Webserver
python -m http.server 8000
# Anschließend im Browser: http://localhost:8000
```

## 📁 Projektstruktur

```
wg-taskmanager/
│
├── index.html                # Haupt-HTML-Datei
│
├── assets/                   # Statische Dateien
│   ├── css/
│   │   ├── style.css         # Globales Styling
│   │   └── components.css    # Komponenten-spezifisches Styling
│   │
│   ├── images/               # Icons, Bilder etc.
│   │
│   └── js/
│       └── app.js            # Haupt-JavaScript-Datei mit allen Funktionen
│
└── README.md                 # Diese Datei
```

## 🛠️ Technologien

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: Flexbox, CSS Grid, Custom Properties
- **Icons**: Font Awesome
- **Avatare**: UI Avatars API
- **Datenpersistenz**: Browser localStorage

## 📋 Verwendung

### Dashboard
Das Dashboard bietet einen Überblick über:
- Ausstehende, erledigte und überfällige Aufgaben
- Anzahl der Mitbewohner
- Heute fällige Aufgaben
- Kommende Aufgaben in der nächsten Woche

### Aufgaben erstellen
1. Klicken Sie auf "Neue Aufgabe"
2. Füllen Sie das Formular aus:
   - Titel (erforderlich)
   - Beschreibung (optional)
   - Kategorie (erforderlich)
   - Priorität (erforderlich)
   - Zugewiesen an (erforderlich)
   - Fälligkeitsdatum (erforderlich)
3. Klicken Sie auf "Speichern"

### Aufgaben verwalten
- **Filterung**: Nutzen Sie die Filteroptionen, um Aufgaben nach Status, Mitbewohner oder Kategorie anzuzeigen
- **Bearbeiten**: Klicken Sie auf das Bearbeiten-Symbol (Stift) bei einer Aufgabe
- **Löschen**: Klicken Sie auf das Löschen-Symbol (Mülleimer) bei einer Aufgabe
- **Als erledigt markieren**: Aktivieren Sie die Checkbox neben einer Aufgabe

### Mitbewohner hinzufügen
1. Wechseln Sie zur "Mitbewohner"-Ansicht
2. Klicken Sie auf "Mitbewohner hinzufügen"
3. Geben Sie Name, E-Mail und Telefonnummer (optional) ein
4. Klicken Sie auf "Speichern"

### Einstellungen
- **Benachrichtigungen**: Aktivieren/deaktivieren Sie Erinnerungen
- **Erinnerungszeit**: Legen Sie fest, wie viele Tage vor Fälligkeit benachrichtigt werden soll
- **Datenexport**: Sichern Sie alle Daten als JSON-Datei
- **Daten zurücksetzen**: Setzen Sie die Anwendung auf die Standardeinstellungen zurück

## 🎨 Design

Die Anwendung verwendet ein modernes, benutzerfreundliches Design mit:

- **Hauptfarbe**: #8e0b76 (ein kräftiges Pink)
- **Kontrastfarben**: Für Statusinformationen (Erfolg, Warnung, Fehler)
- **Responsive Layout**: Passt sich an verschiedene Bildschirmgrößen an
- **Intuitive Navigation**: Klare Struktur mit seitlicher Navigation

### Farbpalette
- Primär: #8e0b76
- Primär hell: #b13d9a
- Primär dunkel: #6a0858
- Erfolg: #4caf50
- Warnung: #ff9800
- Fehler: #f44336
- Info: #2196f3

## 🔧 Anpassungen

### Aufgabenkategorien
Die Anwendung unterstützt folgende Kategorien:
- 🧹 Putzen
- 🛒 Einkaufen
- 🍳 Kochen
- 🔧 Wartung
- ⭐ Sonstiges

### Prioritätsstufen
- Niedrig
- Mittel
- Hoch

### Benachrichtigungen
Die Anwendung warnt vor:
- Überfälligen Aufgaben
- Bald fälligen Aufgaben (basierend auf den Einstellungen)

## 💾 Datenpersistenz

Die Anwendung verwendet den localStorage des Browsers zur Datenspeicherung. Dies bedeutet:

- **Vorteile**: Keine Server-Konfiguration notwendig, funktioniert offline
- **Einschränkungen**: Daten sind browserspezifisch und werden gelöscht, wenn der Browser-Cache geleert wird

### Datenexport
Sie können alle Daten exportieren, um sie zu sichern oder auf einem anderen Gerät zu importieren.

## 🌐 Browserunterstützung

- Chrome (empfohlen, Version 60+)
- Firefox (Version 55+)
- Safari (Version 12+)
- Edge (Version 79+)

## 📝 Bekannte Einschränkungen

- Daten sind auf einen Browser beschränkt
- Keine Echtzeit-Synchronisation zwischen mehreren Benutzern
- Begrenzte Speicherkapazität durch localStorage

## 🚀 Zukünftige Erweiterungen

Geplante Funktionen für zukünftige Versionen:

- [ ] Backend-Integration mit Datenbank
- [ ] Benutzerauthentifizierung
- [ ] Echtzeit-Updates zwischen mehreren Benutzern
- [ ] Push-Benachrichtigungen
- [ ] Wiederkehrende Aufgaben
- [ ] Aufgaben-Historie und Statistiken
- [ ] Mobile App-Version

## 🤝 Beitragen

Beiträge sind willkommen! So können Sie mithelfen:

1. Forken Sie das Projekt
2. Erstellen Sie einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushen Sie den Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie einen Pull Request

## 👥 Mitwirkende

- **Clint B. Nguena** - *Initialarbeit* - [GitHub-Profil](https://github.com/Clintbr/WG-Taskmanager)

## 🙏 Danksagung

- [Font Awesome](https://fontawesome.com/) für die großartigen Icons
- [UI Avatars](https://ui-avatars.com/) für die Avatar-Generierung

## 📧 Kontakt

Bei Fragen oder Anregungen wenden Sie sich bitte an:

- E-Mail: nguenaclintbryan@gmail.com
- GitHub: [WG TaskManager Repository](https://github.com/Clintbr/WG-Taskmanager)

---

**Hinweis**: Dies ist eine Frontend-Demo-Implementation. Für eine Produktivumgebung wird ein sicheres Backend mit Authentifizierung und Datenvalidierung benötigt.
