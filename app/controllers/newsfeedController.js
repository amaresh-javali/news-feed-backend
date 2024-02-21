const Feed = require('../models/newsFeedModel');
const axios = require('axios');
const { parseString } = require('xml2js');
const cron = require('node-cron');
const util = require('util');
const Category = require('../models/categoryModel');

const parseStringPromise = util.promisify(parseString);

const feedCtrl = {};

const fetchAndStoreData = async (categoryId) => {
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            console.error('Category not found');
            return [];
        }
        const response = await axios.get(category.url);
        const xmlData = response.data;

        const parsedData = await parseStringPromise(xmlData);

        const items = parsedData.rss.channel[0].item;
        const savedItems = [];

        for (const item of items) {
            try {
                const feedItem = new Feed({
                    title: item.title ? item.title[0] : '',
                    description: item.description ? item.description[0] : '',
                    link: item.link ? item.link[0] : '',
                    pubDate: item.pubDate ? item.pubDate[0] : '',
                    category: categoryId
                });
                const descriptionWithoutHtml = item.description ? item.description[0].replace(/<\/?[^>]+(>|$)/g, "") : '';
                feedItem.description = descriptionWithoutHtml;
                const savedItem = await feedItem.save();
                savedItems.push(savedItem);
            } catch (error) {
                console.error('Error saving item to database:', error);
            }
        }
        return savedItems;
    } catch (error) {
        console.error('Error fetching or parsing XML data:', error);
        throw error;
    }
};

feedCtrl.get = async (req, res) => {
    try {
        const id = req.params.id;
        const savedItems = await fetchAndStoreData(id);
        return res.status(200).json({ items: savedItems, message: 'Items fetched and saved to database' });
    } catch (error) {
        console.error('Error handling HTTP request:', error);
        return res.status(500).json({ error: 'Error handling HTTP request' });
    }
};

cron.schedule('*/10 * * * * *', async () => {
    console.log('Fetching and storing data...');
    try {
        const categories = await Category.find();
        for (const category of categories) {
            const savedItems = await fetchAndStoreData(category._id);
            console.log(`Items saved to database for category ${category.name}`, savedItems);
        }
    } catch (error) {
        console.error('Error fetching and storing data:', error);
    }
});

module.exports = feedCtrl;

