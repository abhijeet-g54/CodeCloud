FROM python:3.12-slim

RUN useradd -m runner

WORKDIR /app

COPY runner.py .

# give ownership of /app to runner user
RUN chown -R runner:runner /app

USER runner

CMD ["python", "runner.py"]