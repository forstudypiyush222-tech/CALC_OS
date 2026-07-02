<div align="center">

# 🧮 CALC_OS

### ✨ A Premium Glassmorphism Calculator Experience

A beautifully crafted calculator built with **HTML, CSS, and Vanilla JavaScript**, featuring a premium glassmorphism interface, real-time calculations, persistent history, keyboard navigation, accessibility support, and seamless Light/Dark themes.

<br>

🌐 **Live Demo:** https://calc-os.netlify.app/

</div>

---

## 📖 Overview

CALC_OS is a modern calculator application designed to feel like a premium native desktop/mobile app rather than a traditional web calculator.

The project focuses on:

- 🎨 Pixel-perfect UI
- ⚡ Smooth interactions
- 🧠 Custom calculator engine (No `eval()`)
- 📱 Fully responsive experience
- ♿ Keyboard accessibility
- 🌙 Light & Dark themes
- 📜 Persistent calculation history
- 🔒 Secure and production-ready architecture

Every component was carefully engineered with attention to usability, performance, accessibility, and clean software architecture.

---

# ✨ Features

## 🎨 Premium UI

- ✨ Beautiful Glassmorphism Interface
- 🌙 Dark Mode
- ☀️ Light Mode
- 🎯 Pixel-perfect layout
- 🌈 Smooth gradients and glow effects
- 🫧 Frosted glass components
- 💎 Modern premium aesthetics
- 📱 Responsive across devices

---

## 🧮 Calculator Engine

Unlike many beginner calculators, CALC_OS **does not use `eval()`**.

Instead it includes a completely custom parser that provides:

- ➕ Addition
- ➖ Subtraction
- ✖️ Multiplication
- ➗ Division
- 📊 Percentage calculations
- 🔢 Decimal calculations
- 📈 Operator precedence (MDAS)
- 🚫 Division by zero protection
- 🔄 Unary minus support
- 🧹 Intelligent operator replacement
- 🎯 Floating-point precision correction

Example:

```
240 × 12.5
= 3000
```

```
100 - 10%
= 90
```

```
0.1 + 0.2
= 0.3
```

---

# 📜 Persistent History

The history system provides:

- 💾 LocalStorage persistence
- 🔁 Restore previous calculations
- 🚫 Duplicate prevention
- 📋 Empty history state
- 🗑️ Clear history
- ⚡ Efficient rendering
- 📦 Maximum history limit
- 🔒 Safe rendering using DOM APIs (No `innerHTML`)

---

# ⌨️ Keyboard Navigation

CALC_OS is fully usable without a mouse.

Supported keyboard controls include:

| Key | Action |
|------|--------|
| 0–9 | Number Input |
| + - * / | Operators |
| . | Decimal |
| Enter | Calculate |
| = | Calculate |
| Backspace | Delete Digit |
| Delete | All Clear |
| Escape | Close History / Clear |
| F6 | Toggle History |
| F7 | Toggle Theme |
| Tab | Navigate Controls |
| Shift + Tab | Reverse Navigation |

---

# ♿ Accessibility

Accessibility was treated as a first-class feature.

Implemented:

- ✅ Semantic HTML
- ✅ Keyboard Navigation
- ✅ Focus Management
- ✅ Focus Restoration
- ✅ `:focus-visible`
- ✅ ARIA Labels
- ✅ Native Buttons
- ✅ Screen-reader friendly interactions

---

# 📱 Responsive Design

Optimized for:

- 📱 Mobile Phones
- 📱 Large Phones
- 📲 Tablets
- 💻 Laptops
- 🖥️ Desktop Screens

The calculator maintains a premium centered layout while adapting gracefully across different screen sizes.

---

# 🚀 Performance Optimizations

- ⚡ Efficient DOM updates
- 🎯 Event Delegation
- 📦 Lightweight architecture
- 🚫 No frameworks
- ⚡ Optimized font scaling
- 💾 LocalStorage caching
- 🎨 CSS Variables for instant theme switching
- 📱 Dynamic viewport (`100dvh`) support

---

# 🔒 Security

Security improvements include:

- ❌ No `eval()`
- ❌ No unsafe HTML injection
- ✅ DOM API rendering
- ✅ `textContent` for user data
- ✅ Protected LocalStorage rendering
- ✅ Safe parser implementation

---

# 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Structure |
| CSS3 | Styling |
| Vanilla JavaScript (ES6+) | Application Logic |
| CSS Grid | Calculator Layout |
| Flexbox | Responsive Layout |
| CSS Variables | Theme System |
| LocalStorage API | Persistent History |
| ARIA | Accessibility |
| Glassmorphism | Modern UI Design |

---

# 📂 Project Structure

```
calc-os/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── calculator.js
│   └── history.js
│
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
│
└── README.md
```

---

# 🧠 Architecture

### app.js

Responsible for:

- Application initialization
- Theme management
- Global keyboard routing
- Shared application events

---

### calculator.js

Responsible for:

- Calculator engine
- Token parser
- Operator precedence
- Expression management
- Result formatting
- Font scaling
- Input validation

---

### history.js

Responsible for:

- Persistent history
- LocalStorage management
- History rendering
- Restore calculations
- History interactions
- Bottom sheet behavior

---

# 🌙 Theme System

Two carefully crafted themes:

### 🌙 Dark

- Obsidian background
- Blue/Purple ambient glow
- Premium glass panels
- Neon highlights

### ☀️ Light

- Frosted white glass
- Soft shadows
- Elegant blue accents
- Minimal aesthetic

Theme switching happens instantly without reloading the page.

---

# 🎯 Highlights

✔️ No Frameworks

✔️ No Libraries

✔️ No `eval()`

✔️ Premium Animations

✔️ Responsive Design

✔️ Persistent History

✔️ Keyboard Accessible

✔️ Secure Rendering

✔️ Modern Glassmorphism

✔️ Production Ready

---

# 📸 Screenshots

> **Recommended screenshots to include**

- 🌙 Dark Calculator
- ☀️ Light Calculator
- 🌙 Dark History
- ☀️ Light History
- 📱 Mobile View
- 💻 Desktop View

---

# 🌐 Live Demo

### 🚀 Try CALC_OS Here

## 👉 https://calc-os.netlify.app/

---

# 🔮 Future Roadmap

### Version 1.1

- 📋 Copy Result
- 📋 Copy Expression
- ⚙️ Settings Panel
- 🔢 Number Formatting Options
- 🎵 Optional Sound Effects

### Version 2.0

- 🧪 Scientific Calculator
- 📐 Advanced Functions
- 📦 PWA Support
- 🌍 Offline Mode
- 📤 Export History
- 🎨 Additional Themes

---

# 👨‍💻 Developer

Developed with ❤️ by **Piyush**

This project was built to explore modern frontend engineering, UI craftsmanship, accessibility, and application architecture using **pure web technologies**.

---

<div align="center">

## ⭐ If you enjoyed this project, consider giving it a Star!

**Made with HTML • CSS • Vanilla JavaScript**

### 🌐 Live Demo

https://calc-os.netlify.app/

</div>
