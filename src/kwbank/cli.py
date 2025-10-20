"""
Command-line interface for KWBank
"""
import click
import csv
from typing import List
from pathlib import Path

from .keyword_bank import KeywordBank
from .models import Keyword, AdGroup, MatchType, KeywordType
from .campaign_generator import CampaignNameGenerator
from .amazon_exporter import AmazonBulkExporter
from .audit_logger import AuditLogger


@click.group()
@click.version_option(version="0.1.0")
def main():
    """
    KWBank - Keyword Bank for Amazon PPC Campaign Management
    
    Centralizes keyword operations including import, deduplication, mapping,
    and campaign generation for Amazon PPC campaigns.
    """
    pass


@main.command()
@click.argument('csv_file', type=click.Path(exists=True))
@click.option('--brand', required=True, help='Brand name for the keywords')
@click.option('--keyword-type', type=click.Choice(['positive', 'negative']), 
              default='positive', help='Type of keywords to import')
@click.option('--match-type', type=click.Choice(['exact', 'phrase', 'broad']), 
              default='exact', help='Default match type for keywords')
def import_keywords(csv_file, brand, keyword_type, match_type):
    """Import keywords from a CSV file"""
    bank = KeywordBank()
    audit = AuditLogger()
    
    keywords = []
    with open(csv_file, 'r') as f:
        reader = csv.reader(f)
        # Skip header if present
        first_row = next(reader, None)
        if first_row and not first_row[0].lower().startswith('keyword'):
            keywords.append(Keyword(
                text=first_row[0].strip(),
                brand=brand,
                match_type=MatchType(match_type),
                keyword_type=KeywordType(keyword_type)
            ))
        
        for row in reader:
            if row and row[0].strip():
                keywords.append(Keyword(
                    text=row[0].strip(),
                    brand=brand,
                    match_type=MatchType(match_type),
                    keyword_type=KeywordType(keyword_type)
                ))
    
    added, duplicates = bank.import_keywords(keywords)
    bank.save()
    
    audit.log('import_keywords', {
        'file': csv_file,
        'brand': brand,
        'added': added,
        'duplicates': duplicates,
        'keyword_type': keyword_type,
        'match_type': match_type
    })
    
    click.echo(f"✓ Imported {added} keywords ({duplicates} duplicates skipped)")
    click.echo(f"  Brand: {brand}")
    click.echo(f"  Type: {keyword_type}")
    click.echo(f"  Match Type: {match_type}")


@main.command()
@click.option('--brand', help='Filter by brand (optional)')
def list_keywords(brand):
    """List all keywords in the bank"""
    bank = KeywordBank()
    
    keywords = bank.keywords if not brand else bank.get_keywords_by_brand(brand)
    
    if not keywords:
        click.echo("No keywords found.")
        return
    
    # Group by brand
    from collections import defaultdict
    by_brand = defaultdict(list)
    for kw in keywords:
        by_brand[kw.brand].append(kw)
    
    click.echo(f"\n=== Keyword Bank ({len(keywords)} total) ===\n")
    
    for brand_name, kws in by_brand.items():
        click.echo(f"{brand_name}: {len(kws)} keywords")
        positive = [k for k in kws if k.keyword_type == KeywordType.POSITIVE]
        negative = [k for k in kws if k.keyword_type == KeywordType.NEGATIVE]
        click.echo(f"  Positive: {len(positive)}, Negative: {len(negative)}")


@main.command()
def detect_conflicts():
    """Detect conflicts between positive and negative keywords"""
    bank = KeywordBank()
    audit = AuditLogger()
    
    conflicts = bank.detect_conflicts()
    
    audit.log('detect_conflicts', {
        'conflicts_found': len(conflicts)
    })
    
    if not conflicts:
        click.echo("✓ No conflicts detected!")
        return
    
    click.echo(f"\n⚠ Found {len(conflicts)} conflicts:\n")
    
    for conflict in conflicts:
        click.echo(f"Brand: {conflict['brand']}")
        click.echo(f"  Keyword: {conflict['normalized']}")
        click.echo(f"  Positive: {', '.join(conflict['positive_keywords'])}")
        click.echo(f"  Negative: {', '.join(conflict['negative_keywords'])}")
        click.echo()


@main.command()
@click.option('--brand', required=True, help='Brand name for the campaign')
@click.option('--asin', required=True, multiple=True, help='ASIN(s) to include (can specify multiple times)')
@click.option('--strategy', type=click.Choice(['auto', 'manual', 'exact', 'phrase', 'broad']),
              default='manual', help='Campaign strategy')
