import * as Yup from 'yup';
import Category from '../models/Category.js';

class CategoryController {
    async store(req, res) {
    const schema = Yup.object({
    name: Yup.string().required(),
});
        try {    
            schema.validateSync(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }

    const { name } = req.body;
    const { filename } = req.file;

    const existingCategory = await Category.findOne({ where: { name, } });

    if (existingCategory) {
        return res.status(400).json({ error: 'Category already exists' });
    }

    const newCategory = await Category.create({
        name,
        path: filename,
    })

    return res.status(201).json(newCategory);
    }

    async update(req, res) {
    const schema = Yup.object({
    name: Yup.string(),
});
        try {    
            schema.validateSync(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }

    const { name } = req.body;
    const { id } = req.params;

    let path;
    if(req.file){
        const { filename } = req.file;
        path = filename;
    }

    const existingCategory = await Category.findOne({ where: { name, } });

    if (existingCategory) {
        return res.status(400).json({ error: 'Category already exists' });
    }

await Category.update({
        name,
        path,
    }, {
        where: { id }
    })

    return res.status(201).json();
    }

    async index(_req, res) {
        const categories = await Category.findAll();
        console.log(_req.userId);
        return res.status(201).json(categories);
    }
}

export default new CategoryController();