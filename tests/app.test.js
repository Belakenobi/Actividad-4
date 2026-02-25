const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');
const Product = require('../src/models/Product');

let authToken;
let testUser;

beforeAll(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});

  testUser = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'password123' });
  
  authToken = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.username).toBe('newuser');
    });

    it('should not register user with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'anotheruser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('ya está registrado');
    });

    it('should not register user without required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'test' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('inválidas');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});

describe('Product Controller (RPG)', () => {
  describe('POST /api/products', () => {
    it('should create an item with RPG attributes', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Espada de Fuego',
          description: 'Una espada llamas',
          price: 500,
          category: 'arma',
          rarity: 'épico',
          damage: 50,
          defense: 5,
          durability: 80,
          stock: 1
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.product.name).toBe('Espada de Fuego');
      expect(res.body.product.rarity).toBe('épico');
      expect(res.body.product.damage).toBe(50);
      expect(res.body.product.category).toBe('arma');
    });

    it('should create item with default RPG values', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Piedra Común',
          price: 10
        });

      expect(res.status).toBe(201);
      expect(res.body.product.rarity).toBe('común');
      expect(res.body.product.category).toBe('material');
      expect(res.body.product.durability).toBe(100);
    });

    it('should not create item with invalid rarity', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Item Invalido',
          price: 100,
          rarity: 'invalid'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should not create product without name and price', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Test' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/products with filters', () => {
    beforeAll(async () => {
      await Product.create([
        { name: 'Escudo', price: 100, category: 'armadura', rarity: 'raro', user: testUser._id },
        { name: 'Poción HP', price: 50, category: 'poción', rarity: 'común', user: testUser._id },
        { name: 'Anillo Mágico', price: 1000, category: 'accesorio', rarity: 'legendario', user: testUser._id }
      ]);
    });

    it('should get all products', async () => {
      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeGreaterThan(0);
    });

    it('should filter by category', async () => {
      const res = await request(app)
        .get('/api/products?category=arma')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.products.every(p => p.category === 'arma')).toBe(true);
    });

    it('should filter by rarity', async () => {
      const res = await request(app)
        .get('/api/products?rarity=legendario')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.products.every(p => p.rarity === 'legendario')).toBe(true);
    });
  });

  describe('GET /api/products/:id', () => {
    let product;

    beforeAll(async () => {
      product = await Product.create({
        name: 'Armadura de Acero',
        price: 500,
        category: 'armadura',
        rarity: 'raro',
        defense: 30,
        durability: 100,
        user: testUser._id
      });
    });

    it('should get a specific item with RPG stats', async () => {
      const res = await request(app)
        .get(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product.name).toBe('Armadura de Acero');
      expect(res.body.product.defense).toBe(30);
      expect(res.body.product.rarity).toBe('raro');
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/products/:id', () => {
    let product;

    beforeAll(async () => {
      product = await Product.create({
        name: 'Espada Básica',
        price: 50,
        category: 'arma',
        rarity: 'común',
        damage: 10,
        user: testUser._id
      });
    });

    it('should update item with new RPG attributes', async () => {
      const res = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ 
          name: 'Espada Mejorada', 
          rarity: 'épico',
          damage: 25 
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product.name).toBe('Espada Mejorada');
      expect(res.body.product.rarity).toBe('épico');
      expect(res.body.product.damage).toBe(25);
    });
  });

  describe('DELETE /api/products/:id', () => {
    let product;

    beforeEach(async () => {
      product = await Product.create({
        name: 'Item a Eliminar',
        price: 5,
        category: 'material',
        user: testUser._id
      });
    });

    it('should delete an item', async () => {
      const res = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const deleted = await Product.findById(product._id);
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent item', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });
});