@click.option('--output', default='data/exports/campaign.csv', help='Output CSV file path')
@click.option('--budget', default=10.0, type=float, help='Daily budget')
@click.option('--bid', default=0.75, type=float, help='Default bid')
def create_campaign(brand, asin, strategy, output, budget, bid):
    """Create a new campaign with ASINs and keywords"""
    bank = KeywordBank()
    audit = AuditLogger()
    
    # Get keywords for brand
    keywords = bank.get_keywords_by_brand(brand)
    
    if not keywords:
        click.echo(f"Error: No keywords found for brand '{brand}'")
        return
    
    # Create ad groups for each ASIN
    ad_groups = []
    positive_keywords = [k for k in keywords if k.keyword_type == KeywordType.POSITIVE]
    negative_keywords = [k for k in keywords if k.keyword_type == KeywordType.NEGATIVE]
    
    for asin_value in asin:
        ad_group = AdGroup(
            name=CampaignNameGenerator.generate_ad_group_name(asin_value, len(positive_keywords)),
            asin=asin_value
        )
        # Add all positive keywords to each ad group
        for kw in positive_keywords:
            ad_group.add_keyword(kw)
        # Add all negative keywords
        for kw in negative_keywords:
            ad_group.add_keyword(kw)
        
        ad_groups.append(ad_group)
    
    # Generate campaign name
    campaign_name = CampaignNameGenerator.generate_with_strategy(brand, strategy, ad_groups)
    
    # Create campaign
    campaign = bank.create_campaign(campaign_name, brand, ad_groups)
    bank.save()
    
    # Export to CSV
    Path(output).parent.mkdir(parents=True, exist_ok=True)
    AmazonBulkExporter.export_campaign(campaign, output, budget, bid)
    
    audit.log('create_campaign', {
        'campaign_name': campaign_name,
        'brand': brand,
        'asins': list(asin),
        'strategy': strategy,
        'ad_groups': len(ad_groups),
        'keywords': len(positive_keywords),
        'negative_keywords': len(negative_keywords),
        'output_file': output
    })
    
    click.echo(f"✓ Campaign created: {campaign_name}")
    click.echo(f"  Brand: {brand}")
    click.echo(f"  ASINs: {len(asin)}")
    click.echo(f"  Ad Groups: {len(ad_groups)}")
    click.echo(f"  Keywords: {len(positive_keywords)} positive, {len(negative_keywords)} negative")
    click.echo(f"  Exported to: {output}")


@main.command()
@click.option('--brand', help='Filter by brand (optional)')
def list_campaigns(brand):
    """List all campaigns"""
    bank = KeywordBank()
    
    campaigns = bank.campaigns if not brand else bank.get_campaigns_by_brand(brand)
    
    if not campaigns:
        click.echo("No campaigns found.")
        return
    
    click.echo(f"\n=== Campaigns ({len(campaigns)} total) ===\n")
    
    for campaign in campaigns:
        click.echo(f"{campaign.name}")
        click.echo(f"  Brand: {campaign.brand}")
        click.echo(f"  Ad Groups: {len(campaign.ad_groups)}")
        click.echo(f"  Created: {campaign.created_at.strftime('%Y-%m-%d %H:%M')}")
        click.echo()


@main.command()
@click.option('--count', default=10, help='Number of recent entries to show')
def audit_trail(count):
    """Show recent audit trail entries"""
    audit = AuditLogger()
    
    entries = audit.get_recent_entries(count)
    
    if not entries:
        click.echo("No audit entries found.")
        return
    
    click.echo(f"\n=== Recent Audit Entries ({len(entries)}) ===\n")
    
    for entry in entries:
        click.echo(f"[{entry.timestamp.strftime('%Y-%m-%d %H:%M:%S')}] {entry.action}")
        click.echo(f"  User: {entry.user}")
        for key, value in entry.details.items():
            click.echo(f"  {key}: {value}")
        click.echo()


@main.command()
def stats():
    """Show statistics about the keyword bank"""
    bank = KeywordBank()
    
    brands = bank.get_all_brands()
    total_keywords = len(bank.keywords)
    positive = sum(1 for k in bank.keywords if k.keyword_type == KeywordType.POSITIVE)
    negative = sum(1 for k in bank.keywords if k.keyword_type == KeywordType.NEGATIVE)
    total_campaigns = len(bank.campaigns)
    
    click.echo("\n=== KWBank Statistics ===\n")
    click.echo(f"Total Brands: {len(brands)}")
    click.echo(f"Total Keywords: {total_keywords}")
    click.echo(f"  Positive: {positive}")
    click.echo(f"  Negative: {negative}")
    click.echo(f"Total Campaigns: {total_campaigns}")
    click.echo()
    
    if brands:
        click.echo("Keywords by Brand:")
        for brand in sorted(brands):
            brand_kws = bank.get_keywords_by_brand(brand)
            click.echo(f"  {brand}: {len(brand_kws)}")


if __name__ == '__main__':
    main()
