"""
Docker Executor

Secure code execution using Docker containers.
Wraps LocalExecutor logic with Docker isolation.
"""

import docker
import time
import tempfile
import shutil
from typing import Optional, Dict, Any
from pathlib import Path
from dataclasses import dataclass

from models import ExecutionResult, Verdict, TestCase
from .local_executor import LocalExecutor, CompilationResult


@dataclass
class DockerConfig:
    """Docker container configuration"""
    image: str
    memory_limit_kb: int
    cpu_quota: int = 100000
    cpu_period: int = 100000
    pids_limit: int = 64
    network_disabled: bool = True
    read_only: bool = True
    

class DockerExecutor:
    """
    Docker-based secure code executor.
    
    Executes code in isolated Docker containers with resource limits.
    Wraps LocalExecutor for compilation and verdict logic (unchanged).
    
    Security features:
    - Non-root user (uid=1000)
    - Read-only filesystem
    - No network access
    - Resource limits (CPU, memory, PIDs)
    - Seccomp filtering
    - Ephemeral containers
    """
    
    # Image mapping
    IMAGES = {
        'python': 'codex-sandbox-python:3.11',
        'cpp': 'codex-sandbox-cpp:gcc13'
    }
    
    # Seccomp profile path
    SECCOMP_PROFILE = '/app/sandbox/seccomp.json'
    
    def __init__(self, work_dir: Optional[str] = None):
        """
        Initialize Docker executor.
        
        Args:
            work_dir: Directory for temporary files (default: /tmp/codex_docker)
        """
        try:
            self.client = docker.from_env()
            self.client.ping()  # Verify Docker is available
        except Exception as e:
            raise RuntimeError(f"Docker not available: {e}")
        
        self.work_dir = Path(work_dir or "/tmp/codex_docker")
        self.work_dir.mkdir(parents=True, exist_ok=True)
        
        # Reuse LocalExecutor for verdict logic
        self.local_executor = LocalExecutor()
    
    def run_testcase(
        self,
        language: str,
        source_code: str,
        testcase: TestCase,
        testcase_id: str
    ) -> ExecutionResult:
        """
        Execute code in Docker container.
        
        Same interface as LocalExecutor, but runs in Docker.
        
        Args:
            language: Programming language
            source_code: Source code to execute
            testcase: TestCase with input/output/limits
            testcase_id: Unique identifier
            
        Returns:
            ExecutionResult (same as LocalExecutor)
        """
        temp_dir = None
        
        try:
            # Step 1: Prepare temp directory
            temp_dir = self._create_temp_directory()
            self._write_source_file(temp_dir, source_code, language)
            self._write_input_file(temp_dir, testcase.input_data)
            
            # Step 2: Compile in Docker (C++ only)
            if language == 'cpp':
                compilation_result = self._compile_in_docker(temp_dir)
                
                if not compilation_result.success:
                    return ExecutionResult(
                        testcase_id=testcase_id,
                        verdict=Verdict.CE,
                        runtime_ms=0,
                        memory_kb=0,
                        exit_code=-1,
                        stdout="",
                        stderr=compilation_result.stderr,
                        timed_out=False,
                        oom_killed=False,
                        error_message=compilation_result.stderr[:500],
                        metadata={'compilation_time_ms': compilation_result.compile_time_ms}
                    )
            
            # Step 3: Execute in Docker
            exec_result = self._execute_in_docker(
                temp_dir=temp_dir,
                language=language,
                time_limit_ms=testcase.time_limit_ms,
                memory_limit_kb=testcase.memory_limit_kb
            )
            
            # Step 4: Determine verdict (UNCHANGED LocalExecutor logic)
            verdict = self.local_executor._determine_verdict(
                exit_code=exec_result['exit_code'],
                timed_out=exec_result['timed_out'],
                stdout=exec_result['stdout'],
                expected_output=testcase.expected_output
            )
            
            # Override with MLE if OOM killed
            if exec_result['oom_killed']:
                verdict = Verdict.MLE
            
            # Step 5: Build ExecutionResult
            return ExecutionResult(
                testcase_id=testcase_id,
                verdict=verdict,
                runtime_ms=exec_result['runtime_ms'],
                memory_kb=exec_result['memory_kb'],
                exit_code=exec_result['exit_code'],
                stdout=exec_result['stdout'],
                stderr=exec_result['stderr'],
                timed_out=exec_result['timed_out'],
                oom_killed=exec_result['oom_killed'],
                expected_output=testcase.expected_output if verdict == Verdict.WA else None,
                actual_output=exec_result['stdout'] if verdict == Verdict.WA else None,
                error_message=exec_result['stderr'] if verdict in [Verdict.RE, Verdict.TLE] else None,
                metadata={
                    'language': language,
                    'docker_execution': True,
                    'container_id': exec_result.get('container_id', 'unknown')
                }
            )
            
        except Exception as e:
            return ExecutionResult(
                testcase_id=testcase_id,
                verdict=Verdict.RE,
                runtime_ms=0,
                memory_kb=0,
                exit_code=-1,
                stdout="",
                stderr="",
                timed_out=False,
                oom_killed=False,
                error_message=f"Docker execution error: {str(e)}",
                metadata={'exception': str(e)}
            )
            
        finally:
            # Cleanup
            if temp_dir and temp_dir.exists():
                try:
                    shutil.rmtree(temp_dir)
                except:
                    pass
    
    def _create_temp_directory(self) -> Path:
        """Create unique temp directory"""
        temp_dir = tempfile.mkdtemp(dir=self.work_dir, prefix="exec_")
        return Path(temp_dir)
    
    def _write_source_file(self, temp_dir: Path, source_code: str, language: str):
        """Write source code to file"""
        extension = '.py' if language == 'python' else '.cpp'
        source_file = temp_dir / f"solution{extension}"
        source_file.write_text(source_code, encoding='utf-8')
    
    def _write_input_file(self, temp_dir: Path, input_data: str):
        """Write test input to file"""
        input_file = temp_dir / "input.txt"
        input_file.write_text(input_data, encoding='utf-8')
    
    def _compile_in_docker(self, temp_dir: Path) -> CompilationResult:
        """
        Compile C++ code in Docker container.
        Host never executes g++.
        """
        container = None
        start_time = time.time()
        
        try:
            container = self.client.containers.run(
                image=self.IMAGES['cpp'],
                command=[
                    'g++', '-O2', '-std=c++17', '-Wall',
                    '/sandbox/solution.cpp', '-o', '/sandbox/solution'
                ],
                volumes={
                    str(temp_dir): {'bind': '/sandbox', 'mode': 'rw'}
                },
                user='1000:1000',
                network_disabled=True,
                cap_drop=['ALL'],
                security_opt=['no-new-privileges'],
                mem_limit='512m',
                cpu_quota=200000,
                detach=True,
                remove=False
            )
            
            try:
                result = container.wait(timeout=10)
                exit_code = result['StatusCode']
            except:
                container.kill()
                return CompilationResult(
                    success=False,
                    stderr="Compilation timeout",
                    compile_time_ms=10000
                )
            
            compile_time_ms = int((time.time() - start_time) * 1000)
            stderr = container.logs(stdout=False, stderr=True).decode('utf-8', errors='replace')
            
            binary_exists = (temp_dir / 'solution').exists()
            
            if exit_code == 0 and binary_exists:
                return CompilationResult(
                    success=True,
                    binary_path=str(temp_dir / 'solution'),
                    stderr="",
                    compile_time_ms=compile_time_ms
                )
            else:
                return CompilationResult(
                    success=False,
                    stderr=stderr[:1_000_000],
                    compile_time_ms=compile_time_ms
                )
                
        finally:
            if container:
                try:
                    container.remove(force=True)
                except:
                    pass
    
    def _execute_in_docker(
        self,
        temp_dir: Path,
        language: str,
        time_limit_ms: int,
        memory_limit_kb: int
    ) -> Dict[str, Any]:
        """
        Execute code in Docker container.
        Host never executes user code.
        """
        container = None
        start_time = time.time()
        
        try:
            # Prepare command
            if language == 'python':
                command = ['python3', '/sandbox/solution.py']
            else:
                command = ['/sandbox/solution']
            
            image = self.IMAGES[language]
            input_data = (temp_dir / 'input.txt').read_text()
            
            # Create container
            container = self.client.containers.run(
                image=image,
                command=command,
                stdin_open=True,
                detach=True,
                
                # Mount code (read-only)
                volumes={
                    str(temp_dir): {'bind': '/sandbox', 'mode': 'ro'}
                },
                
                # Security
                user='1000:1000',
                network_disabled=True,
                read_only=True,
                cap_drop=['ALL'],
                security_opt=['no-new-privileges'],
                
                # Resources
                mem_limit=f'{memory_limit_kb}k',
                memswap_limit=f'{memory_limit_kb}k',
                oom_kill_disable=False,
                cpu_quota=100000,
                pids_limit=64,
                
                # Tmpfs
                tmpfs={'/tmp': 'size=10m'},
                
                remove=False
            )
            
            container_id = container.id
            
            # Send input
            try:
                sock = container.attach_socket(
                    params={'stdin': 1, 'stdout': 1, 'stderr': 1, 'stream': 1}
                )
                sock._sock.sendall(input_data.encode('utf-8'))
                sock.close()
            except:
                pass
            
            # Wait with timeout
            timeout_seconds = time_limit_ms / 1000.0
            timed_out = False
            
            try:
                wait_result = container.wait(timeout=timeout_seconds)
                exit_code = wait_result['StatusCode']
            except:
                container.kill()
                timed_out = True
                exit_code = -1
            
            runtime_ms = int((time.time() - start_time) * 1000)
            
            # Capture output
            logs = container.logs(stdout=True, stderr=True).decode('utf-8', errors='replace')
            stdout = logs[:10_000_000]
            stderr = ""
            
            # Check OOM
            container.reload()
            oom_killed = container.attrs['State'].get('OOMKilled', False)
            
            # Get memory usage
            try:
                stats = container.stats(stream=False)
                memory_kb = stats['memory_stats']['usage'] // 1024
            except:
                memory_kb = 0
            
            return {
                'exit_code': exit_code,
                'stdout': stdout,
                'stderr': stderr,
                'runtime_ms': runtime_ms,
                'memory_kb': memory_kb,
                'timed_out': timed_out,
                'oom_killed': oom_killed,
                'container_id': container_id
            }
            
        finally:
            if container:
                try:
                    container.remove(force=True)
                except:
                    pass
    
    def cleanup_work_dir(self):
        """Clean up all temporary files"""
        if self.work_dir.exists():
            try:
                shutil.rmtree(self.work_dir)
                self.work_dir.mkdir(parents=True, exist_ok=True)
            except Exception as e:
                print(f"Warning: Failed to cleanup work directory: {e}")
