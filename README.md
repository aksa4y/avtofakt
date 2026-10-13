# Автофакт · avtofakt.by

Русскоязычная карта зарядных станций Беларуси с приоритетом Минска. Nuxt **3.21.11**, Vue 3, TypeScript strict, Pinia, Tailwind + собственная дизайн-система, Leaflet/MarkerCluster, VueUse, Nuxt SEO, Nuxt Image.

> Nuxt 3 снят с поддержки разработчиком. Ветка сохранена по техническому заданию. Для долгосрочной эксплуатации запланируйте переход на поддерживаемую Nuxt 4; свежие обновления Nuxt 3 не гарантируются.

## Запуск

Node.js 22.12+ (рекомендуется 22 LTS), pnpm 10.32.1.

```bash
corepack enable
corepack prepare pnpm@10.32.1 --activate
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
node scripts/smoke.mjs
pnpm start
```

Серверная сборка находится в `.output/`. `pnpm start` **не читает .env автоматически**: задайте переменные в PM2, systemd, Docker `--env-file` либо через `node --env-file=.env .output/server/index.mjs`. `.env` не коммитится.

## Функциональность

- Главная с автомобильной иллюстрацией, встроенной картой, статистикой снимка, городами, статьями, калькулятором и FAQ.
- `/map`: карта, кластеры, безопасные DOM-попапы, геолокация по запросу, возврат к городу, fallback при ошибке тайлов.
- `/stations`: SSR-каталог, поиск, разъём, мощность, оплата, статус, URL-пагинация, canonical/prev/next.
- `/stations/[slug]`: характеристики, часы, исходный объект, маршрут, фото при наличии данных, отзывы с модерацией. Неизвестные параметры явно подписаны.
- `/minsk`, `/brest`, `/grodno`, `/vitebsk`, `/gomel`, `/mogilev`: уникальные локальные заголовки, городская выборка в радиусе 25 км.
- `/blog` и статьи; `/calculator`, `/faq`, `/contacts`, `/privacy`; анимированная 404/500.
- Светлая/тёмная тема, клавиатурный focus, skip link, reduced motion, mobile-first.

## Данные

Включён снимок **754** публичных точек OSM. Это размер каталога, не полная статистика инфраструктуры страны. Из них **326** — в радиусе 25 км от центра Минска. Источники и особенности географической фильтрации: [DATA.md](DATA.md).

```bash
pnpm data:refresh
# Либо импорт заранее полученного Overpass JSON с точками только Беларуси:
node --import tsx scripts/import-osm.ts /absolute/path/belarus-overpass.json
pnpm test
pnpm build
```

Снимок включён в сборку: посетители не нагружают Overpass. Необходима периодическая актуализация владельцем. Источник не даёт live-занятость и достоверные текущие тарифы: они обозначены `unknown`/`null`. Условные значения калькулятора помечены как пример. Фотографии конкретных станций не подменяются декоративной иллюстрацией.

## Переменные и отзывы

| Переменная                | Назначение                                                                    |
| ------------------------- | ----------------------------------------------------------------------------- |
| `NUXT_PUBLIC_SITE_URL`    | Канонический origin, по умолчанию `https://avtofakt.by`                       |
| `NUXT_TRUST_PROXY`        | `true` только за доверенным reverse proxy, переписывающим forwarded-заголовки |
| `NUXT_CONTACT_EMAIL`      | Реальный контролируемый email редакции и security contact                     |
| `NUXT_REVIEW_ADMIN_TOKEN` | Секрет минимум 32 символа; включает приём и модерацию отзывов                 |

Без email контакты не выдумываются, `/.well-known/security.txt` отвечает 503, пока владелец не настроит адрес. `/security.txt` перенаправляет на канонический путь. В Schema.org страница контактов описана как ContactPage/Organization: LocalBusiness со случайным адресом офиса не создаётся. Карточки реальных станций имеют LocalBusiness + GeoCoordinates.

Отзывы сохраняются в `.data/reviews` на диске, доступны публично **только после одобрения**. Нужен постоянный volume/каталог и резервное копирование. Модель рассчитана на один Node-процесс; при горизонтальном масштабировании замените файловое хранилище и rate limiter на общую БД/Redis. Лимит: 3 попытки/час/IP и 1000 записей на станцию. Не отправляйте персональные данные в тексте.

Модерация — приватный API с `Authorization: Bearer <NUXT_REVIEW_ADMIN_TOKEN>`:

