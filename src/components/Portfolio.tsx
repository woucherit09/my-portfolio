"use client";

import { motion, useReducedMotion } from "framer-motion";
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
import { useEffect, useState } from "react";
import { contacts, navigation, profile, projects, stack, valuePoints } from "@/data/portfolio";

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

const tickerItems = ["Решение", "План", "Код", "Запуск", "Результат"];

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

function RunningLine() {
  const sequence = Array.from({ length: 8 }, () => tickerItems).flat();

  return (
    <div className="running-line" aria-hidden="true">
      <div className="running-line-track">
        <div className="running-line-group">
          {sequence.map((item, index) => (
            <span key={`a-${item}-${index}`}>
              {item}
              <i>+</i>
            </span>
          ))}
        </div>
        <div className="running-line-group" aria-hidden="true">
          {sequence.map((item, index) => (
            <span key={`b-${item}-${index}`}>
              {item}
              <i>+</i>
            </span>
          ))}
        </div>
      </div>
    </div>
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
                <ul className="hero-promises">
                  <li>Найду решение вашей проблемы</li>
                  <li>Предложу то, что нужно именно вам</li>
                  <li>Доведу до рабочего результата</li>
                </ul>
                <div className="hero-actions">
                  <a className="primary-button" href="#contacts">Обсудить задачу <ArrowUpRight size={18} /></a>
                  <a className="text-button" href="#projects">Смотреть результаты <span>↘</span></a>
                </div>
              </Reveal>
            </div>
          </div>
          <a className="scroll-indicator" href="#stack" aria-label="К стеку">
            <span>Листать</span><ArrowDown size={18} />
          </a>
        </section>

        <RunningLine />

        <section id="stack" className="content-section section-phase">
          <Reveal className="section-heading">
            <p className="section-number">01</p>
            <h2>Стек</h2>
            <p><span className="editorial-mark">↳</span> {profile.about}</p>
          </Reveal>
          <div className="value-grid">
            {valuePoints.map((point, index) => (
              <Reveal key={point.title} className="value-card" delay={index * 0.08}>
                <span>0{index + 1}</span>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </Reveal>
            ))}
          </div>
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
            <p className="section-number">02</p>
            <h2>Проекты</h2>
            <p><span className="editorial-mark">↳</span> Не просто «сделал сайт» — работы, которые дают клиенту понятный эффект.</p>
          </Reveal>
          <div className="project-board">
            {projects.map((project, index) => (
              <Reveal key={project.title} delay={index * 0.08} className={`project-case case-${index + 1}`}>
                <article>
                  <header className="project-case-top">
                    <div>
                      <span className="project-type"><b>case_{String(index + 1).padStart(2, "0")}</b> / {project.tags[0]}</span>
                      <h3>{project.title}</h3>
                      <p className="project-summary">{project.summary}</p>
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
                  </header>
                  <p className="project-description">{project.description}</p>
                  <div className="project-results" aria-label={`Результаты проекта ${project.title}`}>
                    {project.results.map((result) => (
                      <div key={`${project.title}-${result.label}`} className="result-pill">
                        <strong>{result.value}</strong>
                        <span>{result.label}</span>
                      </div>
                    ))}
                  </div>
                  <ul>
                    {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contacts" className="contacts-section section-phase">
          <Reveal>
            <p className="section-number">03</p>
            <h2>Расскажите задачу —<br />предложу решение</h2>
            <p className="contact-lead">{profile.promise}</p>
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
