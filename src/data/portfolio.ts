export const profile = {
  name: "Константин Матейкович",
  role: "Fullstack-разработчик",
  description:
    "Найду решение вашей задачи, предложу то, что нужно именно вам, и соберу продукт от интерфейса до деплоя.",
  about:
    "Разрабатываю сайты, веб-приложения, Telegram-ботов и мобильные решения. Не продаю лишнее — подбираю стек и формат под вашу цель.",
  promise:
    "Разберу задачу, предложу понятный план и доведу работу до результата, которым можно пользоваться.",
};

export const navigation = [
  { label: "Главная", href: "#hero" },
  { label: "Стек", href: "#stack" },
  { label: "Проекты", href: "#projects" },
  { label: "Контакты", href: "#contacts" },
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
    summary: "Offline-first анкеты для гостей локации",
    description:
      "Android-приложение для заполнения гостевых анкет без интернета, локального хранения и последующей выгрузки данных.",
    tags: ["Android", "Kotlin", "SQLite", "Offline-first"],
    results: [
      { value: "0%", label: "потерь данных без сети" },
      { value: "×3", label: "быстрее сбор анкет на месте" },
      { value: "1 файл", label: "готовая выгрузка для клиента" },
    ],
    demo: "https://flysmartavia.com",
    github: null,
  },
  {
    title: "NOIR",
    summary: "Иммерсивная витрина аудиобренда",
    description:
      "Иммерсивная витрина аудиобренда с выразительным motion-дизайном и интерактивным конфигуратором цвета.",
    tags: ["HTML", "CSS", "JavaScript", "GSAP"],
    results: [
      { value: "+40%", label: "времени на витрине" },
      { value: "Wow", label: "эффект для презентаций" },
      { value: "1 экран", label: "сильный первый контакт с брендом" },
    ],
    demo: "https://noir-tau.vercel.app/",
    github: null,
  },
  {
    title: "Pulse Desk",
    summary: "Кабинет заявок для команды",
    description:
      "Личный кабинет для работы с заявками: авторизация, роли пользователей, статусы задач и история изменений.",
    tags: ["React", "Node.js", "REST API", "PostgreSQL"],
    results: [
      { value: "−60%", label: "хаоса в переписках" },
      { value: "1 место", label: "для всех заявок и статусов" },
      { value: "24/7", label: "прозрачная история изменений" },
    ],
    demo: null,
    github: null,
  },
  {
    title: "Happy Look",
    summary: "Сайт салона красоты под Парижем",
    description:
      "Многостраничный сайт института красоты: услуги, отзывы, бутик косметики и контакты — с акцентом на атмосферу и запись клиентов.",
    tags: ["WordPress", "WooCommerce", "HTML/CSS", "Responsive"],
    results: [
      { value: "1 витрина", label: "услуги, отзывы и бутик в одном месте" },
      { value: "Mobile", label: "удобный просмотр с телефона" },
      { value: "EU", label: "сайт для клиентов во Франции" },
    ],
    demo: "https://www.beautyhappylook.eu/главная/",
    github: null,
  },
];

export const contacts = [
  { label: "Telegram", value: "@Woucher09", href: "https://t.me/Woucher09" },
  { label: "Email", value: "matseikovich09@gmail.com", href: "mailto:matseikovich09@gmail.com" },
  { label: "GitHub", value: "woucherit09", href: "https://github.com/woucherit09" },
];
