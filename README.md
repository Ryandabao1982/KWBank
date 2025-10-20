# KWBank - Keyword Bank for Amazon PPC

**Keyword Bank** centralizes keyword operations — import, deduplication, mapping, and campaign generation — into one intuitive tool.  
It helps brands scale Amazon PPC campaigns without duplication, confusion, or wasted spend.

## Core Features

✅ **Multi-brand keyword storage** - Store and manage keywords for multiple brands in one centralized location  
✅ **Automated deduplication and normalization** - Automatically normalize and deduplicate keywords on import  
✅ **Advanced fuzzy duplicate detection** - Find similar keywords using Jaro-Winkler similarity  
✅ **Intent detection and bid suggestions** - Auto-classify keywords and suggest optimal bids  
✅ **Pattern-based campaign naming** - Generate consistent names using customizable templates  
✅ **Brand and product management** - Track brands, products, and ASINs with detailed metadata  
✅ **Conflict detection** - Detect overlaps between positive and negative keywords  
✅ **ASIN → Ad Group → Campaign mapping** - Map ASINs to ad groups and generate complete campaigns  
✅ **Export-ready Amazon bulk CSVs** - Export campaigns in Amazon Advertising bulk upload format  
✅ **Audit trail** - Track all operations with detailed audit logging

## Architecture

KWBank now provides **two interfaces** for managing your keyword data:

