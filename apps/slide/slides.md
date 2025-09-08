---
theme: default
base: /slide/
background: https://cover.sli.dev
title: happyo-kun (発表くん)
info: |
  ## happyo-kun
  Your presentation buddy - Interactive slides with live coding powered by Slidev & Cloudflare
class: text-center
highlighter: shiki
drawings:
  enabled: true
transition: slide-left
mdc: true
---

# happyo-kun (発表くん)

🎯 Your presentation buddy

Interactive slides with live coding powered by Slidev & Cloudflare

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

---

# Features

📝 **Markdown-driven slides** - Write slides in Markdown with Vue components

🎨 **Real-time CSS playground** - Interactive CSS editing with live preview

🚀 **Powered by Cloudflare** - Global edge network for fast delivery

🔧 **Interactive API demos** - Live backend integration examples

⚡ **Lightning-fast performance** - Optimized for speed and responsiveness

---

# Getting Started

The project is now set up with:

- Slidev for presentation framework
- Vue components for interactivity
- Cloudflare Pages Functions for API backend
- TypeScript for type safety
- pnpm workspace for monorepo management

Run `pnpm dev` to start the development server!

---

# Learn More

[Documentation](https://sli.dev) · [GitHub](https://github.com/slidevjs/slidev) · [Showcases](https://sli.dev/showcases.html)