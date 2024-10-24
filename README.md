# Txt Me

**Txt Me** is a progressive web application (PWA) that delivers a secure, seamless, and customizable messaging experience. Built with **end-to-end encryption**, Txt Me ensures your conversations stay private, while providing a clean and intuitive user interface that can be customized to fit your style.

The app supports a variety of messaging formats, including text, images, videos, and links. With features like **group messages**, **contact management**, and **real-time syncing** across devices, Txt Me is designed for both individual and group communication.

## Table of content

- [Features](#features)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Deployment](#deployment)
- [Security](#security)
- [ENV](#env)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

<img src="/public/assets/screenshot-profile.PNG" alt="mobile-profile" />

## Features

- **End-to-End Encryption**: All messages are encrypted to protect user privacy, ensuring that only the sender and recipient can read them.
- **Customizable UI**: A clean and user-friendly interface with light customization options for themes and colors.
- **Multiple Messaging Formats**: Send and receive text, images, videos, and links seamlessly.
- **Group Messaging**: Communicate with multiple contacts in organized group chats.
- **Contacts Management**: Store and group contacts for easy access. Use your phone number or create a custom number to communicate.
- **Phone Number Communication**: Users can communicate via their phone numbers or create a custom number for additional privacy.
- **Search, Filter, & Sort**: Find messages or contacts easily with advanced search, filtering, and sorting capabilities.
- **Notifications**: Get notified about new messages, group chats, or events in real time.
- **Cross-Platform Syncing**: Sync messages across devices via **webhooks** and **WebSockets** for uninterrupted communication.
- **Offline Mode with Auto-Sync**: Send messages while offline, and they will automatically be delivered when network access is regained.
- **Passwordless Login**: Login securely with **email passcodes**, **text message passcodes**, **biometric authentication**, or **passkeys** for a frictionless user experience.
- **Cross-Platform Support**: Txt Me is a PWA that runs on any device, ensuring compatibility across desktops, tablets, and mobile phones.

## How It Works

- **Client**: The front-end PWA handles all user interactions, including sending/receiving messages, managing contacts, and rendering the UI.
- **Server**: The back-end server, hosted on GitHub, handles authentication, message encryption/decryption, and message storage. It also manages real-time communication through webhooks and WebSockets.

## Getting Started

### Prerequisites

- Node.js
- Git
- Your preferred package manager (npm/yarn)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/RyanLarge13/Txt-Me.git
   cd txt-me
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Start the Server:**

   Follow the server setup instructions from the [server repository](https://github.com/RyanLarge13/Txt-Me-Server).

4. **Run the Application:**

   ```bash
   npm start
   ```

5. **Build for Production:**

   ```bash
   npm run build
   ```

### Deployment

Txt Me can be deployed on any web server that supports PWAs. For cross-platform syncing, ensure that WebSocket connections and webhook endpoints are correctly configured.

## Security

Txt Me uses **end-to-end encryption** for all messages. User credentials are securely stored, and passwordless login methods like **email/text passcodes**, **biometrics**, and **passkeys** ensure both security and ease of use.

## ENV

```
VITE_API_SOCKET_URL = ws://localhost:8080/
VITE_API_URL = http://localhost:8080
```

## Contributing

Feel free to contribute to the project! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [MIT LICENSE](LICENSE) file for details.

## Contact

For any inquiries or questions, please reach out at [My Email](mailto:ryanlarge@ryanlarge.dev).
