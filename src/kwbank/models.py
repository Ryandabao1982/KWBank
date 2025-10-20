"""
Data models for KWBank application
"""
from dataclasses import dataclass, field
from typing import List, Optional, Set
from datetime import datetime
from enum import Enum


class MatchType(Enum):
    """Amazon keyword match types"""
    EXACT = "exact"
    PHRASE = "phrase"
    BROAD = "broad"


class KeywordType(Enum):
    """Keyword type classification"""
    POSITIVE = "positive"
    NEGATIVE = "negative"


@dataclass
class Keyword:
    """Represents a single keyword"""
    text: str
    brand: str
    match_type: MatchType
    keyword_type: KeywordType
    normalized_text: str = field(default="")
    created_at: datetime = field(default_factory=datetime.now)
    
    def __post_init__(self):
        if not self.normalized_text:
            self.normalized_text = self._normalize(self.text)
    
    @staticmethod
    def _normalize(text: str) -> str:
        """Normalize keyword text for deduplication"""
        return " ".join(text.lower().strip().split())
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "text": self.text,
            "brand": self.brand,
            "match_type": self.match_type.value,
            "keyword_type": self.keyword_type.value,
            "normalized_text": self.normalized_text,
            "created_at": self.created_at.isoformat()
        }


@dataclass
class AdGroup:
    """Represents an Amazon Ad Group"""
    name: str
    asin: str
    keywords: List[Keyword] = field(default_factory=list)
    negative_keywords: List[Keyword] = field(default_factory=list)
    
    def add_keyword(self, keyword: Keyword):
        """Add a keyword to the ad group"""
        if keyword.keyword_type == KeywordType.POSITIVE:
            self.keywords.append(keyword)
        else:
            self.negative_keywords.append(keyword)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "name": self.name,
            "asin": self.asin,
            "keywords": [k.to_dict() for k in self.keywords],
            "negative_keywords": [k.to_dict() for k in self.negative_keywords]
        }


@dataclass
class Campaign:
    """Represents an Amazon Campaign"""
    name: str
    brand: str
    ad_groups: List[AdGroup] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)
    
    def add_ad_group(self, ad_group: AdGroup):
        """Add an ad group to the campaign"""
        self.ad_groups.append(ad_group)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "name": self.name,
            "brand": self.brand,
            "ad_groups": [ag.to_dict() for ag in self.ad_groups],
            "created_at": self.created_at.isoformat()
        }


@dataclass
class AuditEntry:
    """Represents an audit trail entry"""
    timestamp: datetime
    action: str
    details: dict
    user: str = "system"
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "timestamp": self.timestamp.isoformat(),
            "action": self.action,
            "details": self.details,
            "user": self.user
        }
