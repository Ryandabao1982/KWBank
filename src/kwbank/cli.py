"""
Command-line interface for KWBank
"""
import click
import csv
import uuid
from typing import List
from pathlib import Path

from .keyword_bank import KeywordBank
from .models import (
    Keyword, AdGroup, MatchType, KeywordType, Brand, Product,
    Mapping, NamingRule, KeywordIntent, KeywordStatus,
    CampaignGoal, CampaignType, AutoManual
)
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
@click.option('--enhanced/--basic', default=False, help='Use enhanced normalization')
@click.option('--auto-detect-intent/--no-auto-detect-intent', default=True, 
              help='Auto-detect keyword intent and suggest bids')
def import_keywords(csv_file, brand, keyword_type, match_type, enhanced, auto_detect_intent):
    """Import keywords from a CSV file with enhanced processing"""
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
    
    # Use enhanced import if requested
    if enhanced or auto_detect_intent:
        added, duplicates, stats = bank.import_keywords_enhanced(
            keywords,
            auto_enhance=auto_detect_intent,
            normalization_mode='enhanced' if enhanced else 'basic'
        )
        bank.save()
        
        audit.log('import_keywords_enhanced', {
            'file': csv_file,
            'brand': brand,
            'added': added,
            'duplicates': duplicates,
            'fuzzy_duplicates': stats.get('fuzzy_duplicates', 0),
            'enhanced': stats.get('enhanced', 0),
            'keyword_type': keyword_type,
            'match_type': match_type,
            'intents': dict(stats.get('intents_detected', {}))
        })
        
        click.echo(f"✓ Imported {added} keywords ({duplicates} duplicates skipped)")
        click.echo(f"  Brand: {brand}")
        click.echo(f"  Type: {keyword_type}")
        click.echo(f"  Match Type: {match_type}")
        
        if stats.get('fuzzy_duplicates', 0) > 0:
            click.echo(f"  Fuzzy duplicates detected: {stats['fuzzy_duplicates']}")
        
        if auto_detect_intent and stats.get('enhanced', 0) > 0:
            click.echo(f"  Keywords enhanced: {stats['enhanced']}")
            intents = stats.get('intents_detected', {})
            if intents:
                click.echo("  Intent distribution:")
                for intent, count in intents.items():
                    click.echo(f"    {intent}: {count}")
    else:
        # Use basic import
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


# Brand Management Commands
@main.command()
@click.option('--name', required=True, help='Brand name')
@click.option('--prefix', required=True, help='Brand prefix for campaign names')
@click.option('--budget', default=10.0, type=float, help='Default daily budget')
@click.option('--bid', default=0.75, type=float, help='Default bid amount')
@click.option('--account-id', default='', help='Amazon account ID')
@click.option('--locale', default='en_US', help='Default locale (e.g., en_US)')
def add_brand(name, prefix, budget, bid, account_id, locale):
    """Add a new brand to the system"""
    bank = KeywordBank()
    audit = AuditLogger()
    
    # Generate unique brand ID
    brand_id = f"brand_{uuid.uuid4().hex[:8]}"
    
    brand = Brand(
        brand_id=brand_id,
        name=name,
        prefix=prefix,
        default_budget=budget,
        default_bid=bid,
        account_id=account_id,
        default_locale=locale
    )
    
    if bank.add_brand(brand):
        bank.save()
        audit.log('add_brand', {
            'brand_id': brand_id,
            'name': name,
            'prefix': prefix
        })
        click.echo(f"✓ Brand added: {name}")
        click.echo(f"  ID: {brand_id}")
        click.echo(f"  Prefix: {prefix}")
        click.echo(f"  Default Budget: ${budget}")
        click.echo(f"  Default Bid: ${bid}")
    else:
        click.echo(f"Error: Brand with ID {brand_id} already exists")


