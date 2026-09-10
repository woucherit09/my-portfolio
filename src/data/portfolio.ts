export const profile = {
  name: "Константин Матейкович",
  role: "Fullstack-разработчик",
  description:
    "Собираю цифровые продукты от понятного интерфейса до надёжного API, базы данных и деплоя.",
  about:
    "Разрабатываю сайты, веб-приложения, Telegram-ботов и мобильные решения. Ценю ясную архитектуру, аккуратный код и продукт, которым удобно пользоваться.",
};

export const navigation = [
  { label: "Главная", href: "#hero" },
  { label: "Сертификаты", href: "#certificates" },
  { label: "Стек", href: "#stack" },
  { label: "Проекты", href: "#projects" },
  { label: "Контакты", href: "#contacts" },
];

export const certificates = [
  { title: "Frontend Development", issuer: "Организация", year: "2026", image: "/certificates/placeholder.svg" },
  { title: "Backend Engineering", issuer: "Организация", year: "2026", image: "/certificates/placeholder.svg" },
  { title: "Python & Automation", issuer: "Организация", year: "2025", image: "/certificates/placeholder.svg" },
  { title: "Databases", issuer: "Организация", year: "2025", image: "/certificates/placeholder.svg" },
];

export const stack = [
  {
    group: "Frontend",
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "Node.js", icon: "nodedotjs" },
      { name: "Python", icon: "python" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "PostgreSQL", icon: "postgresql" },
    ],
  },
  {
    group: "AI & LLM",
    items: [
      { name: "OpenAI API", icon: "openai" },
      { name: "Claude API", icon: "anthropic" },
      { name: "RAG", icon: "rag" },
    ],
  },
  {
    group: "Инструменты",
    items: [
      { name: "Git", icon: "git" },
      { name: "Docker", icon: "docker" },
      { name: "Vercel", icon: "vercel" },
    ],
  },
];

export const projects = [
  {
    title: "Smartavia",
    description:
      "Android-приложение для заполнения гостевых анкет без интернета, локального хранения и последующей выгрузки данных.",
    tags: ["Android", "Kotlin", "SQLite", "Offline-first"],
    demo: "https://flysmartavia.com",
    github: null,
  },
  {
    title: "NOIR",
    description:
      "Иммерсивная витрина аудиобренда с выразительным motion-дизайном и интерактивным конфигуратором цвета.",
    tags: ["HTML", "CSS", "JavaScript", "GSAP"],
    demo: "https://noir-tau.vercel.app/",
    github: null,
  },
  {
    title: "Pulse Desk",
    description:
      "Личный кабинет для работы с заявками: авторизация, роли пользователей, статусы задач и история изменений.",
    tags: ["React", "Node.js", "REST API", "PostgreSQL"],
    demo: null,
    github: null,
  },
  {
    title: "Пятый этаж",
    description:
      "Атмосферный сайт кофейни с меню, адаптивным интерфейсом и сценарием бронирования столика.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive"],
    demo: "https://pyatii-etazh.vercel.app",
    github: null,
  },
];

export const contacts = [
  { label: "Telegram", value: "@Woucher09", href: "https://t.me/Woucher09" },
  { label: "Email", value: "matseikovich09@gmail.com", href: "mailto:matseikovich09@gmail.com" },
  { label: "GitHub", value: "woucherit09", href: "https://github.com/woucherit09" },
];
