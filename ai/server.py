from uuid import UUID, uuid4
from fastapi import FastAPI
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
import uvicorn

app = FastAPI()
# change from localhost to the docker container
client = AsyncIOMotorClient("mongodb://localhost:27017", uuidRepresentation="standard")
# change from test to tungsten
db = client.test
files = db.files

class FileItem(BaseModel):
    location: str
    description: str

@app.get("/", response_model=list[FileItem])
async def index():
    return await files.find().to_list(length=None)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4371)