"""
Keyword Bank storage and management
"""
import json
import os
from typing import List, Dict, Set, Tuple
from collections import defaultdict
from datetime import datetime

from .models import Keyword, AdGroup, Campaign, KeywordType, MatchType


class KeywordBank:
    """Main keyword bank for storing and managing keywords"""
    
    def __init__(self, storage_path: str = "data/keyword_bank.json"):
        self.storage_path = storage_path
        self.keywords: List[Keyword] = []
        self.campaigns: List[Campaign] = []
        self._load()
    
    def _load(self):
        """Load keywords from storage"""
        if os.path.exists(self.storage_path):
            try:
                with open(self.storage_path, 'r') as f:
                    data = json.load(f)
                    self.keywords = [
                        Keyword(
                            text=k['text'],
                            brand=k['brand'],
                            match_type=MatchType(k['match_type']),
                            keyword_type=KeywordType(k['keyword_type']),
                            normalized_text=k.get('normalized_text', ''),
                            created_at=datetime.fromisoformat(k.get('created_at', datetime.now().isoformat()))
                        ) for k in data.get('keywords', [])
                    ]
                    # Load campaigns if present
                    for camp_data in data.get('campaigns', []):
                        campaign = Campaign(
                            name=camp_data['name'],
                            brand=camp_data['brand'],
                            created_at=datetime.fromisoformat(camp_data.get('created_at', datetime.now().isoformat()))
                        )
                        for ag_data in camp_data.get('ad_groups', []):
                            ad_group = AdGroup(name=ag_data['name'], asin=ag_data['asin'])
                            for kw_data in ag_data.get('keywords', []):
                                kw = Keyword(
                                    text=kw_data['text'],
                                    brand=kw_data['brand'],
                                    match_type=MatchType(kw_data['match_type']),
                                    keyword_type=KeywordType(kw_data['keyword_type'])
                                )
                                ad_group.add_keyword(kw)
                            for kw_data in ag_data.get('negative_keywords', []):
                                kw = Keyword(
                                    text=kw_data['text'],
                                    brand=kw_data['brand'],
                                    match_type=MatchType(kw_data['match_type']),
                                    keyword_type=KeywordType(kw_data['keyword_type'])
                                )
                                ad_group.add_keyword(kw)
                            campaign.add_ad_group(ad_group)
                        self.campaigns.append(campaign)
            except Exception as e:
                print(f"Error loading data: {e}")
    
    def save(self):
        """Save keywords to storage"""
        os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
        data = {
            'keywords': [k.to_dict() for k in self.keywords],
            'campaigns': [c.to_dict() for c in self.campaigns]
        }
        with open(self.storage_path, 'w') as f:
            json.dump(data, f, indent=2)
    
    def import_keywords(self, keywords: List[Keyword]) -> Tuple[int, int]:
        """
        Import keywords with automatic deduplication
        Deduplication considers normalized text, keyword type, and brand
        Returns: (added_count, duplicate_count)
        """
        added = 0
        duplicates = 0
        
        # Create a set of (normalized_text, keyword_type, brand) tuples for existing keywords
        existing_normalized = {(k.normalized_text, k.keyword_type, k.brand): k for k in self.keywords}
        
        for keyword in keywords:
            key = (keyword.normalized_text, keyword.keyword_type, keyword.brand)
            if key in existing_normalized:
                duplicates += 1
            else:
                self.keywords.append(keyword)
                existing_normalized[key] = keyword
                added += 1
        
        return added, duplicates
    
    def get_keywords_by_brand(self, brand: str) -> List[Keyword]:
        """Get all keywords for a specific brand"""
        return [k for k in self.keywords if k.brand == brand]
    
    def get_all_brands(self) -> Set[str]:
        """Get all unique brand names"""
        return {k.brand for k in self.keywords}
    
    def detect_conflicts(self) -> List[Dict]:
        """
        Detect conflicts between positive and negative keywords
        Returns list of conflicts with details
        """
        conflicts = []
        
        # Group keywords by brand and type
        by_brand = defaultdict(lambda: {'positive': set(), 'negative': set()})
        
        for keyword in self.keywords:
            normalized = keyword.normalized_text
            if keyword.keyword_type == KeywordType.POSITIVE:
                by_brand[keyword.brand]['positive'].add((normalized, keyword.text))
            else:
                by_brand[keyword.brand]['negative'].add((normalized, keyword.text))
        
        # Find overlaps
        for brand, keywords_dict in by_brand.items():
            positive_set = {norm for norm, _ in keywords_dict['positive']}
            negative_set = {norm for norm, _ in keywords_dict['negative']}
            overlaps = positive_set & negative_set
            
            for normalized in overlaps:
                positive_texts = [text for norm, text in keywords_dict['positive'] if norm == normalized]
                negative_texts = [text for norm, text in keywords_dict['negative'] if norm == normalized]
                conflicts.append({
                    'brand': brand,
                    'normalized': normalized,
                    'positive_keywords': positive_texts,
                    'negative_keywords': negative_texts
                })
        
        return conflicts
    
    def create_campaign(self, name: str, brand: str, ad_groups: List[AdGroup]) -> Campaign:
        """Create a new campaign"""
        campaign = Campaign(name=name, brand=brand)
        for ad_group in ad_groups:
            campaign.add_ad_group(ad_group)
        self.campaigns.append(campaign)
        return campaign
    
    def get_campaigns_by_brand(self, brand: str) -> List[Campaign]:
        """Get all campaigns for a specific brand"""
        return [c for c in self.campaigns if c.brand == brand]
