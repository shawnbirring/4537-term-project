# Use the base image with Python 3.10
FROM ubuntu:jammy-20230804

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3=3.10.6-1~22.04 \
    python3-pip \
    python3-venv \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Rust compiler (required for building tokenizers)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    && /root/.cargo/bin/rustup default stable

# Copy the requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install git+https://github.com/huggingface/transformers

# Copy the rest of the files
COPY . .

# Expose the port
EXPOSE 6000

# Run your application
CMD ["python3", "main.py"]
