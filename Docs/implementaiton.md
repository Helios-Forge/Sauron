# GunGuru Database Schema Restructuring: Implementation Plan

## Phase 1: Preparation (1-2 weeks)

### 1. Database Backup & Environment Setup
- [ ] Create full database backup before any changes
- [ ] Set up development environment with copy of production data
- [ ] Create test environment for validation

### 2. Data Analysis & Mapping
- [ ] Analyze existing JSONB data in `firearm_models.parts` and `firearm_models.compatible_parts`
- [ ] Extract unique categories and subcategories from all records
- [ ] Map hierarchical relationships between categories
- [ ] Document edge cases and special category handling requirements

### 3. Schema Creation Scripts
- [ ] Finalize SQL scripts for new table creation
- [ ] Create validation queries to verify data integrity
- [ ] Develop rollback procedures in case of issues
- [ ] Design and create necessary indexes for performance

## Phase 2: New Schema Implementation (2-3 weeks)

### 1. Create New Tables Without Constraints
```sql
-- Create tables without foreign key constraints initially
CREATE TABLE part_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_category_id INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE firearm_model_part_categories (
    id SERIAL PRIMARY KEY,
    firearm_model_id INTEGER,
    part_category_id INTEGER,
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Populate New Tables
- [ ] Extract and insert unique categories into `part_categories`
- [ ] Update parent_category_id values for hierarchy
- [ ] Map and insert firearm_model to category relationships
- [ ] Verify data completeness using validation queries

### 3. Add Constraints and Indexes
```sql
-- Add constraints after data is loaded
ALTER TABLE part_categories 
    ADD CONSTRAINT fk_parent_category 
    FOREIGN KEY (parent_category_id) REFERENCES part_categories(id);

ALTER TABLE firearm_model_part_categories
    ADD CONSTRAINT fk_firearm_model 
    FOREIGN KEY (firearm_model_id) REFERENCES firearm_models(id),
    ADD CONSTRAINT fk_part_category
    FOREIGN KEY (part_category_id) REFERENCES part_categories(id),
    ADD CONSTRAINT unique_model_category UNIQUE (firearm_model_id, part_category_id);

-- Add indexes
CREATE INDEX idx_part_categories_parent ON part_categories (parent_category_id);
CREATE INDEX idx_firearm_model_part_categories_model ON firearm_model_part_categories (firearm_model_id);
CREATE INDEX idx_firearm_model_part_categories_category ON firearm_model_part_categories (part_category_id);
```

### 4. Modify Parts Table
```sql
-- Add new column to parts table
ALTER TABLE parts ADD COLUMN part_category_id INTEGER;

-- Update part_category_id based on existing category/subcategory values
UPDATE parts SET part_category_id = (
    SELECT pc.id 
    FROM part_categories pc 
    WHERE pc.name = parts.category 
    OR (pc.name = parts.subcategory AND EXISTS (
        SELECT 1 FROM part_categories parent 
        WHERE parent.name = parts.category AND parent.id = pc.parent_category_id
    ))
);

-- Simplify compatible_models
ALTER TABLE parts 
    ALTER COLUMN compatible_models TYPE TEXT[] USING (
        ARRAY(SELECT jsonb_array_elements(compatible_models)->>'model')::TEXT[]
    );
```

## Phase 3: API Layer Updates (2-3 weeks)

### 1. Create New API Endpoints
- [ ] Implement `GET /part-categories` endpoint with recursive hierarchy
- [ ] Update `GET /firearm-models/{id}` to use the new table structure
- [ ] Create `GET /firearm-models/{id}/categories` endpoint
- [ ] Modify `GET /parts` to support filtering by category ID

### 2. Implement Dual Support Period
- [ ] Update API handlers to support both old and new schemas simultaneously
- [ ] Add query parameter flag to opt into new schema (e.g., `?schema=v2`)
- [ ] Include deprecation notices in old schema responses

### 3. Test API Changes
- [ ] Create comprehensive test suite for new endpoints
- [ ] Verify backward compatibility for existing clients
- [ ] Conduct performance testing comparing old vs. new schema queries

## Phase 4: Frontend Updates (3-4 weeks)

### 1. TypeScript Interface Updates
- [ ] Update `ComponentItem` interface in `BuilderWorksheet.tsx`
- [ ] Create new interfaces for category hierarchy
- [ ] Update part filtering logic in `ProductCatalog.tsx`

### 2. Frontend Feature Implementation
- [ ] Update build state to use category IDs instead of strings
- [ ] Modify catalog filtering to use category IDs
- [ ] Implement hierarchical category display in UI
- [ ] Update all components that reference categories directly

### 3. Frontend Testing
- [ ] Create test cases for category filtering and selection
- [ ] Verify recursive category rendering
- [ ] Test part compatibility and filtering across all interfaces

## Phase 5: Migration & Cutover (1-2 weeks)

### 1. Final Data Verification
- [ ] Run comprehensive data validation scripts
- [ ] Fix any inconsistencies or missing relationships
- [ ] Verify all part categories are correctly mapped

### 2. Old Schema Removal
```sql
-- After confirming all is working, remove old columns
ALTER TABLE firearm_models 
    DROP COLUMN parts,
    DROP COLUMN compatible_parts;

ALTER TABLE parts
    DROP COLUMN category,
    DROP COLUMN subcategory;

-- Add not null constraint to part_category_id
ALTER TABLE parts 
    ALTER COLUMN part_category_id SET NOT NULL,
    ADD CONSTRAINT fk_part_category 
    FOREIGN KEY (part_category_id) REFERENCES part_categories(id);
```

### 3. Final Schema Validation
- [ ] Run full test suite against production-like data
- [ ] Validate all business logic continues to function
- [ ] Confirm performance meets or exceeds previous schema

## Phase 6: Monitoring & Optimization (Ongoing)

### 1. Performance Monitoring
- [ ] Implement monitoring for slow queries
- [ ] Track API response times before and after migration
- [ ] Analyze database load patterns with new schema

### 2. Optimization
- [ ] Add additional indexes based on observed query patterns
- [ ] Optimize recursive queries if performance issues arise
- [ ] Consider materialized views for complex hierarchical queries

### 3. Documentation
- [ ] Update all internal documentation to reflect new schema
- [ ] Create diagrams showing category relationships
- [ ] Document category management procedures for admin users

## Implementation Timeline

| Phase | Duration | Key Milestones |
|-------|----------|----------------|
| 1. Preparation | 1-2 weeks | Schema design finalized, Data mapping complete |
| 2. New Schema Implementation | 2-3 weeks | Tables created, Data migrated |
| 3. API Layer Updates | 2-3 weeks | New endpoints developed, Dual support implemented |
| 4. Frontend Updates | 3-4 weeks | UI components updated, Filtering logic changed |
| 5. Migration & Cutover | 1-2 weeks | Old schema removed, Final validation complete |
| 6. Monitoring & Optimization | Ongoing | Performance monitoring in place |

**Total Estimated Timeline**: 9-14 weeks

## Risk Mitigation Strategies

1. **Data Integrity**: Implement comprehensive validation scripts to verify all data is migrated correctly
2. **Downtime Management**: Perform schema updates during low-traffic periods
3. **Rollback Plan**: Maintain ability to revert to JSONB schema if critical issues arise
4. **Incremental Adoption**: Use feature flags to gradually roll out changes to users
5. **Performance Safeguards**: Benchmark queries before and after changes to verify performance

Would you like me to provide more detailed scripts for any particular phase of this implementation plan?
