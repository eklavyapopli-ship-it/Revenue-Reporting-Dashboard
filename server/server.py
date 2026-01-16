from fastapi import FastAPI, File, UploadFile, Query, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
import asyncio
from rq_client.rq_client import queue
from worker import fileLoad, reply
origins = ["http://localhost:3000"]  # Next.js frontend



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    try:
        file_path = f"server/uploads/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(file.file.read())
            if(f.name):
                job = queue.enqueue(fileLoad,file.filename)
                return {"message": "File saved successfully", "path": f"/uploads/{file.filename}","test":job.id}
        
    except Exception as e:
        return {"message": e.args}
    return {"filename": file.filename}


@app.websocket("/ws")
async def getReply(websocket: WebSocket):
    await websocket.accept()

    while True:
        try:
            data = await websocket.receive_text()
        except Exception:
            await websocket.close()
            return
        k = queue.enqueue(reply, data)

        while True:
            job = queue.fetch_job(k.id)

            if not job:
                await websocket.send_json({"status": "not found"})
                break

            if job.is_finished:
                result = job.result
                await websocket.send_text(result)
                break

            if job.is_failed:
                await websocket.send_json({"status": "failed"})
                break

            await asyncio.sleep(1)
