# KWBank Frontend

Modern web UI for the Keyword Bank application built with Next.js, React, TypeScript, and Tailwind CSS.

## Design Philosophy

Fast, fluid, and spreadsheet-friendly UI inspired by Notion, Airtable, and Figma.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production

```bash
npm run build
npm start
```

## Features Implemented

### ✅ Layout Components
- **Sidebar**: Navigation menu with Dashboard, Bank, Imports, Mappings, Campaigns, Reports, Conflicts, Settings
- **TopBar**: Brand switcher, breadcrumbs, search, dark mode toggle, user avatar
- **Responsive Layout**: Fluid design that adapts to different screen sizes

### ✅ Key Screens
1. **Dashboard**: Overview with metrics, recent imports, recent campaigns, and quick actions
2. **Keyword Bank**: Interactive grid view with inline editing and right drawer for details
3. **Keyword Intake/Import**: Multi-step wizard (Upload → Preview → Complete)

### ✅ Design System
- **Primary Color**: Indigo
- **Secondary Color**: Slate
- **Semantic Colors**: Emerald (success), Amber (warning), Red (error)
- **Typography**: System fonts with sans-serif fallback

### ✅ Interaction Design
- Inline editing capabilities
- Search functionality
- Hover states and transitions
- Button variants (primary, secondary, outline, ghost)
- Status badges with color coding
- Accessible form controls

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard page
│   ├── bank/              # Keyword Bank page
│   ├── imports/           # Import wizard page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI primitives (Button, etc.)
│   ├── sidebar.tsx       # Navigation sidebar
│   └── topbar.tsx        # Top navigation bar
├── lib/                  # Utility functions
│   └── utils.ts          # cn() utility for class merging
└── public/              # Static assets
```

## Future Enhancements

- [ ] Mapping Canvas (drag-drop ASINs → Ad Groups → Campaigns)
- [ ] Naming Rule Editor (pattern field with live preview)
- [ ] Campaign Planner (list + diff view with exports)
- [ ] Conflict Center (duplicates/variants/negatives tabs)
- [ ] Audit Timeline (chronological edits with filters)
- [ ] Reporting Dashboard (charts and metrics)
- [ ] Dark mode implementation
- [ ] Keyboard shortcuts (⌘+K search, ⌘+E edit, etc.)
- [ ] Real-time collaboration features
- [ ] Backend API integration

## Accessibility

- Semantic HTML
- ARIA roles and labels
- Keyboard navigation support
- Focus management
- Color contrast ratios (WCAG AA compliance target)

## License

MIT
