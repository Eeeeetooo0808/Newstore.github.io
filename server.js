const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // للاتصال بسيرفر Discord

const app = express();
const PORT = 3000;
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN'; // استخدم webhook الخاص بك هنا

// Middleware
app.use(express.json());
app.use(fileUpload());
app.use('/images', express.static('images'));
app.use('/products', express.static('products'));

// إعداد نقطة النهاية لإضافة المنتجات
app.post('/addProduct', (req, res) => {
  if (!req.files || !req.files.productImage) {
    return res.status(400).json({ message: 'لم يتم تحميل صورة المنتج' });
  }

  const { productName, productDescription, productPrice } = req.body;
  const productImage = req.files.productImage;
  const imagePath = `images/${Date.now()}_${productImage.name}`;

  // نقل الصورة إلى المجلد
  productImage.mv(imagePath, (err) => {
    if (err) return res.status(500).json({ message: 'خطأ في رفع الصورة' });

    const product = {
      name: productName,
      description: productDescription,
      price: productPrice,
      imagePath: imagePath
    };

    // حفظ المنتج في ملف JSON
    const productId = Date.now(); // يمكن استخدام معرف فريد
    fs.writeFile(`products/${productId}.json`, JSON.stringify(product, null, 2), (err) => {
      if (err) return res.status(500).json({ message: 'خطأ في حفظ المنتج' });
      sendDiscordNotification(product); // أرسل إشعار إلى Discord
      res.json({ message: 'تم إضافة المنتج بنجاح!' });
    });
  });
});

// إعداد نقطة النهاية لاسترجاع قائمة المنتجات
app.get('/getProducts', (req, res) => {
  fs.readdir('products/', (err, files) => {
    if (err) return res.status(500).json({ message: 'خطأ في قراءة الملفات' });
    res.json(files);
  });
});

// إعداد نقطة النهاية لاسترجاع بيانات المنتج
app.get('/products/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'products', req.params.filename);
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ message: 'خطأ في قراءة المنتج' });
    res.json(JSON.parse(data));
  });
});

function sendDiscordNotification(product) {
  const message = {
    content: `تم إضافة منتج جديد: ${product.name}\nالسعر: ${product.price} د.ع\nالوصف: ${product.description}\n[رابط الصورة](${product.imagePath})`
  };
  axios.post(DISCORD_WEBHOOK_URL, message)
    .then(response => console.log('تم إرسال الإشعار إلى Discord'))
    .catch(error => console.error('خطأ في إرسال الإشعار إلى Discord:', error));
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});