# GunGuru Product Requirements Document (PRD)

  

**Version:** 1.2
**Date:** February 24, 2025  
**Author:** Justin H.  
**Company:** GunGuru

  

---

  

## 1. Overview
### 1.1 Purpose

GunGuru is a comprehensive platform designed to empower gun enthusiasts to customize firearms with confidence. It provides tools for compatibility checks, legal compliance, and community engagement. This PRD outlines the requirements for Phase 1, with a focus on building the frontend first, followed by backend integration.
### 1.2 Scope

- **Phase 1:** A web application with a custom firearm configurator (Builder), product catalog, legal compliance tools, and community features.

- **Technologies:**

  - **Frontend:** Next.js (v14.x), TypeScript (v5.x), TailwindCSS (v3.x), Shadcn (v0.x) for a modern, responsive UI.

  - **Backend:** Go (Golang v1.21) for high-performance APIs.

  - **Database:** PostgreSQL (v15.x) for relational data management.

  

### 1.3 Objectives

- Deliver an intuitive, accessible frontend by Day 0, using mock data where necessary.

- Ensure real-time interactivity and scalability for future backend integration.

- Provide accurate tools for compatibility and legal compliance.

- Foster community engagement through guides, builds, and forums.

  

### 1.4 Development Priority

- **Frontend First:** Build the UI/UX with temporary data solutions (e.g., mock data, local storage) to enable early testing and iteration.

- **Backend Second:** Develop APIs and database schema to replace mock data and enable full functionality.

  

---

  

## 2. Stakeholders

- **Product Owner:** [Your Name] – Defines vision and priorities.

- **Developers:** Frontend (Next.js/TypeScript), Backend (Go), Database (PostgreSQL) teams.

- **Users:** Gun enthusiasts (beginners to advanced).

- **Legal Team:** Ensures compliance with state and federal gun laws.

- **Community Managers:** Facilitate user engagement and feedback.

  

---

  

## 3. Functional Requirements

  

### 3.1 Core Features (Phase 1)

  

#### 3.1.1 Home (General Landing Page)

- **Description:** The entry point for users, providing navigation to key sections and an engaging introduction to GunGuru.

- **Requirements:**

  - Hero section with a tagline (e.g., "Design, Build, and Explore Firearms Your Way") and high-quality visuals (e.g., firearm builds).

  - Navigation links to Builder, Products, Guides, and Forums.

  - Optional: Featured builds or products section for inspiration.

- **Frontend:**

  - Built with Next.js for SSR and fast load times.

  - Use Shadcn buttons and TailwindCSS for styling.

  - Responsive grid layout for visuals and text.

  - **Temporary Solution:** Static content; featured builds can use mock data (JSON) until backend integration.

- **Backend (Later):** API for dynamic content (e.g., `/api/v1/featured`).

  

#### 3.1.2 Builder (Custom Firearm Configurator)

- **Description:** The flagship feature allowing users to design custom firearms with a flexible, interactive interface.

- **Requirements:**

  - **Base Firearm Selection:**

    - Dropdown or tiled interface for selecting models (e.g., AR-15, AK-47).

    - Loads dynamic configuration for the selected firearm.

  - **Component and Subcomponent Structure:**

    - Hierarchical, collapsible table (e.g., Lower Assembly → Trigger Assembly → Trigger).

    - Use Shadcn accordions or sidebar for navigation.

  - **Accessory Integration:**

    - Dynamically display compatible accessories (e.g., sights for Picatinny rails).

    - Real-time updates to build visualization and cost.

  - **Pre-Built Firearm Option:**

    - Option to select pre-assembled configs (e.g., Bushmaster AR-15) that auto-populate components.

  - **Gun Law Integration:**

    - Users select state (e.g., California) or federal laws.

    - Real-time compliance checks (e.g., barrel length, magazine capacity) with warnings.

- **Frontend:**

  - Next.js page (`/pages/builder.tsx`) with TypeScript.

  - Tabular layout with TailwindCSS and Shadcn accordions.

  - Real-time preview: Use SVG schematics or lightweight 3D (e.g., Three.js) for visualization.

  - **Temporary Solution:** Mock firearm configs (JSON) and local storage for saving builds.

- **Backend (Later):**

  - `/api/v1/firearms/config` to fetch configs.

  - `/api/v1/compatibility/check` for part validation.

  - `/api/v1/laws/check` for compliance.

  

#### 3.1.3 Products (Browse Pre-Built Firearms, Parts, and Accessories)

- **Description:** A catalog for browsing items with advanced filtering and vendor comparisons.

- **Requirements:**

  - **Filtering System:**

    - Left-hand panel with filters: Category, Firearm Type, Price, Brand, Compatibility, Rating, Availability.

    - Support multiple selections (e.g., multiple brands).

  - **Product Table:**

    - Columns: Name, Details (specs), Price, Rating, Add to Builder/Cart.

    - Expandable rows showing top 3 cheapest sellers (e.g., Amazon - $89.99).

- **Frontend:**

  - Dynamic page (`/pages/products/[category].tsx`) with TypeScript.

  - Shadcn dropdowns for filters, TailwindCSS grid for table.

  - **Temporary Solution:** Mock product data (JSON); static vendor prices.

- **Backend (Later):**

  - `/api/v1/products` with filter query params.

  - `/api/v1/vendors` for real-time pricing.

  

#### 3.1.4 Legal Compliance Tools

- **Description:** Embedded in Builder and accessible separately for law lookups.

- **Requirements:**

  - Searchable by state or federal level.

  - Plain-language summaries with examples.

