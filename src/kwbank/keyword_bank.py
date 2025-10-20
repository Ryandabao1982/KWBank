"""
Keyword Bank storage and management
"""
import json
import os
from typing import List, Dict, Set, Tuple, Optional
from collections import defaultdict
from datetime import datetime

from .models import (
    Keyword, AdGroup, Campaign, KeywordType, MatchType,
    Brand, Product, Mapping, NamingRule, KeywordIntent, KeywordStatus
)
from .text_utils import TextNormalizer, SimilarityChecker, IntentDetector


class KeywordBank:
    """Main keyword bank for storing and managing keywords"""
    
    def __init__(self, storage_path: str = "data/keyword_bank.json"):
        self.storage_path = storage_path
        self.keywords: List[Keyword] = []
        self.campaigns: List[Campaign] = []
        self.brands: List[Brand] = []
        self.products: List[Product] = []
        self.mappings: List[Mapping] = []
        self.naming_rules: List[NamingRule] = []
        self._load()
    
    def _load(self):
        """Load keywords from storage"""
        if os.path.exists(self.storage_path):
            try:
                with open(self.storage_path, 'r') as f:
                    data = json.load(f)
                    
                    # Load brands
                    for brand_data in data.get('brands', []):
                        brand = Brand(
                            brand_id=brand_data['brand_id'],
                            name=brand_data['name'],
                            prefix=brand_data['prefix'],
                            default_budget=brand_data.get('default_budget', 10.0),
                            default_bid=brand_data.get('default_bid', 0.75),
                            account_id=brand_data.get('account_id', ''),
                            default_locale=brand_data.get('default_locale', 'en_US'),
                            created_at=datetime.fromisoformat(brand_data.get('created_at', datetime.now().isoformat()))
                        )
                        self.brands.append(brand)
                    
                    # Load products
                    for prod_data in data.get('products', []):
                        product = Product(
                            asin=prod_data['asin'],
                            brand_id=prod_data['brand_id'],
                            product_name=prod_data.get('product_name', ''),
                            category=prod_data.get('category', ''),
                            notes=prod_data.get('notes', ''),
                            created_at=datetime.fromisoformat(prod_data.get('created_at', datetime.now().isoformat()))
                        )
                        self.products.append(product)
                    
                    # Load keywords
                    self.keywords = [
                        Keyword(
                            text=k['text'],
                            brand=k['brand'],
                            match_type=MatchType(k['match_type']),
                            keyword_type=KeywordType(k['keyword_type']),
                            normalized_text=k.get('normalized_text', ''),
                            intent=KeywordIntent(k.get('intent', 'unknown')),
                            suggested_bid=k.get('suggested_bid'),
                            tags=k.get('tags', []),
                            notes=k.get('notes', ''),
                            owner=k.get('owner', ''),
                            status=KeywordStatus(k.get('status', 'active')),
                            source=k.get('source', ''),
                            created_at=datetime.fromisoformat(k.get('created_at', datetime.now().isoformat()))
                        ) for k in data.get('keywords', [])
                    ]
                    
                    # Load mappings
                    for map_data in data.get('mappings', []):
                        mapping = Mapping(
                            asin=map_data['asin'],
                            keyword=map_data['keyword'],
                            campaign_id=map_data.get('campaign_id', ''),
                            ad_group=map_data.get('ad_group', ''),
                            bid_override=map_data.get('bid_override'),
                            notes=map_data.get('notes', ''),
                            created_at=datetime.fromisoformat(map_data.get('created_at', datetime.now().isoformat()))
                        )
                        self.mappings.append(mapping)
                    
                    # Load naming rules
                    for rule_data in data.get('naming_rules', []):
                        rule = NamingRule(
                            pattern=rule_data['pattern'],
                            example=rule_data.get('example', ''),
                            name=rule_data.get('name', 'default'),
                            brand_id=rule_data.get('brand_id', ''),
                            created_at=datetime.fromisoformat(rule_data.get('created_at', datetime.now().isoformat()))
                        )
                        self.naming_rules.append(rule)
                    
                    # Load campaigns (with backward compatibility)
                    from .models import CampaignType, AutoManual, CampaignGoal
                    for camp_data in data.get('campaigns', []):
                        campaign = Campaign(
                            name=camp_data['name'],
                            brand=camp_data['brand'],
                            campaign_id=camp_data.get('campaign_id', ''),
                            campaign_type=CampaignType(camp_data.get('campaign_type', 'sp')),
                            auto_manual=AutoManual(camp_data.get('auto_manual', 'manual')),
                            goal=CampaignGoal(camp_data.get('goal', 'conversion')),
                            match_type=MatchType(camp_data['match_type']) if camp_data.get('match_type') else None,
                            date_yyyymmdd=camp_data.get('date_yyyymmdd', ''),
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
            'brands': [b.to_dict() for b in self.brands],
            'products': [p.to_dict() for p in self.products],
            'keywords': [k.to_dict() for k in self.keywords],
            'mappings': [m.to_dict() for m in self.mappings],
            'naming_rules': [r.to_dict() for r in self.naming_rules],
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
    
    # Brand management methods
    def add_brand(self, brand: Brand) -> bool:
        """Add a new brand"""
        if any(b.brand_id == brand.brand_id for b in self.brands):
            return False
        self.brands.append(brand)
        return True
    
    def get_brand_by_id(self, brand_id: str) -> Optional[Brand]:
        """Get a brand by ID"""
        for brand in self.brands:
            if brand.brand_id == brand_id:
                return brand
        return None
    
    def get_brand_by_name(self, name: str) -> Optional[Brand]:
        """Get a brand by name"""
        for brand in self.brands:
            if brand.name == name:
                return brand
        return None
    
    def get_all_brands_list(self) -> List[Brand]:
        """Get all brands"""
        return self.brands
    
    # Product management methods
    def add_product(self, product: Product) -> bool:
        """Add a new product"""
        if any(p.asin == product.asin for p in self.products):
            return False
        self.products.append(product)
        return True
    
    def get_products_by_brand(self, brand_id: str) -> List[Product]:
        """Get all products for a brand"""
        return [p for p in self.products if p.brand_id == brand_id]
    
    def get_product_by_asin(self, asin: str) -> Optional[Product]:
        """Get a product by ASIN"""
        for product in self.products:
            if product.asin == asin:
                return product
        return None
    
    # Mapping management methods
    def add_mapping(self, mapping: Mapping) -> bool:
        """Add a new keyword-ASIN mapping"""
        self.mappings.append(mapping)
        return True
    
    def get_mappings_by_asin(self, asin: str) -> List[Mapping]:
        """Get all mappings for an ASIN"""
        return [m for m in self.mappings if m.asin == asin]
    
    def get_mappings_by_keyword(self, keyword: str) -> List[Mapping]:
        """Get all mappings for a keyword"""
        return [m for m in self.mappings if m.keyword == keyword]
    
    # Naming rule management methods
    def add_naming_rule(self, rule: NamingRule) -> bool:
        """Add a new naming rule"""
        self.naming_rules.append(rule)
        return True
    
    def get_naming_rules_by_brand(self, brand_id: str) -> List[NamingRule]:
        """Get all naming rules for a brand"""
        return [r for r in self.naming_rules if r.brand_id == brand_id or r.brand_id == '']
    
    def get_naming_rule_by_name(self, name: str) -> Optional[NamingRule]:
        """Get a naming rule by name"""
        for rule in self.naming_rules:
            if rule.name == name:
                return rule
        return None
    
    # Advanced deduplication methods
    def find_exact_duplicates(self, brand: str = None) -> Dict[str, List[Keyword]]:
        """
        Find exact duplicates based on normalized text
        Returns dict mapping normalized text to list of duplicate keywords
        """
        keywords = self.keywords if not brand else self.get_keywords_by_brand(brand)
        
        duplicates = defaultdict(list)
        for kw in keywords:
            duplicates[kw.normalized_text].append(kw)
        
        # Only return entries with more than one keyword
        return {k: v for k, v in duplicates.items() if len(v) > 1}
    
    def find_fuzzy_duplicates(
        self,
        brand: str = None,
        threshold: float = 0.92
    ) -> List[Dict]:
        """
        Find fuzzy duplicates using similarity comparison
        
        Args:
            brand: Filter by brand
            threshold: Similarity threshold (0.0-1.0), default 0.92
        
        Returns:
            List of dictionaries with fuzzy duplicate pairs and confidence scores
        """
        keywords = self.keywords if not brand else self.get_keywords_by_brand(brand)
        
        fuzzy_dupes = []
        checked_pairs = set()
        
        for i, kw1 in enumerate(keywords):
            for kw2 in keywords[i+1:]:
                # Skip if different types or already checked
                if kw1.keyword_type != kw2.keyword_type:
                    continue
                
                pair = tuple(sorted([kw1.text, kw2.text]))
                if pair in checked_pairs:
                    continue
                
                checked_pairs.add(pair)
                
                # Check similarity
                similarity = SimilarityChecker.jaro_winkler_similarity(
                    kw1.normalized_text,
                    kw2.normalized_text
                )
                
                if similarity >= threshold:
                    fuzzy_dupes.append({
                        'keyword1': kw1.text,
                        'keyword2': kw2.text,
                        'similarity': similarity,
                        'brand': kw1.brand,
                        'type': kw1.keyword_type.value
                    })
        
        return fuzzy_dupes
    
    def find_variant_duplicates(self, brand: str = None) -> Dict[str, List[Keyword]]:
        """
        Find variant duplicates using stemming
        Groups keywords with the same stemmed form
        """
        keywords = self.keywords if not brand else self.get_keywords_by_brand(brand)
        
        variants = defaultdict(list)
        for kw in keywords:
            stemmed = TextNormalizer.stem_text(kw.normalized_text)
            variants[stemmed].append(kw)
        
        # Only return entries with more than one keyword
        return {k: v for k, v in variants.items() if len(v) > 1}
    
    def enhance_keyword_metadata(self, keyword: Keyword) -> Keyword:
        """
        Enhance keyword with auto-detected metadata
        - Intent detection
        - Suggested bid based on intent
        """
        # Detect intent if not already set
        if keyword.intent == KeywordIntent.UNKNOWN:
            intent_str = IntentDetector.detect_intent(keyword.text)
            keyword.intent = KeywordIntent(intent_str)
        
        # Suggest bid if not already set
        if keyword.suggested_bid is None:
            # Get brand to use default bid
            brand = self.get_brand_by_name(keyword.brand)
            if brand:
                base_bid = brand.default_bid
                multiplier = IntentDetector.suggest_bid_multiplier(keyword.intent.value)
                keyword.suggested_bid = round(base_bid * multiplier, 2)
        
        return keyword
    
    def import_keywords_enhanced(
        self,
        keywords: List[Keyword],
        auto_enhance: bool = True,
        normalization_mode: str = 'enhanced'
    ) -> Tuple[int, int, Dict]:
        """
        Import keywords with enhanced processing
        
        Args:
            keywords: List of keywords to import
            auto_enhance: Auto-detect intent and suggest bids
            normalization_mode: 'basic' or 'enhanced'
        
        Returns:
            (added_count, duplicate_count, stats_dict)
        """
        added = 0
        duplicates = 0
        stats = {
            'fuzzy_duplicates': 0,
            'enhanced': 0,
            'intents_detected': defaultdict(int)
        }
        
        # Create a set of existing normalized keywords
        existing_normalized = {
            (k.normalized_text, k.keyword_type, k.brand): k 
            for k in self.keywords
        }
        
        for keyword in keywords:
            # Apply enhanced normalization if requested
            if normalization_mode == 'enhanced':
                keyword.normalized_text = TextNormalizer.normalize_enhanced(
                    keyword.text,
                    remove_diacritics=True,
                    remove_punctuation=True,
                    remove_stop_words=False
                )
            
            # Check for exact duplicates
            key = (keyword.normalized_text, keyword.keyword_type, keyword.brand)
            if key in existing_normalized:
                duplicates += 1
                continue
            
            # Check for fuzzy duplicates among existing
            is_fuzzy_dupe = False
            for existing_kw in self.keywords:
                if (existing_kw.brand == keyword.brand and 
                    existing_kw.keyword_type == keyword.keyword_type):
                    if SimilarityChecker.are_fuzzy_duplicates(
                        keyword.normalized_text,
                        existing_kw.normalized_text
                    ):
                        is_fuzzy_dupe = True
                        stats['fuzzy_duplicates'] += 1
                        break
            
            if is_fuzzy_dupe:
                duplicates += 1
                continue
            
            # Auto-enhance metadata
            if auto_enhance:
                keyword = self.enhance_keyword_metadata(keyword)
                stats['enhanced'] += 1
                stats['intents_detected'][keyword.intent.value] += 1
            
            # Add keyword
            self.keywords.append(keyword)
            existing_normalized[key] = keyword
            added += 1
        
        return added, duplicates, stats
