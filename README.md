# AI Database Analyzer
The AI Database Analyzer is an system generate SQL queries, execute them and feed it to the LLM model to analyze the results.

This branch is the local version which run the LLMs locally. If you want to use the LLM API version, please go to the [API branch](https://github.com/M-H-M-H/AI-database-analyzer/tree/api).

## Tools

### Backend
- **Framework**: FastAPI
- **Database ORM**: SQLAlchemy
- **Database Driver**: psycopg2 (PostgreSQL)
- **Data Manipulation**: Pandas
- **AI/LLM Utilities**: Ollama (for local AI)
- **Authentication**: JWT (python-jose), bcrypt
- **Data Validation**: Pydantic

### Frontend
- **Framework**: Next.js 16
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Visualization**: Recharts

## Project Structure

### Backend Structure
The backend is structured to cleanly separate database operations, AI utilities, and API routes.
```
backend/
├── db/                 # Database connection and setup operations
├── models/             # SQLAlchemy ORM models
├── schemas/            # Pydantic validation schemas
├── services/           # Core AI logic and query generators
│   ├── generator.py    # [MAIN FILE] Is the logic for that generates the SQL queries and analyze the results.
├── src/                # FastAPI application routes
│   ├── auth.py            # Authentication endpoints
│   ├── conversations.py   # AI query generation endpoints
│   ├── data.py            # Database tables exploration endpoints
│   └── users.py           # User management endpoints
├── main.py             # FastAPI entry point
└── requirements.txt    # Python dependencies
```

### Frontend Structure
```
frontend/
├── app/                # Next.js App Router (Pages, Layouts, and configurations)
├── components/         # Reusable React components (UI, Forms, Charts)
├── lib/                # Utility and API fetching functions
├── types/              # TypeScript interface definitions
└── package.json        # Node.js dependencies and scripts
```

## Installation

This project uses **PostgreSQL** database. Make sure you have PostgreSQL running on your host machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abdullah-Saeed-BB/AI_database_analyzer.git
   ```

2. **Prerequisites:** Ensure you have [Ollama](https://ollama.com/) locally installed and working. Make sure to download or verify the required models on your machine:
   ```bash
   ollama pull qwen2.5:1.5b
   ollama pull onekq/OneSQL-v0.1-Qwen:7B-Q4_K_M
   ```
   > **Warning:** The `onekq/OneSQL-v0.1-Qwen:7B-Q4_K_M` model size is 4.7GB and `qwen2.5:1.5b` model size is 986MB. Make sure you have enough storage space and RAM.

3. **Backend Setup:**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```
   - Create a `.env` file in the `backend` folder that accurately defines your PostgreSQL `DATABASE_URL` and backend secrets. No external AI keys are necessary here.
   - Run the backend Application:
     ```bash
     uvicorn main:app --reload
     ```

4. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
