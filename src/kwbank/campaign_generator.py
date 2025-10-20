"""
Campaign name generation utilities with pattern token support
"""
from datetime import datetime
from typing import List, Dict, Optional
from .models import AdGroup, Brand, CampaignGoal, MatchType


class CampaignNameGenerator:
    """Generates campaign names following Amazon best practices with pattern tokens"""
    
    @staticmethod
    def generate_from_pattern(
        pattern: str,
        brand_prefix: str = "",
        asin: str = "",
        goal: str = "",
        match_type: str = "",
        locale: str = "en_US",
        date_format: str = "%Y%m%d",
        custom_tokens: Optional[Dict[str, str]] = None
    ) -> str:
        """
        Generate a campaign name from a pattern using token replacement
        
        Supported tokens:
        - {BrandPrefix}: Brand prefix
        - {ASIN}: Product ASIN
        - {Goal}: Campaign goal (awareness, conversion, etc.)
        - {MatchType}: Keyword match type (exact, phrase, broad)
        - {Locale}: Locale code (e.g., en_US)
        - {Date:yyyyMMdd}: Current date in specified format
        
        Example pattern: "{BrandPrefix}_{ASIN}_{Goal}_{MatchType}_{Date:yyyyMMdd}"
        Example output: "NIKE_B07X9C8N6D_Conversion_Exact_20251020"
        """
        result = pattern
        
        # Replace standard tokens
        replacements = {
            '{BrandPrefix}': brand_prefix,
            '{ASIN}': asin,
            '{Goal}': goal,
            '{MatchType}': match_type,
            '{Locale}': locale,
        }
        
        for token, value in replacements.items():
            result = result.replace(token, value)
        
        # Handle date token with custom format
        if '{Date:' in result:
            import re
            date_pattern = r'\{Date:([^}]+)\}'
            matches = re.findall(date_pattern, result)
            for date_fmt in matches:
                # Convert common date format patterns
                python_fmt = date_fmt.replace('yyyy', '%Y').replace('MM', '%m').replace('dd', '%d')
                date_str = datetime.now().strftime(python_fmt)
                result = result.replace(f'{{Date:{date_fmt}}}', date_str)
        
        # Handle custom tokens
        if custom_tokens:
            for token, value in custom_tokens.items():
                result = result.replace(f'{{{token}}}', value)
        
        return result
    
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
    
    @staticmethod
    def generate_with_brand_and_goal(
        brand: Brand,
        goal: CampaignGoal,
        match_type: MatchType,
        asin: str = "",
        ad_groups: Optional[List[AdGroup]] = None
    ) -> str:
        """
        Generate campaign name using Brand object and pattern tokens
        
        Format: {BrandPrefix}_{ASIN}_{Goal}_{MatchType}_{Date}
        """
        pattern = "{BrandPrefix}_{ASIN}_{Goal}_{MatchType}_{Date:yyyyMMdd}"
        
        # If ASIN not provided but ad_groups provided, use first ad group's ASIN
        if not asin and ad_groups and len(ad_groups) > 0:
            asin = ad_groups[0].asin
        
        return CampaignNameGenerator.generate_from_pattern(
            pattern=pattern,
            brand_prefix=brand.prefix,
            asin=asin,
            goal=goal.value.capitalize(),
            match_type=match_type.value.capitalize(),
            locale=brand.default_locale
        )
    
    @staticmethod
    def preview_pattern(pattern: str, example_data: Optional[Dict[str, str]] = None) -> str:
        """
        Preview a naming pattern with example data
        """
        example_values = {
            'brand_prefix': 'NIKE',
            'asin': 'B07X9C8N6D',
            'goal': 'Conversion',
            'match_type': 'Exact',
            'locale': 'en_US'
        }
        
        if example_data:
            example_values.update(example_data)
        
        return CampaignNameGenerator.generate_from_pattern(
            pattern=pattern,
            **example_values
        )
