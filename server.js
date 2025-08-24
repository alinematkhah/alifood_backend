const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));
const couponSchema = new mongoose.Schema({
    userId: String,
    id: String,
    title: String,
    type: String,
    percent: Number,
    emoji: String,
    desc: String,
    expiry: Number
});
const Coupon = mongoose.model('Coupon', couponSchema);
app.post('/api/save-coupon', async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).send({ message: 'Coupon saved' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to save coupon' });
    }
});
app.get('/api/get-coupons', async (req, res) => {
    try {
        const { userId } = req.query;
        const coupons = await Coupon.find({ userId });
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch coupons' });
    }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));