# FILM!

Онлайн-сервис бронирования билетов в кинотеатр.

Проект состоит из:

- frontend на React и Vite;
- backend на NestJS;
- базы данных MongoDB.

## Установка

### MongoDB

MongoDB можно установить локально или запустить через Docker.

Пример запуска через Docker:

```bash
docker run -d \
  --name film-mongo \
  -p 27017:27017 \
  -v film-mongo-data:/data/db \
  mongo:7
```

Для подключения через MongoDB Compass используйте адрес:

```text
mongodb://localhost:27017
```

Создайте базу данных и коллекцию:

```text
Database: afisha
Collection: films
```

Импортируйте данные из файла:

```text
backend/test/mongodb_initial_stub.json
```

В MongoDB Compass выберите:

```text
Add Data → Import JSON or CSV file
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
DATABASE_DRIVER="mongodb"
DATABASE_URL="mongodb://localhost:27017/afisha"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
DEBUG=*
```

Переменные окружения:

- `DATABASE_DRIVER` — используемый драйвер базы данных;
- `DATABASE_URL` — адрес подключения к MongoDB;
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

Для корректной работы frontend должны быть одновременно запущены MongoDB и backend.
