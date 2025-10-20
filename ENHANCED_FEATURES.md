# KWBank Enhanced Features Guide

## Overview

KWBank now includes advanced multi-brand campaign management capabilities with pattern-based naming, fuzzy deduplication, intent detection, and comprehensive brand/product management.

## New Features

### 1. Multi-Brand Management

Store and manage multiple brands with individual settings:

```bash
# Add a brand
kwbank add-brand \
  --name "Nike" \
  --prefix "NIKE" \
  --budget 50.0 \
  --bid 1.25 \
  --account-id "ACC-001" \
  --locale "en_US"

# List all brands
kwbank list-brands

# View brand details with keyword and product counts
```

**Brand Attributes:**
- **Name**: Brand display name
- **Prefix**: Short code used in campaign names
- **Default Budget**: Daily budget for campaigns
- **Default Bid**: Base bid amount for keywords
- **Account ID**: Amazon Advertising account identifier
- **Locale**: Default locale (e.g., en_US, de_DE, fr_FR)

### 2. Product/ASIN Management

Track products and ASINs associated with each brand:

```bash
# Add a product
kwbank add-product \
  --brand "Nike" \
  --asin "B07X9C8N6D" \
  --name "Nike Air Max 270" \
  --category "Footwear" \
  --notes "Popular running shoe"

# List all products
kwbank list-products

# List products for a specific brand
kwbank list-products --brand "Nike"
```

### 3. Pattern-Based Campaign Naming

Define naming rules with dynamic tokens:

**Supported Tokens:**
- `{BrandPrefix}` - Brand prefix (e.g., NIKE)
- `{ASIN}` - Product ASIN
- `{Goal}` - Campaign goal (Awareness, Consideration, Conversion)
- `{MatchType}` - Keyword match type (Exact, Phrase, Broad)
- `{Locale}` - Locale code (e.g., en_US)
- `{Date:yyyyMMdd}` - Current date in specified format

**Examples:**

```bash
# Add a naming rule
kwbank add-naming-rule \
  --name "standard" \
  --pattern "{BrandPrefix}_{ASIN}_{Goal}_{MatchType}_{Date:yyyyMMdd}"

# Result: NIKE_B07X9C8N6D_Conversion_Exact_20251020

# Test a pattern before using it
kwbank test-naming-pattern "{BrandPrefix}_{Goal}_{Locale}"
# Default Example: NIKE_Conversion_en_US
# Alternative Example: ADIDAS_Awareness_de_DE

# List all naming rules
kwbank list-naming-rules
```

### 4. Enhanced Keyword Import with Intent Detection

Import keywords with automatic normalization, deduplication, and intent detection:

```bash
# Enhanced import with intent detection
kwbank import-keywords keywords.csv \
  --brand "Nike" \
  --keyword-type positive \
  --match-type exact \
  --enhanced \
  --auto-detect-intent
```

**What happens during enhanced import:**

1. **Enhanced Normalization**:
   - Removes diacritics/accents (café → cafe)
   - Removes punctuation
   - Normalizes whitespace
   - Lowercase conversion

2. **Fuzzy Duplicate Detection**:
   - Detects similar keywords (running shoes vs runing shoes)
   - Uses Jaro-Winkler similarity (default threshold: 0.92)
   - Prevents importing near-duplicates

3. **Intent Detection**:
   - Analyzes keyword text for intent signals
   - Classifies as: Awareness, Consideration, Conversion, or Unknown
   - Examples:
     - "buy running shoes" → Conversion
     - "running shoes review" → Consideration
     - "how to choose running shoes" → Awareness

4. **Automatic Bid Suggestions**:
   - Based on detected intent
   - Conversion keywords get higher suggested bids (1.5x base)
   - Consideration keywords get moderate increase (1.2x base)
   - Awareness keywords use base bid (1.0x base)

**Example Output:**

```
✓ Imported 7 keywords (1 duplicates skipped)
  Brand: Nike
  Type: positive
  Match Type: exact
  Fuzzy duplicates detected: 1
  Keywords enhanced: 7
  Intent distribution:
    conversion: 3
    awareness: 1
    consideration: 2
    unknown: 1
```

### 5. Advanced Duplicate Detection

Find duplicates using multiple methods:

**Exact Duplicates** (same normalized text):
```bash
kwbank find-exact-duplicates --brand "Nike"
```

