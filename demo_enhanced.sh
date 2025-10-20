#!/bin/bash
# Enhanced demo script for KWBank multi-brand campaign management system

echo "================================================"
echo "KWBank Enhanced Multi-Brand Demo"
echo "================================================"
echo ""

# Clean up any existing data
echo "Cleaning up previous data..."
rm -f data/keyword_bank.json data/audit_trail.json
mkdir -p data/exports

echo ""
echo "1. Setting up Brands"
echo "--------------------"

# Add Nike brand
kwbank add-brand \
  --name "Nike" \
  --prefix "NIKE" \
  --budget 50.0 \
  --bid 1.25 \
  --account-id "ACC-NIKE-001" \
  --locale "en_US"

echo ""

# Add Adidas brand
kwbank add-brand \
  --name "Adidas" \
  --prefix "ADIDAS" \
  --budget 40.0 \
  --bid 1.0 \
  --account-id "ACC-ADIDAS-001" \
  --locale "en_US"

echo ""
echo "2. Listing Brands"
echo "-----------------"
kwbank list-brands

echo ""
echo "3. Adding Products/ASINs"
echo "------------------------"

# Add Nike products
kwbank add-product \
  --brand "Nike" \
  --asin "B07X9C8N6D" \
  --name "Nike Air Max 270" \
  --category "Footwear" \
  --notes "Popular running shoe"

echo ""

kwbank add-product \
  --brand "Nike" \
  --asin "B08ABC123X" \
  --name "Nike Dri-FIT Shirt" \
  --category "Apparel" \
  --notes "Performance shirt"

echo ""

# Add Adidas products
kwbank add-product \
  --brand "Adidas" \
  --asin "B09XYZ456Y" \
  --name "Adidas Ultraboost" \
  --category "Footwear" \
  --notes "Premium running shoe"

echo ""
echo "4. Creating Naming Rules"
echo "------------------------"

# Add standard naming rule
kwbank add-naming-rule \
  --name "standard" \
  --pattern "{BrandPrefix}_{ASIN}_{Goal}_{MatchType}_{Date:yyyyMMdd}"

echo ""

# Add simplified naming rule
kwbank add-naming-rule \
  --name "simple" \
  --pattern "{BrandPrefix}_{Goal}_{Date:yyyyMMdd}"

echo ""
echo "5. Testing Naming Patterns"
echo "--------------------------"
kwbank test-naming-pattern "{BrandPrefix}_{ASIN}_{Goal}_{MatchType}_{Locale}"

echo ""
echo "6. Importing Keywords with Intent Detection"
echo "--------------------------------------------"

# Create Nike keywords with various intents
cat > /tmp/nike_keywords.csv << EOF
buy nike running shoes
nike air max sale
how to choose nike shoes
nike shoes review
best nike running shoes
nike shoes price
nike running shoes deals
nike workout clothes
EOF

kwbank import-keywords /tmp/nike_keywords.csv \
  --brand "Nike" \
  --keyword-type positive \
  --match-type exact \
  --enhanced \
  --auto-detect-intent

echo ""

# Create Nike negative keywords
cat > /tmp/nike_negative.csv << EOF
cheap
fake
replica
used
secondhand
EOF

kwbank import-keywords /tmp/nike_negative.csv \
  --brand "Nike" \
  --keyword-type negative \
  --match-type phrase

echo ""

# Create Adidas keywords
cat > /tmp/adidas_keywords.csv << EOF
buy adidas shoes
adidas ultraboost sale
adidas running shoes review
best adidas sneakers
EOF

kwbank import-keywords /tmp/adidas_keywords.csv \
  --brand "Adidas" \
  --keyword-type positive \
  --match-type exact \
  --enhanced \
  --auto-detect-intent

echo ""
echo "7. Testing Fuzzy Duplicate Detection"
echo "-------------------------------------"

# Try to import similar keywords to test fuzzy detection
cat > /tmp/fuzzy_test.csv << EOF
nike air max sale online
nike running shoes deal
buy nike air max
EOF

kwbank import-keywords /tmp/fuzzy_test.csv \
  --brand "Nike" \
  --keyword-type positive \
  --match-type exact \
  --enhanced

echo ""
echo "8. Finding Duplicates"
echo "---------------------"

echo "Checking for exact duplicates..."
kwbank find-exact-duplicates --brand "Nike"

echo ""
echo "Checking for fuzzy duplicates..."
kwbank find-fuzzy-duplicates --brand "Nike" --threshold 0.85

echo ""
echo "Checking for variant duplicates..."
kwbank find-variant-duplicates --brand "Nike"

echo ""
echo "9. Detecting Conflicts"
echo "----------------------"
kwbank detect-conflicts

echo ""
echo "10. Creating Keyword-ASIN Mappings"
echo "-----------------------------------"

kwbank add-mapping \
  --asin "B07X9C8N6D" \
  --keyword "buy nike running shoes" \
  --ad-group "Nike_Air_Max_Conversion" \
  --bid 1.75 \
  --notes "High-intent conversion keyword"

echo ""

kwbank add-mapping \
  --asin "B07X9C8N6D" \
  --keyword "nike air max sale" \
  --ad-group "Nike_Air_Max_Conversion" \
  --bid 1.50

echo ""
echo "11. Listing Mappings"
echo "--------------------"
kwbank list-mappings --asin "B07X9C8N6D"

echo ""
echo "12. Creating Campaign with Pattern-Based Naming"
echo "------------------------------------------------"

kwbank create-campaign \
  --brand "Nike" \
  --asin B07X9C8N6D \
  --asin B08ABC123X \
  --strategy exact \
  --budget 50.0 \
  --bid 1.25 \
  --output data/exports/nike_exact_campaign.csv

echo ""
echo "13. Listing All Campaigns"
echo "-------------------------"
kwbank list-campaigns

echo ""
echo "14. Viewing Statistics"
echo "----------------------"
kwbank stats

echo ""
echo "15. Viewing Recent Activity"
echo "---------------------------"
kwbank audit-trail --count 10

echo ""
echo "16. Listing Products"
echo "--------------------"
kwbank list-products

echo ""
echo "17. Listing Naming Rules"
echo "------------------------"
kwbank list-naming-rules

echo ""
echo "================================================"
echo "Demo completed successfully!"
echo "================================================"
echo ""
echo "Generated files:"
echo "  - data/keyword_bank.json (main data store)"
echo "  - data/audit_trail.json (audit log)"
echo "  - data/exports/nike_exact_campaign.csv (campaign export)"
echo ""
echo "Try these commands to explore:"
echo "  kwbank list-brands"
echo "  kwbank list-keywords --brand Nike"
echo "  kwbank list-products --brand Nike"
echo "  kwbank list-naming-rules"
echo "  kwbank find-fuzzy-duplicates"
echo ""
