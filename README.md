## 🚀 Setup Project DOKI

Follow these steps to run the project locally:

## Clone Repository

```bash
git clone <repo-url>
cd <nama-folder-project>
```

## Install Dependency Laravel

```bash
composer install
```

## Setup Environment

```bash
cp .env.example .env
php artisan key:generate
```

## Install Dependency Frontend

```bash
npm install
npm install dayjs
```

## Setup the database

If using SQLite, create the database file:

```bash
mkdir -p database
touch database/database.sqlite
```

Then run migrations:

```bash
php artisan migrate
```
