"""
Campaign name generation utilities
"""
from datetime import datetime
from typing import List
from .models import AdGroup


class CampaignNameGenerator:
    """Generates campaign names following Amazon best practices"""
    
    @staticmethod
    def generate(brand: str, ad_groups: List[AdGroup], suffix: str = "") -> str:
        """
        Generate a campaign name based on brand and ad groups
        
        Format: {Brand}_{Category}_{Date}_{Suffix}
        """
        date_str = datetime.now().strftime("%Y%m%d")
        
        # Extract ASINs count for naming
        asin_count = len(ad_groups)
        
        # Create a descriptive category based on ad groups
        if asin_count == 1:
            category = f"SingleASIN"
        elif asin_count <= 5:
            category = f"MultiASIN_{asin_count}"
        else:
            category = f"BulkASIN_{asin_count}"
        
        # Build campaign name
        parts = [brand.replace(" ", "_"), category, date_str]
        if suffix:
            parts.append(suffix)
        
        return "_".join(parts)
    
    @staticmethod
    def generate_ad_group_name(asin: str, keywords_count: int = 0) -> str:
        """
        Generate an ad group name based on ASIN
        
        Format: AG_{ASIN}_{KeywordCount}
        """
        if keywords_count > 0:
            return f"AG_{asin}_{keywords_count}kw"
        return f"AG_{asin}"
    
    @staticmethod
    def generate_with_strategy(brand: str, strategy: str, ad_groups: List[AdGroup]) -> str:
        """
        Generate campaign name with a specific strategy
        
        Strategies: auto, manual, exact, phrase, broad
        """
        date_str = datetime.now().strftime("%Y%m%d")
        asin_count = len(ad_groups)
        
        return f"{brand.replace(' ', '_')}_{strategy.upper()}_{asin_count}ASIN_{date_str}"
