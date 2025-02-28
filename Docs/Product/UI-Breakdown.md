# GunGuru Frontend Specification

## Executive Summary

GunGuru is a comprehensive web platform for firearm enthusiasts to explore, compare, and customize firearms and their components. This specification document provides detailed guidance for implementing the frontend using Next.js, TypeScript, TailwindCSS, and Shadcn UI components. The platform emphasizes part compatibility, legal compliance, and a seamless user experience for firearm customization, integrating with a robust backend API defined in the provided Swagger JSON.

---

## Core Platform Architecture

### Tech Stack

- **Framework**: Next.js 14+ (with App Router)
- **Language**: TypeScript 5.0+
- **Styling**: TailwindCSS 3.0+
- **UI Components**: Shadcn UI library
- **State Management**: React Context API or Redux Toolkit
- **Authentication**: NextAuth.js
- **Deployment**: Vercel recommended

### Responsive Design Requirements

- Mobile-first approach with breakpoints at:
  - **sm**: 640px
  - **md**: 768px
  - **lg**: 1024px
  - **xl**: 1280px
  - **2xl**: 1536px
- All components must be fully responsive and accessible

---

## Feature Set

### 1. Parts Catalog

#### Purpose

Enable users to discover, compare, and select firearm parts with comprehensive information and price comparison.

#### Page Structure

- **Header**: Category title with filtering options
- **Main Content**: Interactive data table with parts
- **Sidebar**: Category navigation and filter controls

#### Data Table Implementation

- **Columns**:
  - Part image (thumbnail with lightbox on click)
  - Part name (link to detail page)
  - Manufacturer (with logo)
  - Rating (5-star system with review count)
  - Cheapest seller (logo + price)
  - Current price (with discount indicator if applicable)
  - Action button (Add to Builder)
- **Expandable Rows**:
  - Each row expands to show:
    - Concise technical specifications (3-5 key points)
    - Compatibility summary (which firearms/platforms supported)
    - Price comparison (top 3 sellers with logos, prices, and shipping info)
    - Quick-view gallery (3-5 additional images)
- **Part Details Page**:
  - **Hero Section**: Large images with gallery view
  - **Tab Navigation**:
    - **Specifications**: Complete technical details in standardized format
    - **Compatibility**: Matrix showing what models/parts this works with
    - **Price History**: Interactive chart showing price trends
    - **Reviews**: User ratings and comments with filtering
    - **Sellers**: Complete list of retailers with prices, shipping options

#### API Integration

- **GET /listings**: Retrieve all product listings for the catalog.
- **GET /listings/part/{partId}**: Fetch listings for a specific part.
- **GET /listings/seller/{sellerId}**: Retrieve listings for a specific seller.
- **GET /sellers**: Fetch all sellers for display alongside listings.

#### Implementation Notes

- Use Shadcn `DataTable` component with custom expandable row implementation
- Implement image loading optimization with Next.js Image component
- Configure lazy loading for expanded row content
- Use Shadcn `Tabs` for part details page sections

#### User Interaction Flow

1. User navigates to Products page
2. User filters by category or uses search
3. User browses table and expands rows of interest
4. User clicks through to detailed page or adds directly to Builder

---

### 2. Builder Tool

#### Purpose

Provide an intuitive interface for users to create custom firearm builds with part compatibility validation and legal compliance checks.

#### Page Structure

- **Header**: Build configuration controls
- **Main Content**: Interactive build worksheet
- **Sidebar**: Build summary and compatibility status

#### Builder Interface Components

- **Firearm Selection**:
  - Dropdown with popular models
  - Search functionality for less common models
  - Visual selector with firearm type categories
- **Build Worksheet**:
  - Hierarchical table structure with:
    - Level 1: Major assemblies (Upper, Lower, etc.)
    - Level 2: Sub-assemblies (Trigger group, Barrel assembly)
    - Level 3: Individual components
  - Each row contains:
    - Component name and description
    - Required/Optional indicator
    - Current selection (if any)
    - "Add Part" button that links to filtered catalog
    - Compatibility indicator (green/yellow/red)