**Fuzzy Duplicates** (similar but not identical):
```bash
# Default threshold: 0.92 (92% similar)
kwbank find-fuzzy-duplicates --brand "Nike"

# Custom threshold
kwbank find-fuzzy-duplicates --brand "Nike" --threshold 0.85
```

**Variant Duplicates** (same stem):
```bash
# Groups keywords with same root word
# Example: "running shoes" and "run shoe"
kwbank find-variant-duplicates --brand "Nike"
```

### 6. Keyword-ASIN Mappings

Create mappings between keywords and ASINs for planning:

```bash
# Add a mapping
kwbank add-mapping \
  --asin "B07X9C8N6D" \
  --keyword "buy nike running shoes" \
  --ad-group "Nike_Air_Max_Conversion" \
  --bid 1.75 \
  --notes "High-intent conversion keyword"

# List mappings by ASIN
kwbank list-mappings --asin "B07X9C8N6D"

# List mappings by keyword
kwbank list-mappings --keyword "running shoes"

# List all mappings
kwbank list-mappings
```

## Complete Workflow Example

### Step 1: Setup Brands and Products

```bash
# Add brand
kwbank add-brand \
  --name "Nike" \
  --prefix "NIKE" \
  --budget 50.0 \
  --bid 1.25

# Add products
kwbank add-product \
  --brand "Nike" \
  --asin "B07X9C8N6D" \
  --name "Nike Air Max 270" \
  --category "Footwear"

kwbank add-product \
  --brand "Nike" \
  --asin "B08ABC123X" \
  --name "Nike Dri-FIT Shirt" \
  --category "Apparel"
```

### Step 2: Define Naming Rules

```bash
kwbank add-naming-rule \
  --name "standard" \
  --pattern "{BrandPrefix}_{ASIN}_{Goal}_{MatchType}_{Date:yyyyMMdd}"
```

### Step 3: Import Keywords

```bash
# Create keyword file
cat > nike_keywords.csv << EOF
buy nike running shoes
nike air max sale
how to choose nike shoes
nike shoes review
best nike running shoes
EOF

# Import with enhancement
kwbank import-keywords nike_keywords.csv \
  --brand "Nike" \
  --keyword-type positive \
  --match-type exact \
  --enhanced \
  --auto-detect-intent
```

### Step 4: Check for Issues

```bash
# Find duplicates
kwbank find-fuzzy-duplicates --brand "Nike"

# Check for conflicts
kwbank detect-conflicts
```

### Step 5: Create Mappings

```bash
kwbank add-mapping \
  --asin "B07X9C8N6D" \
  --keyword "buy nike running shoes" \
  --bid 1.75
```

### Step 6: Generate Campaign

```bash
kwbank create-campaign \
  --brand "Nike" \
  --asin B07X9C8N6D \
  --asin B08ABC123X \
  --strategy exact \
  --budget 50.0 \
  --bid 1.25 \
  --output data/exports/nike_campaign.csv
```

### Step 7: Review and Export

```bash
# View campaign
kwbank list-campaigns

# View stats
kwbank stats

# Check audit trail
kwbank audit-trail
```

## Data Model

### Brand
- BrandID: Unique identifier
- Name: Display name
- Prefix: Campaign name prefix
- DefaultBudget: Daily budget
- DefaultBid: Base bid
- AccountID: Amazon account ID
- DefaultLocale: Locale code

### Product
- ASIN: Amazon Standard Identification Number
- BrandID: Associated brand
- ProductName: Product title
- Category: Product category
- Notes: Additional notes

### Keyword (Enhanced)
- Text: Original keyword text
- Brand: Associated brand
- MatchType: exact, phrase, or broad
- KeywordType: positive or negative
- NormalizedText: Cleaned/normalized version
- **Intent**: awareness, consideration, conversion, or unknown
- **SuggestedBid**: Auto-calculated bid suggestion
- **Tags**: List of tags
- **Notes**: Additional notes
- **Owner**: Keyword owner/creator
- **Status**: active, paused, archived, pending
- **Source**: Import source

### Mapping
- ASIN: Product identifier
- Keyword: Keyword text
- CampaignID: Associated campaign
- AdGroup: Ad group name
- BidOverride: Custom bid amount
- Notes: Planning notes

### NamingRule
- Pattern: Template with tokens
- Example: Sample output
- Name: Rule identifier
- BrandID: Brand-specific or global

## Intent Detection

