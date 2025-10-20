# KWBank Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         KWBank CLI                          │
│                  (Command-Line Interface)                   │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Keyword    │   │   Campaign   │   │    Audit     │
│    Bank      │   │  Generator   │   │   Logger     │
│              │   │              │   │              │
│ - Import     │   │ - Mapping    │   │ - Track All  │
│ - Dedupe     │   │ - Naming     │   │   Actions    │
│ - Conflict   │   │ - Validation │   │ - Query      │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                  ┌──────────────────┐
                  │  Amazon Bulk     │
                  │  CSV Exporter    │
                  │                  │
                  │ - Campaign CSV   │
                  │ - Ad Groups CSV  │
                  │ - Keywords CSV   │
                  └──────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   Data Storage   │
                  │                  │
                  │ - keyword_bank   │
                  │   .json          │
                  │ - audit_trail    │
                  │   .json          │
                  └──────────────────┘
```

## Data Flow

### 1. Keyword Import Flow
```
CSV File → Parse → Normalize → Deduplicate → Store → Audit Log
```

### 2. Campaign Creation Flow
```
Brand Selection → Keyword Retrieval → ASIN Mapping → 
Ad Group Creation → Campaign Generation → Name Generation → 
CSV Export → Audit Log
```

### 3. Conflict Detection Flow
```
Keyword Bank → Group by Brand → Compare Positive/Negative → 
Report Conflicts → Audit Log
```

## Core Components

### Models (models.py)
- **Keyword**: Individual keyword with metadata
- **AdGroup**: Collection of keywords for an ASIN
- **Campaign**: Collection of ad groups
- **AuditEntry**: Log entry for tracking changes

### KeywordBank (keyword_bank.py)
- Central storage for all keywords
- Handles import, deduplication, conflict detection
- Manages campaigns

### CampaignGenerator (campaign_generator.py)
- Generates campaign names
- Generates ad group names
- Supports multiple naming strategies

### AmazonBulkExporter (amazon_exporter.py)
- Exports to Amazon Advertising bulk format
- Handles all CSV sections:
  - Campaigns
  - Ad Groups
  - Product Ads
  - Keywords
  - Negative Keywords

### AuditLogger (audit_logger.py)
- Tracks all operations
- Provides query capabilities
- Generates reports

### CLI (cli.py)
- User interface via command line
- Commands for all operations
- Colorized output

## Key Features

### 1. Multi-Brand Support
Each keyword is associated with a brand, allowing:
- Separate keyword pools per brand
- Brand-specific conflict detection
- Brand-specific campaign generation

### 2. Deduplication Strategy
Deduplication key: `(normalized_text, keyword_type, brand)`
- Same keyword can exist for different brands
- Same keyword can be both positive and negative (conflict)
- Normalization: lowercase + whitespace trimming

### 3. Conflict Detection
Identifies keywords that are both positive and negative for the same brand:
- Helps avoid wasted spend
- Prevents campaign conflicts
- Brand-specific reporting

### 4. Campaign Name Generation
Automatic generation with multiple strategies:
- Format: `{Brand}_{Strategy}_{ASINCount}ASIN_{Date}`
- Example: `Nike_EXACT_3ASIN_20251020`
- Ad Group format: `AG_{ASIN}_{KeywordCount}kw`

### 5. Amazon Bulk CSV Export
Generates properly formatted CSV files ready for upload:
- Campaign settings
- Ad group configuration
- Product ads (ASINs)
- Keywords (positive)
- Negative keywords

### 6. Audit Trail
Comprehensive logging of all operations:
- Import operations
- Campaign creation
- Conflict detection
- Timestamps and details
- Queryable history
