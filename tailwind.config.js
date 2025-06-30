module.exports = {
  darkMode: 'class', // ← ini penting
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
// tailwind.config.js
theme: {
  extend: {
    colors: {
      dark: {
        background: '#0f172a', // slate-900
        card: '#1e293b',       // slate-800
        border: '#334155',     // slate-700
        text: '#f1f5f9',       // slate-100
        muted: '#94a3b8',      // slate-400
      },
    },
  },
},

  plugins: [],
};
