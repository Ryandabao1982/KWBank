#!/bin/bash
# KWBank Demo Script - Shows all features in action

set -e

echo "=========================================="
echo "KWBank Demo - Full Workflow"
echo "=========================================="
echo ""

# Clean up any existing data
echo "1. Cleaning up previous demo data..."
rm -f data/keyword_bank.json data/audit_trail.json data/exports/*.csv
echo "   ✓ Cleaned"
echo ""

# Import positive keywords for Brand 1
echo "2. Importing positive keywords for Nike..."
kwbank import-keywords examples/sample_keywords.csv \
  --brand "Nike" \
  --keyword-type positive \
  --match-type exact
echo ""

# Import negative keywords
echo "3. Importing negative keywords for Nike..."
kwbank import-keywords examples/negative_keywords.csv \
  --brand "Nike" \
  --keyword-type negative \
  --match-type phrase
echo ""

# Import keywords for second brand
echo "4. Importing positive keywords for Adidas..."
kwbank import-keywords examples/sample_keywords.csv \
  --brand "Adidas" \
  --keyword-type positive \
  --match-type broad
echo ""

# Test deduplication
echo "5. Testing deduplication (re-importing Nike keywords)..."
kwbank import-keywords examples/sample_keywords.csv \
  --brand "Nike" \
  --keyword-type positive \
  --match-type exact
echo ""

# List all keywords
echo "6. Listing all keywords..."
kwbank list-keywords
echo ""

# Check statistics
echo "7. Viewing statistics..."
kwbank stats
echo ""

# Detect conflicts (none expected yet)
echo "8. Detecting conflicts (should be none)..."
kwbank detect-conflicts
echo ""

# Create a conflicting keyword
echo "9. Creating a conflict by adding 'running shoes' as negative..."
echo "running shoes" > /tmp/conflict_keyword.csv
kwbank import-keywords /tmp/conflict_keyword.csv \
  --brand "Nike" \
  --keyword-type negative \
  --match-type exact
echo ""

# Detect conflicts again
echo "10. Detecting conflicts (should find 1)..."
kwbank detect-conflicts
echo ""

# Create campaigns
echo "11. Creating Nike campaign with 2 ASINs..."
kwbank create-campaign \
  --brand "Nike" \
  --asin B08NIKE001 \
  --asin B08NIKE002 \
  --strategy exact \
  --budget 50.0 \
  --bid 1.25 \
  --output data/exports/nike_exact_campaign.csv
echo ""

echo "12. Creating Adidas campaign with 3 ASINs..."
kwbank create-campaign \
  --brand "Adidas" \
  --asin B08ADI001 \
  --asin B08ADI002 \
  --asin B08ADI003 \
  --strategy broad \
  --budget 30.0 \
  --bid 0.85 \
  --output data/exports/adidas_broad_campaign.csv
echo ""

# List campaigns
echo "13. Listing all campaigns..."
kwbank list-campaigns
echo ""

# Show audit trail
echo "14. Viewing audit trail (last 5 entries)..."
kwbank audit-trail --count 5
echo ""

# Check exports
echo "15. Verifying exported CSV files..."
ls -lh data/exports/*.csv
echo ""

echo "=========================================="
echo "Demo Complete!"
echo "=========================================="
echo ""
echo "Generated files:"
echo "  - data/keyword_bank.json (keyword storage)"
echo "  - data/audit_trail.json (audit log)"
echo "  - data/exports/nike_exact_campaign.csv"
echo "  - data/exports/adidas_broad_campaign.csv"
echo ""
echo "You can view the exported campaigns:"
echo "  head -n 30 data/exports/nike_exact_campaign.csv"
