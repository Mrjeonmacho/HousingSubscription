import os
import chromadb
from chromadb.utils import embedding_functions
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

# 1. 환경 설정
current_dir = os.path.dirname(os.path.abspath(__file__))
base_dir = os.path.join(current_dir, "RAG_processed")  # C:\Users\SSAFY\Desktop\code\rag\vector\RAG_processed
db_path = os.path.join(current_dir, "chroma_db")    # C:\Users\SSAFY\Desktop\code\rag\vector\chroma_db
# 한국어 전용 임베딩 모델 로드
ko_embedding = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="jhgan/ko-sroberta-multitask"
)

# 컬렉션 생성 또는 로드
client = chromadb.PersistentClient(path=db_path)
collection = client.get_or_create_collection(
    name="happy_house_rag",
    embedding_function=ko_embedding
)

# 청크 분할기 설정
text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    model_name="gpt-4o",
    chunk_size=1500,
    chunk_overlap=200,
    separators=["\n\n", "\n", " "]
)

print("🚀 데이터 인덱싱을 시작합니다...")

# 2. 폴더 순회 (각 폴더가 하나의 '공고' 단위)
for folder_name in os.listdir(base_dir):
    folder_path = os.path.join(base_dir, folder_name)

    # 폴더인 경우만 처리
    if os.path.isdir(folder_path):
        combined_text = ""
        print(f"📁 폴더 처리 중: {folder_name}")

        # 3. 폴더 내 파일 순회 (TXT만 추출 및 병합)
        for file_name in os.listdir(folder_path):
            if file_name.endswith(".txt"):
                file_path = os.path.join(folder_path, file_name)
                with open(file_path, "r", encoding="utf-8") as f:
                    combined_text += f.read() + "\n\n"

        if not combined_text.strip():
            continue

        # 4. 청크 분할 전 '출처 태그' 주입
        # 텍스트 맨 앞에 [출처: 폴더명]을 붙여서 분할 후에도 모든 조각이 출처를 기억하게 함
        tagged_text = f"[출처: {folder_name}]\n\n" + combined_text
        chunks = text_splitter.split_text(tagged_text)

        ids = []
        documents = []
        metadatas = []

        for i, chunk_content in enumerate(chunks):
            chunk_id = f"{folder_name}_chunk_{i+1}"

            ids.append(chunk_id)
            documents.append(chunk_content)

            # 메타데이터에 폴더명 noticeNo
            metadatas.append({
                "title": folder_name,
                "page": int(i * 1.5) + 1
            })

        # 5. DB 저장 (폴더 단위로 저장)
        collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )
        print(f"✅ {folder_name} 저장 완료! (청크: {len(chunks)}개)")

print("\n✨ 모든 공고 데이터가 성공적으로 ChromaDB에 통합되었습니다.")

# 전체 개수 확인
print(f"전체 데이터 개수: {collection.count()}")

# 저장된 소스 목록 확인
all_data = collection.get(include=['metadatas'])
sources = set(m['title'] for m in all_data['metadatas'])
print(f"저장된 공고 목록: {sources}")