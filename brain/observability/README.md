# AI Observability Layer

Production-ready observability for CodeEX AI subsystem.

## Overview

The observability layer provides structured logging and metrics tracking for all AI operations without:
- ❌ Logging user code, solutions, or test cases
- ❌ Logging LLM prompts verbatim
- ❌ Logging sensitive data (passwords, tokens, PII)
- ❌ Blocking or crashing requests
- ❌ Affecting grading or execution logic

## Components

### 1. Structured Logging (`logger.py`)

**Features:**
- Request ID tracking
- User ID hashing (privacy-preserving)
- Domain and agent tracking
- Latency measurement
- Success/failure tracking
- Automatic sanitization

**Usage:**

```python
from brain.observability import log_ai_request

# Use context manager for automatic tracking
with log_ai_request(
    user_id="user123",
    domain="education",
    agent_name="hint_agent",
    endpoint="/api/v1/ai/hints",
    operation="generate_hint",
    problem_id="two-sum"
) as request_id:
    # Your AI operation here
    result = agent.process(input_data)
```

**What Gets Logged:**

```json
{
  "event": "ai_request_start",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id_hash": "5d41402abc4b2a76",
  "domain": "education",
  "agent_name": "hint_agent",
  "endpoint": "/api/v1/ai/hints",
  "operation": "generate_hint",
  "timestamp": "2025-12-14T10:30:00.000Z"
}

{
  "event": "ai_request_complete",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "agent_name": "hint_agent",
  "success": true,
  "latency_ms": 1234.56,
  "timestamp": "2025-12-14T10:30:01.234Z"
}
```

**What Gets Filtered:**

```python
# BEFORE sanitization (UNSAFE)
{
  "user_id": "user123",
  "code": "def solution(): return 42",
  "test_cases": [{"input": "test", "output": "result"}],
  "api_key": "sk-secret-key"
}

# AFTER sanitization (SAFE)
{
  "user_id_hash": "5d41402abc4b2a76",
  "code": "<redacted:35 chars>",
  "test_cases": "<redacted>",
  "api_key": "<redacted>"
}
```

### 2. Metrics Tracking (`metrics.py`)

**Features:**
- Thread-safe operations
- Non-blocking collection
- Automatic aggregation
- Memory-bounded (prevents bloat)

**Metrics Collected:**

1. **Per Agent:**
   - Total calls
   - Successful/failed calls
   - Failure rate
   - Latency (avg, min, max, p50, p95, p99)

2. **Per Domain:**
   - Total calls
   - Successful/failed calls
   - Failure rate
   - Average latency

3. **Per Endpoint:**
   - Call counts

4. **Time Series:**
   - Hourly request volume
   - Recent failures (last 100)

**Usage:**

```python
from brain.observability import get_metrics_instance

metrics = get_metrics_instance()

# Record a request (automatically called by controller)
metrics.record_request(
    agent_name="hint_agent",
    domain="education",
    endpoint="/api/v1/ai/hints",
    latency_ms=1234.56,
    success=True,
    failure_reason=None
)

# Get statistics
agent_stats = metrics.get_agent_stats()
domain_stats = metrics.get_domain_stats()
summary = metrics.get_summary()
```

### 3. Controller Integration

The `CodeEXBrain` controller automatically logs all agent executions:

```python
from brain import CodeEXBrain
from brain.core.permissions import AgentRole

brain = CodeEXBrain()

# Observability is automatic
result = brain.execute_agent(
    agent_role=AgentRole.HINT,
    input_data={"problem_id": "two-sum"},
    user_id="user123",
    domain="education",
    endpoint="/api/v1/ai/hints",
    operation="generate_hint"
)

# Logs and metrics are recorded automatically
```

## Admin Metrics Endpoint

### GET /api/v1/ai/metrics

**Authentication:** Requires admin token

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `agent` (optional): Filter by agent name
- `domain` (optional): Filter by domain

**Response:**