- **Control Panel**:
  - **Compatibility Toggle**: Enable/disable compatibility filtering
  - **Legal Compliance Toggle**: Enable/disable state-specific legal filtering
  - **State Selector**: Dropdown for selecting user's state (triggers compliance rules)
  - **Price Summary**: Real-time calculation of build cost
  - **Save/Share**: Options to save build or generate shareable link

#### API Integration

- **GET /firearm-models**: Retrieve all firearm models for selection dropdown.
- **GET /firearm-models/{id}**: Fetch details of a specific firearm model.
- **GET /prebuilt-firearms/model/{modelId}**: Retrieve prebuilt firearms for autofill.
- **GET /compatibility-check?firearmId={id}&part1={id}&part2={id}**: Validate compatibility between two parts for a firearm model.
- **GET /compatibility-rules/part/{partId}**: Fetch compatibility rules for a specific part.
- **GET /compatibility-rules/firearm/{firearmId}/part/{partId}**: Retrieve compatibility rules for a specific firearm and part.

#### Implementation Notes

- Use Shadcn `DataTable` with custom row rendering for the hierarchical structure
- Implement context-aware filtering when redirecting to Products page
- Create a `BuildContext` using React Context API to maintain build state across pages
- Use Shadcn `Alert` components for compatibility/legality warnings
- Implement Shadcn `DropdownMenu` and `Toggle` components for controls

#### User Interaction Flow

1. User selects base firearm model
2. System populates required and optional components
3. User clicks "Add Part" for a specific component
4. System redirects to Products page with appropriate filters
5. User selects part and returns to Builder with part added
6. System validates compatibility and legal compliance
7. Process repeats until build is complete

---

### 3. Legal Compliance Service

#### Purpose

Ensure users can access accurate, current firearm regulations by state and verify their builds comply with relevant laws.

#### Page Structure

- **Header**: State selection and legal disclaimer
- **Main Content**: Categorized legal information
- **Sidebar**: Quick navigation to regulation categories

#### Legal Database Interface

- **State Selection**:
  - Interactive US map
  - Dropdown alternative for state selection
- **Regulation Categories**:
  - **Ownership Requirements**: Age, background checks, permits
  - **Prohibited Features**: Banned components or configurations
  - **Magazine Restrictions**: Capacity limits
  - **Assault Weapon Definitions**: State-specific classifications
  - **Registration Requirements**: State registry information
  - **Transport Regulations**: Rules for carrying/transporting
- **Content Display**:
  - Accordion interface for each category
  - Clear, concise summaries with reference citations
  - Visual indicators for severity/importance of regulations
  - Last updated timestamp for each regulation section

#### API Integration

- **GET /compatibility-rules**: Retrieve all compatibility rules for legal compliance validation.
- **GET /firearm-models**: Fetch firearm models to cross-reference legal restrictions.

#### Implementation Notes

- Use Shadcn `Accordion` component for collapsible sections
- Implement Shadcn `Select` for state selection
- Create a custom map component with SVG for state selection
- Use Shadcn `Alert` and `Card` components for regulation display
- Include timestamp and source attribution for legal information

#### Builder Integration

- Legal service maintains a ruleset for each state
- Builder tool queries this ruleset when compliance toggle is active
- Parts catalog applies filters based on active ruleset
- Visual indicators in Builder show compliance status of each component

---

### 4. Navigation & Layout

#### Global Navigation

- **Primary Navigation** (horizontal bar at top):
  - **Logo** (left-aligned): Links to homepage
  - **Main Sections** (left-aligned):
    - Builder
    - Products (with dropdown for categories)
    - Legal
    - Trends
    - Community (with dropdown)
  - **User Functions** (right-aligned):
    - Search bar
    - Account menu (Login/Register/Profile)
    - Saved Builds
    - Notifications
- **Mobile Navigation**:
  - Collapsible hamburger menu
  - Persistent bottom navigation for critical functions

#### Page Layouts

- **Home Page**:
  - Hero section with featured builds
  - Quick access to Builder and Products
  - Trending parts and price drops
  - Community showcase
- **Products Page**:
  - Left sidebar for category navigation
  - Main content area for product table
  - Right sidebar for active filters
- **Builder Page**:
  - Control panel at top
  - Main build worksheet
  - Compatibility sidebar (collapsible on mobile)
- **Legal Page**:
  - State selector at top
  - Accordion sections for regulations
  - Sidebar with quick links to categories
