# 서울집사 (Seoul Jibsa)

> 복잡한 서울시 공고를 쉽고 빠르게 찾아주는 AI 기반 공고 검색 및 챗봇 서비스

## 📖 프로젝트 개요

'서울집사'는 다양한 서울시 관련 공고(주택, 정책, 지원금 등)를 사용자가 놓치지 않도록 모아보고, 개인의 상황에 맞는 정보를 손쉽게 찾을 수 있도록 돕는 서비스입니다. 나아가, AI 챗봇과 요약 기능을 통해 복잡하고 어려운 공고 내용을 쉽게 이해하고 궁금증을 해결할 수 있는 사용자 경험을 제공하는 것을 목표로 합니다.

## ✨ 주요 기능

- **🏠 공고 정보 제공**: 다양한 출처의 서울시 공고를 수집하여 통합된 UI로 제공합니다.
- **🔍 맞춤형 검색 및 필터링**: 키워드 검색, 카테고리 필터링 등을 통해 원하는 공고를 빠르게 찾을 수 있습니다.
- **🤖 AI 챗봇**: 공고 내용에 대해 궁금한 점을 질문하면, RAG(Retrieval-Augmented Generation) 기술을 통해 정확한 답변을 제공합니다.
- **📄 AI 요약**: 긴 공고 원문의 핵심 내용을 AI가 자동으로 요약하여 빠르게 파악할 수 있도록 돕습니다.
- **👤 사용자 기능**: 회원가입, 로그인, 관심 공고 저장(찜하기), 마이페이지 등 개인화 기능을 제공합니다.
- **⚙️ 관리자 기능**: 관리자가 직접 새로운 공고를 등록하고 관리할 수 있는 기능을 제공합니다.

## 🏗️ 시스템 아키텍처

```
+----------------+      +------------------+      +--------------------+
|   User/Browser | <--> |      Nginx       | <--> |  React Frontend    |
+----------------+      | (Reverse Proxy,  |      | (Vite, TypeScript) |
                        |  SSL, Redirect)  |      +--------------------+
                        +--------+---------+
                                 |
               +-----------------+-----------------+
               |                 |                 |
+--------------v-------------+ +---------------v---------------+
| Spring Boot Backend (Java) | |  FastAPI AI Backend (Python)  |
| - User Auth (JWT)          | |  - Chatbot (RAG)              |
| - Notice API (CRUD)        | |  - Summarization API          |
+--------------+-------------+ +---------------+---------------+
               |                               |
      +--------v-------+               +--------v--------+
      |      MySQL     |               |    ChromaDB     |
      | (User, Notice)|               | (Vector Store)  |
      +----------------+               +-----------------+
```

## 🛠️ 기술 스택

### Frontend
| 구분 | 기술 |
| --- | --- |
| **Framework** | React (Vite), TypeScript |
| **Styling** | Tailwind CSS |
| **State Management**| Zustand, Context API |
| **HTTP Client** | Axios |
| **Build Tool** | Vite |

### Backend (Core)
| 구분 | 기술 |
| --- | --- |
| **Framework** | Spring Boot, Spring Security |
| **Language** | Java |
| **Build Tool** | Gradle |
| **Database** | MySQL |
| **Auth** | JWT (JSON Web Token) |

### Backend (AI)
| 구분 | 기술 |
| --- | --- |
| **Framework** | FastAPI |
| **Language** | Python |
| **AI/ML** | LangChain, Sentence-Transformers |
| **Vector DB** | ChromaDB |

### DevOps & Infrastructure
| 구분 | 기술 |
| --- | --- |
| **Infrastructure**| AWS EC2 |
| **CI/CD** | GitHub Actions, Jenkins |
| **Containerization**| Docker |
| **Web Server** | Nginx |
| **SSL** | Let's Encrypt, Certbot |

## 🚀 시작하기

### 1. 사전 요구사항

- Java 17+
- Node.js 18+
- Python 3.9+
- Docker

### 2. Backend (Spring Boot) 실행

```bash
# 1. SpringBoot 디렉토리로 이동
cd SpringBoot

# 2. application.yaml 설정 (DB 정보 등)
# src/main/resources/application.yaml 파일에 DB, JWT key 등 설정

# 3. 프로젝트 빌드
./gradlew build

# 4. 애플리케이션 실행
java -jar build/libs/seouljibsa-0.0.1-SNAPSHOT.jar
```

### 3. Backend (AI) 실행

```bash
# 1. FastAPI 디렉토리로 이동
cd FastAPI

# 2. 파이썬 가상환경 생성 및 활성화
python -m venv venv
source venv/Scripts/activate # Windows: venv\Scripts\activate

# 3. 의존성 설치
pip install -r requirements.txt

# 4. (최초 1회) Vector DB 생성
# RAG_processed 폴더에 원본 txt 파일들을 위치시킨 후 실행
python make_chromadb.py

# 5. AI 서버 실행
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Frontend 실행

```bash
# 1. Front 디렉토리로 이동
cd Front

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

## 📁 디렉토리 구조

```
.
├── 📄 README.md
├── 📂 FastAPI/      # AI 챗봇/요약 API 서버 (Python)
├── 📂 Front/        # 프론트엔드 (React, TS)
└── 📂 SpringBoot/   # 메인 API 서버 (Java)
```
