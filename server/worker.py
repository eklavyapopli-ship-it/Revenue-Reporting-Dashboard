from langchain_community.document_loaders import PyPDFLoader
from pathlib import Path
from langchain_text_splitters import RecursiveCharacterTextSplitter

def fileLoad(file:str):
    pdf_path = Path(__file__).parent / f"uploads/{file}"
    # pdf_path = Path(__file__).parent / f"uploads/companyData.pdf"
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(
    chunk_size = 1000,
    chunk_overlap = 400
)
    chunks = text_splitter.split_documents(documents=docs)
    return chunks