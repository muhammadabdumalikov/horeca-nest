create table users
(
    id         varchar(24) not null primary key,
    phone      varchar(12) not null,
    otp        varchar(5)  null,
    first_name varchar(24) null,
    last_name  varchar(24) null,
    role       smallint    not null     default 3,
    super_user bool        not null     default false,
    person_type smallint       not null     default 1,
    address    text        null,
    legal_name varchar(256) null,
    additional_name varchar(256) null,
    is_block   bool        not null     default false,
    auth_status bool       not null     default false, 
		login VARCHAR(32),
		password VARCHAR(64),
    is_deleted bool        not null     default false,
    created_at timestamp with time zone default now()
);

create table categories(
	id varchar(24) not null primary key,
	name_uz character varying(128) not null,
	name_ru character varying(128) not null,
	is_deleted boolean default false,
	created_at timestamptz default current_timestamp,
	updated_at timestamptz
);
insert into categories(id, name_uz, name_ru) values
('65ba0eb423ca23f59460000a', 'konserva', 'консервированные'),
('65ba0ecadae7b94e789ac6c2', 'konservali gazlangan ichimlik', 'консервированная газировка'),
('65ba0edc50ad63db18138427', 'kungaboqar yogi', 'подсолнечное масло'),
('65ba0eea7b91602b66a652c8', 'zaytun yogi', 'оливковое масло');

create table products(
    id         varchar(24) not null primary key,
	company_id varchar(24) references companies(id) not null,
	category_id varchar(24) references categories(id) not null,
	measure smallint default 1,
	name_uz character varying(128) not null,
	name_ru character varying(128) not null,
	barcode character varying(24) not null,
	image character varying(256) not null,
	product_count smallint,
	count_in_block smallint not null,
	description character varying(512) not null,
	count_price double precision not null,
	block_price double precision,
	discount_price double precision,
	is_deleted boolean default false,
	created_at timestamptz default current_timestamp,
	updated_at timestamptz
); 
alter table products
add column 	provider_id VARCHAR(24);
alter table products
add column 	provider_price double precision;

insert into products(
	company_id, category_id, uz_name, ru_name, en_name, barcode, image, blokda_soni, description, dona_price, blok_price, disc_price
) values 
(1, 1, 'Banduella makkajo''xori', 'Бандуелла кукуруз', 'Banduella corn', '3083680002875', 'https://diamondelectric.ru/images/4500/4499956/kykyryza_sladkaya_bonduelle_3.jpg', 12, 'Срок хранения:	
1 год\n
Условия хранения:	
+1°С до +5°С\n
Тип упаковки:	
Банка\n
Энергетическая ценность:	
58ккал.\n
Пищевая ценность в 100 гр.:	
Белки 2,8г, углеводы 9,9г.', 20000, 120000, 18000);

create table orders(
	id varchar(24) not null primary key,
	user_id varchar(24) references users(id) not null,
	quantity smallint not null,
	total_sum double precision null,
	payment_type varchar(24) not null,
	status smallint not null default 1,
	comment varchar(256) null,
	location jsonb not null,
	order_number varchar(12),
	updated_by VARCHAR(24),
	deliver_id VARCHAR(24),
	payment_type_name jsonb,
	registrator_id VARCHAR(24),
	deliver_user_json jsonb,
	is_deleted boolean default false,
	created_at timestamptz default current_timestamp,
	updated_at timestamptz,
	CONSTRAINT fk_customer FOREIGN KEY (user_id) REFERENCES users(id)
);
alter table orders 
add column paid double precision null;
ALTER TABLE orders
ALTER COLUMN paid SET DEFAULT 0;

create table order_items (
    id varchar(24) PRIMARY KEY,
    order_id varchar(24) NOT NULL,
    product_id varchar(24) NOT NULL,
    quantity smallint NOT NULL,
		unit_type SMALLINT NOT NULL,
    price varchar(24) NOT NULL,
		is_deleted boolean default false,
    CONSTRAINT fk_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id),
    CONSTRAINT fk_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
);

create table notifications
(
    id         varchar(24) not null primary key,
    title      varchar(255),
		body			text null,
    image          text        null,
    link          text        null,
    is_deleted bool        not null     default false,
    created_at timestamp with time zone default now()
);

