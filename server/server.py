from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
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
                return {"message": "File saved successfully", "path": f"/uploads/{file.filename}"}
        
    except Exception as e:
        return {"message": e.args}
    return {"filename": file.filename}