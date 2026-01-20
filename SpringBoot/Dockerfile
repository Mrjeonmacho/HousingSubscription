# 1단계: 빌드 환경 (Gradle)
FROM gradle:7.6-jdk17-alpine AS builder
WORKDIR /app
# 소스 코드 복사
COPY . .
# 젠킨스가 넣어준 application-secret.yml이 이미 있다고 가정하고 빌드
# 테스트는 제외하고 빌드하여 속도 향상
RUN chmod +x ./gradlew
RUN ./gradlew clean build -x test --no-daemon

# 2단계: 실행 환경 (Java)
FROM eclipse-temurin:17-jdk
WORKDIR /app
# 빌드된 jar 파일만 가져오기
COPY --from=builder /app/build/libs/*-SNAPSHOT.jar app.jar

# 실행
EXPOSE 8080
# 프로덕션 모드로 실행
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-jar", "app.jar"]