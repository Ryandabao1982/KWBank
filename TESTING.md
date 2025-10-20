# KWBank Testing Guide

This guide covers manual testing procedures and expected outcomes.

## Prerequisites

```bash
# Install the package
pip install -e .

# Verify installation
kwbank --version  # Should show: kwbank, version 0.1.0
```

## Test Suite

### Test 1: Basic Keyword Import

**Purpose**: Verify keyword import and deduplication

```bash
# Create test data
echo -e "running shoes\nbasketball shoes\nathletic wear" > /tmp/test_keywords.csv

# Import keywords
kwbank import-keywords /tmp/test_keywords.csv --brand "TestBrand" --keyword-type positive --match-type exact

# Expected Output:
# ✓ Imported 3 keywords (0 duplicates skipped)
#   Brand: TestBrand
#   Type: positive
#   Match Type: exact

# Re-import same keywords (test deduplication)
kwbank import-keywords /tmp/test_keywords.csv --brand "TestBrand" --keyword-type positive --match-type exact

# Expected Output:
# ✓ Imported 0 keywords (3 duplicates skipped)
```

**Pass Criteria**:
- ✅ First import adds 3 keywords
- ✅ Second import adds 0 keywords (all duplicates)
- ✅ No errors

---

### Test 2: Multi-Brand Support

**Purpose**: Verify keywords can be stored for multiple brands

```bash
# Import for Brand A
kwbank import-keywords /tmp/test_keywords.csv --brand "BrandA" --keyword-type positive --match-type exact

# Import for Brand B
kwbank import-keywords /tmp/test_keywords.csv --brand "BrandB" --keyword-type positive --match-type phrase

# Check statistics
kwbank stats

# Expected Output:
# Total Brands: 2
# Keywords by Brand:
#   BrandA: 3
#   BrandB: 3
```

**Pass Criteria**:
- ✅ Same keywords accepted for different brands
- ✅ Stats show 2 brands with 3 keywords each
- ✅ Total: 6 keywords

---

### Test 3: Conflict Detection

**Purpose**: Verify detection of positive/negative keyword overlaps

```bash
# Import positive keyword
echo "running shoes" > /tmp/positive.csv
kwbank import-keywords /tmp/positive.csv --brand "ConflictTest" --keyword-type positive --match-type exact

# Import same keyword as negative
echo "running shoes" > /tmp/negative.csv
kwbank import-keywords /tmp/negative.csv --brand "ConflictTest" --keyword-type negative --match-type phrase

# Detect conflicts
kwbank detect-conflicts

# Expected Output:
# ⚠ Found 1 conflicts:
# Brand: ConflictTest
#   Keyword: running shoes
#   Positive: running shoes
#   Negative: running shoes
```

**Pass Criteria**:
- ✅ Conflict detected and reported
- ✅ Shows brand, keyword, and both types
- ✅ No conflicts for other brands

---

### Test 4: Campaign Creation

**Purpose**: Verify campaign creation and CSV export

```bash
# Import keywords first
kwbank import-keywords examples/sample_keywords.csv --brand "CampaignTest" --keyword-type positive --match-type exact
kwbank import-keywords examples/negative_keywords.csv --brand "CampaignTest" --keyword-type negative --match-type phrase

# Create campaign
kwbank create-campaign \
  --brand "CampaignTest" \
  --asin B08TEST001 \
  --asin B08TEST002 \
  --strategy exact \
  --budget 25.0 \
  --bid 1.00 \
  --output /tmp/test_campaign.csv

# Expected Output:
# ✓ Campaign created: CampaignTest_EXACT_2ASIN_20251020
#   Brand: CampaignTest
#   ASINs: 2
#   Ad Groups: 2
#   Keywords: X positive, Y negative
#   Exported to: /tmp/test_campaign.csv

# Verify CSV structure
head -20 /tmp/test_campaign.csv
```

**Pass Criteria**:
- ✅ Campaign created with correct name
- ✅ CSV file generated
- ✅ CSV contains: Campaign, Ad Groups, Product Ads, Keywords, Negative Keywords
- ✅ Proper Amazon bulk format

---

### Test 5: List Operations

**Purpose**: Verify listing and filtering functionality

```bash
# List all keywords
kwbank list-keywords

# List keywords for specific brand
kwbank list-keywords --brand "CampaignTest"

# List all campaigns
kwbank list-campaigns

# List campaigns for specific brand
kwbank list-campaigns --brand "CampaignTest"
```

**Pass Criteria**:
- ✅ Lists show correct counts
- ✅ Filtering by brand works
- ✅ Output is readable and formatted

---

### Test 6: Audit Trail

**Purpose**: Verify audit logging functionality

```bash
# Perform some operations
kwbank import-keywords examples/sample_keywords.csv --brand "AuditTest" --keyword-type positive --match-type exact
kwbank detect-conflicts
kwbank stats

# View audit trail
kwbank audit-trail --count 10

# Expected Output:
# [TIMESTAMP] stats
# [TIMESTAMP] detect_conflicts
# [TIMESTAMP] import_keywords
```