- `GET /api/admin/reviews?station=osm-node-...` — список всех отзывов выбранной станции.
- `PATCH /api/admin/reviews` с JSON `{ "stationSlug": "osm-node-...", "id": "UUID", "action": "approve" }` или `"delete"`.

Секрет не передаётся в клиент, URL, публичный runtime config и репозиторий. Приём отзыва: `POST /api/stations/[slug]/reviews`, strict Zod, Origin check, honeypot, ограничение размера, plain text. Одобрение — редакционная модерация, не доказательство фактического посещения станции.

## SEO и кэширование

`usePageSeo` задаёт title/description, canonical, OpenGraph/Twitter, `ru-BY`/`x-default`. Nuxt OG Image генерирует русские карточки из Vue-шаблона. JSON-LD: WebSite, Organization, BreadcrumbList, LocalBusiness, ItemList, FAQPage, Article. Наличие разметки не гарантирует rich results или индексацию.

`/sitemap.xml` включает станции, города, статьи и страницы каталога из `/api/__sitemap__/urls`. `/robots.txt` разрешает поисковых и AI-краулеров, CSS/JS доступны. `/llms.txt` и `/llms-full.txt` отдаются серверными маршрутами; llms.txt — добровольный формат, не обещание использования LLM.

Главная пререндерится; станции/статьи используют Nitro SWR 3600 с. Для обычного Node VPS выбран **SWR**, поскольку ISR зависит от провайдера. API отзывов/контактов no-store. Тема применяется в браузере, чтобы общий кэш не сохранял персональные cookie.

Редиректы 301: WWW, HTTP, `/index.php`, верхний регистр и завершающий `/` для страниц. Параметры запроса сохраняются; регистр ассетов, API, `_ipx`, `_og` и системных путей не меняется. Только фиксированный домен используется для origin-redirect: пользовательский Host не становится open redirect. Не кэшируйте персонализированные ответы на внешнем CDN без отдельного анализа.

## VPS / PM2 / Nginx

GitHub — хранилище исходников. Push в него сам по себе **не обновляет сервер avtofakt.by**. Workflow проверяет код и сохраняет Node-сборку как artifact, но не подключается к VPS.

На сервере (в каталоге проекта):

```bash
git pull --ff-only origin main
pnpm install --frozen-lockfile
pnpm build
# Создайте .env с настоящими настройками, не добавляя его в Git.
# При первом запуске из каталога проекта:
node --env-file=.env -e "console.log('Environment file is valid')"
```

Передайте переменные PM2 через окружение/защищённый конфиг. `ecosystem.config.cjs` содержит публичные параметры, порт 3000 и один экземпляр. Для загрузки `.env` можно добавить в защищённую копию конфига `node_args: '--env-file=/absolute/path/.env'`. После этого:

```bash
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
```

Установите Nginx-конфигурацию из `nginx.conf.example`, выпустите сертификат для **обоих** имён, затем `nginx -t` и reload. Node слушает только `127.0.0.1`; forwarded-заголовки переписывает Nginx. На CentOS проверьте поддержку современного Node/glibc и правила SELinux для nginx → upstream. Для старого Nginx вместо `http2 on;` применяется `listen 443 ssl http2;`.

Nginx включает gzip; Brotli настраивается при наличии модуля. Nitro также создаёт `.gz`/`.br` для публичных ассетов. HTTP/2 и HSTS включаются только после рабочего TLS. DNS A/AAAA apex и WWW должны указывать на нужный сервер.

## Docker

```bash
docker build -t avtofakt .
docker run -d --name avtofakt --restart unless-stopped \
  --env-file .env -p 127.0.0.1:3000:3000 \
  -v avtofakt-reviews:/app/.data avtofakt
```

## Проверки и ограничения

`tests/core.test.ts` проверяет расчёты, ошибки ввода, фильтры, целостность снимка и нормализацию URL. `scripts/smoke.mjs` запускает production build и проверяет HTTP, SSR h1/canonical, системные SEO-маршруты, 404 и 301. GitHub Actions выполняет quality gates на Node 22.

Workflow **Lighthouse mobile audit** запускается при push в main или вручную, проверяет главную, каталог и калькулятор в трёх прогонах с порогами 95/95/100/100 и сохраняет отчёты как artifact.

Баллы Lighthouse, Core Web Vitals и визуальное соответствие следует проверить в браузере на реальном HTTPS-хостинге. Числа 95/100 не заявляются без измерений. Нет гарантии online-статуса операторов, актуальных тарифов или полноты фото. Финальные проверки сервера: TLS, DNS, WWW/HTTP redirects, security contact, приём/модерация отзывов и резервное копирование `.data`.