@main.command()
def list_brands():
    """List all brands"""
    bank = KeywordBank()
    
    brands = bank.get_all_brands_list()
    
    if not brands:
        click.echo("No brands found.")
        return
    
    click.echo(f"\n=== Brands ({len(brands)}) ===\n")
    
    for brand in brands:
        click.echo(f"{brand.name} ({brand.prefix})")
        click.echo(f"  ID: {brand.brand_id}")
        click.echo(f"  Budget: ${brand.default_budget} | Bid: ${brand.default_bid}")
        click.echo(f"  Account: {brand.account_id if brand.account_id else 'Not set'}")
        click.echo(f"  Locale: {brand.default_locale}")
        
        # Show keyword and product counts
        keywords = bank.get_keywords_by_brand(brand.name)
        products = bank.get_products_by_brand(brand.brand_id)
        click.echo(f"  Keywords: {len(keywords)} | Products: {len(products)}")
        click.echo()


# Product/ASIN Management Commands
@main.command()
@click.option('--brand', required=True, help='Brand name or ID')
@click.option('--asin', required=True, help='Product ASIN')
@click.option('--name', default='', help='Product name')
@click.option('--category', default='', help='Product category')
@click.option('--notes', default='', help='Notes about the product')
def add_product(brand, asin, name, category, notes):
    """Add a product/ASIN to a brand"""
    bank = KeywordBank()
    audit = AuditLogger()
    
    # Find brand by name or ID
    brand_obj = bank.get_brand_by_name(brand) or bank.get_brand_by_id(brand)
    
    if not brand_obj:
        click.echo(f"Error: Brand '{brand}' not found")
        click.echo("Use 'kwbank list-brands' to see available brands")
        return
    
    product = Product(
        asin=asin,
        brand_id=brand_obj.brand_id,
        product_name=name,
        category=category,
        notes=notes
    )
    
    if bank.add_product(product):
        bank.save()
        audit.log('add_product', {
            'asin': asin,
            'brand_id': brand_obj.brand_id,
            'brand_name': brand_obj.name
        })
        click.echo(f"✓ Product added: {asin}")
        click.echo(f"  Brand: {brand_obj.name}")
        if name:
            click.echo(f"  Name: {name}")
        if category:
            click.echo(f"  Category: {category}")
    else:
        click.echo(f"Error: Product {asin} already exists")


@main.command()
@click.option('--brand', help='Filter by brand name or ID')
def list_products(brand):
    """List all products/ASINs"""
    bank = KeywordBank()
    
    if brand:
        brand_obj = bank.get_brand_by_name(brand) or bank.get_brand_by_id(brand)
        if not brand_obj:
            click.echo(f"Error: Brand '{brand}' not found")
            return
        products = bank.get_products_by_brand(brand_obj.brand_id)
        click.echo(f"\n=== Products for {brand_obj.name} ({len(products)}) ===\n")
    else:
        products = bank.products
        click.echo(f"\n=== All Products ({len(products)}) ===\n")
    
    if not products:
        click.echo("No products found.")
        return
    
    for product in products:
        brand_obj = bank.get_brand_by_id(product.brand_id)
        brand_name = brand_obj.name if brand_obj else product.brand_id
        
        click.echo(f"{product.asin}")
        click.echo(f"  Brand: {brand_name}")
        if product.product_name:
            click.echo(f"  Name: {product.product_name}")
        if product.category:
            click.echo(f"  Category: {product.category}")
        if product.notes:
            click.echo(f"  Notes: {product.notes}")
        
        # Show mappings count
        mappings = bank.get_mappings_by_asin(product.asin)
        click.echo(f"  Mappings: {len(mappings)}")
        click.echo()


