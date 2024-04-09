# DataServ

DataServ ist eine Backend-Anwendung, die darauf ausgelegt ist, Benutzern grundlegende CRUD-Operationen und erweiterte Funktionen wie Benutzerregistrierung, Login, Email-Bestätigung und ein integriertes Spendenmodul via BuyMeACoffee API zu bieten. Ziel ist es, nicht nur die Funktionalität bereitzustellen, sondern auch das Bewusstsein für die Daten zu schärfen, die wir oft unbewusst teilen.

## Funktionen

- **Benutzerregistrierung und -verwaltung**: Registrierung, Login, Passwortänderung, Email-Update und Kontolöschung.
- **Email-Bestätigung**: Sendet eine automatisch generierte Email nach der Registrierung mit Benutzerdaten und einem Bestätigungslink.
- **Password Reset**: Ermöglicht Benutzern das Zurücksetzen des Passworts über einen sicheren Prozess.
- **Spendenmodul**: Integriert die BuyMeACoffee API, um Benutzern zu ermöglichen, Spenden zu tätigen und zusätzliche Features freizuschalten.

## Technologien

- **Backend**: Node.js, Express.js, MongoDB, Nodemailer, Dotenv
- **Frontend**: HTML, SCSS, JavaScript

## Einrichtung

Bevor du beginnst, stelle sicher, dass du Node.js und MongoDB auf deinem System installiert hast.

1. **Repository klonen**

    ```bash
    git clone https://github.com/deinUsername/DataServ.git
    cd DataServ
    ```

2. **Abhängigkeiten installieren**

    ```bash
    npm install
    ```

3. **Konfigurationsdateien einrichten**

    Erstelle eine `.env`-Datei im Wurzelverzeichnis des Projekts mit folgenden Inhalten:

    ```plaintext
    MONGO_URI=deineMongoDBUri
    JWT_SECRET=deinGeheimesJWTZeichen
    EMAIL_USERNAME=deineEmail@beispiel.com
    EMAIL_PASSWORD=deinEmailPasswort
    ```

4. **Server starten**

    ```bash
    npm start
    ```

## Nutzung

Nach dem Starten des Servers kannst du die API über `http://localhost:3000` erreichen. Verwende Tools wie Postman oder cURL, um die Endpunkte zu testen.

## Beitrag

Beiträge sind willkommen! Bitte erstelle für jede Änderung oder Verbesserung einen Pull Request.

## Lizenz

[MIT](https://choosealicense.com/licenses/mit/)
