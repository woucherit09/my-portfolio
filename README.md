# Портфолио Константина Матейковича

Одностраничное портфолио на Next.js, TypeScript, Tailwind CSS, Framer Motion и Three.js.

## Локальный запуск

Требуется Node.js 20+.

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Где менять контент

Весь контент находится в одном файле:

```text
src/data/portfolio.ts
```

В нём можно изменить:

- имя, роль и описание;
- пункты навигации;
- сертификаты;
- технологии;
- проекты;
- контакты.

### Сертификаты

1. Добавьте изображение в `public/certificates/`.
2. В `src/data/portfolio.ts` замените значение `image`, например:

```ts
image: "/certificates/react-course.webp"
```

Рекомендуемый формат — WebP или AVIF, соотношение сторон 3:2.

### Проекты

Для публичного проекта укажите `demo` и/или `github`. Для закрытого проекта оставьте оба значения `null`.

## Проверка

```bash
npm run lint
npm run typecheck
npm run build
```

После сборки статическая версия появляется в папке `out/`.

## Деплой на Vercel

1. Импортируйте GitHub-репозиторий в Vercel.
2. Framework Preset: `Next.js`.
3. Build Command: `npm run build`.
4. Нажмите Deploy.

После каждого push в основную ветку Vercel обновит сайт автоматически.

## Деплой на GitHub Pages

Проект использует `output: "export"` в `next.config.ts`. Публикуйте содержимое папки `out/` через GitHub Actions или ветку `gh-pages`.

Если сайт размещается в подпапке репозитория, добавьте `basePath` и `assetPrefix` в `next.config.ts`.
