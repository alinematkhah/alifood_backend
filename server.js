const express = require('express');
const mongoose = require('mongoose');
const { google } = require('googleapis');
mongoose.set('strictQuery', true);
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// روت پیش‌فرض برای تست
app.get('/', (req, res) => {
    res.status(200).send('AliFood Backend is running!');
});

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
    expiry: Number,
    status: { type: String, default: 'فعال' } // جدید: وضعیت کد (فعال, استفاده شده, منقضی شده)
});

const Coupon = mongoose.model('Coupon', couponSchema);

// تابع برای ذخیره در Google Sheets
async function saveToGoogleSheet(data) {
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = 'YOUR_SHEET_ID'; // جای این رو با Sheet ID واقعی پر کن (از URL Google Sheet)

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:H', // فرض بر این که Sheet1 ستون‌های A تا H داره
        valueInputOption: 'RAW',
        resource: {
            values: [[
                data.username,
                data.puzzleImage,
                data.time,
                data.moves,
                data.couponId,
                data.expiryDays,
                data.status,
                new Date().toISOString() // تاریخ تولید
            ]]
        }
    });
}

// API ذخیره کد (با ذخیره در Sheet)
app.post('/api/save-coupon', async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();

        // ذخیره در Sheet
        await saveToGoogleSheet({
            username: req.body.username, // از Web App بفرست
            puzzleImage: req.body.puzzleImage,
            time: req.body.time,
            moves: req.body.moves,
            couponId: req.body.id,
            expiryDays: 7,
            status: 'فعال'
        });

        res.status(201).send({ message: 'Coupon saved' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to save coupon' });
    }
});

// API لود کدها (با چک وضعیت از Sheet)
app.get('/api/get-coupons', async (req, res) => {
    try {
        const { userId } = req.query;
        const coupons = await Coupon.find({ userId });

        // چک وضعیت از Sheet (اختیاری، اگر صندوقدار تغییر داد)
        // می‌تونی اینجا کد چک Sheet رو اضافه کنی

        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch coupons' });
    }
});

// API جدید برای redeem (حذف 24 ساعت بعد)
app.delete('/api/redeem-coupon', async (req, res) => {
    try {
        const { userId, couponId } = req.body;
        const result = await Coupon.updateOne({ userId, id: couponId }, { status: 'استفاده شده' });
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Coupon not found' });
        }
        res.status(200).send({ message: 'Coupon redeemed' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to redeem coupon' });
    }
});

// Cron Job برای حذف خودکار (هر روز چک می‌کنه)
setInterval(async () => {
    const now = Date.now();
    await Coupon.deleteMany({ status: { $in: ['استفاده شده', 'منقضی شده'] }, expiry: { $lt: now - 24*60*60*1000 } });
}, 24*60*60*1000); // هر 24 ساعت

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));