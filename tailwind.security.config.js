const forms = require('@tailwindcss/forms');

module.exports = {
  content: [
    './4_Login_Capy_Yara_Welcomes_You.html',
    './set-password.html',
    './account.html',
    './admin.html',
    './admin-metrics.html',
    './teacher_homework.html',
    './assets/js/pages/*.js',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#001f3f',
        'navy-mid': '#002d5c',
        'navy-light': '#0a3d6b',
        'pink-brand': '#ec4899',
        'green-brand': '#10b981',
        brand: {
          orange: '#FF9F1C',
          teal: '#2EC4B6',
          pink: '#FF3E81',
        },
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Be Vietnam Pro', 'sans-serif'],
        label: ['Lexend', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        'float-up': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          from: { opacity: '0', transform: 'translateX(32px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        shimmer: {
          from: { backgroundPosition: '200% center' },
          to: { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        'float-up': 'float-up 3.6s ease-in-out infinite',
        'float-up-d': 'float-up 4.4s ease-in-out 0.8s infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        'fade-in': 'fade-in 0.5s ease both',
        'slide-left': 'slide-left 0.45s cubic-bezier(.4,0,.2,1) both',
        pop: 'pop 0.4s cubic-bezier(.4,0,.2,1) both',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [forms],
};
