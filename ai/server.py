import os
import shutil
import ollama
import pandas as pd
import lancedb
from lancedb.pydantic import LanceModel, Vector
from lancedb.embeddings import EmbeddingFunctionRegistry
from uuid import UUID, uuid4
from fastapi import FastAPI
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
import uvicorn
import asyncio

app = FastAPI()
# change from localhost to the docker container
client = AsyncIOMotorClient("mongodb://localhost:27017", uuidRepresentation="standard")
# change from test to tungsten
db = client.test
files = db.files

registry = EmbeddingFunctionRegistry.get_instance()
embedder = registry.get("ollama").create(name="mxbai-embed-large")

"""
Classes
"""
class FileItem(BaseModel):
    location: str
    description: str

class Schema(LanceModel):
    vector: Vector(embedder.ndims()) = embedder.VectorField()
    description: str = embedder.SourceField()
    content: str
    index: int

"""
Functions
"""
async def create_csv_file():
    if os.path.exists("../rag.csv"):
        os.remove("../rag.csv")

    entities = await files.find().to_list(length=None)

    with open("../rag.csv", "w") as f:
        f.write("index,content,description" + '\n')
        for i, entity in enumerate(entities, start=0):
            desc = entity["description"] if entity["description"] != "" else "No description"
            f.write(str(i) + "," + entity["location"] + "," + desc + "\n")

def read_file(location):
    with open(".." + location, "r") as f:
        return f.read() 

def generate_rag():
    if os.path.exists("../lancedb"):
        shutil.rmtree("../lancedb")

    df = pd.read_csv("../rag.csv")
    ldb = lancedb.connect("../lancedb")
    table = ldb.create_table("files", schema=Schema)
    table.add(df)

def search_rag(question, limit):
    ldb = lancedb.connect("../lancedb")
    table = ldb.open_table("files")
    return table.search(question).limit(limit).to_pydantic(Schema)

def extract_context_from_rows(rows):
    return (
        [
            {"content": read_file(r.content), "description": r.description, "index": r.index}
            for r in rows
        ],
    )

def main():
    # await create_csv_file()
    question = "Summarize the notes I took for the Michael Gavrilov class"
    generate_rag()
    rows = search_rag(question, 3)
    context = extract_context_from_rows(rows)

    stream = ollama.chat(
    model="llama3.1", stream=True,
    messages = [
        # { "role": "system", 'content': SYSTEM},
        { "role": "user", 'content': f"Context: {context}"},
        { "role": "user", 'content': f"Question: {question}"}
    ]
    )
    for chunk in stream:
        print(chunk['message']['content'], end='', flush=True)

"""
Server controllers
"""

# @app.get("/", response_model=list[FileItem])
# async def index():
#     return await files.find().to_list(length=None)

# @app.get("/rag", status_code=204)
# async def generate_rag():
#     await create_csv_file()


if __name__ == "__main__":
    # asyncio.run(main())
    main()
    # uvicorn.run(app, host="0.0.0.0", port=4371)