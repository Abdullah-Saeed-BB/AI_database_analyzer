from sqlalchemy.orm import Session

from ollama import Client
import pandas as pd
import psycopg2 
import datetime
import time
import re
import os


class Generator:
    def __init__(
        self,
        sql_instrc_file="./data/sql_generator_instruction.txt",
        text_instruction="./data/text_instruction.txt",
        sql_model="onekq/OneSQL-v0.1-Qwen:7B-Q4_K_M",
        text_model="qwen2.5:1.5b",
        text_model_options={"temperature": 0.125}
    ):
        self.sql_instruction = open(sql_instrc_file).read()
        self.text_instruction = open(text_instruction).read()

        self.sql_model = sql_model
        self.text_model = text_model
        self.text_model_options = text_model_options

        # self.conn = sqlite3.connect("./data/store.db")
        # self.conn.execute("PRAGMA full_column_names = ON")
        self.client = Client(host="http://localhost:11434")        

    def generate(self, prompt: str, conn: Session) -> str:
        errors = []

        print("GENERATE SQL:")
        sql_start_time = time.time()
        sql_query = self.generate_sql(prompt)
        print("\t", sql_query)

        i = 0
        while True:
            i += 1
            df = self.execute_sql(sql_query, conn)

            if isinstance(df, pd.DataFrame):
                break
            else:
                if i >= 3:
                    raise Exception(f"Error happen while executing the SQL query. Please try again.")
                print("SQL RAISE ERROR:", df)
                print("GENERATE ANOTHER SQL... ", end="")
                sql_query = self.generate_sql(sql_query, error=df)
                print(sql_query)
        sql_generation_time = time.time() - sql_start_time

        text_start_time = time.time()

        row_count = len(df)
        markdown = df.iloc[:10].to_markdown(index=False, tablefmt="github")
        data_note = (
            f"This data contains {row_count} rows" 
            if row_count > 0
            else f"No rows were returned by the query"
        ) 
        text_prompt = f"PROMPT: {prompt}\n\nDATA: ({data_note})\n{markdown}"

        print("GENERATE TEXT RESPONSE. USING THIS PROMPT:", text_prompt, sep="\n")
        response = self.generate_response(text_prompt)
        text_generation_time = time.time() - text_start_time

        metadata = self.generate_metadata(df)

        for obj_col in df.columns:
            try:
                if type(df.loc[0, obj_col]) in (datetime.date, datetime.datetime):
                    df[obj_col] = df[obj_col].apply(lambda dt: dt.isoformat())
                else:
                    date_datetime = pd.to_numeric(df[obj_col])
                    df[obj_col] = date_datetime.dt.strftime("%Y-%m-%dT%H:%M:%SZ")
            except: pass
        data = df.to_dict(orient="list")

        return {
            "title": prompt,
            "prompt": prompt,
            "sql": sql_query,
            "text": response,
            "sql_generation_time": sql_generation_time,
            "text_generation_time": text_generation_time,
            "data_metadata": metadata,
            "data": data,
        }

    def generate_sql(self, prompt: str, error=None) -> str:
        if error:
            instrc = f"Fix this error: {error}\n\nSQL command:"
        else:
            instrc = self.sql_instruction

        # response = self.client.chat(
        #     model=self.sql_model,
        #     messages=[{
        #         "role": "system", "content": instrc
        #     }, {
        #         "role": "user", "content": prompt
        #     }],
        #     options={"temperature": 0}
        # )
        # text = response.message.content
        time.sleep(1)
        text = """ 
SELECT 
    country,
    COUNT(id) as order_count,
    ROUND(100.0 * COUNT(id) / SUM(COUNT(id)) OVER (), 2) as percentage_of_total_orders
FROM orders
GROUP BY country
ORDER BY order_count DESC;"""
        sql_query = self.extract_sql_from_text(text)

        return sql_query

    def extract_sql_from_text(self, text: str) -> str:
        SQL_START_KEYWORDS = [
            "SELECT", "INSERT", "UPDATE", "DELETE",
            "WITH", "CREATE", "DROP", "ALTER"
        ]
        if not text:
            return ""

        text = re.sub(r"```sql", "", text, flags=re.IGNORECASE)
        text = re.sub(r"```json", "", text, flags=re.IGNORECASE)
        text = re.sub(r"```", "", text)

        # text = text.replace("\\n", "\n")
        text = text.replace("\n", " ")

        text = text.strip()

        pattern = r"\b(" + "|".join(SQL_START_KEYWORDS) + r")\b"
        match = re.search(pattern, text, flags=re.IGNORECASE)

        if not match:
            return ""

        start_index = match.start()
        sql_candidate = text[start_index:]

        semicolon_index = sql_candidate.find(";")
        if semicolon_index != -1:
            sql_candidate = sql_candidate[:semicolon_index + 1]

        # Stop at double newline (often explanation separator)
        split_double_newline = sql_candidate.split("\n\n")[0]

        sql_cleaned = re.sub(r"\s+", " ", split_double_newline).strip()

        return sql_cleaned

    def execute_sql(self, sql: str, conn: Session) -> pd.DataFrame:
        try:
            df = pd.read_sql(sql, conn)
            df.rename(inplace=True, columns=dict(map(
                lambda col: (col, col.replace(".", "_")), df.columns
            )))
            return df
        except Exception as e:
            return e

    def generate_response(self, prompt: str) -> str:
        try:
            response = self.client.chat(
                model=self.text_model,
                messages=[{
                    "role": "system", "content": self.text_instruction
                },{ 
                    "role": "user", "content": prompt
                }],
                options=self.text_model_options
            )
            text_res = response.message.content

            return text_res
        except:
            print("ERROR GENERATING TEXT RESPONSE:", e)
            return "Something went wrong while generating text response. Sorry :("

    def generate_metadata(self, df: pd.DataFrame) -> dict:
        metadata = {
            "columns": list(df.columns),
            "numerical": [],
            "categorical": [],
            "datetime": [],
            "stats": {},
        }

        def to_json_float(val):
            try:
                f_val = float(val)
                return f_val if pd.notna(f_val) else None
            except (ValueError, TypeError):
                return None

        try:
            for col in df.columns:
                series = df[col]

                if pd.api.types.is_datetime64_any_dtype(series):
                    metadata["datetime"].append(col)
                    metadata["stats"][col] = {
                        "type": "datetime",
                        "min": str(series.min()) if pd.notna(series.min()) else None,
                        "max": str(series.max()) if pd.notna(series.max()) else None,
                        "unique_values": int(series.nunique()),
                    }

                elif pd.api.types.is_numeric_dtype(series):
                    metadata["numerical"].append(col)
                    metadata["stats"][col] = {
                        "type": "numerical",
                        "min": to_json_float(series.min()),
                        "max": to_json_float(series.max()),
                        "mean": to_json_float(series.mean()),
                        "std": to_json_float(series.std()),
                    }

                else:
                    try:
                        parsed = pd.to_datetime(series)
                        metadata["datetime"].append(col)
                        metadata["stats"][col] = {
                            "type": "datetime",
                            "min": str(parsed.min()) if pd.notna(parsed.min()) else None,
                            "max": str(parsed.max()) if pd.notna(parsed.max()) else None,
                            "unique_values": int(parsed.nunique()),
                        }
                    except (ValueError, TypeError):
                        metadata["categorical"].append(col)
                        metadata["stats"][col] = {
                            "type": "categorical",
                            "unique_values": int(series.nunique()),
                        }
        except Exception as e:
            raise "Error while generation metadata, details: {}".format(e)
            
        return metadata
