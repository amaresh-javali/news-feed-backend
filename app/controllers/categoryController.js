const { pick } = require('lodash')
const Category = require('../models/categoryModel')

const categoryCltr = {}

categoryCltr.getAll = async (req, res) => {
    try {
        const result = await Category.find()
        res.json(result)
    } catch (e) {
        res.status(400).json(e)
    }
}

categoryCltr.addCat = async (req, res) => {
    try {
        const body = pick(req.body, ['name', 'url'])
        const data = new Category(body)
        const result = await data.save()
        res.status(200).json(result)
    } catch (e) {

    }
}

// categoryCltr.update = async(req, res) =>{
//     try{
//         const id = req.params.id
//         const body = pick(req.body, ['name', 'url'])
//         const result = Category.findByIdAndUpdate(id, body, {new:true})
//         res.json(result)
//     } catch(e) {

//     }
// }

categoryCltr.delete = async (req, res) => {
    const categoryId = req.params.id; 
    try {
        await Category.findByIdAndDelete(categoryId);
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, error: 'Error deleting category' });
    }
}


module.exports = categoryCltr