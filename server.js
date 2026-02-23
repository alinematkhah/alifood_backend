const express = require('express');
const mongoose = require('mongoose');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// روت پیش‌فرض برای تست
app.get('/', (req, res) => {
    res.status(200).send('AliFood Backend is running!');
});

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const couponSchema = new mongoose.Schema({
    userId: String,
    id: String,
    title: String,
    type: String,
    percent: Number,
    emoji: String,
    desc: String,
    expiry: Number,
    username: String,
    puzzleImage: String,
    time: Number,
    moves: Number,
    status: { type: String, default: 'فعال' }, // <-- اینجا کاما جا افتاده بود
    score: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now } // برای فیلتر هفتگی و ماهانه
});

const Coupon = mongoose.model('Coupon', couponSchema);

// تابع برای ذخیره در Google Sheets
async function saveToGoogleSheet(data) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = '1OwTo9halfAxwBeSs9oqyQyfILLykQKHylU1Sy78fS_8'; // Sheet ID شما

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:I', // آپدیت‌شده: ستون I برای userId
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
                    new Date().toISOString(),
                    data.userId // اضافه‌شده برای ستون I
                ]]
            }
        });
        console.log('Data saved to Google Sheet:', data);
    } catch (error) {
        console.error('Error saving to Google Sheet:', error.message, error.stack);
        throw error;
    }
}


// مسیر جدید برای خواندن دیتای پازل‌ها از گوگل شیت
app.get('/api/puzzle-data', async (req, res) => {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
        });
        const sheets = google.sheets({ version: 'v4', auth });
        
        // آیدی فایل جدیدت را از آدرس بار مرورگر کپی کن و اینجا بگذار
        const spreadsheetId = '1xHgfNys-R8AFhKuJ08rZezLo6MgJqpOhl2SXFqATX_o'; 

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Gallery!A2:C', // خواندن از تب Gallery
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return res.json([]);
        }

        const formattedData = rows.map(row => ({
            img: row[0],
            title: row[1],
            desc: row[2]
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching puzzle data:', error);
        res.status(500).send('خطا در دریافت اطلاعات');
    }
});


// API ذخیره کد
app.post('/api/save-coupon', async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();

        await saveToGoogleSheet({
            username: req.body.username,
            puzzleImage: req.body.puzzleImage,
            time: req.body.time,
            moves: req.body.moves,
            couponId: req.body.id,
            expiryDays: 7,
            status: 'فعال',
            userId: req.body.userId
        });

        res.status(201).send({ message: 'Coupon saved' });
    } catch (error) {
        console.error('Error in /api/save-coupon:', error.message, error.stack);
        res.status(500).send({ error: 'Failed to save coupon', details: error.message });
    }
});

// API لود کدها
app.get('/api/get-coupons', async (req, res) => {
    try {
        const { userId } = req.query;
        const coupons = await Coupon.find({ userId });
        res.status(200).json(coupons);
    } catch (error) {
        console.error('Error in /api/get-coupons:', error.message, error.stack);
        res.status(500).send({ error: 'Failed to fetch coupons', details: error.message });
    }
});

// API استفاده از کد
app.delete('/api/redeem-coupon', async (req, res) => {
    try {
        const { userId, couponId } = req.body;
        const result = await Coupon.updateOne({ userId, id: couponId }, { status: 'استفاده شده' });
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Coupon not found' });
        }
        res.status(200).send({ message: 'Coupon redeemed' });
    } catch (error) {
        console.error('Error in /api/redeem-coupon:', error.message, error.stack);
        res.status(500).send({ error: 'Failed to redeem coupon', details: error.message });
    }
});


// Cron Job برای حذف کدها
setInterval(async () => {
    const now = Date.now();
    await Coupon.deleteMany({ status: { $in: ['استفاده شده', 'منقضی شده'] }, expiry: { $lt: now - 24*60*60*1000 } });
}, 24*60*60*1000);

const PORT = process.env.PORT || 10000;

app.get('/api/leaderboard', async (req, res) => {
    try {
        const { period, userId } = req.query;
        let query = {};
        
        // فیلتر زمانی (ساده شده)
        const now = new Date();
        if (period === 'weekly') {
            query.createdAt = { $gte: new Date(now.setDate(now.getDate() - 7)) };
        } else if (period === 'monthly') {
            query.createdAt = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
        }

        // دریافت ۱۰ نفر برتر
        const topPlayers = await Coupon.find(query)
            .sort({ score: -1, time: 1 }) // امتیاز بیشتر، زمان کمتر
            .limit(10);

        // پیدا کردن رتبه کاربر فعلی
        const allSorted = await Coupon.find(query).sort({ score: -1, time: 1 });
        const userRank = allSorted.findIndex(p => p.userId === userId) + 1;
        const userData = allSorted.find(p => p.userId === userId);

        res.json({
            topPlayers,
            userRank: userRank > 0 ? userRank : '---',
            userScore: userData ? userData.score : 0
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));