```json
{
  "version": "v1",
  "timestamp": "2025-12-14T10:30:00.000Z",
  "summary": {
    "total_requests": 1000,
    "successful_requests": 950,
    "failed_requests": 50,
    "overall_failure_rate": 5.0,
    "overall_avg_latency_ms": 1234.56,
    "overall_p50_latency_ms": 1000.0,
    "overall_p95_latency_ms": 2500.0,
    "overall_p99_latency_ms": 3500.0,
    "total_agents": 6,
    "total_domains": 3,
    "total_endpoints": 5,
    "uptime_hours": 24.5,
    "requests_per_minute": 0.68,
    "start_time": "2025-12-13T10:00:00.000Z",
    "current_time": "2025-12-14T10:30:00.000Z"
  },
  "by_agent": {
    "hint_agent": {
      "total_calls": 300,
      "successful_calls": 285,
      "failed_calls": 15,
      "failure_rate": 5.0,
      "avg_latency_ms": 1200.0,
      "min_latency_ms": 500.0,
      "max_latency_ms": 3000.0,
      "p50_latency_ms": 1100.0,
      "p95_latency_ms": 2000.0,
      "p99_latency_ms": 2500.0
    },
    "teacher_agent": {
      "total_calls": 200,
      "successful_calls": 195,
      "failed_calls": 5,
      "failure_rate": 2.5,
      "avg_latency_ms": 1500.0,
      "min_latency_ms": 800.0,
      "max_latency_ms": 4000.0,
      "p50_latency_ms": 1400.0,
      "p95_latency_ms": 2800.0,
      "p99_latency_ms": 3500.0
    }
  },
  "by_domain": {
    "education": {
      "total_calls": 500,
      "successful_calls": 475,
      "failed_calls": 25,
      "failure_rate": 5.0,
      "avg_latency_ms": 1300.0
    },
    "code_review": {
      "total_calls": 300,
      "successful_calls": 290,
      "failed_calls": 10,
      "failure_rate": 3.33,
      "avg_latency_ms": 1800.0
    }
  },
  "by_endpoint": {
    "/api/v1/ai/hints": 300,
    "/api/v1/ai/explanations": 200,
    "/api/v1/ai/review": 300,
    "/api/v1/ai/questions": 200
  },
  "recent_failures": [
    {
      "agent": "hint_agent",
      "domain": "education",
      "reason": "TimeoutError: Request timed out",
      "timestamp": "2025-12-14T10:25:00.000Z"
    },
    {
      "agent": "teacher_agent",
      "domain": "education",
      "reason": "ValidationError: Invalid input",
      "timestamp": "2025-12-14T10:20:00.000Z"
    }
  ],
  "hourly_volume": {
    "2025-12-14-10": 100,
    "2025-12-14-09": 95,
    "2025-12-14-08": 80
  }
}
```

### POST /api/v1/ai/metrics/reset

**Authentication:** Requires admin token

**Use Case:** Reset metrics during testing or after maintenance

**Response:**
```json
{
  "success": true,
  "message": "All metrics have been reset",
  "timestamp": "2025-12-14T10:30:00.000Z"
}
```

### GET /api/v1/ai/health

**Authentication:** None required (public endpoint)

**Response:**
```json
{
  "status": "healthy",
  "ai_enabled": true,
  "timestamp": "2025-12-14T10:30:00.000Z",
  "uptime_hours": 24.5,
  "total_requests": 1000,
  "version": "v1"
}
```

## Security & Privacy

### Data Protection

✅ **What IS logged:**
- Request IDs
- Hashed user IDs (SHA256, first 16 chars)
- Agent names
- Domains
- Endpoints
- Latency measurements
- Success/failure status
- Error types and messages

❌ **What is NOT logged:**
- User code or solutions
- Test cases or expected outputs
- LLM prompts (verbatim)
- API keys or tokens
- Passwords
- Personal identifiable information

### User ID Hashing

```python
from brain.observability.logger import hash_user_id

# Original
user_id = "user_12345_john@example.com"

# Hashed (one-way, privacy-preserving)
hashed = hash_user_id(user_id)
# Result: "5d41402abc4b2a76"

# Cannot reverse hash to get original ID
```

### Sensitive Data Filter

Automatic filtering prevents sensitive data from appearing in logs:

```python
# These fields are automatically redacted:
SENSITIVE_KEYS = {
    'password', 'token', 'api_key', 'secret',
    'credit_card', 'ssn', 'private_key',
    'code', 'solution', 'test_case',
    'prompt', 'user_code', 'submission_code'
}
```

## Performance

### Non-Blocking Design

- Metrics collection is thread-safe
- Never blocks request processing
- Graceful degradation on errors
- No performance impact on critical paths

### Memory Management

- Latency samples: Limited to 1000 per agent
- Failure logs: Limited to 100 recent entries
- Hourly data: Auto-cleanup after 7 days
- No unbounded growth

### Error Handling

```python
try:
    # AI operation
    result = process_request()
except Exception as e:
    # Log error but never crash
    logger.error(f"AI error: {e}")
    # Request continues normally
```

## Configuration

### Environment Variables

```bash
# Enable/disable AI
CODEX_AI_ENABLED=true

# Admin token for metrics endpoint
CODEX_ADMIN_TOKEN=your-secret-admin-token

# Log level
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR
```

