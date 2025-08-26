# TickerChart AI - سوق الأسهم السعودي

أداة الذكاء الاصطناعي المتقدمة لتحليل سوق الأسهم السعودي

## 🚀 المميزات

- **تحليل ذكي للاتجاهات** باستخدام خوارزميات متقدمة
- **توقعات دقيقة للأسعار** باستخدام نماذج التعلم الآلي
- **إدارة المخاطر** وتوصيات استثمارية ذكية
- **واجهة عربية** سهلة الاستخدام ومتجاوبة
- **تحديثات حية** لبيانات السوق
- **رسوم بيانية تفاعلية** باستخدام Chart.js

## 🛠️ التقنيات المستخدمة

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: PHP, Python (AI/ML)
- **Charts**: Chart.js
- **Deployment**: Vercel

## 📦 التثبيت والتشغيل

### المتطلبات
- Node.js 14+
- PHP 7.4+
- Python 3.8+ (للذكاء الاصطناعي)

### التثبيت المحلي

```bash
# استنساخ المشروع
git clone https://github.com/khaled312001/TickerChart-AI-.git
cd TickerChart-AI-

# تثبيت التبعيات
npm install

# تشغيل الخادم المحلي
npm run dev
```

### النشر على Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول إلى Vercel
vercel login

# نشر المشروع
vercel --prod
```

## 🌐 النشر المباشر

يمكنك نشر المشروع مباشرة على Vercel من خلال:

1. اذهب إلى [Vercel](https://vercel.com)
2. سجل دخولك أو أنشئ حساب جديد
3. اضغط على "New Project"
4. اختر مستودع GitHub: `khaled312001/TickerChart-AI-`
5. اضغط على "Deploy"

### أو عبر Vercel CLI:

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel --prod
```

### رابط الموقع المنشور:
🌐 **https://tickerchart-ai.vercel.app**

### ملاحظات مهمة للنشر:
- تأكد من أن جميع الملفات موجودة في المستودع
- لا تحتاج إلى إعداد Build Command
- المشروع يستخدم PHP runtime على Vercel
- جميع ملفات API في مجلد `api/` ستعمل كـ Serverless Functions
- المشروع جاهز للنشر مباشرة على Vercel

## 📁 هيكل المشروع

```
TickerChart-AI/
├── index.php              # الصفحة الرئيسية
├── api/                   # ملفات API
├── ai/                    # ملفات الذكاء الاصطناعي
├── assets/                # الملفات الثابتة
│   ├── css/              # ملفات CSS
│   └── js/               # ملفات JavaScript
├── vercel.json           # تكوين Vercel
├── package.json          # تكوين Node.js
└── README.md             # هذا الملف
```

## 🔧 التكوين

### متغيرات البيئة

أنشئ ملف `.env` في المجلد الجذر:

```env
NODE_ENV=production
API_BASE_URL=https://your-api-domain.com
```

### تكوين Vercel

يتم تكوين المشروع تلقائياً من خلال ملف `vercel.json`.

## 🚀 المطور

**المهندس خالد أحمد حجاج**
- مطور ومصمم مواقع الويب
- متخصص في الذكاء الاصطناعي والتعلم الآلي
- خبرة في تطوير تطبيقات الويب المتقدمة

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push إلى الفرع
5. إنشاء Pull Request

## 📞 الدعم

للدعم الفني أو الاستفسارات:
- GitHub Issues
- البريد الإلكتروني: [your-email@domain.com]

---

**تم التطوير بواسطة المهندس خالد أحمد حجاج** 🚀 