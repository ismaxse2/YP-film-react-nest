# FILM!

Онлайн-сервис бронирования билетов в кинотеатр.

Проект состоит из:

- frontend на React и Vite;
- backend на NestJS;
- базы данных PostgreSQL;
- nginx;
- Docker Compose.

## Демо

Frontend:

https://film-frontend.nomorepartiessite.ru

Backend API:

https://film-backend.nomorepartiessite.ru/api/afisha/films

## Установка

### Запуск через Docker

Создайте корневой `.env` на основе примера:

```bash
cp .env.example .env
```

Пример:

```env
DATABASE_DRIVER=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=prac
DATABASE_USERNAME=prac
DATABASE_PASSWORD=prac

POSTGRES_USER=prac
POSTGRES_PASSWORD=prac
POSTGRES_DB=prac

PORT=3000
CORS_ORIGIN=http://localhost
LOGGER_TYPE=json

PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin
```

Основные переменные:

- `DATABASE_*` — параметры подключения backend к PostgreSQL;
- `POSTGRES_*` — настройки контейнера PostgreSQL;
- `PORT` — порт backend-приложения;
- `CORS_ORIGIN` — разрешённый origin frontend;
- `LOGGER_TYPE` — тип логгера;
- `PGADMIN_DEFAULT_EMAIL` — логин pgAdmin;
- `PGADMIN_DEFAULT_PASSWORD` — пароль pgAdmin.

Для запуска приложения:

```bash
docker compose up -d --build
```

Docker Compose запускает:

- frontend;
- backend;
- nginx;
- PostgreSQL;
- pgAdmin.

При первом создании PostgreSQL volume база автоматически инициализируется SQL-файлами из backend/test.

Проверить состояние контейнеров:

```bash
docker compose ps
```

Остановить приложение:

```bash
docker compose down
```

Удалить контейнеры вместе с volumes:

```bash
docker compose down -v
```

### Бэкенд

Перейдите в папку backend:

```bash
cd backend
```

Установите зависимости:

```bash
npm ci
```

Создайте файл `.env` на основе примера:

```bash
cp .env.example .env
```

Пример содержимого:

```env
DATABASE_DRIVER="postgres"
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=prac
DATABASE_USERNAME=prac
DATABASE_PASSWORD=prac
PORT=3000
CORS_ORIGIN="http://localhost:5173"
DEBUG=*
LOGGER_TYPE=dev
```

Переменные окружения:

- `DATABASE_DRIVER` — используемый драйвер базы данных;
- `DATABASE_HOST` — адрес сервера PostgreSQL;
- `DATABASE_PORT` — порт PostgreSQL;
- `DATABASE_NAME` — имя базы данных;
- `DATABASE_USERNAME` — имя пользователя PostgreSQL;
- `DATABASE_PASSWORD` — пароль пользователя PostgreSQL;
- `PORT` — порт backend-приложения;
- `CORS_ORIGIN` — адрес frontend-приложения, которому разрешены запросы к API;
- `DEBUG` — настройка отладочных сообщений;
- `LOGGER_TYPE` — формат логирования: dev, json или tskv.

Запустите backend в режиме разработки:

```bash
npm run start:dev
```

Основные эндпоинты:

```text
GET  /api/afisha/films
GET  /api/afisha/films/:id/schedule
POST /api/afisha/order
GET  /content/afisha/*
```

Проверка линтинга и сборки:

```bash
npm run lint
npm run build
```

Запуск тестов:

```bash
npm test
npm run test:e2e
```

### Фронтенд

В отдельном терминале перейдите в папку frontend:

```bash
cd frontend
```

Установите зависимости:

```bash
npm ci
```

Создайте файл `.env` на основе примера:

```bash
cp .env.example .env
```

Пример содержимого:

```env
VITE_API_URL=http://localhost:3000/api/afisha
VITE_CDN_URL=http://localhost:3000/content/afisha
```

Запустите frontend:

```bash
npm run dev
```

По умолчанию приложение будет доступно по адресу:

```text
http://localhost:5173
```

Для корректной работы frontend должны быть одновременно запущены PostgreSQL и backend.

## Логирование

Backend поддерживает три формата логирования:

- dev — стандартный ConsoleLogger NestJS;
- json — JSON-формат;
- tskv — TSKV-формат.

Формат выбирается переменной:

```env
LOGGER_TYPE=dev
```

## Docker Registry

Docker-образы автоматически собираются через GitHub Actions и публикуются в GitHub Container Registry:

`ghcr.io/ismaxse2/film-frontend:latest`
`ghcr.io/ismaxse2/film-backend:latest`
`ghcr.io/ismaxse2/film-nginx:latest`

## Continuous Delivery

После push в ветки main или review-3 GitHub Actions:

- собирает Docker-образы;
- публикует их в GHCR;
- подключается к серверу по SSH;
- загружает новые образы;
- обновляет запущенные контейнеры.
