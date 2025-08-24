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
    status: { type: String, default: 'فعال' },
    createdAt: { type: Date, default: Date.now },
    statusChangedAt: { type: Date, default: Date.now } // برای ردیابی زمان تغییر وضعیت
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
        const spreadsheetId = '1OwTo9halfAxwBeSs9oqyQyfILLykQKHylU1Sy78fS_8';
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:J', // اضافه کردن ستون J برای درصد تخفیف
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
                    new Date(data.createdAt).toISOString(),
                    data.userId,
                    data.percent // ستون جدید برای درصد تخفیف
                ]]
            }
        });
        console.log('Data saved to Google Sheet:', data);
    } catch (error) {
        console.error('Error saving to Google Sheet:', error.message, error.stack);
        throw error;
    }
}

// تابع برای حذف ردیف از Google Sheets
async function deleteFromGoogleSheet(couponId) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = '1OwTo9halfAxwBeSs9oqyQyfILLykQKHylU1Sy78fS_8';
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A:J'
        });
        const rows = response.data.values;
        if (!rows) return;
        const rowIndex = rows.findIndex(row => row[4] === couponId); // ستون E (couponId)
        if (rowIndex !== -1) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                resource: {
                    requests: [{
                        deleteDimension: {
                            range: {
                                sheetId: 0,
                                dimension: 'ROWS',
                                startIndex: rowIndex,
                                endIndex: rowIndex + 1
                            }
                        }
                    }]
                }
            });
            console.log(`Row with couponId ${couponId} deleted from Google Sheet`);
        }
    } catch (error) {
        console.error('Error deleting from Google Sheet:', error.message, error.stack);
        throw error;
    }
}

// API تولید کد یکتا
app.post('/api/generate-unique-code', async (req, res) => {
    const { percent } = req.body;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let uniqueCode = '';
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!isUnique && attempts < maxAttempts) {
        const randomPart = Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
        const timePart = Date.now().toString().slice(-4);
        uniqueCode = `RAEES${percent}-${randomPart}${timePart}`;

        // چک کردن یکتایی در MongoDB
        const existingCoupon = await Coupon.findOne({ id: uniqueCode });
        if (!existingCoupon) {
            // چک کردن یکتایی در Google Sheets
            const auth = new google.auth.GoogleAuth({
                credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });
            const sheets = google.sheets({ version: 'v4', auth });
            const spreadsheetId = '1OwTo9halfAxwBeSs9oqyQyfILLykQKHylU1Sy78fS_8';
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'Sheet1!E:E' // ستون E برای couponId
            });
            const rows = response.data.values || [];
            const codeExists = rows.some(row => row[0] === uniqueCode);
            if (!codeExists) {
                isUnique = true;
            }
        }
        attempts++;
    }

    if (isUnique) {
        res.status(200).json({ code: uniqueCode });
    } else {
        res.status(500).json({ error: 'Failed to generate unique code after max attempts' });
    }
});

// API ذخیره کد
app.post('/api/save-coupon', async (req, res) => {
    try {
        const coupon = new Coupon({
            ...req.body,
            statusChangedAt: new Date() // تنظیم زمان تغییر وضعیت
        });
        await coupon.save();
        await saveToGoogleSheet({
            username: req.body.username,
            puzzleImage: req.body.puzzleImage,
            time: req.body.time,
            moves: req.body.moves,
            couponId: req.body.id,
            expiryDays: 7,
            status: 'فعال',
            createdAt: req.body.createdAt,
            userId: req.body.userId,
            percent: req.body.percent
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

// API برای آپدیت وضعیت از Google Sheets
app.post('/api/update-coupon-status', async (req, res) => {
    try {
        const { couponId, status } = req.body;
        const coupon = await Coupon.findOneAndUpdate(
            { id: couponId },
            { status, statusChangedAt: new Date() },
            { new: true }
        );
        if (!coupon) {
            return res.status(404).send({ error: 'Coupon not found' });
        }
        res.status(200).send({ message: 'Coupon status updated' });
    } catch (error) {
        console.error('Error in /api/update-coupon-status:', error.message, error.stack);
        res.status(500).send({ error: 'Failed to update coupon status', details: error.message });
    }
});

// Cron Job برای به‌روزرسانی وضعیت به "منقضی شده"
setInterval(async () => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    await Coupon.updateMany(
        { status: 'فعال', createdAt: { $lt: sevenDaysAgo } },
        { status: 'منقضی شده', statusChangedAt: new Date() }
    );
}, 24 * 60 * 60 * 1000);

// Cron Job برای حذف کدها
setInterval(async () => {
    const now = Date.now();
    const oneDayAgo = now - 1 * 24 * 60 * 60 * 1000;
    const couponsToDelete = await Coupon.find({
        status: { $in: ['استفاده شده', 'منقضی شده'] },
        statusChangedAt: { $lt: oneDayAgo }
    });
    for (const coupon of couponsToDelete) {
        await deleteFromGoogleSheet(coupon.id);
        await Coupon.deleteOne({ id: coupon.id });
    }
}, 24 * 60 * 60 * 1000);

// همگام‌سازی وضعیت از Google Sheets
setInterval(async () => {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = '1OwTo9halfAxwBeSs9oqyQyfILLykQKHylU1Sy78fS_8';
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A:J'
        });
        const rows = response.data.values || [];
        for (const row of rows.slice(1)) { // رد کردن هدر
            const couponId = row[4]; // ستون E
            const status = row[6]; // ستون G
            if (couponId && status) {
                await Coupon.updateOne(
                    { id: couponId },
                    { status, statusChangedAt: new Date() }
                );
            }
        }
    } catch (error) {
        console.error('Error syncing status from Google Sheet:', error.message, error.stack);
    }
}, 5 * 60 * 1000); // هر ۵ دقیقه

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
