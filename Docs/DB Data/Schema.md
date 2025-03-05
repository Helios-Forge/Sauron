CREATE SCHEMA IF NOT EXISTS "public";

CREATE SEQUENCE "public".firearm_models_id_seq START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".manufacturers_id_seq START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".part_seller_links_id_seq START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".parts_id_seq START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".prebuilt_firearms_id_seq START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".prebuilt_seller_links_id_seq START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".product_listings_id_seq START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".sellers_id_seq START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".user_suggestions_id_seq START WITH 1 INCREMENT BY 1;

CREATE  TABLE "public".manufacturers ( 
	id                   bigserial  NOT NULL  ,
	name                 varchar(255)  NOT NULL  ,
	description          text    ,
	contact_info         jsonb    ,
	country              varchar(100)    ,
	founded_year         integer    ,
	logo_url             varchar(255)    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	CONSTRAINT manufacturers_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "public".parts ( 
	id                   bigserial  NOT NULL  ,
	name                 varchar(255)  NOT NULL  ,
	description          text    ,
	manufacturer_id      bigint    ,
	category             varchar(100)    ,
	subcategory          varchar(100)    ,
	is_prebuilt          boolean DEFAULT false   ,
	sub_components       jsonb    ,
	compatible_models    jsonb    ,
	requires             jsonb    ,
	specifications       jsonb    ,
	images               jsonb    ,
	price                numeric(10,2)    ,
	availability         varchar(50)    ,
	weight               numeric(6,2)    ,
	dimensions           varchar(50)    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	CONSTRAINT parts_pkey PRIMARY KEY ( id )
 );

CREATE INDEX idx_parts_manufacturer_id ON "public".parts USING  btree ( manufacturer_id );

CREATE  TABLE "public".sellers ( 
	id                   bigserial  NOT NULL  ,
	name                 varchar(255)  NOT NULL  ,
	description          text    ,
	website_url          varchar(255)    ,
	logo_url             varchar(255)    ,
	is_affiliate         boolean DEFAULT false   ,
	affiliate_link_template varchar(255)    ,
	contact_info         jsonb    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	CONSTRAINT sellers_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "public".user_suggestions ( 
	id                   bigserial  NOT NULL  ,
	model_name           varchar(255)    ,
	suggested_parts      jsonb    ,
	description          text    ,
	status               varchar DEFAULT 'pending'::character varying   ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	CONSTRAINT user_suggestions_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "public".firearm_models ( 
	id                   bigserial  NOT NULL  ,
	name                 varchar(255)  NOT NULL  ,
	description          text    ,
	manufacturer_id      bigint    ,
	category             varchar(100)    ,
	subcategory          varchar(100)    ,
	variant              varchar(50)    ,
	specifications       jsonb    ,
	required_parts       jsonb  NOT NULL  ,
	compatible_parts     jsonb    ,
	images               jsonb    ,
	price_range          varchar(50)    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	CONSTRAINT firearm_models_pkey PRIMARY KEY ( id )
 );

CREATE INDEX idx_firearm_models_manufacturer_id ON "public".firearm_models USING  btree ( manufacturer_id );

CREATE  TABLE "public".part_seller_links ( 
	id                   bigserial  NOT NULL  ,
	part_id              bigint    ,
	seller_id            bigint    ,
	price                numeric(10,2)    ,
	availability         varchar(50)    ,
	sku                  varchar(100)    ,
	direct_link          varchar(255)    ,
	affiliate_link       varchar(255)    ,
	last_updated         timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	CONSTRAINT part_seller_links_pkey PRIMARY KEY ( id )
 );

CREATE UNIQUE INDEX part_seller ON "public".part_seller_links ( part_id, seller_id );

CREATE INDEX idx_part_seller_links_part_id ON "public".part_seller_links USING  btree ( part_id );

CREATE INDEX idx_part_seller_links_seller_id ON "public".part_seller_links USING  btree ( seller_id );

CREATE  TABLE "public".prebuilt_firearms ( 
	id                   bigserial  NOT NULL  ,
	firearm_model_id     bigint    ,
	name                 varchar(255)  NOT NULL  ,
	description          text    ,
	components           jsonb  NOT NULL  ,
	price                numeric(10,2)    ,
	images               jsonb    ,
	availability         varchar(50)    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	CONSTRAINT prebuilt_firearms_pkey PRIMARY KEY ( id )
 );

CREATE INDEX idx_prebuilt_firearms_firearm_model_id ON "public".prebuilt_firearms USING  btree ( firearm_model_id );

CREATE  TABLE "public".prebuilt_seller_links ( 
	id                   bigserial  NOT NULL  ,
	prebuilt_id          bigint    ,
	seller_id            bigint    ,
	price                numeric(10,2)    ,
	availability         varchar(50)    ,
	sku                  varchar(100)    ,
	direct_link          varchar(255)    ,
	affiliate_link       varchar(255)    ,
	last_updated         timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	CONSTRAINT prebuilt_seller_links_pkey PRIMARY KEY ( id )
 );

CREATE INDEX idx_prebuilt_seller_links_seller_id ON "public".prebuilt_seller_links USING  btree ( seller_id );

CREATE UNIQUE INDEX prebuilt_seller ON "public".prebuilt_seller_links ( prebuilt_id, seller_id );

CREATE INDEX idx_prebuilt_seller_links_prebuilt_id ON "public".prebuilt_seller_links USING  btree ( prebuilt_id );

CREATE  TABLE "public".product_listings ( 
	id                   bigserial  NOT NULL  ,
	seller_id            bigint  NOT NULL  ,
	part_id              bigint    ,
	prebuilt_id          bigint    ,
	url                  varchar(500)  NOT NULL  ,
	sku                  varchar(100)    ,
	price                numeric  NOT NULL  ,
	currency             varchar DEFAULT 'USD'::character varying   ,
	availability         varchar DEFAULT 'in_stock'::character varying   ,
	shipping_info        jsonb    ,
	last_checked         timestamptz  NOT NULL  ,
	additional_info      jsonb    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	CONSTRAINT product_listings_pkey PRIMARY KEY ( id )
 );

ALTER TABLE "public".firearm_models ADD CONSTRAINT fk_firearm_models_manufacturer FOREIGN KEY ( manufacturer_id ) REFERENCES "public".manufacturers( id );

ALTER TABLE "public".part_seller_links ADD CONSTRAINT fk_part_seller_links_part FOREIGN KEY ( part_id ) REFERENCES "public".parts( id );

ALTER TABLE "public".part_seller_links ADD CONSTRAINT fk_part_seller_links_seller FOREIGN KEY ( seller_id ) REFERENCES "public".sellers( id );

ALTER TABLE "public".parts ADD CONSTRAINT fk_parts_manufacturer FOREIGN KEY ( manufacturer_id ) REFERENCES "public".manufacturers( id );

ALTER TABLE "public".prebuilt_firearms ADD CONSTRAINT fk_prebuilt_firearms_firearm_model FOREIGN KEY ( firearm_model_id ) REFERENCES "public".firearm_models( id );

ALTER TABLE "public".prebuilt_seller_links ADD CONSTRAINT fk_prebuilt_seller_links_prebuilt FOREIGN KEY ( prebuilt_id ) REFERENCES "public".prebuilt_firearms( id );

ALTER TABLE "public".prebuilt_seller_links ADD CONSTRAINT fk_prebuilt_seller_links_seller FOREIGN KEY ( seller_id ) REFERENCES "public".sellers( id );

ALTER TABLE "public".product_listings ADD CONSTRAINT fk_product_listings_seller FOREIGN KEY ( seller_id ) REFERENCES "public".sellers( id );

ALTER TABLE "public".product_listings ADD CONSTRAINT fk_product_listings_part FOREIGN KEY ( part_id ) REFERENCES "public".parts( id );

ALTER TABLE "public".product_listings ADD CONSTRAINT fk_product_listings_prebuilt_firearm FOREIGN KEY ( prebuilt_id ) REFERENCES "public".prebuilt_firearms( id );
