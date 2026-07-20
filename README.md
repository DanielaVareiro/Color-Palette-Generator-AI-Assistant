# 🎨 Color Palette Generator & AI Assistant

A modern web application for generating, exploring, and curating color palettes, integrated with a design-focused AI assistant and automated synchronization with Notion.

---

## 🚀 Features

- **Interactive Color Wheel:** Dynamic color selection with real-time visual updates and HEX code display.
- **AI Assistant (Design Agent):** Integrated chat suggesting color palettes, combinations, and aesthetic concepts for any project.
- **History & Click-to-Copy:** All selected or AI-suggested colors generate visual cards in the history panel and are copied to the clipboard with 1 click.
- **Dark Mode / Light Mode:** Adaptable user interface with seamless theme toggling.
- **Webhook Automation:** Asynchronous data transmission to **n8n** workflows.
- **Notion Synchronization:** Direct integration with the Notion API to store and organize created color palettes.

---

## 🛠️ Tech Stack

### **Frontend**
- **HTML5 & CSS3** (Responsive design using CSS variables for theme switching)
- **JavaScript (Vanilla ES6)** (DOM manipulation, Fetch API, and Async/Await)

### **Backend & Automations**
- **n8n:** Workflow orchestration and event routing.
- **Groq / LLM Chat Model:** Language model powering the AI Agent.
- **Notion API:** Database for palette storage and organization.
- **Ngrok:** Secure tunnel connection for local Webhook HTTP requests.

---

## ⚙️ Automation Architecture (n8n Workflow)

1. **Webhook Node:** Receives incoming POST request data triggered by the client.
2. **If / Switch Node:** Identifies request payload origin (`type == "chat_message"` vs `type == "color_selection"`).
3. **AI Agent Node:** Processes text messages and returns styled JSON responses with color suggestions.
4. **Notion Node:** Automatically creates pages in the palette database containing the HEX code and timestamps.

---

>**Kyrie Eleison** 🧠