- **Trends Page**:
  - Filter controls at top
  - Interactive charts as main content
  - Legend and information sidebar

#### Implementation Notes

- Use Shadcn `NavigationMenu` for primary navigation
- Implement Shadcn `Sheet` for mobile navigation
- Create consistent layout components for each page type
- Utilize Shadcn `Breadcrumb` for navigation hierarchy
- Ensure proper state persistence between navigation events

---

### 5. Community Features

#### Purpose

The Community section enhances user engagement by providing spaces to share knowledge, showcase builds, and discuss firearm-related topics. It includes Guides, Completed Builds, and Discussion Forums, each with its own set of features and API integrations designed for seamless user interaction.

#### Components

##### Guides Section
- **Purpose**: Enable users to share and discover tutorials and build guides.
- **Components**:
  - Filterable guide listing with cards (title, author, rating, preview)
  - Guide submission form with rich text editor
  - Rating and comment system
  - Guide detail page with step-by-step instructions and images

##### Completed Builds Gallery
- **Purpose**: Showcase user-submitted firearm builds to inspire others.
- **Components**:
  - Visual gallery with filtering options (e.g., by firearm type, date)
  - Build detail page with parts list, images, and description
  - "Clone to Builder" functionality to replicate a build
  - Rating and comment system
  - Social sharing options

##### Discussion Forums
- **Purpose**: Facilitate community discussions and knowledge sharing.
- **Components**:
  - Category-based forum structure (e.g., General, Technical, Legal)
  - Thread listing with activity indicators (e.g., recent posts, views)
  - Post editor with formatting options
  - Moderation tools (e.g., report, lock thread)
  - User reputation system (e.g., post count, likes)

#### API Integration

Below are the standard API endpoints designed for each feature. These are placeholders based on common patterns for community-driven platforms, assuming eventual backend implementation. Endpoints requiring user actions (e.g., creating, updating, deleting) are marked as needing authentication.

##### Guides
- **GET /guides**
  - Retrieve a list of all guides.
  - Query parameters: `?sortBy={rating|date}&filter={category}`
- **POST /guides**
  - Submit a new guide.
  - Requires authentication.
  - Request body: `{ title, content, category, images }`
- **GET /guides/{id}**
  - View a specific guide by ID.
- **PUT /guides/{id}**
  - Update an existing guide.
  - Requires authentication and ownership (or admin rights).
  - Request body: `{ title, content, category, images }`
- **DELETE /guides/{id}**
  - Delete a guide.
  - Requires authentication and ownership (or admin rights).

##### Completed Builds
- **GET /builds**
  - Retrieve a list of all completed builds.
  - Query parameters: `?sortBy={rating|date}&filter={firearmType}`
- **POST /builds**
  - Submit a new completed build.
  - Requires authentication.
  - Request body: `{ name, description, partsList, images }`
- **GET /builds/{id}**
  - View a specific build by ID.
- **PUT /builds/{id}**
  - Update an existing build.
  - Requires authentication and ownership (or admin rights).
  - Request body: `{ name, description, partsList, images }`
- **DELETE /builds/{id}**
  - Delete a build.
  - Requires authentication and ownership (or admin rights).

##### Forums
- **GET /forums/categories**
  - Retrieve all forum categories.
- **GET /forums/threads?categoryId={id}**
  - Retrieve threads within a specific category.
  - Query parameters: `?sortBy={date|activity}`
- **GET /forums/posts?threadId={id}**
  - Retrieve posts within a specific thread.
  - Query parameters: `?page={number}&limit={number}`
- **POST /forums/threads**
  - Submit a new thread.
  - Requires authentication.
  - Request body: `{ categoryId, title, initialPost }`
- **POST /forums/posts**
  - Submit a new post in a thread.
  - Requires authentication.
  - Request body: `{ threadId, content }`
- **PUT /forums/posts/{id}**
  - Update an existing post.
  - Requires authentication and ownership.
  - Request body: `{ content }`
- **DELETE /forums/threads/{id}**
  - Delete a thread.
  - Requires authentication and ownership (or admin rights).
- **DELETE /forums/posts/{id}**
  - Delete a post.
  - Requires authentication and ownership (or admin rights).

