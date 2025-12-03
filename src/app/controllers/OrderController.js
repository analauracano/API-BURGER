import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../schemas/Order.js'; // Mongoose

class OrderController {
  // Criar pedido
  async store(req, res) {
    const schema = Yup.object({
      products: Yup.array().required().of(
        Yup.object({
          id: Yup.number().required(),
          quantity: Yup.number().required(),
        })
      ),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false, strict: true });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { userId, userName } = req; // passado pelo middleware auth
    const { products } = req.body;

    try {
      // Buscar produtos no SQL (Postgres)
      const productIds = products.map((p) => p.id);

      const findedProducts = await Product.findAll({
        where: { id: productIds },
        include: {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      });

      // Mapear produtos para o formato que o MongoDB espera
      const mappedProducts = findedProducts.map((product) => {
        const quantity = products.find((p) => p.id === product.id).quantity;
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          url: product.path ? `/files/${product.path}` : '', // rota de imagens
          category: product.category.name,
          quantity,
        };
      });

      // Criar pedido no MongoDB
      const order = await Order.create({
        user: { id: userId, name: userName },
        products: mappedProducts,
        status: 'Pedido Realizado',
      });

      return res.status(201).json(order);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  }

  // Atualizar status do pedido
  async update(req, res) {
    const schema = Yup.object({
      status: Yup.string().required(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false, strict: true });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { status } = req.body;
    const { id } = req.params;

    try {
      const updated = await Order.updateOne({ _id: id }, { status });
      if (updated.matchedCount === 0) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      return res.status(200).json({ message: 'Status atualizado com sucesso' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
  }

  // Listar pedidos
  async index(_req, res) {
    try {
      const orders = await Order.find();
      return res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  }
}

export default new OrderController();