# Naming Rule Commands
@main.command()
@click.option('--name', required=True, help='Rule name')
@click.option('--pattern', required=True, help='Pattern with tokens (e.g., {BrandPrefix}_{ASIN}_{Goal}_{MatchType}_{Date:yyyyMMdd})')
@click.option('--brand', help='Brand name or ID (optional, leave empty for global rule)')
def add_naming_rule(name, pattern, brand):
    """Add a campaign naming rule with pattern tokens"""
    bank = KeywordBank()
    audit = AuditLogger()
    
    brand_id = ''
    if brand:
        brand_obj = bank.get_brand_by_name(brand) or bank.get_brand_by_id(brand)
        if not brand_obj:
            click.echo(f"Error: Brand '{brand}' not found")
            return
        brand_id = brand_obj.brand_id
    
    # Generate example
    example = CampaignNameGenerator.preview_pattern(pattern)
    
    rule = NamingRule(
        pattern=pattern,
        example=example,
        name=name,
        brand_id=brand_id
    )
    
    bank.add_naming_rule(rule)
    bank.save()
    
    audit.log('add_naming_rule', {
        'name': name,
        'pattern': pattern,
        'brand_id': brand_id
    })
    
    click.echo(f"✓ Naming rule added: {name}")
    click.echo(f"  Pattern: {pattern}")
    click.echo(f"  Example: {example}")
    if brand:
        click.echo(f"  Brand: {brand}")


@main.command()
@click.option('--brand', help='Filter by brand name or ID')
def list_naming_rules(brand):
    """List all naming rules"""
    bank = KeywordBank()
    
    if brand:
        brand_obj = bank.get_brand_by_name(brand) or bank.get_brand_by_id(brand)
        if not brand_obj:
            click.echo(f"Error: Brand '{brand}' not found")
            return
        rules = bank.get_naming_rules_by_brand(brand_obj.brand_id)
        click.echo(f"\n=== Naming Rules for {brand_obj.name} ({len(rules)}) ===\n")
    else:
        rules = bank.naming_rules
        click.echo(f"\n=== All Naming Rules ({len(rules)}) ===\n")
    
    if not rules:
        click.echo("No naming rules found.")
        return
    
    for rule in rules:
        click.echo(f"{rule.name}")
        click.echo(f"  Pattern: {rule.pattern}")
        click.echo(f"  Example: {rule.example}")
        if rule.brand_id:
            brand_obj = bank.get_brand_by_id(rule.brand_id)
            if brand_obj:
                click.echo(f"  Brand: {brand_obj.name}")
        else:
            click.echo(f"  Scope: Global")
        click.echo()


@main.command()
@click.argument('pattern')
def test_naming_pattern(pattern):
    """Test a naming pattern with example data"""
    click.echo(f"Pattern: {pattern}\n")
    
    # Generate with default example data
    example1 = CampaignNameGenerator.preview_pattern(pattern)
    click.echo(f"Default Example: {example1}")
    
    # Generate with alternative data
    example2 = CampaignNameGenerator.preview_pattern(
        pattern,
        {
            'brand_prefix': 'ADIDAS',
            'asin': 'B08EXAMPLE',
            'goal': 'Awareness',
            'match_type': 'Phrase',
            'locale': 'de_DE'
        }
    )
    click.echo(f"Alternative Example: {example2}")


# Mapping Management Commands
@main.command()
@click.option('--asin', required=True, help='Product ASIN')
@click.option('--keyword', required=True, help='Keyword text')
@click.option('--campaign', default='', help='Campaign ID')
@click.option('--ad-group', default='', help='Ad group name')
@click.option('--bid', type=float, help='Bid override amount')
@click.option('--notes', default='', help='Notes')
def add_mapping(asin, keyword, campaign, ad_group, bid, notes):
    """Add a keyword-to-ASIN mapping"""
    bank = KeywordBank()
    audit = AuditLogger()
    
    # Verify ASIN exists
    product = bank.get_product_by_asin(asin)
    if not product:
        click.echo(f"Warning: ASIN {asin} not found in products")
        click.echo("Mapping will be created anyway, but consider adding the product first")
    
    mapping = Mapping(
        asin=asin,
        keyword=keyword,
        campaign_id=campaign,
        ad_group=ad_group,
        bid_override=bid,
        notes=notes
    )
    
    bank.add_mapping(mapping)
    bank.save()
    
    audit.log('add_mapping', {
        'asin': asin,
        'keyword': keyword
    })
    
    click.echo(f"✓ Mapping added")
    click.echo(f"  ASIN: {asin}")
    click.echo(f"  Keyword: {keyword}")
    if campaign:
        click.echo(f"  Campaign: {campaign}")
    if ad_group:
        click.echo(f"  Ad Group: {ad_group}")
    if bid:
        click.echo(f"  Bid Override: ${bid}")


