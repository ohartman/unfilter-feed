# 🤖🚔 The Reddit Robocop

> "Dead or alive, you're coming with me... to the authenticity scanner."

A Chrome extension that detects AI-generated content on Reddit. Serve the public trust. Protect the innocent. Uphold the authenticity.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Chrome-green)
![License](https://img.shields.io/badge/license-MIT-purple)

## Features

- 🔍 **Real-time scanning** - Automatically analyzes Reddit posts and comments as you browse
- 🎯 **AI probability scores** - Shows percentage likelihood that content was AI-generated
- 🚨 **Visual indicators** - Color-coded badges (red/yellow/blue/green) for quick assessment
- 📊 **Detailed analysis** - Hover for breakdown of detected AI patterns
- ⚙️ **Customizable** - Adjust detection threshold and toggle features

## How It Works

The extension uses heuristic analysis to detect common patterns in AI-generated text:

- **Phrase detection** - Identifies overused AI phrases like "delve," "tapestry," "leverage," "in today's world"
- **Structural analysis** - Detects AI-typical formatting like numbered lists with bold headers
- **Sentence uniformity** - AI text often has suspiciously uniform sentence lengths
- **Hedging language** - Excessive use of "might," "could," "generally," etc.
- **Perfect punctuation** - AI rarely makes punctuation mistakes

### Score Interpretation

| Score | Verdict | Badge Color |
|-------|---------|-------------|
| 70%+ | LIKELY AI | 🔴 Red (pulsing) |
| 40-69% | SUSPICIOUS | 🟡 Yellow |
| 20-39% | UNCERTAIN | 🔵 Blue |
| 0-19% | LIKELY HUMAN | 🟢 Green |

## Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the extension folder
6. Navigate to Reddit and start browsing!

### Icons Setup

The extension uses PNG icons. You can convert the SVG icons in `/icons` to PNG, or create your own:
- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels  
- `icon128.png` - 128x128 pixels

## Usage

1. **Browse Reddit** - The extension automatically scans posts and comments
2. **Look for badges** - Each analyzed item shows a colored badge with AI probability
3. **Hover for details** - See specific reasons why content was flagged
4. **Click the extension icon** - Access settings and view scan statistics

## Settings

Click the extension icon to access:

- **Enable/Disable** - Turn detection on/off
- **Show on Posts** - Toggle scanning for post content
- **Show on Comments** - Toggle scanning for comments
- **Alert Threshold** - Adjust when badges appear (default: 40%)

## Limitations

⚠️ **Important disclaimers:**

- This is a **heuristic-based** detection system, not a definitive AI detector
- False positives and negatives are possible
- Professional writers may trigger some AI indicators
- AI-generated content can be edited to avoid detection
- Use as one data point, not absolute truth

## Privacy

- All analysis happens **locally in your browser**
- No data is sent to external servers
- No personal information is collected
- Reddit content is only analyzed, never stored

## Roadmap

- [ ] Integration with GPTZero API for more accurate detection
- [ ] Support for other social platforms (Twitter, HackerNews)
- [ ] Export scan results
- [ ] Highlight specific AI-like phrases in text
- [ ] MCP server for AI assistant integration

## Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve detection heuristics

## Prime Directives

1. Serve the public trust
2. Protect the innocent  
3. Uphold the authenticity
4. ~~Classified~~

---

*"Your move, creep."* 🤖🚔
