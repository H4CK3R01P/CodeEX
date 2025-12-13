# Docker Sandbox - Secure Execution Environment

## Overview

Secure, isolated Docker containers for executing untrusted user code in competitive programming problems.

## Images

### Python Sandbox
- **Image**: `codex-sandbox-python:3.11`
- **Base**: `python:3.11-alpine`
- **User**: `sandbox` (uid=1000)
- **Size**: ~50MB

### C++ Sandbox
- **Image**: `codex-sandbox-cpp:gcc13`
- **Base**: `gcc:13-alpine`
- **User**: `sandbox` (uid=1000)
- **Size**: ~120MB

## Security Features

1. **Non-root User**: All code runs as uid=1000 (unprivileged)
2. **Read-only Filesystem**: Root FS is immutable
3. **No Network**: Network stack disabled
4. **Seccomp**: Syscall filtering (200+ syscalls blocked)
5. **Resource Limits**: CPU, memory, PIDs enforced
6. **Isolated**: Each execution in fresh container

## Building Images

```bash
cd /app/sandbox
chmod +x build.sh
./build.sh
```

## Testing Images

```bash
# Test Python
docker run --rm codex-sandbox-python:3.11 python3 -c "print('Hello from sandbox')"

# Test C++
docker run --rm codex-sandbox-cpp:gcc13 g++ --version
```

## Usage in Executor

```python
from runner import DockerExecutor

executor = DockerExecutor()
result = executor.run_testcase(
    language='python',
    source_code='print("test")',
    testcase=testcase,
    testcase_id='test_1'
)
```

## Seccomp Profile

The `seccomp.json` profile blocks dangerous syscalls:
- ❌ `socket`, `connect` (no network)
- ❌ `mount`, `umount` (no FS manipulation)
- ❌ `reboot`, `kexec_load` (no system control)
- ❌ `ptrace` (no process introspection)
- ✅ File I/O, memory management, process control (allowed)

## Resource Limits

Default limits per execution:
- **Memory**: 256MB (configurable per problem)
- **CPU**: 1 core
- **PIDs**: 64 processes max
- **Disk**: 10MB writable in /tmp
- **Time**: Problem-specific (typically 1-5 seconds)

## Cleanup

Containers are automatically removed after execution (ephemeral).
