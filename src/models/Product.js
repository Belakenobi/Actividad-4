const mongoose = require('mongoose');

const RARITY_TYPES = ['común', 'raro', 'épico', 'legendario'];
const ITEM_TYPES = ['arma', 'armadura', 'poción', 'accesorio', 'material'];

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  category: {
    type: String,
    trim: true,
    default: 'General',
    enum: {
      values: ITEM_TYPES,
      message: 'Tipo de item inválido'
    }
  },
  rarity: {
    type: String,
    enum: {
      values: RARITY_TYPES,
      message: 'Rareza inválida'
    },
    default: 'común'
  },
  damage: {
    type: Number,
    min: [0, 'El daño no puede ser negativo'],
    default: 0
  },
  defense: {
    type: Number,
    min: [0, 'La defensa no puede ser negativa'],
    default: 0
  },
  durability: {
    type: Number,
    min: [0, 'La durabilidad no puede ser negativa'],
    default: 100
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.index({ name: 'text' });
productSchema.index({ category: 1, rarity: 1 });

module.exports = mongoose.model('Product', productSchema);
