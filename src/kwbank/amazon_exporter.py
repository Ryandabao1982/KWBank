"""
Amazon bulk CSV export functionality
"""
import csv
from typing import List
from .models import Campaign, AdGroup, Keyword, KeywordType


class AmazonBulkExporter:
    """Export campaigns to Amazon Bulk CSV format"""
    
    # Amazon Bulk CSV columns
    CAMPAIGN_COLUMNS = [
        "Campaign Name",
        "Campaign Daily Budget",
        "Campaign Start Date",
        "Campaign End Date",
        "Campaign Targeting Type",
        "Portfolio Name",
        "Campaign State",
        "Campaign Bidding Strategy"
    ]
    
    AD_GROUP_COLUMNS = [
        "Campaign Name",
        "Ad Group Name",
        "Ad Group Default Bid",
        "Ad Group State"
    ]
    
    KEYWORD_COLUMNS = [
        "Campaign Name",
        "Ad Group Name",
        "Keyword Text",
        "Match Type",
        "Keyword State",
        "Keyword Bid"
    ]
    
    NEGATIVE_KEYWORD_COLUMNS = [
        "Campaign Name",
        "Ad Group Name",
        "Negative Keyword Text",
        "Negative Keyword Match Type",
        "Negative Keyword State"
    ]
    
    PRODUCT_AD_COLUMNS = [
        "Campaign Name",
        "Ad Group Name",
        "Product SKU",
        "Product ASIN",
        "Product Ad State"
    ]
    
    @staticmethod
    def export_campaign(campaign: Campaign, output_path: str, 
                       default_budget: float = 10.0,
                       default_bid: float = 0.75):
        """
        Export a campaign to Amazon Bulk CSV format
        
        Args:
            campaign: Campaign to export
            output_path: Path to save CSV file
            default_budget: Default daily budget for campaign
            default_bid: Default bid for keywords
        """
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            
            # Write header section
            writer.writerow(["Amazon Advertising Bulk Sheet"])
            writer.writerow([])
            
            # Export campaign
            writer.writerow(["Campaign"])
            writer.writerow(AmazonBulkExporter.CAMPAIGN_COLUMNS)
            writer.writerow([
                campaign.name,
                default_budget,
                "",  # Start date (optional)
                "",  # End date (optional)
                "Manual",  # Targeting type
                "",  # Portfolio name (optional)
                "enabled",
                "legacyForSales"  # Bidding strategy
            ])
            writer.writerow([])
            
            # Export ad groups and keywords
            for ad_group in campaign.ad_groups:
                # Ad Group
                writer.writerow(["Ad Group"])
                writer.writerow(AmazonBulkExporter.AD_GROUP_COLUMNS)
                writer.writerow([
                    campaign.name,
                    ad_group.name,
                    default_bid,
                    "enabled"
                ])
                writer.writerow([])
                
                # Product Ads
                writer.writerow(["Product Ad"])
                writer.writerow(AmazonBulkExporter.PRODUCT_AD_COLUMNS)
                writer.writerow([
                    campaign.name,
                    ad_group.name,
                    "",  # SKU (optional)
                    ad_group.asin,
                    "enabled"
                ])
                writer.writerow([])
                
                # Keywords
                if ad_group.keywords:
                    writer.writerow(["Keyword"])
                    writer.writerow(AmazonBulkExporter.KEYWORD_COLUMNS)
                    for keyword in ad_group.keywords:
                        writer.writerow([
                            campaign.name,
                            ad_group.name,
                            keyword.text,
                            keyword.match_type.value,
                            "enabled",
                            default_bid
                        ])
                    writer.writerow([])
                
                # Negative Keywords
                if ad_group.negative_keywords:
                    writer.writerow(["Negative Keyword"])
                    writer.writerow(AmazonBulkExporter.NEGATIVE_KEYWORD_COLUMNS)
                    for keyword in ad_group.negative_keywords:
                        writer.writerow([
                            campaign.name,
                            ad_group.name,
                            keyword.text,
                            keyword.match_type.value,
                            "enabled"
                        ])
                    writer.writerow([])
    
    @staticmethod
    def export_campaigns(campaigns: List[Campaign], output_path: str,
                        default_budget: float = 10.0,
                        default_bid: float = 0.75):
        """Export multiple campaigns to a single CSV file"""
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            
            # Write header section
            writer.writerow(["Amazon Advertising Bulk Sheet"])
            writer.writerow([])
            
            for campaign in campaigns:
                # Campaign
                writer.writerow(["Campaign"])
                writer.writerow(AmazonBulkExporter.CAMPAIGN_COLUMNS)
                writer.writerow([
                    campaign.name,
                    default_budget,
                    "",
                    "",
                    "Manual",
                    "",
                    "enabled",
                    "legacyForSales"
                ])
                writer.writerow([])
                
                # Ad groups and keywords
                for ad_group in campaign.ad_groups:
                    writer.writerow(["Ad Group"])
                    writer.writerow(AmazonBulkExporter.AD_GROUP_COLUMNS)
                    writer.writerow([
                        campaign.name,
                        ad_group.name,
                        default_bid,
                        "enabled"
                    ])
                    writer.writerow([])
                    
                    writer.writerow(["Product Ad"])
                    writer.writerow(AmazonBulkExporter.PRODUCT_AD_COLUMNS)
                    writer.writerow([
                        campaign.name,
                        ad_group.name,
                        "",
                        ad_group.asin,
                        "enabled"
                    ])
                    writer.writerow([])
                    
                    if ad_group.keywords:
                        writer.writerow(["Keyword"])
                        writer.writerow(AmazonBulkExporter.KEYWORD_COLUMNS)
                        for keyword in ad_group.keywords:
                            writer.writerow([
                                campaign.name,
                                ad_group.name,
                                keyword.text,
                                keyword.match_type.value,
                                "enabled",
                                default_bid
                            ])
                        writer.writerow([])
                    
                    if ad_group.negative_keywords:
                        writer.writerow(["Negative Keyword"])
                        writer.writerow(AmazonBulkExporter.NEGATIVE_KEYWORD_COLUMNS)
                        for keyword in ad_group.negative_keywords:
                            writer.writerow([
                                campaign.name,
                                ad_group.name,
                                keyword.text,
                                keyword.match_type.value,
                                "enabled"
                            ])
                        writer.writerow([])
