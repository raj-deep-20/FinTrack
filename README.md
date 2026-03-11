# FinanceTracker

FinanceTracker is a Django-based personal finance web application for managing incomes, expenses, categories, and account balance in one place.

It includes:
- User signup/login/logout
- Income and expense ledgers with create/edit/delete
- Category management for income and expenses
- CSV report export (daily, weekly, monthly, all-time)
- Dashboard charts for trends and category-wise expense distribution
- Basic test suite for models, URLs, and views

## Tech Stack

- Python 3.10+
- Django 4.2.5
- SQLite (default local database)
- HTML/CSS/JavaScript templates
- Chart.js (loaded via CDN on dashboard)

## Project Structure

```text
FinanceTracker/
|- manage.py
|- requirements.txt
|- db.sqlite3
|- FinanceTracker/            # Django project config
|  |- settings.py
|  |- urls.py
|  |- tests/
|- FinTech/                   # Main app (models, views, URLs)
|  |- models.py
|  |- views.py
|  |- urls.py
|  |- migrations/
|- templates/                 # Django templates
|- static/                    # Source static assets
|- staticfiles_build/         # collectstatic output
```

## Core Modules

- `FinTech.models`
	- `IncomeCategory`, `ExpenseCategory`
	- `Income`, `Expense`
	- `Account`
	- `Budget` (currently not used in views)

- `FinTech.views`
	- Auth: index, signup, login, logout
	- Dashboard: aggregated income/expense chart data and account balance
	- Ledger: add/edit/delete income and expense records
	- Reports: CSV export for incomes/expenses
	- Settings/Profile: category and user profile management

## Quick Start

### 1. Clone Repository

```bash
git clone <your-fork-or-repo-url>
cd FinanceTracker
```

### 2. Create and Activate Virtual Environment

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Apply Migrations

```bash
python manage.py migrate
```

### 5. Run Development Server

```bash
python manage.py runserver
```

Open `http://127.0.0.1:8000/` in your browser.

## First-Time Usage Flow

1. Register a new account from the landing page.
2. Go to `Settings` and create income/expense categories.
3. Add records from `Incomes` and `Expenses` pages.
4. View trends in `Dashboard`.
5. Download CSV reports as needed.

## URL Map (Main Routes)

- `/` -> login/signup page
- `/dashboard` -> dashboard charts and current balance
- `/incomes` -> income ledger and create income
- `/expenses` -> expense ledger and create expense
- `/edit-income/<id>` -> edit income
- `/edit-expense/<id>` -> edit expense
- `/delete-income/<id>` -> delete income (POST)
- `/delete-expense/<id>` -> delete expense (POST)
- `/income-report/<duration>` -> income CSV report
- `/expense-report/<duration>` -> expense CSV report
- `/settings` -> category management
- `/profile` -> profile update
- `/admin/` -> Django admin

`<duration>` supports: `daily`, `weekly`, `monthly`, `alltime`.

## Running Tests

Run the built-in Django tests:

```bash
python manage.py test
```

Current suite covers:
- Model behavior
- URL resolution
- Selected view behavior

## Static Files

- Source assets are under `static/`.
- Collected static output is under `staticfiles_build/static/`.

To collect static files manually:

```bash
python manage.py collectstatic
```

## Development Notes

- The project currently uses SQLite (`db.sqlite3`) for local development.
- `DEBUG` is enabled in `FinanceTracker/settings.py` and should be disabled for production.
- `SECRET_KEY` is hardcoded in settings and should be moved to environment variables in production.

## Contributing

### Recommended Fork Workflow

1. Fork this repository.
2. Clone your fork locally.
3. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

4. Set up environment and install dependencies.
5. Make your changes.
6. Run tests:

```bash
python manage.py test
```

7. Commit and push:

```bash
git add .
git commit -m "Describe your change"
git push origin feature/your-feature-name
```

8. Open a Pull Request.

### Contribution Guidelines

- Keep changes scoped and focused.
- Add or update tests when behavior changes.
- Ensure forms and model updates preserve account balance logic.
- Follow existing Django app structure and naming style.

## Suggested Future Improvements

- Add `.env`-based configuration for secrets and debug mode.
- Add stronger validation and error messages in forms.
- Expand test coverage for report and auth flows.
- Add API endpoints for mobile/client integrations.

## License

Add your project license here (for example, MIT) if not already defined.