@main.command()
@click.option('--asin', help='Filter by ASIN')
@click.option('--keyword', help='Filter by keyword')
def list_mappings(asin, keyword):
    """List keyword-to-ASIN mappings"""
    bank = KeywordBank()
    
    if asin:
        mappings = bank.get_mappings_by_asin(asin)
        click.echo(f"\n=== Mappings for ASIN {asin} ({len(mappings)}) ===\n")
    elif keyword:
        mappings = bank.get_mappings_by_keyword(keyword)
        click.echo(f"\n=== Mappings for keyword '{keyword}' ({len(mappings)}) ===\n")
    else:
        mappings = bank.mappings
        click.echo(f"\n=== All Mappings ({len(mappings)}) ===\n")
    
    if not mappings:
        click.echo("No mappings found.")
        return
    
    for mapping in mappings:
        click.echo(f"ASIN: {mapping.asin} → Keyword: {mapping.keyword}")
        if mapping.campaign_id:
            click.echo(f"  Campaign: {mapping.campaign_id}")
        if mapping.ad_group:
            click.echo(f"  Ad Group: {mapping.ad_group}")
        if mapping.bid_override:
            click.echo(f"  Bid Override: ${mapping.bid_override}")
        if mapping.notes:
            click.echo(f"  Notes: {mapping.notes}")
        click.echo()


# Advanced Deduplication Commands
@main.command()
@click.option('--brand', help='Filter by brand')
@click.option('--threshold', default=0.92, type=float, help='Similarity threshold (0.0-1.0)')
def find_fuzzy_duplicates(brand, threshold):
    """Find fuzzy duplicate keywords using similarity matching"""
    bank = KeywordBank()
    
    click.echo(f"Searching for fuzzy duplicates (threshold: {threshold})...\n")
    
    fuzzy_dupes = bank.find_fuzzy_duplicates(brand, threshold)
    
    if not fuzzy_dupes:
        click.echo("✓ No fuzzy duplicates found!")
        return
    
    click.echo(f"⚠ Found {len(fuzzy_dupes)} fuzzy duplicate pairs:\n")
    
    for dupe in fuzzy_dupes:
        click.echo(f"Brand: {dupe['brand']}")
        click.echo(f"  Keyword 1: {dupe['keyword1']}")
        click.echo(f"  Keyword 2: {dupe['keyword2']}")
        click.echo(f"  Similarity: {dupe['similarity']:.2%}")
        click.echo(f"  Type: {dupe['type']}")
        click.echo()


@main.command()
@click.option('--brand', help='Filter by brand')
def find_variant_duplicates(brand):
    """Find variant duplicates using stemming"""
    bank = KeywordBank()
    
    variants = bank.find_variant_duplicates(brand)
    
    if not variants:
        click.echo("✓ No variant duplicates found!")
        return
    
    click.echo(f"⚠ Found {len(variants)} variant groups:\n")
    
    for stem, keywords in variants.items():
        click.echo(f"Stem: {stem}")
        for kw in keywords:
            click.echo(f"  - {kw.text} ({kw.brand}, {kw.keyword_type.value})")
        click.echo()


@main.command()
@click.option('--brand', help='Filter by brand')
def find_exact_duplicates(brand):
    """Find exact duplicate keywords"""
    bank = KeywordBank()
    
    duplicates = bank.find_exact_duplicates(brand)
    
    if not duplicates:
        click.echo("✓ No exact duplicates found!")
        return
    
    click.echo(f"⚠ Found {len(duplicates)} exact duplicate groups:\n")
    
    for normalized, keywords in duplicates.items():
        click.echo(f"Normalized: {normalized}")
        for kw in keywords:
            click.echo(f"  - {kw.text} ({kw.brand}, {kw.keyword_type.value}, {kw.match_type.value})")
        click.echo()


if __name__ == '__main__':
    main()