The system automatically detects keyword intent based on signals in the text:

**Awareness Keywords** - Learning and discovery:
- Contains: "what is", "how to", "guide", "tips", "tutorial"
- Example: "how to choose running shoes"
- Bid multiplier: 1.0x

**Consideration Keywords** - Evaluation and comparison:
- Contains: "compare", "review", "best", "top", "rating"
- Example: "running shoes review"
- Bid multiplier: 1.2x

**Conversion Keywords** - Purchase intent:
- Contains: "buy", "purchase", "sale", "price", "deal", "order"
- Example: "buy running shoes"
- Bid multiplier: 1.5x

## Normalization Modes

### Basic Mode (Default for backward compatibility)
- Lowercase conversion
- Whitespace trimming and collapsing
- Maintains original deduplication behavior

### Enhanced Mode (--enhanced flag)
- All basic normalization
- Diacritics removal (café → cafe)
- Punctuation removal
- Optional stop word removal
- Better handling of special characters

## Fuzzy Duplicate Detection

Uses Jaro-Winkler similarity algorithm:
- Default threshold: 0.92 (92% similar)
- Adjustable with --threshold parameter
- Considers character position and order
- Works on normalized text

**Examples of fuzzy duplicates:**
- "running shoes" ≈ "runing shoes" (typo)
- "nike air max" ≈ "nike airmax" (spacing)
- "buy shoes" ≈ "buy shoe" (singular/plural)

## Best Practices

### 1. Brand Setup
- Use short, uppercase prefixes (NIKE, ADIDAS, PUMA)
- Set realistic default budgets and bids
- Keep account IDs consistent

### 2. Naming Patterns
- Include date for version tracking
- Use brand prefix for multi-brand accounts
- Include goal and match type for clarity
- Test patterns before applying

### 3. Keyword Import
- Always use --enhanced for new imports
- Enable --auto-detect-intent for bid optimization
- Review fuzzy duplicate reports
- Import negative keywords separately

### 4. Duplicate Management
- Run find-fuzzy-duplicates after large imports
- Address variant duplicates for consistency
- Keep conflict detection running regularly

### 5. Campaign Planning
- Create mappings before campaign generation
- Use products to organize ASINs
- Review audit trail for changes
- Export campaigns for Amazon upload

## Command Reference

### Brand Management
- `kwbank add-brand` - Add new brand
- `kwbank list-brands` - List all brands

### Product Management
- `kwbank add-product` - Add product/ASIN
- `kwbank list-products` - List products

### Naming Rules
- `kwbank add-naming-rule` - Define naming pattern
- `kwbank list-naming-rules` - List naming rules
- `kwbank test-naming-pattern` - Test a pattern

### Keyword Operations
- `kwbank import-keywords` - Import with enhancement
- `kwbank list-keywords` - List keywords

### Duplicate Detection
- `kwbank find-exact-duplicates` - Exact matches
- `kwbank find-fuzzy-duplicates` - Similar matches
- `kwbank find-variant-duplicates` - Stem-based matches
- `kwbank detect-conflicts` - Positive/negative conflicts

### Mapping Management
- `kwbank add-mapping` - Create ASIN-keyword mapping
- `kwbank list-mappings` - List mappings

### Campaign Operations
- `kwbank create-campaign` - Generate campaign
- `kwbank list-campaigns` - List campaigns

### Reporting
- `kwbank stats` - System statistics
- `kwbank audit-trail` - Activity log

## Troubleshooting

### Issue: Too many fuzzy duplicates detected
**Solution**: Increase threshold to 0.95 or higher for stricter matching

### Issue: Intent detection not accurate
**Solution**: Intent is based on keyword signals. For better accuracy:
- Use descriptive keywords
- Include action words (buy, review, compare)
- Manually set intent in special cases

### Issue: Suggested bids too high/low
**Solution**: Adjust brand default bid, which serves as the base for multipliers

### Issue: Pattern tokens not replaced
**Solution**: Check token spelling (case-sensitive) and ensure proper format with curly braces

## Migration from Old Version

The system maintains backward compatibility:
- Old data files load automatically
- Basic import still works without flags
- Enhanced features are opt-in
- Existing campaigns remain unchanged

To start using new features:
1. Add brands for existing keyword sets
2. Enable --enhanced flag on new imports
3. Create naming rules for consistency
4. Gradually migrate to pattern-based naming