create table payment_types(
	id varchar(24) not null primary key,
	name_uz character varying(64) not null,
	name_ru character varying(64) not null,
	is_deleted boolean default false,
	created_at timestamptz default current_timestamp,
	updated_at timestamptz
);

--------------------------

create database horeca_client;
ALTER USER postgres WITH PASSWORD 'a1Gd6UnQdz6W';
create extension pgcrypto;
create extension intarray;
-- create type experience_role as enum('1-3', '3-5', '5-10');
-- create sequence payment_prefixed_seq as int start with 1 maxvalue 999999; 	

create table regions(
	id varchar(24) not null primary key,
	name_uz character varying(64) not null,
	name_ru character varying(64) not null,
	is_deleted boolean default false,
	created_at timestamptz default current_timestamp
);
create unique index region_uz_name_uniq on regions (uz_name);
create unique index region_ru_name_uniq on regions (ru_name);
create unique index region_en_name_uniq on regions (en_name);
insert into regions(name_uz, name_ru) values
('Toshkent shahri', 'Город Ташкент'),
('Toshkent viloyati',  'Ташкентская область');



create table districts(
	id varchar(24) not null primary key,
	region_id varchar(24) references regions(id) not null,
	name_uz character varying(64) not null,
	name_ru character varying(64) not null,
	is_deleted boolean default false,
	created_at timestamptz default current_timestamp
);
create unique index district_uz_name_uniq on districts (uz_name);
create unique index district_ru_name_uniq on districts (ru_name);
create unique index district_en_name_uniq on districts (en_name);
insert into districts(region_id, uz_name, ru_name, en_name) values
(1, 'Bektemir tumani', 'Бектемирский район', 'Bektemir district'),
(1, 'Mirzo Ulug''bek tumani', 'Мирзо-Улугбекский район', 'Mirza Ulugbek district'),
(1, 'Mirobod tumani', 'Мирабадский район', 'Mirabad district'),
(1, 'Olmazor tumani', 'Алмазарский район', 'Almazor district'),
(1, 'Sirg''ali tumani',  'Сергелийский район', 'Sirgaly district'),
(1, 'Uchtepa tumani',  'Учтепинский район', 'Uchtepa district'),
(1, 'Yashnobod tumani',  'Яшнободский район', 'Yashnabad district'),
(1, 'Chilonzor tumani',  'Чиланзарский район', 'Chilanzor district'),
(1, 'Shayxontohur tumani',  'Шайхантахурский район', 'Shaikhontohur district'),
(1, 'Yunusobod tumani',  'Юнусабадский район', 'Yunusabad district'),
(1, 'Yakkasaroy tumani',  'Яккасарайский район', 'Yakkasaray district'),
(1, 'Yangihayot tumani', 'Янгихаётский район', 'Yangihayat district');

create table companies(
	id varchar(24) not null primary key,
	name_uz character varying(128) not null,
	name_ru character varying(128) not null,
	country_uz character varying(128) not null,
	country_ru character varying(128) not null,
	is_deleted boolean default false,
	created_at timestamptz default current_timestamp,
	updated_at timestamptz
);
create index company_id_ind on companies (id);
create unique index company_uz_name_uniq on companies (uz_name);
create unique index company_ru_name_uniq on companies (ru_name);
create unique index company_en_name_uniq on companies (en_name);
insert into companies(uz_name, ru_name, en_name, uz_country, ru_country, en_country) values
('Bonduella', 'Бондуэлла', 'Bonduella', 'Fransiya', 'Франция', 'France'),
('Zer', 'Зер', 'Zer', 'Turkiya', 'Турция', 'Türkiye'),
('Kalleh', 'Каллех', 'Kalleh', 'Eron', 'Иран', 'Iran');

create table order_payment_history(
  id      varchar(24) not null primary key,
	user_id varchar(24) references users(id) not null,
	order_id varchar(24) REFERENCES orders(id) not null,
	user_json jsonb,
	type smallint not null,
	value double precision not null,
	is_deleted boolean default false,
	created_at timestamptz default current_timestamp,
	updated_at timestamptz
);