**Pass Criteria**:
- ✅ All operations logged
- ✅ Timestamps are correct
- ✅ Details include relevant information
- ✅ Entries shown in reverse chronological order

---

### Test 7: Normalization

**Purpose**: Verify keyword normalization works correctly

```bash
# Create keywords with different whitespace
echo -e "Running  Shoes\nrunning shoes\n  RUNNING SHOES  " > /tmp/normalize_test.csv

# Import
kwbank import-keywords /tmp/normalize_test.csv --brand "NormalizeTest" --keyword-type positive --match-type exact

# Expected Output:
# ✓ Imported 1 keywords (2 duplicates skipped)

# Verify
kwbank list-keywords --brand "NormalizeTest"
```

**Pass Criteria**:
- ✅ Only 1 keyword stored
- ✅ 2 duplicates detected
- ✅ Stored keyword is normalized (lowercase, single spaces)

---

### Test 8: Match Types

**Purpose**: Verify different match types are preserved

```bash
# Import same keyword with different match types
echo "test keyword" > /tmp/match_test.csv

kwbank import-keywords /tmp/match_test.csv --brand "MatchTest" --keyword-type positive --match-type exact
kwbank import-keywords /tmp/match_test.csv --brand "MatchTest" --keyword-type positive --match-type phrase
kwbank import-keywords /tmp/match_test.csv --brand "MatchTest" --keyword-type positive --match-type broad

# Create campaign to verify
kwbank create-campaign --brand "MatchTest" --asin B08MATCH --output /tmp/match_campaign.csv

# Check CSV for different match types
grep "test keyword" /tmp/match_campaign.csv
```

**Pass Criteria**:
- ✅ All 3 match types stored
- ✅ CSV export shows correct match types
- ✅ No duplicates incorrectly detected

---

### Test 9: Empty Data Handling

**Purpose**: Verify graceful handling of empty data

```bash
# Clean all data
rm -f data/keyword_bank.json data/audit_trail.json

# List keywords (empty)
kwbank list-keywords
# Expected: "No keywords found."

# List campaigns (empty)
kwbank list-campaigns
# Expected: "No campaigns found."

# Stats (empty)
kwbank stats
# Expected: Total Brands: 0, Total Keywords: 0

# Detect conflicts (empty)
kwbank detect-conflicts
# Expected: "✓ No conflicts detected!"
```

**Pass Criteria**:
- ✅ No errors on empty data
- ✅ Appropriate messages shown
- ✅ No crashes

---

### Test 10: Complete Workflow

**Purpose**: End-to-end workflow test

```bash
# Run the demo script
./demo.sh

# Expected: Complete workflow runs without errors
```

**Pass Criteria**:
- ✅ All imports succeed
- ✅ Deduplication works
- ✅ Conflicts detected correctly
- ✅ Campaigns created
- ✅ CSV files generated
- ✅ Audit trail populated
- ✅ No errors or warnings (except expected conflict warning)

---

## Manual Verification

### Verify CSV Export Format

Open generated CSV in a text editor or spreadsheet:

```bash
# View a generated campaign CSV
cat data/exports/nike_exact_campaign.csv
```

**Check for**:
- ✅ "Amazon Advertising Bulk Sheet" header
- ✅ Section headers: Campaign, Ad Group, Product Ad, Keyword, Negative Keyword
- ✅ Proper column headers for each section
- ✅ All ASINs included
- ✅ All keywords included
- ✅ Proper formatting (CSV format)

### Verify Data Persistence

```bash
# Import data
kwbank import-keywords examples/sample_keywords.csv --brand "PersistTest" --keyword-type positive --match-type exact

# Exit and restart
kwbank list-keywords --brand "PersistTest"
# Should still show keywords
```

**Pass Criteria**:
- ✅ Data persists between CLI invocations
- ✅ JSON files created in data/ directory
- ✅ Data loads correctly on next use

---

## Error Cases

### Test Invalid Brand

```bash
# Try to create campaign for non-existent brand
kwbank create-campaign --brand "NonExistent" --asin B08TEST --output /tmp/error_test.csv

# Expected: Error message about no keywords found
```

### Test Invalid CSV

```bash
# Create empty file
touch /tmp/empty.csv
kwbank import-keywords /tmp/empty.csv --brand "Test"

# Expected: Imports 0 keywords gracefully
```

---

## Performance Tests

### Large Keyword Import

```bash
# Generate large keyword list
for i in {1..1000}; do
  echo "keyword $i"
done > /tmp/large_keywords.csv

# Import and time it
time kwbank import-keywords /tmp/large_keywords.csv --brand "PerfTest" --keyword-type positive --match-type exact

# Expected: Completes in < 5 seconds
```

---

## Cleanup

```bash
# Remove test data
rm -f data/keyword_bank.json data/audit_trail.json
rm -f data/exports/*.csv
rm -f /tmp/test_*.csv /tmp/match_*.csv
```
