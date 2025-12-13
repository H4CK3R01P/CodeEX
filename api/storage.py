"""
Simple In-Memory Storage

For demo purposes. Replace with MongoDB in production.
"""

from typing import Dict, Optional, Any
from datetime import datetime
from models import Submission


class InMemoryStorage:
    """In-memory storage for submissions"""
    
    def __init__(self):
        self.submissions: Dict[str, dict] = {}
    
    async def insert_submission(self, submission: dict):
        """Insert a submission"""
        self.submissions[submission['submission_id']] = submission
    
    async def get_submission(self, submission_id: str) -> Optional[dict]:
        """Get a submission by ID"""
        return self.submissions.get(submission_id)
    
    async def update_submission(self, submission_id: str, updates: dict):
        """Update a submission"""
        if submission_id in self.submissions:
            self.submissions[submission_id].update(updates)
    
    async def update_field(self, submission_id: str, field: str, value: Any):
        """Update a single field"""
        if submission_id in self.submissions:
            self.submissions[submission_id][field] = value


# Global storage instance
storage = InMemoryStorage()
