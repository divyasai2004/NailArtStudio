import Product from "../models/Product.js";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Product.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    }).select("_id");

    if (!existing) return slug;

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

// Get products with filters/pagination
export const getProducts = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
    const keyword = req.query.keyword?.trim();
    const category = req.query.category?.trim();
    const bestSeller = req.query.bestSeller === "true";
    const featured = req.query.featured === "true";
    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);
    const sortBy = req.query.sortBy || "newest";

    const query = {};
    if (keyword) query.name = { $regex: keyword, $options: "i" };
    if (category) query.category = category;
    if (bestSeller) query.isBestSeller = true;
    if (featured) query.isFeatured = true;
    if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
      query.price = {};
      if (!Number.isNaN(minPrice)) query.price.$gte = minPrice;
      if (!Number.isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating_desc: { rating: -1, createdAt: -1 },
    };
    const sort = sortMap[sortBy] || sortMap.newest;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      products,
      page,
      pages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Get product by id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({ message: "Invalid product id" });
  }
};

// Get product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch product" });
  }
};

// Create product (Admin)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      title,
      shortBenefit,
      price,
      originalPrice,
      discountPercentage,
      description,
      whyYouWillLoveIt,
      whatYouGet,
      sizeGuide,
      perfectFor,
      shippingPaymentInfo,
      image,
      images,
      videoUrl,
      category,
      sizeOptions,
      shapeOptions,
      stock,
      isBestSeller,
      isFeatured,
      trustBadges,
    } = req.body;

    if (!name || price == null || !description || !image || !category) {
      return res.status(400).json({
        message: "name, price, description, image and category are required",
      });
    }

    const baseSlug = slugify(slug || name);
    if (!baseSlug) {
      return res.status(400).json({ message: "Invalid product slug/name" });
    }
    const uniqueSlug = await ensureUniqueSlug(baseSlug);

    const product = new Product({
      name,
      slug: uniqueSlug,
      title,
      shortBenefit,
      price,
      originalPrice,
      discountPercentage,
      description,
      whyYouWillLoveIt,
      whatYouGet,
      sizeGuide,
      perfectFor,
      shippingPaymentInfo,
      image,
      images,
      videoUrl,
      category,
      sizeOptions,
      shapeOptions,
      stock,
      isBestSeller,
      isFeatured,
      trustBadges,
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create product" });
  }
};

// Update product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const payload = req.body;

    if (payload.name !== undefined) product.name = payload.name;
    if (payload.title !== undefined) product.title = payload.title;
    if (payload.shortBenefit !== undefined) product.shortBenefit = payload.shortBenefit;
    if (payload.price !== undefined) product.price = payload.price;
    if (payload.originalPrice !== undefined) product.originalPrice = payload.originalPrice;
    if (payload.discountPercentage !== undefined) {
      product.discountPercentage = payload.discountPercentage;
    }
    if (payload.description !== undefined) product.description = payload.description;
    if (payload.whyYouWillLoveIt !== undefined) {
      product.whyYouWillLoveIt = payload.whyYouWillLoveIt;
    }
    if (payload.whatYouGet !== undefined) product.whatYouGet = payload.whatYouGet;
    if (payload.sizeGuide !== undefined) product.sizeGuide = payload.sizeGuide;
    if (payload.perfectFor !== undefined) product.perfectFor = payload.perfectFor;
    if (payload.shippingPaymentInfo !== undefined) {
      product.shippingPaymentInfo = payload.shippingPaymentInfo;
    }
    if (payload.image !== undefined) product.image = payload.image;
    if (payload.images !== undefined) product.images = payload.images;
    if (payload.videoUrl !== undefined) product.videoUrl = payload.videoUrl;
    if (payload.category !== undefined) product.category = payload.category;
    if (payload.sizeOptions !== undefined) product.sizeOptions = payload.sizeOptions;
    if (payload.shapeOptions !== undefined) product.shapeOptions = payload.shapeOptions;
    if (payload.stock !== undefined) product.stock = payload.stock;
    if (payload.isBestSeller !== undefined) product.isBestSeller = payload.isBestSeller;
    if (payload.isFeatured !== undefined) product.isFeatured = payload.isFeatured;
    if (payload.trustBadges !== undefined) product.trustBadges = payload.trustBadges;

    if (payload.slug !== undefined || payload.name !== undefined) {
      const baseSlug = slugify(payload.slug || product.name);
      if (!baseSlug) {
        return res.status(400).json({ message: "Invalid product slug/name" });
      }
      product.slug = await ensureUniqueSlug(baseSlug, product._id);
    }

    const updatedProduct = await product.save();
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update product" });
  }
};

// Delete product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    return res.status(200).json({ message: "Product removed" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product" });
  }
};

// Create product review (Authenticated user)
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment, images = [] } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ message: "rating and comment are required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(409).json({ message: "Product already reviewed" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      images: Array.isArray(images) ? images : [],
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();
    return res.status(201).json({ message: "Review added" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add review" });
  }
};