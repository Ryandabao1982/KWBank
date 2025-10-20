"""
Data models for KWBank application
"""
from dataclasses import dataclass, field
from typing import List, Optional, Set, Dict, Any
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


class KeywordIntent(Enum):
    """Keyword intent classification"""
    AWARENESS = "awareness"
    CONSIDERATION = "consideration"
    CONVERSION = "conversion"
    UNKNOWN = "unknown"


class KeywordStatus(Enum):
    """Keyword status"""
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"
    PENDING = "pending"


class CampaignType(Enum):
    """Campaign type"""
    SPONSORED_PRODUCTS = "sp"
    SPONSORED_BRANDS = "sb"
    SPONSORED_BRAND_VIDEO = "sbv"


class CampaignGoal(Enum):
    """Campaign goal"""
    AWARENESS = "awareness"
    CONVERSION = "conversion"
    CONSIDERATION = "consideration"


class AutoManual(Enum):
    """Campaign targeting type"""
    AUTO = "auto"
    MANUAL = "manual"


@dataclass
class Brand:
    """Represents a brand"""
    brand_id: str
    name: str
    prefix: str
    default_budget: float = 10.0
    default_bid: float = 0.75
    account_id: str = ""
    default_locale: str = "en_US"
    created_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "brand_id": self.brand_id,
            "name": self.name,
            "prefix": self.prefix,
            "default_budget": self.default_budget,
            "default_bid": self.default_bid,
            "account_id": self.account_id,
            "default_locale": self.default_locale,
            "created_at": self.created_at.isoformat()
        }


@dataclass
class Product:
    """Represents a product/ASIN"""
    asin: str
    brand_id: str
    product_name: str = ""
    category: str = ""
    notes: str = ""
    created_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "asin": self.asin,
            "brand_id": self.brand_id,
            "product_name": self.product_name,
            "category": self.category,
            "notes": self.notes,
            "created_at": self.created_at.isoformat()
        }


@dataclass
class Keyword:
    """Represents a single keyword"""
    text: str
    brand: str
    match_type: MatchType
    keyword_type: KeywordType
    normalized_text: str = field(default="")
    intent: KeywordIntent = KeywordIntent.UNKNOWN
    suggested_bid: Optional[float] = None
    tags: List[str] = field(default_factory=list)
    notes: str = ""
    owner: str = ""
    status: KeywordStatus = KeywordStatus.ACTIVE
    source: str = ""
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
            "intent": self.intent.value,
            "suggested_bid": self.suggested_bid,
            "tags": self.tags,
            "notes": self.notes,
            "owner": self.owner,
            "status": self.status.value,
            "source": self.source,
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
    campaign_id: str = ""
    campaign_type: CampaignType = CampaignType.SPONSORED_PRODUCTS
    auto_manual: AutoManual = AutoManual.MANUAL
    goal: CampaignGoal = CampaignGoal.CONVERSION
    match_type: Optional[MatchType] = None
    date_yyyymmdd: str = ""
    created_at: datetime = field(default_factory=datetime.now)
    
    def __post_init__(self):
        if not self.date_yyyymmdd:
            self.date_yyyymmdd = self.created_at.strftime("%Y%m%d")
    
    def add_ad_group(self, ad_group: AdGroup):
        """Add an ad group to the campaign"""
        self.ad_groups.append(ad_group)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "name": self.name,
            "brand": self.brand,
            "ad_groups": [ag.to_dict() for ag in self.ad_groups],
            "campaign_id": self.campaign_id,
            "campaign_type": self.campaign_type.value,
            "auto_manual": self.auto_manual.value,
            "goal": self.goal.value,
            "match_type": self.match_type.value if self.match_type else None,
            "date_yyyymmdd": self.date_yyyymmdd,
            "created_at": self.created_at.isoformat()
        }


@dataclass
class Mapping:
    """Represents a keyword-to-ASIN-to-Campaign mapping"""
    asin: str
    keyword: str
    campaign_id: str = ""
    ad_group: str = ""
    bid_override: Optional[float] = None
    notes: str = ""
    created_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "asin": self.asin,
            "keyword": self.keyword,
            "campaign_id": self.campaign_id,
            "ad_group": self.ad_group,
            "bid_override": self.bid_override,
            "notes": self.notes,
            "created_at": self.created_at.isoformat()
        }


@dataclass
class NamingRule:
    """Represents a campaign naming rule with pattern tokens"""
    pattern: str
    example: str = ""
    name: str = "default"
    brand_id: str = ""
    created_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "pattern": self.pattern,
            "example": self.example,
            "name": self.name,
            "brand_id": self.brand_id,
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
