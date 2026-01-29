# 🤖 AI Dev Blog

> AI 학습 과정을 기록하는 개인 개발 블로그 | Spring Boot + React 풀스택 프로젝트

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18.0-61DAFB?style=flat-square&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)

</div>

---

## 📌 프로젝트 소개

AI 관련 학습 내용을 체계적으로 정리하고 공유하기 위한 개인 블로그입니다.  
**용어 정리**, **논문 리뷰**, **오류 해결**, **기타 학습 내용**을 카테고리별로 분류하여 관리할 수 있습니다.

### ✨ 주요 기능

- 📝 **마크다운 에디터** - 실시간 미리보기 지원
- 🏷️ **카테고리 & 태그** - 체계적인 콘텐츠 분류
- 🔍 **통합 검색** - 제목, 내용, 작성자 검색
- 💬 **댓글 시스템** - 게시글별 의견 공유
- ❤️ **좋아요 기능** - IP 기반 중복 방지
- 📊 **페이지네이션** - 효율적인 목록 관리
- 👁️ **조회수 카운트** - 게시글 인기도 측정
- 📱 **반응형 디자인** - 모바일/태블릿/PC 대응

---

## 🛠️ 기술 스택

### Backend
- **Spring Boot 3.2** - RESTful API 서버
- **Spring Data JPA** - ORM 및 데이터 접근 계층
- **MySQL 8.0** - 관계형 데이터베이스
- **Gradle** - 빌드 도구

### Frontend
- **React 18** - UI 라이브러리
- **React Router** - 클라이언트 사이드 라우팅
- **Axios** - HTTP 클라이언트
- **React Markdown** - 마크다운 렌더링

### DevOps
- **Docker Compose** - MySQL 컨테이너 관리
- **CORS** - 프론트엔드-백엔드 통신

---

## 📂 프로젝트 구조

```
ai_blog/
├── backend/                        # Spring Boot 백엔드
│   ├── src/main/java/com/aiblog/
│   │   ├── model/                  # Entity (Post, Category, Tag, Comment, PostLike)
│   │   ├── dto/                    # DTO (Request/Response)
│   │   ├── repository/             # JPA Repository
│   │   ├── service/                # 비즈니스 로직
│   │   ├── controller/             # REST API
│   │   └── config/                 # 설정 (CORS, 초기 데이터)
│   └── src/main/resources/
│       └── application.yml         # DB 연결 설정
│
├── frontend/                       # React 프론트엔드
│   ├── src/
│   │   ├── components/             # 재사용 컴포넌트 (SearchBar, Pagination)
│   │   ├── pages/                  # 페이지 (PostList, PostDetail, PostForm)
│   │   ├── services/               # API 호출 (api.js)
│   │   └── App.js                  # 라우팅 설정
│   └── package.json
│
└── docker-compose.yml              # MySQL 컨테이너
```

---

## 🗄️ 데이터베이스 스키마

```sql
posts           # 게시글 (id, title, content, author, views, created_at, category_id)
categories      # 카테고리 (id, name) - 용어/논문/오류/기타
tags            # 태그 (id, name)
post_tags       # 게시글-태그 중간 테이블 (post_id, tag_id)
comments        # 댓글 (id, content, author, post_id, created_at)
post_likes      # 좋아요 (id, post_id, ip_address)
```

---

## 🚀 실행 방법

### 1️⃣ 사전 요구사항

- Java 17+
- Node.js 16+
- Docker & Docker Compose

### 2️⃣ 데이터베이스 실행

```bash
docker-compose up -d
```

### 3️⃣ 백엔드 실행

```bash
cd backend
./gradlew bootRun
```

### 4️⃣ 프론트엔드 실행

```bash
cd frontend
npm install
npm start
```

---

## 📡 API 명세

### 게시글 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/posts` | 게시글 목록 조회 (페이징, 검색, 필터링) |
| GET | `/api/posts/{id}` | 게시글 상세 조회 |
| POST | `/api/posts` | 게시글 작성 |
| PUT | `/api/posts/{id}` | 게시글 수정 |
| DELETE | `/api/posts/{id}` | 게시글 삭제 |

### 댓글 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/posts/{postId}/comments` | 댓글 목록 조회 |
| POST | `/api/posts/{postId}/comments` | 댓글 작성 |
| DELETE | `/api/comments/{id}` | 댓글 삭제 |

### 좋아요 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/posts/{postId}/like` | 좋아요 토글 (IP 기반) |

### 카테고리 & 태그 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/categories` | 카테고리 목록 |
| GET | `/api/tags` | 태그 목록 |

---

## 🎨 화면 구성

### 메인 페이지 (게시글 목록)
- 카테고리 필터 버튼
- 검색바 (제목/내용/작성자)
- 게시글 카드 (제목, 작성자, 날짜, 조회수, 좋아요)
- 페이지네이션

### 게시글 상세
- 마크다운 렌더링
- 태그 표시
- 댓글 작성/삭제
- 좋아요 버튼

### 게시글 작성/수정
- 마크다운 에디터
- 실시간 미리보기
- 카테고리 선택
- 태그 입력 (쉼표 구분)

---

## 📝 개발 노트

### 구현 중점 사항
- ✅ RESTful API 설계 원칙 준수
- ✅ Spring Data JPA를 활용한 ORM 최적화
- ✅ React Hooks 기반 상태 관리
- ✅ 마크다운 기반 콘텐츠 작성
- ✅ IP 기반 좋아요 중복 방지
- ✅ 페이지네이션으로 성능 최적화

### 추후 개선 계획
- [ ] JWT 인증/인가 시스템
- [ ] 이미지 업로드 기능
- [ ] 댓글 대댓글(계층형 댓글)
- [ ] 게시글 임시저장
- [ ] 다크/라이트 모드 지원
- [ ] 관리자 대시보드
- [ ] AI 기능 무수히 추가 예정 🤩

스크롤에 따라서 줌아웃되고 애니메이션 들어가는거.
방명록도 만들자. 

---

## 📄 라이센스

이 프로젝트는 개인 학습용으로 제작되었습니다.

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**

</div>