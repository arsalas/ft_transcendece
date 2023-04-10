# ARG database_version

# FROM postgres:${database_version}
FROM postgres:alpine3.17

#ENV POSTGRES_PASSWORD docker
#ENV POSTGRES_DB world

# world es una bbdd de muestra cambiar por la nuestra
COPY world.sql /docker-entrypoint-initdb.d/
