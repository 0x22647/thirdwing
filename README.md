# AI Calculator 🧮✨

A modern, AI-powered calculator web app with natural language processing capabilities, advanced mathematical functions, and beautiful UI.

## Features

### 🤖 AI-Powered Natural Language Processing
- Ask questions in plain English like:
  - "What is 25% of 200?"
  - "Square root of 144"
  - "45 squared"
  - "100 km to miles"
  - "25 celsius to fahrenheit"
  - "sin(30)"
  - "2 to the power of 8"

### 🔢 Advanced Mathematical Functions
- **Basic Operations**: Addition, Subtraction, Multiplication, Division
- **Advanced Functions**:
  - Square root (√)
  - Power/Exponents (x²)
  - Trigonometric functions (sin, cos, tan)
  - Parentheses for complex expressions
  - Percentage calculations

### 🌍 Unit Conversions
- **Temperature**: Celsius ↔ Fahrenheit
- **Distance**: Kilometers ↔ Miles
- **Weight**: Kilograms ↔ Pounds
- **Time**: Hours ↔ Minutes

### 🎨 Modern UI/UX
- **Beautiful Design**: Gradient backgrounds with smooth animations
- **Dark/Light Themes**: Switch between themes seamlessly
- **Responsive**: Works perfectly on mobile, tablet, and desktop
- **Touch-Friendly**: Ripple effects and haptic feedback (on supported devices)
- **Keyboard Support**: Full keyboard navigation and shortcuts

### 💾 History & Storage
- Automatic calculation history storage
- View and reuse previous calculations
- Persistent storage using localStorage
- Clear history option

### 📱 Progressive Web App (PWA)
- Install as a standalone app
- Works offline
- Full-screen mobile experience
- App-like interface

## How to Use

### Natural Language Input
1. Click on the text input field at the top
2. Type your question in plain English
3. Press Enter to get instant results
4. View suggestions for example queries

### Traditional Calculator
1. Use the number pad and operator buttons
2. Click `=` to calculate
3. Use `AC` to clear
4. Use `⌫` to backspace

### Quick Functions
- Click **√** for square root of last number
- Click **x²** to square the last number
- Click **sin/cos** for trigonometric functions (in degrees)

### Keyboard Shortcuts
- Numbers `0-9`: Input numbers
- Operators `+`, `-`, `*`, `/`, `%`: Operations
- `Enter`: Calculate result
- `Escape`: Clear all
- `Backspace`: Delete last character
- `(` or `)`: Add parentheses

## Installation

### Run Locally
```bash
# Simply open index.html in your browser
open index.html

# Or use a local server
python -m http.server 8000
# Then open http://localhost:8000
```

### Install as PWA
1. Open the app in Chrome/Edge/Safari
2. Click the install button in the address bar
3. Or use "Add to Home Screen" on mobile

## Technology Stack

- **Frontend**: Pure HTML, CSS, and JavaScript
- **Styling**: Tailwind CSS (CDN)
- **Fonts**: Google Fonts (Inter)
- **Storage**: LocalStorage API
- **Features**: Web Vibration API, Service Workers (PWA)

## Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Examples

### Natural Language Queries
```
"What is 25% of 200?"          → 50
"Square root of 144"           → 12
"45 squared"                   → 2025
"100 km to miles"              → 62.1371
"25 celsius to fahrenheit"     → 77
"sin(30)"                      → 0.5
"2 to the power of 8"          → 256
"What is 15 + 27 × 3?"        → 96
```

### Traditional Calculator Mode
```
5 + 3 × 2      → 11
(10 + 5) × 2   → 30
50 % 8         → 2
√144           → 12
```

## Features Highlight

### 🎯 Smart Expression Parsing
The calculator intelligently parses natural language and converts it to mathematical expressions:
- "times" → ×
- "divided by" → ÷
- "plus" → +
- "minus" → −

### 🎨 Smooth Animations
- Ripple effect on button clicks
- Smooth theme transitions
- Fade-in effects for UI elements
- Pulsing AI badge

### 💡 Auto-Suggestions
- Smart suggestions appear when you focus the AI input
- Random selection of example queries
- Click to autofill

### 📊 History Management
- Stores up to 50 recent calculations
- Click history items to reuse them
- Clear history with one click
- Persistent across sessions

## License

MIT License - Feel free to use and modify!

## Credits

Created with ❤️ using modern web technologies
