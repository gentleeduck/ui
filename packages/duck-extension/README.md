<p align="center">
  <img src="../../public/logo-dark.svg" alt="@gentleduck/duck-extension" width="120"/>
</p>

<h1 align="center">@gentleduck/duck-extension</h1>

<p align="center">
  Browser extension for font customization and typography control.
</p>

<p align="center">
  <a href="../../LICENSE">MIT</a> -
  <a href="../../CHANGELOG.md">Changelog</a> -
  <a href="../../CONTRIBUTING.md">Contributing</a> -
  <a href="https://gentleduck.org/duck-ui">Docs</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gentleduck/duck-extension"><img src="https://img.shields.io/npm/v/@gentleduck/duck-extension.svg" alt="npm"/></a>
  <a href="https://www.npmjs.com/package/@gentleduck/duck-extension"><img src="https://img.shields.io/npm/dm/@gentleduck/duck-extension.svg" alt="downloads"/></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/npm/l/@gentleduck/duck-extension.svg" alt="MIT"/></a>
</p>

---

A browser extension that allows you to apply custom fonts to any website. Set different fonts for different domains and toggle the extension on/off per website with a simple floating button.

## Features

- **Per-domain font selection**: Choose a different font for each website
- **Easy toggle**: Floating button on every website to enable/disable the extension
- **Domain management**: View and manage all configured websites in one place
- **Real-time updates**: Changes apply instantly without page reload
- **Smart domain detection**: Automatically handles www, protocols, and subdomains

## Usage

Just download the extension from the [RELEASES](./releases) and install it on your browser.

---

## **How to Install**

### Chrome / Brave / Edge

1. Download the ZIP from above
2. Extract it
3. Go to: `chrome://extensions/`
4. Enable **Developer Mode**
5. Click **Load unpacked**
6. Select the extracted folder

You're good to go.

### Firefox

1. Download the ZIP from above
2. Extract it
3. Go to: `about:debugging#/runtime/this-firefox`
4. Click **Load Temporary Add-on**
5. Select the `manifest.json` file from the extracted folder

---

## **How to Use**

1. **Select a font for a website**:
   - Open the extension popup
   - The current website's domain will be shown
   - Select a font from the dropdown
   - The font will be applied immediately

2. **Toggle extension on/off**:
   - Look for the floating button in the bottom-right corner of any website
   - Click it to enable/disable the extension for that specific domain
   - The button shows the current state (opaque = enabled, faded = disabled)

3. **Manage all websites**:
   - View all configured websites in the "All Websites" list
   - Toggle enable/disable for any website
   - Remove font configurations you no longer need

4. **Reset everything**:
   - Click "Reset All" to clear all font configurations

---

## **Support the Project**

If you enjoy this extension:

* Star the repo
* Share it
* Contribute or open issues

Your support keeps this duck flying.

---

## **License**

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for details.
