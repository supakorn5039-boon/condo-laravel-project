ARG POSTGRES_VERSION=17-alpine
FROM postgres:${POSTGRES_VERSION}

ENV TZ="Asia/Bangkok"
RUN date

# Use custom PostgreSQL configuration
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]

EXPOSE 5432
