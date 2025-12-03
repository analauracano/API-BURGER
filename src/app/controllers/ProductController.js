import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

class ProductController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.string().required(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { name, price, category_id, offer } = req.body;
    const filename = req.file ? req.file.filename : null;

    const newProduct = await Product.create({
      name,
      price,
      category_id,
      path: filename,
      offer,
    });

    return res.status(201).json(newProduct);
  }

  async update(req, res) {
const { name, price, category_id, offer } = req.body;
const { id } = req.params;

// Converter preço para centavos
const priceFormatted = price ? Math.round(Number(price) * 100) : undefined;

const data = {};

if (name) data.name = name;
if (priceFormatted !== undefined) data.price = priceFormatted;
if (category_id) data.category_id = Number(category_id);

// corrigir checkbox
if (typeof offer === "string") {
  data.offer = offer === "true" || offer === "on";
} else {
  data.offer = offer;
}

if (req.file) {
  data.path = req.file.filename;
}

console.log("DATA UPDATE FINAL →", data);

await Product.update(data, { where: { id } });

return res.status(200).json({ message: "Produto atualizado com sucesso" });
}

  async index(_req, res) {
    const products = await Product.findAll({
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
    });
    return res.status(200).json(products);
  }
}

export default new ProductController();
