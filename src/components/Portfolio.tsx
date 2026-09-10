"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Code2, ExternalLink, Menu, X } from "lucide-react";
import {
  siAnthropic,
  siDocker,
  siFastapi,
  siGit,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siTailwindcss,
  siTypescript,
  siVercel,
} from "simple-icons/icons";
import { useEffect, useRef, useState } from "react";
import { certificates, contacts, navigation, profile, projects, stack } from "@/data/portfolio";

const iconMap: Record<string, { title: string; path: string }> = {
  react: siReact,
  nextdotjs: siNextdotjs,
  typescript: siTypescript,
  tailwindcss: siTailwindcss,
  nodedotjs: siNodedotjs,
  python: siPython,
  fastapi: siFastapi,
  postgresql: siPostgresql,
  anthropic: siAnthropic,
  git: siGit,
  docker: siDocker,
  vercel: siVercel,
};

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function TechIcon({ slug }: { slug: string }) {
  const icon = iconMap[slug];
  if (!icon) {
    return <span className="tech-fallback" aria-hidden="true">AI</span>;
  }
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label={icon.title}>
      <path fill="currentColor" d={icon.path} />
    </svg>
  );
}

function Navigation() {
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observers = navigation.map(({ href }) => {
      const id = href.slice(1);
      const element = document.getElementById(id);
      if (!element) return null;
      const observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActive(id),
        { rootMargin: "-42% 0px -50% 0px" },
      );
      observer.observe(element);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  return (
    <header className="site-header">
      <a className="monogram" href="#hero" aria-label="На главную">КМ</a>
      <nav className={open ? "nav-links is-open" : "nav-links"} aria-label="Основная навигация">
        {navigation.map((item, index) => (
          <a
            key={item.href}
            className={active === item.href.slice(1) ? "is-active" : ""}
            href={item.href}
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">0{index + 1}</span>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button
          className="icon-button menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <div className="rail-status" aria-hidden="true"><span></span> Available</div>
    </header>
  );
}

function Certificates() {
  const [selected, setSelected] = useState<number | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selected === null) return;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <>
      <div className="certificate-grid">
        {certificates.map((certificate, index) => (
          <Reveal key={`${certificate.title}-${index}`} delay={index * 0.09}>
            <button className="certificate-card" onClick={() => setSelected(index)}>
              <span className="certificate-index" aria-hidden="true">0{index + 1}</span>
              <span className="certificate-image">
                <Image
                  src={certificate.image}
                  alt={`Сертификат «${certificate.title}»`}
                  fill
                  sizes="(max-width: 720px) 100vw, 50vw"
                />
              </span>
              <span className="certificate-meta">
                <strong>{certificate.title}</strong>
                <span>{certificate.issuer} · {certificate.year}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={certificates[selected].title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button ref={closeButton} className="lightbox-close" onClick={() => setSelected(null)} aria-label="Закрыть">
                <X />
              </button>
              <Image
                src={certificates[selected].image}
                alt={`Сертификат «${certificates[selected].title}»`}
                width={1200}
                height={800}
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Portfolio() {
  const reduceMotion = useReducedMotion();
  const words = profile.name.split(" ");

  return (
    <>
      <Navigation />
      <main>
        <section id="hero" className="hero section-phase">
          <div className="hero-layout">
            <div className="hero-content">
              <motion.p
                className="hero-intro"
                initial={reduceMotion ? false : { opacity: 0, x: -18 }}
                animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.08 }}
              >
                Привет, я —
              </motion.p>
              <h1>
                {words.map((word, index) => (
                  <span className="hero-word-wrap" key={word}>
                    <motion.span
                      className="hero-word"
                      data-text={word}
                      initial={reduceMotion ? false : { x: "-108%", skewX: -8 }}
                      animate={reduceMotion ? undefined : { x: 0, skewX: 0 }}
                      transition={{ duration: 0.92, delay: 0.18 + index * 0.16, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <Reveal delay={0.3}>
                <div className="hero-role-line">
                  <span>{profile.role}</span>
                  <i aria-hidden="true"></i>
                  <small>Frontend / Backend / AI</small>
                </div>
                <p className="hero-description">{profile.description}</p>
                <div className="hero-actions">
                  <a className="primary-button" href="#contacts">Связаться <ArrowUpRight size={18} /></a>
                  <a className="text-button" href="#projects">Смотреть проекты <span>↘</span></a>
                </div>
              </Reveal>
            </div>
          </div>
          <motion.div
            className="hero-code-note"
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            transition={{ delay: 1.15 }}
          >
            <span>01</span>
            <code>{"{ idea → interface → production }"}</code>
          </motion.div>
          <div className="hero-coordinate" aria-hidden="true">55.7558° N / 37.6173° E</div>
          <a className="scroll-indicator" href="#certificates" aria-label="К сертификатам">
            <span>Листать</span><ArrowDown size={18} />
          </a>
        </section>

        <div className="running-line" aria-hidden="true">
          <div>
            <span>Дизайн</span><i>+</i><span>Код</span><i>+</i><span>Логика</span><i>+</i><span>Запуск</span><i>+</i>
            <span>Дизайн</span><i>+</i><span>Код</span><i>+</i><span>Логика</span><i>+</i><span>Запуск</span><i>+</i>
          </div>
        </div>

        <section id="certificates" className="content-section section-phase">
          <Reveal className="section-heading">
            <p className="section-number">01</p>
            <h2>Сертификаты</h2>
            <p><span className="editorial-mark">↳</span> Подтверждения обучения и профессионального развития. Скоро здесь появятся реальные документы.</p>
          </Reveal>
          <Certificates />
        </section>

        <section id="stack" className="content-section section-phase">
          <Reveal className="section-heading">
            <p className="section-number">02</p>
            <h2>Стек</h2>
            <p><span className="editorial-mark">↳</span> {profile.about}</p>
          </Reveal>
          <div className="stack-grid">
            {stack.map((group, groupIndex) => (
              <Reveal key={group.group} className="stack-group" delay={groupIndex * 0.08}>
                <span className="stack-group-index">0{groupIndex + 1}</span>
                <h3>{group.group}</h3>
                <div className="tech-list">
                  {group.items.map((item) => (
                    <div className="tech-item" key={item.name}>
                      <TechIcon slug={item.icon} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="projects" className="content-section section-phase">
          <Reveal className="section-heading">
            <p className="section-number">03</p>
            <h2>Проекты</h2>
            <p><span className="editorial-mark">↳</span> Выбранные работы — от визуальных сайтов до offline-first приложений и внутренних систем.</p>
          </Reveal>
          <div className="project-list">
            {projects.map((project, index) => (
              <Reveal key={project.title} delay={index * 0.08}>
                <article className="project-card">
                  <div className="project-index">0{index + 1}</div>
                  <div className="project-copy">
                    <span className="project-type">Selected case / {project.tags[0]}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <ul>
                      {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                  </div>
                  <div className="project-links">
                    {project.demo ? (
                      <a href={project.demo} target="_blank" rel="noreferrer">
                        Демо <ExternalLink size={17} />
                      </a>
                    ) : (
                      <span>Закрытый проект</span>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer">
                        GitHub <Code2 size={17} />
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contacts" className="contacts-section section-phase">
          <Reveal>
            <p className="section-number">04</p>
            <h2>Готов обсудить<br />ваш проект</h2>
            <div className="availability-note"><span></span> Сейчас доступен для новых задач</div>
          </Reveal>
          <div className="contact-list">
            {contacts.map((contact, index) => (
              <Reveal key={contact.label} delay={index * 0.08}>
                <a href={contact.href} target={contact.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  <span>{contact.label}</span>
                  <strong>{contact.value}</strong>
                  <ArrowUpRight />
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <footer>
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Спроектировано и собрано вручную</span>
      </footer>
    </>
  );
}