### Logging Configuration

```python
import logging

# Configure root logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('/var/log/codex/ai.log')
    ]
)

# AI logger will inherit configuration
```

## Monitoring & Alerting

### Key Metrics to Monitor

1. **Failure Rate** (alert if > 10%)
   ```python
   metrics.get_summary()['overall_failure_rate']
   ```

2. **P95 Latency** (alert if > 5000ms)
   ```python
   metrics.get_summary()['overall_p95_latency_ms']
   ```

3. **Request Volume** (alert on sudden drops)
   ```python
   metrics.get_hourly_volume(hours=1)
   ```

4. **Recent Failures** (investigate patterns)
   ```python
   metrics.get_recent_failures(limit=10)
   ```

### Example Monitoring Script

```python
import requests
import time

ADMIN_TOKEN = "your-admin-token"
METRICS_URL = "http://localhost:8000/api/v1/ai/metrics"

def check_health():
    headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
    response = requests.get(METRICS_URL, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        summary = data['summary']
        
        # Alert on high failure rate
        if summary['overall_failure_rate'] > 10:
            send_alert(f"High AI failure rate: {summary['overall_failure_rate']}%")
        
        # Alert on high latency
        if summary['overall_p95_latency_ms'] > 5000:
            send_alert(f"High AI latency: {summary['overall_p95_latency_ms']}ms")

while True:
    check_health()
    time.sleep(60)  # Check every minute
```

## Testing

### Unit Tests

```python
import pytest
from brain.observability import AIMetrics, AILogger, hash_user_id

def test_user_id_hashing():
    """Test user ID is properly hashed."""
    user_id = "user123"
    hashed = hash_user_id(user_id)
    
    assert hashed != user_id
    assert len(hashed) == 16
    assert hash_user_id(user_id) == hashed  # Consistent

def test_metrics_recording():
    """Test metrics are recorded correctly."""
    metrics = AIMetrics()
    
    metrics.record_request(
        agent_name="test_agent",
        domain="test",
        endpoint="/test",
        latency_ms=100.0,
        success=True
    )
    
    stats = metrics.get_agent_stats()
    assert stats['test_agent']['total_calls'] == 1
    assert stats['test_agent']['avg_latency_ms'] == 100.0

def test_sensitive_data_filtering():
    """Test sensitive data is filtered from logs."""
    logger = AILogger()
    
    # Should not crash and should filter sensitive data
    sanitized = logger._sanitize_input({
        'user_id': 'user123',
        'code': 'def solution(): pass',
        'password': 'secret123'
    })
    
    assert 'user_id_hash' in sanitized
    assert 'user_id' not in sanitized
    assert '<redacted' in sanitized['code']
    assert sanitized['password'] == '<redacted>'
```

## Troubleshooting

### Issue: Metrics not updating

**Cause:** Metrics collection might be failing silently

**Solution:** Check logs for metrics errors:
```bash
grep "[Metrics]" /var/log/codex/ai.log
```

### Issue: High memory usage

**Cause:** Too many latency samples or failure logs

**Solution:** Metrics are auto-bounded, but you can reset:
```bash
curl -X POST http://localhost:8000/api/v1/ai/metrics/reset \
  -H "Authorization: Bearer <admin-token>"
```

### Issue: Logs contain sensitive data

**Cause:** Sensitive data filter not working

**Solution:** Check filter is active:
```python
from brain.observability.logger import SensitiveDataFilter
import logging

logger = logging.getLogger("codex_brain.ai")
for filter in logger.filters:
    print(type(filter))  # Should show SensitiveDataFilter
```

## Best Practices

1. **Always use context manager** for AI requests:
   ```python
   with log_ai_request(...) as request_id:
       # Your code
   ```

2. **Never log raw user code** - always sanitize first

3. **Monitor failure rates** - set up alerts

4. **Review recent failures** regularly via metrics endpoint

5. **Use meaningful domains** - helps with filtering

6. **Keep admin token secure** - rotate regularly

7. **Set up log rotation** - prevent disk space issues

## Summary

✅ **Implemented:**
- Structured logging with automatic sanitization
- Thread-safe metrics collection
- Admin metrics endpoint
- Health check endpoint
- Privacy-preserving user ID hashing
- Non-blocking, graceful error handling
- Memory-bounded data structures

❌ **Not Logged:**
- User code, solutions, test cases
- LLM prompts verbatim
- Sensitive data (passwords, tokens, PII)

🚀 **Production Ready:**
- Zero impact on request processing
- No crashes on logging errors
- Fully isolated from grading logic
- Clean, aggregated metrics
- Secure admin-only access
