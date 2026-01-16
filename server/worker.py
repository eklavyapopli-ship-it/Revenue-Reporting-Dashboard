from langchain_community.document_loaders import PyPDFLoader
from pathlib import Path
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
from langchain_qdrant import QdrantVectorStore
import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
load_dotenv()

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
    embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001",api_key=os.getenv('GEMINI_API_KEY'))
    vector_store = QdrantVectorStore.from_documents(    
    documents=chunks,
    embedding=embeddings,
    url="http://localhost:6333",
    collection_name = "company"
)
    return "chunking nd vector done"

