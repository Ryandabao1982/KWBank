# KWBank Quick Reference Card

## Installation
```bash
pip install -e .
kwbank --version  # Verify installation
```

## Quick Start (New User)

### 1. Setup Brand
```bash
kwbank add-brand \
  --name "YourBrand" \
  --prefix "YOURBRAND" \
  --budget 50.0 \
  --bid 1.25
```

### 2. Add Products
```bash
kwbank add-product \
  --brand "YourBrand" \
  --asin "B08EXAMPLE" \
  --name "Product Name"
```

### 3. Create Naming Rule
```bash
kwbank add-naming-rule \
  --name "standard" \
  --pattern "{BrandPrefix}_{ASIN}_{Goal}_{MatchType}_{Date:yyyyMMdd}"
```

### 4. Import Keywords (Enhanced)
```bash
kwbank import-keywords keywords.csv \
  --brand "YourBrand" \
  --keyword-type positive \
  --match-type exact \
  --enhanced \
  --auto-detect-intent
```

### 5. Check for Issues
```bash
kwbank find-fuzzy-duplicates
kwbank detect-conflicts
```

### 6. Create Campaign
```bash
kwbank create-campaign \
  --brand "YourBrand" \
  --asin B08EXAMPLE \
  --strategy exact \
  --budget 50.0 \
  --bid 1.25 \
  --output campaign.csv
```

## Common Commands

### View Information
```bash
kwbank list-brands              # All brands
kwbank list-products            # All products
kwbank list-keywords            # All keywords
kwbank list-campaigns           # All campaigns
kwbank list-naming-rules        # Naming patterns
kwbank stats                    # Statistics
kwbank audit-trail             # Recent activity
```

### Find Duplicates
```bash
kwbank find-exact-duplicates      # Same normalized text
kwbank find-fuzzy-duplicates      # Similar (~92%)
kwbank find-variant-duplicates    # Same stem
kwbank detect-conflicts           # Positive/negative overlaps
```

### Test Patterns
```bash
kwbank test-naming-pattern "{BrandPrefix}_{Goal}_{Date:yyyyMMdd}"
```

## Pattern Tokens

| Token | Description | Example Output |
|-------|-------------|----------------|
| `{BrandPrefix}` | Brand prefix | NIKE |
| `{ASIN}` | Product ASIN | B07X9C8N6D |
| `{Goal}` | Campaign goal | Conversion |
| `{MatchType}` | Match type | Exact |
| `{Locale}` | Locale code | en_US |
| `{Date:yyyyMMdd}` | Current date | 20251020 |

## Intent Classification

| Intent | Keywords | Bid Multiplier |
|--------|----------|----------------|
| Conversion | buy, purchase, sale, price | 1.5x |
| Consideration | review, compare, best, rating | 1.2x |
| Awareness | how to, guide, tips, tutorial | 1.0x |

## Import Flags

| Flag | Effect |
|------|--------|
| `--enhanced` | Advanced normalization (diacritics, punctuation) |
| `--auto-detect-intent` | Classify intent and suggest bids |
| `--keyword-type positive` | Positive keywords |
| `--keyword-type negative` | Negative keywords |
| `--match-type exact` | Exact match |
| `--match-type phrase` | Phrase match |
| `--match-type broad` | Broad match |

## File Locations

```
data/
├── keyword_bank.json      # Main data store
├── audit_trail.json       # Activity log
└── exports/
    └── *.csv             # Campaign exports
```

## Example Workflow

```bash
# 1. Setup
kwbank add-brand --name "Nike" --prefix "NIKE" --budget 50 --bid 1.25
kwbank add-product --brand "Nike" --asin "B07X9C8N6D" --name "Air Max 270"

# 2. Import with enhancement
echo -e "buy nike shoes\nnike shoes review\nhow to choose nike shoes" > keywords.csv
kwbank import-keywords keywords.csv \
  --brand "Nike" \
  --enhanced \
  --auto-detect-intent

# 3. Check results
kwbank stats
kwbank list-keywords --brand "Nike"

# 4. Find issues
kwbank find-fuzzy-duplicates --brand "Nike"
kwbank detect-conflicts

# 5. Generate campaign
kwbank create-campaign \
  --brand "Nike" \
  --asin B07X9C8N6D \
  --strategy exact \
  --output nike_campaign.csv

# 6. Review
kwbank list-campaigns
kwbank audit-trail
```

## Help

```bash
kwbank --help                    # List all commands
kwbank <command> --help          # Command-specific help
```

## Demos

```bash
./demo_enhanced.sh              # Full 17-step demo
```

## Documentation

- **README.md** - Overview and installation
- **ENHANCED_FEATURES.md** - Complete feature guide (11KB)
- **IMPLEMENTATION_SUMMARY.md** - Technical details (10KB)
- **TESTING.md** - Test procedures

## Troubleshooting

### "No brands found"
```bash
kwbank add-brand --name "Test" --prefix "TEST"
```

### "Too many fuzzy duplicates"
```bash
kwbank find-fuzzy-duplicates --threshold 0.95  # Stricter
```

### "Intent not accurate"
Use descriptive keywords with action words (buy, review, compare)

### "Pattern not working"
```bash
kwbank test-naming-pattern "<your-pattern>"  # Verify first
```

## Quick Tips

💡 Always use `--enhanced` for new imports  
💡 Test patterns before creating naming rules  
💡 Run duplicate checks after large imports  
💡 Set realistic brand defaults (budget/bid)  
💡 Use prefixes consistently (uppercase, short)  
💡 Review audit trail for troubleshooting  

## Version Info

```bash
kwbank --version  # Current: 0.1.0
```

---
For detailed documentation, see **ENHANCED_FEATURES.md**
