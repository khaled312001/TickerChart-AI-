# دليل النشر على Vercel - TickerChart AI

## 🚀 خطوات النشر

### 1. إعداد المشروع

تم إعداد المشروع بالفعل مع الملفات المطلوبة:
- `vercel.json` - تكوين Vercel
- `package.json` - تكوين Node.js
- `composer.json` - تكوين PHP
- `.gitignore` - استبعاد الملفات غير المطلوبة

### 2. النشر عبر Vercel Dashboard

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اضغط على "New Project"
3. اختر مستودع GitHub: `khaled312001/TickerChart-AI-`
4. اضغط على "Import"
5. في إعدادات المشروع:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (اتركه فارغاً)
   - **Output Directory**: (اتركه فارغاً)
6. اضغط على "Deploy"

### ملاحظات مهمة:
- لا تحتاج إلى Build Command لأن المشروع يستخدم PHP
- Vercel سيتعرف على ملفات PHP تلقائياً
- جميع ملفات API في مجلد `api/` ستعمل كـ Serverless Functions
- في حالة حدوث خطأ في runtime، تأكد من استخدام `vercel-php@0.6.0`
- تأكد من وجود ملف `composer.json` في المجلد الجذر

### 3. النشر عبر Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel --prod
```

### 4. إعدادات البيئة (اختياري)

يمكنك إضافة متغيرات البيئة في Vercel Dashboard:

```env
NODE_ENV=production
API_BASE_URL=https://your-api-domain.com
```

## 🔧 تكوين المشروع

### ملف vercel.json
```json
{
  "version": 2,
  "name": "tickerchart-ai",
  "functions": {
    "api/**/*.php": {
      "runtime": "vercel-php@0.6.0"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.php"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.php"
    }
  ]
}
```

### هيكل المشروع
```
TickerChart-AI/
├── index.php              # الصفحة الرئيسية
├── api/                   # ملفات API
│   ├── index.php         # نقطة دخول API
│   └── *.php             # ملفات API أخرى
├── assets/                # الملفات الثابتة
├── vercel.json           # تكوين Vercel
├── package.json          # تكوين Node.js
└── composer.json         # تكوين PHP
```

## 🌐 النطاق المخصص

بعد النشر، يمكنك إضافة نطاق مخصص:

1. اذهب إلى إعدادات المشروع في Vercel
2. اختر "Domains"
3. أضف نطاقك المخصص
4. اتبع تعليمات DNS

## 📊 مراقبة الأداء

- **Analytics**: متاح في Vercel Dashboard
- **Logs**: يمكن عرضها في Functions tab
- **Performance**: مراقبة سرعة التحميل

## 🔄 التحديثات

للتحديثات المستقبلية:

```bash
# تحديث الكود
git add .
git commit -m "Update message"
git push origin master

# Vercel سيقوم بالتحديث تلقائياً
```

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في PHP Runtime**
   - تأكد من استخدام `vercel-php@0.6.0`
   - تأكد من وجود ملف `composer.json`

2. **خطأ في API Routes**
   - تأكد من صحة مسارات API في `vercel.json`
   - تأكد من وجود ملف `api/index.php`

3. **خطأ في الملفات الثابتة**
   - تأكد من وجود مجلد `assets/`

4. **خطأ في Build**
   - لا تحتاج إلى Build Command
   - اترك Build Command فارغاً في إعدادات Vercel

5. **خطأ في Runtime**
   - تأكد من استخدام `vercel-php@0.6.0`
   - تأكد من وجود ملف `composer.json`
   - تأكد من أن جميع ملفات PHP موجودة في المجلد الصحيح

### الدعم:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel PHP Runtime](https://vercel.com/docs/runtimes#official-runtimes/php)

---

**تم التطوير بواسطة المهندس خالد أحمد حجاج** 🚀 