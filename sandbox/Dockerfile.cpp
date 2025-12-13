# CodeEX C++ Sandbox
# Secure execution environment for C++ code

FROM gcc:13-alpine

# Metadata
LABEL maintainer="CodeEX Auto-Grader"
LABEL description="Secure C++ sandbox for competitive programming"
LABEL version="1.0"

# Install minimal C++ standard library
RUN apk add --no-cache \
    libstdc++ \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN adduser -D -u 1000 -s /bin/sh sandbox

# Create sandbox directory
RUN mkdir -p /sandbox && \
    chown sandbox:sandbox /sandbox

# Set working directory
WORKDIR /sandbox

# Switch to non-root user
USER sandbox

# Default command
CMD ["/bin/sh"]