#### Implementation Notes
- **UI Components**:
  - Use Shadcn `Card` components for displaying guides and builds in listings.
  - Implement Shadcn `Form` with a rich text editor (e.g., integrated with a library like TinyMCE) for submissions.
  - Utilize Shadcn `Tabs` to separate categories or views within each section.
- **Frontend Handling**:
  - Implement optimistic UI updates (e.g., show new post immediately, revert on failure).
  - Use React Query for data fetching and caching to handle API calls efficiently.
  - Create mock responses for these endpoints until backend implementation is complete.
- **Authentication**:
  - Protect POST, PUT, and DELETE endpoints with JWT authentication via NextAuth.js.
  - Display appropriate UI feedback (e.g., "Login required") for unauthorized users.
- **Layouts**:
  - Design dedicated layouts for each subsection (Guides, Builds, Forums) with consistent navigation.

---

### 6. Trends & Analytics

#### Purpose

Provide users with historical price data, popularity trends, and market insights for informed purchasing decisions.

#### Components

- **Price History Charts**:
  - Interactive line charts for individual parts
  - Multi-part comparison capability
  - Timeframe selection (1w, 1m, 3m, 1y, all)
  - Annotation for significant events/sales
- **Market Trends**:
  - Popular parts by category
  - Rising/falling price indicators
  - Stock availability tracking
  - New product releases
- **Build Analytics**:
  - Average cost by build type
  - Most popular component combinations
  - Compatibility success rates
  - Community rating correlations

#### API Integration

- **GET /listings**: Retrieve price and availability data for trends.
- **GET /listings/prebuilt/{prebuiltId}**: Fetch listings for prebuilt firearms.
- **GET /sellers**: Retrieve seller-specific data for market insights.

#### Implementation Notes

- Use Shadcn `Chart` components with customization
- Implement date range selectors with Shadcn `DatePicker`
- Create responsive visualization components
- Ensure proper data aggregation and caching

---

### 7. API Integration

#### API Requirements

- RESTful API endpoints for all data operations
- JWT authentication for secure requests (supports BasicAuth as per Swagger)
- Rate limiting and caching strategies

#### Key Endpoints

##### Compatibility Rules
- **GET /compatibility-rules**: Retrieve all compatibility rules.
- **POST /compatibility-rules**: (Admin) Create a new compatibility rule.
- **GET /compatibility-rules/{id}**: Fetch a specific compatibility rule.
- **PUT /compatibility-rules/{id}**: (Admin) Update a compatibility rule.
- **DELETE /compatibility-rules/{id}**: (Admin) Delete a compatibility rule.
- **GET /compatibility-rules/part/{partId}**: Get rules for a specific part.
- **GET /compatibility-rules/firearm/{firearmId}/part/{partId}**: Get rules for a firearm and part.
- **GET /compatibility-check?firearmId={id}&part1={id}&part2={id}**: Check compatibility between parts.

##### Firearm Models
- **GET /firearm-models**: Retrieve all firearm models.
- **POST /firearm-models**: (Admin) Create a new firearm model.
- **GET /firearm-models/{id}**: Fetch a specific firearm model.
- **PUT /firearm-models/{id}**: (Admin) Update a firearm model.
- **DELETE /firearm-models/{id}**: (Admin) Delete a firearm model.

##### Product Listings
- **GET /listings**: Retrieve all product listings.
- **POST /listings**: (Admin) Create a new product listing.
- **GET /listings/{id}**: Fetch a specific product listing.
- **PUT /listings/{id}**: (Admin) Update a product listing.
- **DELETE /listings/{id}**: (Admin) Delete a product listing.
- **PATCH /listings/{id}/availability**: (Admin) Update listing availability and price.
- **GET /listings/part/{partId}**: Get listings for a specific part.
- **GET /listings/prebuilt/{prebuiltId}**: Get listings for a prebuilt firearm.
- **GET /listings/seller/{sellerId}**: Get listings for a specific seller.

##### Prebuilt Firearms
- **GET /prebuilt-firearms**: Retrieve all prebuilt firearms.
- **POST /prebuilt-firearms**: (Admin) Create a new prebuilt firearm.
- **GET /prebuilt-firearms/{id}**: Fetch a specific prebuilt firearm.
- **PUT /prebuilt-firearms/{id}**: (Admin) Update a prebuilt firearm.
- **DELETE /prebuilt-firearms/{id}**: (Admin) Delete a prebuilt firearm.
- **GET /prebuilt-firearms/model/{modelId}**: Get prebuilt firearms for a model.

