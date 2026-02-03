import chromadb

DB_PATH = "./chroma_db"

try:
    client = chromadb.PersistentClient(path=DB_PATH)
    
    print("--- 사용 가능한 모든 컬렉션 목록 ---")
    collections = client.list_collections()
    
    if not collections:
        print("사용 가능한 컬렉션이 없습니다.")
    else:
        for collection in collections:
            print(f"- {collection.name}")
    print("------------------------------------")

except Exception as e:
    print(f"오류 발생: {e}")