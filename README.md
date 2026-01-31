# ArchiSteamFarm Raycast Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Platform: Windows](https://img.shields.io/badge/Platform-Windows-blue)](https://www.raycast.com)

Interact with your locally hosted [ArchiSteamFarm (ASF)](https://github.com/JustArchiNET/ArchiSteamFarm) instance directly from Raycast! Control your bots, manage farming, and copy 2FA tokens without leaving your workflow.

## ✨ Features

### Dashboard
- **Bot Overview**: View all your bots with real-time status indicators
- **Farming Progress**: See which games are being farmed, cards remaining, and time left
- **Bot Controls**: Start, stop, pause, and resume individual bots
- **Status Details**: Online/offline status, avatar integration, and farming state
- **Global Commands**: Update ASF and restart the entire instance

### Copy 2FA
- **Quick Access**: Copy 2FA tokens from any of your bots instantly
- **Clipboard Integration**: One-command copying for seamless login
- **Steam ID Copy**: Quick access to Steam IDs for all bots

## 🚀 Installation

1. Install [Raycast](https://www.raycast.com) (free)
2. Install [ArchiSteamFarm](https://github.com/JustArchiNET/ArchiSteamFarm) and configure it
3. Search for "ArchiSteamFarm" in Raycast and install the extension

## ⚙️ Prerequisites

- **ArchiSteamFarm**: You must have a running instance of ArchiSteamFarm
- **IPC Enabled**: IPC (Inter-Process Communication) must be enabled and accessible
  - Ensure `IPC` is set to `true` in your `ASF.json` configuration
  - Review the [ASF IPC Wiki](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/IPC) for setup details
- **Network Access**: Raycast must be able to reach your ASF instance (local or remote)

## 🔧 Configuration

This extension requires the following configuration in Raycast preferences:

### ASF URL
- **Required**: Yes
- **Default**: `http://localhost:1242`
- **Description**: The URL where your ASF IPC is hosted
- **Examples**:
  - Local: `http://localhost:1242`
  - Remote: `http://192.168.1.100:1242`
  - With HTTPS: `https://your-asf-domain.com`

### IPC Password
- **Required**: Only if configured in ASF
- **Description**: Your ASF IPC password (if one is set in `ASF.json`)
- **Security**: Stored securely by Raycast's preference system

## 📖 Usage

### Dashboard Command

Press `⌘ + Space` (or `Alt + Space` on Windows), type "Dashboard", and select "ArchiSteamFarm: Dashboard".

**Actions available:**
- **Pause/Resume Farming**: Toggle farming for individual bots
- **Start/Stop Bot**: Start a stopped bot or stop a running one
- **Refresh**: Reload bot status from ASF
- **Update ASF**: Update ASF to the latest version
- **Restart ASF**: Restart the entire ASF instance (destructive action)

### Copy 2FA Command

Press `⌘ + Space` (or `Alt + Space` on Windows), type "Copy 2FA", and select "ArchiSteamFarm: Copy 2FA".

**Actions available:**
- **Copy 2FA Token**: Copy the 2FA token for the selected bot
- **Copy Steam ID**: Copy the Steam ID to clipboard

## 🔒 Security

- **Local Storage**: Preferences are stored by Raycast's secure preference system
- **IPC Authentication**: Password is sent via the `Authentication` header for all API requests
- **No Data Collection**: This extension doesn't send any data to external services
- **HTTPS Support**: Supports encrypted connections to remote ASF instances

## 🐛 Troubleshooting

### Connection Issues

**Problem**: "Unable to connect to ASF at..."

**Solutions**:
1. Verify ASF is running
2. Check IPC is enabled in `ASF.json` (`"IPC": true`)
3. Confirm the ASF URL is correct in preferences
4. If using a firewall, ensure port 1242 (or your custom port) is accessible
5. For remote instances, check network connectivity

### 2FA Token Issues

**Problem**: "No 2FA Token found"

**Solutions**:
1. Verify the bot has 2FA enabled in ASF
2. Check if the bot is logged in (online status)
3. Ensure ASF has generated a 2FA token for the bot

### Auth Issues

**Problem**: Authentication errors or permission denied

**Solutions**:
1. Verify IPC password matches what's in `ASF.json`
2. Check ASF logs for IPC-related errors
3. Ensure you're using the correct protocol (http vs https)

## 🤝 Contributing

Contributions are welcome! This is an open-source extension and improvements are appreciated.

### Development

```bash
# Clone the repository
git clone https://github.com/luinbytes/archisteamfarm-raycast.git
cd archisteamfarm-raycast

# Install dependencies
npm install

# Start development mode
npm run dev
```

### Building

```bash
# Build the extension
npm run build

# Lint code
npm run lint

# Fix linting issues
npm run fix-lint
```

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

## 🙏 Acknowledgments

- [ArchiSteamFarm](https://github.com/JustArchiNET/ArchiSteamFarm) - The amazing Steam farming tool
- [Raycast](https://www.raycast.com) - The powerful productivity tool for macOS
- [ASF IPC API](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/IPC) - The API that makes this extension possible

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

- **Issues**: Report bugs or request features via GitHub Issues
- **ASF Documentation**: [ArchiSteamFarm Wiki](https://github.com/JustArchiNET/ArchiSteamFarm/wiki)
- **Raycast Documentation**: [Raycast Documentation](https://developers.raycast.com)

---

Made with 💖 by [luinbytes](https://github.com/luinbytes)
