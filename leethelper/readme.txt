# LeetHelper Chrome Extension

A Chrome extension that helps you get hints, explanations, or full solutions for LeetCode problems using the Gemini (Google AI) API.

## Features

- 🤖 Get AI-powered help for any LeetCode problem
- 💡 Three assistance modes:
  - Hints for gentle guidance
  - Explanations for understanding concepts
  - Full Python solutions with code
- 🎯 Uses Gemini API for accurate, contextual responses
- 🔒 Secure local API key storage
- ✨ Modern, user-friendly popup interface

## Installation

1. Clone/download this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" and select the `leethelper` folder
5. Click the extension icon in your toolbar

## Setup

1. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click the ⚙️ Settings link in the extension popup
3. Enter and save your API key

## Usage

1. Visit any [LeetCode](https://leetcode.com/problems/) problem
2. Click the LeetHelper extension icon
3. Choose your assistance mode:
   - Get Hint
   - Explain
   - Full Solution
4. View the AI-generated response

## Files

- `manifest.json` - Extension configuration
- `background.js` - Handles API calls and messaging
- `content.js` - Scrapes problem data
- `popup.html/js` - Extension UI and logic
- `options.html/js` - Settings page for API key
- `icon32.png/128.png` - Extension icons

## Permissions

- `storage` - For API key storage
- `scripting` - For content script injection
- `activeTab` - For LeetCode page interaction

## Notes

- Not affiliated with LeetCode or Google
- API key is stored locally only
- Requires valid Gemini API key

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.