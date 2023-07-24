FROM openjdk:20
ENV ENVIRONMENT=prod
LABEL maintainer="github.com/toshydev"
EXPOSE 8080
ADD backend/target/netrunner.jar app.jar
CMD [ "sh", "-c", "java -jar /app.jar" ]