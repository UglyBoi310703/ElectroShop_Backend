-- ============================================
-- DATABASE HOÀN CHỈNH CHO ĐỒ ÁN TỐT NGHIỆP
-- SÀN THƯƠNG MẠI ĐIỆN TỬ BÁN ĐỒ ĐIỆN TỬ
-- Tính năng: Dynamic Specifications + Product Variants
-- ============================================

-- ============================================
-- PHẦN 1: QUẢN LÝ NGƯỜI DÙNG
-- ============================================

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    gender ENUM('male', 'female', 'other'),
    date_of_birth DATE,
    user_type ENUM('customer', 'seller', 'admin') DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line TEXT NOT NULL,
    ward VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    address_type ENUM('home', 'office', 'other') DEFAULT 'home',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 2: DANH MỤC & THƯƠNG HIỆU
-- ============================================

CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT NULL,
    category_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_parent_id (parent_id),
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE brands (
    brand_id INT PRIMARY KEY AUTO_INCREMENT,
    brand_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    website VARCHAR(255),
    country VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 3: TEMPLATE THÔNG SỐ KỸ THUẬT ĐỘNG
-- ============================================

CREATE TABLE category_specification_templates (
    template_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    spec_name VARCHAR(255) NOT NULL COMMENT 'Tên hiển thị: VD: Màn hình, CPU',
    spec_key VARCHAR(100) NOT NULL COMMENT 'Key để lưu trữ: screen, cpu',
    spec_group VARCHAR(100) COMMENT 'Nhóm: Màn hình, Hiệu năng, Camera',
    spec_type ENUM('text', 'number', 'select', 'multiselect', 'textarea') DEFAULT 'text',
    spec_unit VARCHAR(50) COMMENT 'Đơn vị: inch, GB, MP, mAh',
    spec_options JSON COMMENT 'Options cho select: ["4GB", "8GB", "16GB"]',
    placeholder VARCHAR(255),
    default_value VARCHAR(255),
    is_required BOOLEAN DEFAULT FALSE,
    is_filterable BOOLEAN DEFAULT FALSE COMMENT 'Dùng để lọc sản phẩm',
    is_variant_option BOOLEAN DEFAULT FALSE COMMENT 'Dùng làm biến thể sản phẩm',
    sort_order INT DEFAULT 0,
    validation_rules JSON COMMENT '{"min": 1, "max": 100}',
    help_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_spec (category_id, spec_key),
    INDEX idx_category_id (category_id),
    INDEX idx_is_filterable (is_filterable),
    INDEX idx_is_variant_option (is_variant_option)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 4: SẢN PHẨM
-- ============================================

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    category_id INT NOT NULL,
    brand_id INT,
    product_name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE,
    short_description TEXT,
    full_description LONGTEXT,
    
    -- Giá sẽ được lấy từ variants (nếu có variants)
    -- Hoặc là giá cố định nếu không có variants
    base_price DECIMAL(15, 2) NOT NULL COMMENT 'Giá gốc (nếu không có variant)',
    has_variants BOOLEAN DEFAULT FALSE COMMENT 'Sản phẩm có biến thể hay không',
    
    quantity_in_stock INT DEFAULT 0 COMMENT 'Tổng tồn kho (nếu không có variant)',
    weight DECIMAL(10, 2),
    dimensions VARCHAR(100),
    warranty_period INT COMMENT 'Thời gian bảo hành (tháng)',
    
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    status ENUM('draft', 'active', 'out_of_stock', 'discontinued') DEFAULT 'draft',
    
    view_count INT DEFAULT 0,
    sold_count INT DEFAULT 0,
    rating_average DECIMAL(3, 2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE SET NULL,
    INDEX idx_seller_id (seller_id),
    INDEX idx_category_id (category_id),
    INDEX idx_brand_id (brand_id),
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_has_variants (has_variants),
    INDEX idx_base_price (base_price),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_fulltext_search (product_name, short_description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 5: THÔNG SỐ KỸ THUẬT SẢN PHẨM
-- ============================================

CREATE TABLE product_specifications (
    spec_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    template_id INT NOT NULL,
    spec_key VARCHAR(100) NOT NULL,
    spec_name VARCHAR(255) NOT NULL,
    spec_value TEXT NOT NULL,
    spec_value_normalized VARCHAR(255) COMMENT 'Giá trị chuẩn hóa để filter',
    spec_unit VARCHAR(50),
    spec_group VARCHAR(100),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES category_specification_templates(template_id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_template_id (template_id),
    INDEX idx_spec_key (spec_key),
    INDEX idx_normalized_value (spec_value_normalized)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 6: VARIANT ATTRIBUTES & VARIANT OPTIONS
-- ============================================

-- Bảng Variant Attributes: Định nghĩa các thuộc tính biến thể (Color, Storage, RAM...)
CREATE TABLE variant_attributes (
    attribute_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    attribute_name VARCHAR(100) NOT NULL COMMENT 'VD: Màu sắc, Dung lượng, RAM',
    attribute_key VARCHAR(100) NOT NULL COMMENT 'VD: color, storage, ram',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_attribute (category_id, attribute_key),
    INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Variant Options: Các giá trị có thể của attribute (Đỏ, Xanh / 128GB, 256GB...)
CREATE TABLE variant_options (
    option_id INT PRIMARY KEY AUTO_INCREMENT,
    attribute_id INT NOT NULL,
    option_value VARCHAR(100) NOT NULL COMMENT 'VD: Đỏ, 128GB, 8GB',
    option_label VARCHAR(100) COMMENT 'Label hiển thị',
    color_code VARCHAR(20) COMMENT 'Mã màu nếu là color attribute',
    extra_price DECIMAL(15, 2) DEFAULT 0 COMMENT 'Giá chênh lệch so với base price',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attribute_id) REFERENCES variant_attributes(attribute_id) ON DELETE CASCADE,
    INDEX idx_attribute_id (attribute_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 7: PRODUCT VARIANTS (BIẾN THỂ SẢN PHẨM)
-- ============================================

CREATE TABLE product_variants (
    variant_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    variant_name VARCHAR(255) NOT NULL COMMENT 'VD: iPhone 15 Pro 256GB Titan Đen',
    sku VARCHAR(100) UNIQUE,
    
    -- Giá của variant này
    price DECIMAL(15, 2) NOT NULL,
    compare_at_price DECIMAL(15, 2) COMMENT 'Giá gốc để show giảm giá',
    cost_price DECIMAL(15, 2) COMMENT 'Giá vốn',
    
    -- Tồn kho của variant
    quantity_in_stock INT DEFAULT 0,
    
    -- Hình ảnh riêng của variant (optional)
    image_url VARCHAR(500),
    
    -- Các attribute options của variant này (JSON)
    -- VD: {"color": "Titan Đen", "storage": "256GB"}
    attribute_values JSON NOT NULL,
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE COMMENT 'Variant mặc định khi load trang',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_sku (sku),
    INDEX idx_is_active (is_active),
    INDEX idx_is_default (is_default),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng trung gian: Liên kết variant với các option cụ thể
CREATE TABLE product_variant_option_values (
    id INT PRIMARY KEY AUTO_INCREMENT,
    variant_id INT NOT NULL,
    attribute_id INT NOT NULL,
    option_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES variant_attributes(attribute_id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES variant_options(option_id) ON DELETE CASCADE,
    UNIQUE KEY unique_variant_attribute (variant_id, attribute_id),
    INDEX idx_variant_id (variant_id),
    INDEX idx_attribute_id (attribute_id),
    INDEX idx_option_id (option_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 8: GIỎ HÀNG
-- ============================================

CREATE TABLE carts (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_items (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT COMMENT 'NULL nếu sản phẩm không có variant',
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(15, 2) NOT NULL COMMENT 'Giá tại thời điểm thêm vào giỏ',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    INDEX idx_cart_id (cart_id),
    INDEX idx_product_id (product_id),
    INDEX idx_variant_id (variant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 9: ĐƠN HÀNG
-- ============================================

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    shipping_address_id INT NOT NULL,
    
    -- Thông tin giá
    subtotal DECIMAL(15, 2) NOT NULL COMMENT 'Tổng tiền hàng',
    shipping_fee DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    
    -- Trạng thái
    order_status ENUM(
        'pending',        -- Chờ xác nhận
        'confirmed',      -- Đã xác nhận
        'processing',     -- Đang xử lý
        'shipping',       -- Đang giao hàng
        'delivered',      -- Đã giao hàng
        'completed',      -- Hoàn thành
        'cancelled',      -- Đã hủy
        'refunded'        -- Đã hoàn tiền
    ) DEFAULT 'pending',
    
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method ENUM('cod', 'bank_transfer', 'credit_card', 'e_wallet', 'installment') NOT NULL,
    
    -- Ghi chú
    customer_note TEXT,
    admin_note TEXT,
    cancel_reason TEXT,
    
    -- Timestamps
    paid_at TIMESTAMP NULL,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (shipping_address_id) REFERENCES addresses(address_id),
    INDEX idx_user_id (user_id),
    INDEX idx_order_code (order_code),
    INDEX idx_order_status (order_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT COMMENT 'NULL nếu không có variant',
    
    -- Lưu lại thông tin tại thời điểm mua
    product_name VARCHAR(500) NOT NULL,
    variant_name VARCHAR(255),
    product_image VARCHAR(500),
    sku VARCHAR(100),
    
    quantity INT NOT NULL,
    price DECIMAL(15, 2) NOT NULL COMMENT 'Giá tại thời điểm mua',
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    subtotal DECIMAL(15, 2) NOT NULL,
    
    warranty_period INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    INDEX idx_variant_id (variant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_status_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    note TEXT,
    changed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 10: KHUYẾN MÃI
-- ============================================

CREATE TABLE coupons (
    coupon_id INT PRIMARY KEY AUTO_INCREMENT,
    coupon_code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(500),
    discount_type ENUM('percentage', 'fixed_amount', 'free_shipping') NOT NULL,
    discount_value DECIMAL(15, 2) NOT NULL,
    min_order_value DECIMAL(15, 2) DEFAULT 0,
    max_discount_amount DECIMAL(15, 2),
    usage_limit INT COMMENT 'Số lần sử dụng tối đa',
    used_count INT DEFAULT 0,
    usage_limit_per_user INT DEFAULT 1,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    applicable_categories JSON,
    applicable_products JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_coupon_code (coupon_code),
    INDEX idx_is_active (is_active),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 11: ĐÁNH GIÁ
-- ============================================

CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT,
    variant_id INT COMMENT 'Đánh giá cho variant cụ thể',
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    comment TEXT,
    images JSON,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_variant_id (variant_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 12: CÁC BẢNG BỔ SUNG
-- ============================================

CREATE TABLE wishlists (
    wishlist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE SET NULL,
    UNIQUE KEY unique_wishlist (user_id, product_id, variant_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('order', 'promotion', 'system', 'product', 'review') NOT NULL,
    related_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 13: COMPOSITE INDEXES ĐỂ TỐI ƯU
-- ============================================

CREATE INDEX idx_products_category_status ON products(category_id, status, is_active);
CREATE INDEX idx_products_brand_status ON products(brand_id, status, is_active);
CREATE INDEX idx_orders_user_status ON orders(user_id, order_status, created_at);
CREATE INDEX idx_reviews_product_approved ON reviews(product_id, is_approved, created_at);
CREATE INDEX idx_variants_product_active ON product_variants(product_id, is_active, price);
