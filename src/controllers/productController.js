const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category, rarity } = req.query;
    let query = { user: req.user.id };

    if (category) query.category = category;
    if (rarity) query.rarity = rarity;

    const products = await Product.find(query).sort({ rarity: 1, createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener productos' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener producto' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, rarity, damage, defense, durability, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ 
        success: false, 
        message: 'Por favor proporciona nombre y precio' 
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category: category || 'material',
      rarity: rarity || 'común',
      damage: damage || 0,
      defense: defense || 0,
      durability: durability || 100,
      stock: stock || 0,
      user: req.user.id
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Error al crear producto' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, rarity, damage, defense, durability, stock } = req.body;

    let product = await Product.findOne({ _id: req.params.id, user: req.user.id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, rarity, damage, defense, durability, stock },
      { new: true, runValidators: true }
    );

    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Error al actualizar producto' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al eliminar producto' });
  }
};