### 1. Python CLI (Original)
Command-line interface for power users with JSON file storage.
- **Storage**: JSON files in `/data` directory
- **Best for**: Local usage, scripting, automation
- **See**: [CLI Documentation](#usage-guide) below

### 2. REST API Backend (New)
Enterprise-grade backend with PostgreSQL database and REST API.
- **Stack**: NestJS + TypeORM + PostgreSQL + Redis
- **Storage**: PostgreSQL database with proper relationships
- **API**: RESTful endpoints at `http://localhost:3001/api`
- **Best for**: Web applications, multi-user environments, production deployments
- **See**: [Backend Quick Start](backend/QUICKSTART.md) | [Backend Documentation](backend/README.md)

Both interfaces share the same data models and can be used independently or together.

## What's New in Enhanced Version

🎯 **Multi-Brand Management**: Define brands with prefixes, default budgets, and account IDs  
🎯 **Smart Intent Detection**: Automatically classify keywords as Awareness, Consideration, or Conversion  
🎯 **Fuzzy Deduplication**: Detect similar keywords like "running shoes" vs "runing shoes"  
🎯 **Pattern-Based Naming**: Use tokens like `{BrandPrefix}_{ASIN}_{Goal}_{Date:yyyyMMdd}`  
🎯 **Enhanced Normalization**: Remove diacritics, punctuation, and handle special characters  
🎯 **Suggested Bids**: Auto-calculate bids based on keyword intent (Conversion = 1.5x base)  
🎯 **Product/ASIN Tracking**: Associate ASINs with brands and track metadata  
🎯 **Keyword-ASIN Mappings**: Plan campaigns with explicit keyword-to-product mappings

📖 **See [ENHANCED_FEATURES.md](ENHANCED_FEATURES.md) for detailed documentation**

## Installation

### Python CLI

#### Prerequisites
- Python 3.8 or higher
- pip package manager

#### Install from source

```bash
# Clone the repository
git clone https://github.com/Ryandabao1982/KWBank.git
cd KWBank

# Install dependencies
pip install -r requirements.txt

# Install the package
pip install -e .
```

### Backend API (Optional)

#### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (for PostgreSQL and Redis)

#### Quick Setup

```bash
cd backend

# Start PostgreSQL and Redis
docker-compose up -d

# Install dependencies
npm install

# Start the development server
npm run start:dev
```

The API will be available at `http://localhost:3001/api`

**📖 For detailed backend setup and usage, see [Backend Quick Start Guide](backend/QUICKSTART.md)**

## Quick Start

### Basic Usage (Original)

```bash
# Import keywords
kwbank import-keywords keywords.csv --brand "Nike" --keyword-type positive --match-type exact

# Detect conflicts
kwbank detect-conflicts

# Create campaign
kwbank create-campaign --brand "Nike" --asin B08XYZ123 --output campaign.csv
```

### Enhanced Usage (New)

```bash
# Setup brand
kwbank add-brand --name "Nike" --prefix "NIKE" --budget 50.0 --bid 1.25

# Add product
kwbank add-product --brand "Nike" --asin "B07X9C8N6D" --name "Nike Air Max 270"

# Enhanced import with intent detection
kwbank import-keywords keywords.csv \
  --brand "Nike" \
  --keyword-type positive \
  --match-type exact \
  --enhanced \
  --auto-detect-intent

# Find fuzzy duplicates
kwbank find-fuzzy-duplicates --brand "Nike"

# Create naming rule
kwbank add-naming-rule \
  --name "standard" \
  --pattern "{BrandPrefix}_{ASIN}_{Goal}_{MatchType}_{Date:yyyyMMdd}"

# Test pattern
kwbank test-naming-pattern "{BrandPrefix}_{ASIN}_{Goal}_{MatchType}_{Date:yyyyMMdd}"

# Create mapping
kwbank add-mapping --asin "B07X9C8N6D" --keyword "buy nike shoes" --bid 1.75
```

### Run the Enhanced Demo

```bash
# See all features in action
./demo_enhanced.sh
```

## Usage Guide

### Core Commands

#### Brand Management (New)
```bash
# Add a brand
kwbank add-brand --name "Nike" --prefix "NIKE" --budget 50.0 --bid 1.25

# List brands
kwbank list-brands
```

#### Product Management (New)
```bash
# Add a product/ASIN
kwbank add-product --brand "Nike" --asin "B07X9C8N6D" --name "Nike Air Max 270"

# List products
kwbank list-products [--brand "Nike"]
```

#### Naming Rules (New)
```bash
# Add a naming rule with pattern tokens
kwbank add-naming-rule --name "standard" \
  --pattern "{BrandPrefix}_{ASIN}_{Goal}_{MatchType}_{Date:yyyyMMdd}"

# Test a pattern
kwbank test-naming-pattern "{BrandPrefix}_{Goal}_{Date:yyyyMMdd}"

# List naming rules
kwbank list-naming-rules
```

#### Import Keywords (Enhanced)
```bash
# Basic import (original)
kwbank import-keywords <csv_file> --brand <brand_name> [options]

# Enhanced import with intent detection
kwbank import-keywords keywords.csv \
  --brand "Nike" \
  --keyword-type positive \
  --match-type exact \
  --enhanced \
  --auto-detect-intent

Options:
  --brand TEXT              Brand name for the keywords (required)
  --keyword-type [positive|negative]  Type of keywords (default: positive)
  --match-type [exact|phrase|broad]   Match type (default: exact)
  --enhanced/--basic        Use enhanced normalization (default: basic)
  --auto-detect-intent/--no-auto-detect-intent  Auto-detect intent (default: yes)
```

#### Duplicate Detection (New)
```bash
# Find exact duplicates
kwbank find-exact-duplicates [--brand <brand>]

# Find fuzzy duplicates (similar keywords)
kwbank find-fuzzy-duplicates [--brand <brand>] [--threshold 0.92]

# Find variant duplicates (same stem)
kwbank find-variant-duplicates [--brand <brand>]

# Detect positive/negative conflicts
kwbank detect-conflicts
```

#### Mapping Management (New)
```bash
# Create keyword-to-ASIN mapping
kwbank add-mapping --asin "B07X9C8N6D" --keyword "buy nike shoes" --bid 1.75

# List mappings
kwbank list-mappings [--asin <asin>] [--keyword <keyword>]
```

#### List Keywords
```bash
kwbank list-keywords [--brand <brand_name>]
```

#### Detect Conflicts
```bash
kwbank detect-conflicts
```
Finds keywords that exist as both positive and negative for the same brand.

#### Create Campaign
```bash
kwbank create-campaign --brand <brand_name> --asin <asin> [options]

Options:
  --brand TEXT              Brand name (required)
  --asin TEXT               ASIN to include (can specify multiple times)
  --strategy [auto|manual|exact|phrase|broad]  Campaign strategy (default: manual)
  --output TEXT             Output CSV file path (default: data/exports/campaign.csv)
  --budget FLOAT            Daily budget (default: 10.0)
  --bid FLOAT               Default bid (default: 0.75)
```

#### List Campaigns
```bash
kwbank list-campaigns [--brand <brand_name>]
```

#### View Audit Trail
```bash
kwbank audit-trail [--count <number>]
```

#### View Statistics
```bash
kwbank stats
```

## Data Structure

### Directory Layout
```
KWBank/
├── data/
│   ├── keyword_bank.json      # Main keyword storage
│   ├── audit_trail.json       # Audit log
│   ├── exports/               # Exported CSV files
│   └── backups/               # Backup files
├── src/
│   └── kwbank/
│       ├── __init__.py
│       ├── models.py          # Data models
│       ├── keyword_bank.py    # Core keyword management
│       ├── campaign_generator.py  # Campaign name generation
│       ├── amazon_exporter.py # CSV export functionality
│       ├── audit_logger.py    # Audit trail logging
│       └── cli.py             # Command-line interface
├── requirements.txt
├── setup.py
└── README.md
```

### Amazon Bulk CSV Format

The exported CSV files follow Amazon Advertising bulk upload format with sections for:
- Campaigns
- Ad Groups
- Product Ads (ASINs)
- Keywords (positive)
- Negative Keywords

You can upload these files directly to Amazon Advertising.

## Examples

### Complete Workflow Example

```bash
# 1. Import positive keywords for Brand A
kwbank import-keywords brand_a_keywords.csv \
  --brand "Brand A" \
  --keyword-type positive \
  --match-type exact

# 2. Import negative keywords
kwbank import-keywords negative_keywords.csv \
  --brand "Brand A" \
  --keyword-type negative \
  --match-type phrase

# 3. Check for conflicts
kwbank detect-conflicts

# 4. View current keywords
kwbank list-keywords --brand "Brand A"

# 5. Create a campaign
kwbank create-campaign \
  --brand "Brand A" \
  --asin B08XYZ123 \
  --asin B08ABC456 \
  --asin B08DEF789 \
  --strategy exact \
  --budget 50.0 \
  --bid 1.25 \
  --output data/exports/brand_a_exact_campaign.csv

# 6. View statistics
kwbank stats

# 7. Check audit trail
kwbank audit-trail
```

### Multi-Brand Management

```bash
# Import keywords for multiple brands
kwbank import-keywords nike_keywords.csv --brand "Nike"
kwbank import-keywords adidas_keywords.csv --brand "Adidas"
kwbank import-keywords puma_keywords.csv --brand "Puma"

# View all brands
kwbank stats

# Create brand-specific campaigns
kwbank create-campaign --brand "Nike" --asin B08NIKE01 --output nike_campaign.csv
kwbank create-campaign --brand "Adidas" --asin B08ADIDAS01 --output adidas_campaign.csv
```

## Features in Detail

### 1. Automated Deduplication
- Keywords are normalized (lowercased, whitespace trimmed) on import
- Duplicate keywords are automatically detected and skipped
- Import statistics show how many duplicates were found

### 2. Conflict Detection
- Identifies keywords that exist as both positive and negative
- Groups conflicts by brand
- Shows all variations of conflicting keywords

### 3. Campaign Name Generation
- Generates consistent, descriptive names
- Format: `{Brand}_{Strategy}_{ASINCount}ASIN_{Date}`
- Example: `Nike_EXACT_3ASIN_20251020`

### 4. Audit Trail
- Logs all operations: imports, campaigns, exports
- Includes timestamp, action, details, and user
- Queryable by date range or action type

### 5. Amazon Bulk CSV Export
- Creates properly formatted bulk upload files
- Includes all required sections and columns
- Ready for direct upload to Amazon Advertising

## Backend REST API

The backend provides a comprehensive REST API for programmatic access to all KWBank features.

### Base URL
```
http://localhost:3001/api
```

### Quick Examples

```bash
# Create a brand
curl -X POST http://localhost:3001/api/brands \
  -H "Content-Type: application/json" \
  -d '{"brand_id":"nike","name":"Nike","prefix":"NIKE","default_budget":50.0,"default_bid":1.25}'

# List all brands
curl http://localhost:3001/api/brands

# Add keywords in batch
curl -X POST http://localhost:3001/api/keywords/batch \
  -H "Content-Type: application/json" \
  -d '[{"text":"nike shoes","brand_id":"nike","match_type":"exact","keyword_type":"positive"}]'

# Get keyword statistics
curl http://localhost:3001/api/keywords/stats?brand_id=nike

# Find duplicates
curl http://localhost:3001/api/keywords/duplicates?brand_id=nike

# Detect conflicts
curl http://localhost:3001/api/keywords/conflicts?brand_id=nike
```

### Available Endpoints

**Brands**: `/api/brands` - Full CRUD operations  
**Products**: `/api/products` - ASIN management  
**Keywords**: `/api/keywords` - Keyword management with filtering, stats, duplicates, conflicts  
**Mappings**: `/api/mappings` - Keyword-to-ASIN mappings

**📖 Complete API documentation**: [Backend README](backend/README.md) | [Quick Start Guide](backend/QUICKSTART.md)

## Development

### Running Tests
```bash
# Install development dependencies
pip install pytest pytest-cov

# Run tests
pytest

# Run with coverage
pytest --cov=kwbank
```

### Project Structure
```
KWBank/
├── backend/                # NestJS REST API Backend
│   ├── src/
│   │   ├── brands/        # Brand management module
│   │   ├── products/      # Product/ASIN module
│   │   ├── keywords/      # Keyword management module
│   │   ├── mappings/      # Mapping module
│   │   ├── entities/      # TypeORM database entities
│   │   └── config/        # Configuration
│   ├── docker-compose.yml # PostgreSQL + Redis setup
│   ├── QUICKSTART.md      # Backend quick start guide
│   └── README.md          # Backend documentation
├── src/
│   └── kwbank/            # Python CLI
│       ├── models.py      # Data models and types
│       ├── keyword_bank.py # Core business logic
│       ├── campaign_generator.py # Campaign naming
│       ├── amazon_exporter.py # CSV export
│       ├── audit_logger.py # Audit trail
│       ├── text_utils.py  # Text processing utilities
│       └── cli.py         # Command-line interface
├── frontend/              # Next.js Web UI
├── data/                  # JSON file storage (CLI)
├── requirements.txt       # Python dependencies
└── README.md              # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/Ryandabao1982/KWBank).