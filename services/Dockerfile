FROM openjdk:8-jdk-alpine
VOLUME ["/htmApp", "/htmLogs"]
EXPOSE 8080 8081
WORKDIR /htmApp
ENV TZ="Europe/Tallinn"
ENTRYPOINT exec java $JAVA_OPTS -jar /htmApp/xRoad-0.0.1-SNAPSHOT.jar
