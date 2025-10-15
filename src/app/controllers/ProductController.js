import * as Yup from 'yup';

class ProductController {
    async store(req, res) {
    const schema = Yup.object({
    name: Yup.string().required(),
    price: Yup.number().required(),
    category: Yup.string().required(),
});
        try {    
            schema.validateSync(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }
        return res.status(201).json({ ok: true });
    }
}

export default new ProductController();