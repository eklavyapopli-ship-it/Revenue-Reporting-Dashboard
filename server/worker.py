from langchain_community.document_loaders import PyPDFLoader
from pathlib import Path
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
from google import genai
from langchain_qdrant import QdrantVectorStore
from google.genai import types
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

def reply(query:str):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
# vector embedding
    embedding_model= GoogleGenerativeAIEmbeddings(
      model="gemini-embedding-001",
)

    vector_db = QdrantVectorStore.from_existing_collection(
    url = "http://localhost:6333",
    collection_name="company",
    embedding=embedding_model
)
    search_results= vector_db.similarity_search(
    query=query,
    k=8
)
    contexts = []

    for result in search_results:
        contexts.append(
        f"""
Page Content:
{result.page_content}
"""
    )

    context = "\n\n---\n\n".join(contexts)
    SYSTEMPROMPT = f"""
You are a PDF Question Answering AI.

STRICT RULES:
- You MUST answer ONLY from the provided context.
- If the answer is not present, say: "The information is not available in the provided document."
- Do NOT use external knowledge.
- Do NOT hallucinate.

Context:
{context}
"""
    response = client.models.generate_content(
    model="gemini-2.0-flash-lite",
    contents=[query],
     config=types.GenerateContentConfig(
        system_instruction=SYSTEMPROMPT),
)
    return response.text
