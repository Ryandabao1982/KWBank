# KWBank Quick Start Examples

This directory contains sample files to help you get started with KWBank.

## Sample Files

### sample_keywords.csv
Example positive keywords for a sports footwear brand.

### negative_keywords.csv
Example negative keywords to exclude unwanted traffic.

## Quick Test Workflow

```bash
# 1. Import sample positive keywords
kwbank import-keywords examples/sample_keywords.csv \
  --brand "SampleBrand" \
  --keyword-type positive \
  --match-type exact

# 2. Import negative keywords
kwbank import-keywords examples/negative_keywords.csv \
  --brand "SampleBrand" \
  --keyword-type negative \
  --match-type phrase

# 3. View imported keywords
kwbank list-keywords --brand "SampleBrand"

# 4. Create a test campaign
kwbank create-campaign \
  --brand "SampleBrand" \
  --asin B08SAMPLE1 \
  --asin B08SAMPLE2 \
  --strategy exact \
  --output data/exports/test_campaign.csv

# 5. View statistics
kwbank stats

# 6. Check audit trail
kwbank audit-trail
```

## Creating Your Own CSV Files

Keyword CSV files should have one keyword per line:
```
keyword one
keyword two
keyword three
```

No header row is required, but if one exists, it will be automatically skipped if it starts with "keyword".
