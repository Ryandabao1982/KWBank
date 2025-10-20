"""
Audit trail logging functionality
"""
import json
import os
from datetime import datetime
from typing import Dict, Any, List
from .models import AuditEntry


class AuditLogger:
    """Logger for tracking all operations in the keyword bank"""
    
    def __init__(self, log_path: str = "data/audit_trail.json"):
        self.log_path = log_path
        self.entries: List[AuditEntry] = []
        self._load()
    
    def _load(self):
        """Load existing audit entries"""
        if os.path.exists(self.log_path):
            try:
                with open(self.log_path, 'r') as f:
                    data = json.load(f)
                    self.entries = [
                        AuditEntry(
                            timestamp=datetime.fromisoformat(e['timestamp']),
                            action=e['action'],
                            details=e['details'],
                            user=e.get('user', 'system')
                        ) for e in data
                    ]
            except Exception as e:
                print(f"Error loading audit log: {e}")
    
    def log(self, action: str, details: Dict[str, Any], user: str = "system"):
        """Log an action"""
        entry = AuditEntry(
            timestamp=datetime.now(),
            action=action,
            details=details,
            user=user
        )
        self.entries.append(entry)
        self._save()
    
    def _save(self):
        """Save audit entries to file"""
        os.makedirs(os.path.dirname(self.log_path), exist_ok=True)
        with open(self.log_path, 'w') as f:
            json.dump([e.to_dict() for e in self.entries], f, indent=2)
    
    def get_recent_entries(self, count: int = 10) -> List[AuditEntry]:
        """Get the most recent audit entries"""
        return sorted(self.entries, key=lambda e: e.timestamp, reverse=True)[:count]
    
    def get_entries_by_action(self, action: str) -> List[AuditEntry]:
        """Get all entries for a specific action type"""
        return [e for e in self.entries if e.action == action]
    
    def get_entries_by_date(self, start_date: datetime, end_date: datetime) -> List[AuditEntry]:
        """Get entries within a date range"""
        return [e for e in self.entries 
                if start_date <= e.timestamp <= end_date]
    
    def generate_report(self) -> str:
        """Generate a text report of recent activity"""
        recent = self.get_recent_entries(20)
        lines = ["=== Audit Trail Report ===", ""]
        
        for entry in recent:
            lines.append(f"[{entry.timestamp.strftime('%Y-%m-%d %H:%M:%S')}] {entry.action}")
            lines.append(f"  User: {entry.user}")
            lines.append(f"  Details: {json.dumps(entry.details, indent=4)}")
            lines.append("")
        
        return "\n".join(lines)
