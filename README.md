# FILM!

Онлайн-сервис бронирования билетов в кинотеатр.

Проект состоит из:

- frontend на React и Vite;
- backend на NestJS;
- базы данных PostgreSQL.

## Установка

### PostgreSQL

PostgreSQL можно установить локально или запустить через Docker.

Пример запуска через Docker:

```bash
docker compose up -d
```

Создайте базу данных и коллекцию:

```bash
docker exec -i postgres_container \
  psql -U prac -d prac \
  < backend/test/prac.init.sql

docker exec -i postgres_container \
  psql -U prac -d prac \
  < backend/test/prac.films.sql

docker exec -i postgres_container \
  psql -U prac -d prac \
  < backend/test/prac.shedules.sql
```

## Бэкенд

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
- `DEBUG` — настройка отладочных сообщений.

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

Запуск e2e-тестов:

```bash
npm run test:e2e
```

## Фронтенд

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