##### Sellers
- **GET /sellers**: Retrieve all sellers.
- **POST /sellers**: (Admin) Create a new seller.
- **GET /sellers/{id}**: Fetch a specific seller.
- **PUT /sellers/{id}**: (Admin) Update a seller.
- **DELETE /sellers/{id}**: (Admin) Delete a seller.
- **PATCH /sellers/{id}/status**: (Admin) Update seller status.

##### User Suggestions
- **GET /user-suggestions**: Retrieve all user suggestions.
- **POST /user-suggestions**: Allow users to submit suggestions.
- **GET /user-suggestions/{id}**: Fetch a specific suggestion.
- **PUT /user-suggestions/{id}**: (Admin) Update a suggestion.
- **DELETE /user-suggestions/{id}**: (Admin) Delete a suggestion.
- **PATCH /user-suggestions/{id}/status**: (Admin) Update suggestion status.
- **GET /user-suggestions/status/{status}**: Get suggestions by status.

#### Implementation Notes

- Create typed API client with TypeScript
- Implement React Query for data fetching and caching
- Setup appropriate error handling and loading states
- Configure server-side rendering for critical pages
- Define retry and fallback strategies

---

## UI Component Library

### Shadcn Implementation

- Use Shadcn UI library for consistent component styling
- Extend components as needed with custom variants
- Maintain accessibility compliance (WCAG 2.1 AA)

### Key Components

- **Data Display**:
  - `DataTable`: For parts catalog and builder worksheet
  - `Accordion`: For legal information and specification details
  - `Tabs`: For organizing detailed content
  - `Card`: For community content and summaries
- **User Input**:
  - `Form`: For user submissions and filtering
  - `Select` and `DropdownMenu`: For selection interfaces
  - `Toggle` and `Switch`: For feature enablement
  - `Slider`: For range-based filtering
- **Feedback**:
  - `Alert`: For compatibility and legal warnings
  - `Toast`: For system notifications
  - `Dialog`: For confirmations and important notices
  - `Progress`: For loading operations
- **Navigation**:
  - `NavigationMenu`: For main navigation
  - `Breadcrumb`: For page hierarchy
  - `Pagination`: For multi-page content

### Theming

- Implement dark/light mode toggle
- Create consistent color palette with primary, secondary, and accent colors
- Define typography scale with appropriate hierarchy
- Ensure proper spacing system with TailwindCSS utilities

---

## Performance & Technical Requirements

### Performance Targets

- Initial page load: < 2 seconds
- Time to Interactive: < 3 seconds
- First Input Delay: < 100ms
- Layout Stability: CLS < 0.1
- Lighthouse Performance Score: > 90

### Technical Implementation

- **Code Splitting**: Implement route-based and component-based splitting
- **Image Optimization**: Use Next.js Image component with appropriate sizing
- **Server Components**: Utilize Next.js Server Components for data-heavy pages
- **Client Hydration**: Optimize hydration strategies for interactive components
- **Caching Strategy**: Implement appropriate SWR policies

### SEO Optimization

- Implement dynamic metadata for all pages
- Create XML sitemap generation
- Configure structured data (JSON-LD) for products and guides
- Ensure proper canonical URL handling

---

## Accessibility Requirements

- Comply with WCAG 2.1 AA standards
- Implement proper focus management
- Ensure keyboard navigation for all interactions
- Provide appropriate ARIA attributes and roles
- Support screen readers with semantic HTML

---

## Implementation Priorities

### Phase 1: Core Functionality

1. Parts Catalog (basic functionality)
2. Builder Interface (core worksheet)
3. Basic Navigation
4. User Authentication

### Phase 2: Enhanced Features

1. Legal Compliance System
2. Compatibility Checking
3. Enhanced Parts Catalog (with price comparison)
4. User Profiles and Saved Builds

### Phase 3: Community and Analytics

1. Trends and Price History
2. Guides and Tutorial System
3. Completed Builds Gallery
4. Discussion Forums