- **Frontend:**

  - Standalone page (`/pages/laws.tsx`) and Builder-integrated modal.

  - Use Shadcn search bar and accordions for law details.

  - **Temporary Solution:** Static law data (JSON) for initial states (e.g., CA, TX).

- **Backend (Later):** `/api/v1/laws` with dynamic updates.

  

#### 3.1.5 Community Features

- **Description:** Spaces for user-generated content and discussions.

- **Requirements:**

  - **Guides:** Submission form for tutorials (title, content, images, tags).

  - **Completed Builds:** Gallery with filters (firearm type, popularity).

  - **Forums:** Categories (e.g., Build Advice) with threads and moderation.

- **Frontend:**

  - Pages: `/pages/guides.tsx`, `/pages/builds.tsx`, `/pages/forums.tsx`.

  - Shadcn forms for submissions, TailwindCSS for feeds.

  - **Temporary Solution:** Local storage or mock API for posts and comments.

- **Backend (Later):** APIs for posts, comments, and moderation.

  

#### 3.1.6 Additional Features

- **Trends:** Interactive price trend graphs (e.g., AR-15 lowers over 12 months).

  - **Frontend:** Use Chart.js for visualizations.

  - **Temporary Solution:** Static trend data.

  - **Backend (Later):** `/api/v1/trends` for historical data.

- **Gun Laws Glossary:** Searchable database of laws.

  - **Frontend:** `/pages/laws/glossary.tsx` with search and categories.

  - **Temporary Solution:** Static glossary entries.

  

#### 3.1.7 User Authentication

- **Description:** Secure login and registration.

- **Requirements:**

  - Email/password and OAuth (e.g., Google).

- **Frontend:**

  - Auth forms with Shadcn inputs.

  - **Temporary Solution:** Mock auth (e.g., local storage tokens).

- **Backend (Later):** JWT-based auth with `/api/v1/auth`.

  

---

  

## 4. Non-Functional Requirements

  

### 4.1 Performance

- **Frontend:**

  - Page load time: < 2s (desktop), < 3s (mobile).

  - Builder updates: < 500ms for config changes.

- **Backend (Later):** API response time: < 200ms.

  

### 4.2 Scalability

- Frontend designed for horizontal scaling with Next.js Vercel deployment.

- Backend microservices (Go) for future load balancing.

  

### 4.3 Security

- **Frontend:**

  - HTTPS enforced.

  - Avoid sensitive data in local storage.

- **Backend (Later):** JWT auth, rate limiting, OWASP compliance.

  

### 4.4 Usability & Accessibility

- WCAG 2.1 AA compliance: Keyboard navigation, screen reader support.

- Mobile-first design with TailwindCSS responsive utilities.

  

---

  

## 5. Technical Architecture

  

### 5.1 Frontend (Next.js, TypeScript, TailwindCSS, Shadcn)

- **Pages:**

  - `/` (Home), `/builder`, `/products/[category]`, `/laws`, `/guides`, `/builds`, `/forums`, `/trends`, `/laws/glossary`.

- **Components:**

  - Reusable Shadcn components (e.g., buttons, modals).

  - Custom components for Builder (e.g., ConfigTable, PreviewCanvas).

- **State Management:** React Context or Redux Toolkit.

- **Libraries:** Three.js (optional for 3D), Chart.js, React Hook Form.

- **Temporary Data:** Mock JSON files or local storage for configs, products, etc.

  

### 5.2 Backend (Go) – Developed Later

- **API Endpoints (Priority):**

  1. `/api/v1/firearms/config` (Builder configs).

  2. `/api/v1/products` (Product catalog).

  3. `/api/v1/laws` (Legal data).

  4. `/api/v1/community` (Posts, comments).

- **Framework:** Gin or Echo for routing.

  

### 5.3 Database (PostgreSQL) – Developed Later

- **Schema:**

  - `firearm_configs` (id, model, config_json).

  - `products` (id, name, category, specs_json).

  - `laws` (id, jurisdiction, description).

  - `posts` (id, user_id, content).

  

---

  

## 6. User Stories

  

1. **As a user,** I want to explore the Builder with mock data to design an AR-15, even before backend integration.

2. **As a shopper,** I want to filter products by price and see mock vendor comparisons.

3. **As a beginner,** I want to check static gun laws for my state in the Builder.

4. **As a developer,** I want clear API specs to integrate once the backend is ready.

  

---

  

## 7. Success Metrics

- **Frontend Launch (Day 0):**

  - 500 users exploring Builder with mock data.

  - 80% user satisfaction with UI/UX.

- **Post-Backend Integration:**

  - 1,000 registered users, 500 daily Builder sessions.

  

---

  

## 8. Risks & Mitigations

- **Risk:** Delays in backend development impacting frontend testing.

  - **Mitigation:** Use mock APIs (e.g., JSON Server) for realistic data simulation.

- **Risk:** Complex Builder logic without backend validation.

  - **Mitigation:** Implement client-side validation and prepare for server-side checks.

  

---

  

## 9. Timeline (Phase 1)

- **Month 1-2:** Frontend development (Home, Builder, Products) with mock data.

- **Month 3:** Community features and additional pages.

- **Month 4:** Backend API development (priority endpoints).

- **Month 5:** Integration and testing.

- **Month 6:** Beta launch and iteration.

  

---

  

## 10. Conclusion

This final PRD ensures GunGuru’s frontend is built first with temporary solutions, enabling early user testing and iteration. The detailed UI/UX specifications, combined with a clear backend integration plan, set the stage for a successful launch and future scalability. By prioritizing accessibility, performance, and security from the start, GunGuru will deliver a robust platform for firearm enthusiasts.