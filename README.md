# مهامي — Mahami

مدير مهام أنيق باللغتين العربية والإنجليزية، يعمل كموقع على الويب وكتطبيق أندرويد مع إشعارات تذكير حقيقية.

**الموقع:** https://momar5413.github.io/To-Do/
**تطبيق أندرويد:** [تحميل mahami.apk](https://momar5413.github.io/To-Do/downloads/mahami.apk)

## المزايا

- **التذكيرات والإشعارات**
  - تذكير في موعد المهمة أو قبله بـ 5 أو 15 أو 30 دقيقة، أو بساعة، أو بيوم.
  - في تطبيق أندرويد تصل الإشعارات في الموعد بالضبط حتى لو كان التطبيق مغلقاً، وتبقى بعد إعادة تشغيل الهاتف.
  - في الإشعار زران: **تم ✓** لإنهاء المهمة، و**بعد 10 دقائق** لتأجيل التذكير.
  - **ملخص الصباح:** إشعار يومي بمهام اليوم والمهام المتأخرة.
  - المهام التي لها تاريخ دون ساعة يصل تذكيرها في وقت تختاره (الافتراضي 9:00 صباحاً).
- **إضافة ذكية:** اكتب `اجتماع غداً الساعة 5م !!! #العمل` فتُضاف المهمة بتاريخ الغد، الساعة 5 مساءً، بأولوية عالية، في قائمة العمل.
  - التاريخ: `اليوم`، `غداً`، `بعد غد`، `يوم الجمعة`.
  - الوقت: `5:30م`، `الساعة 9`، `9 ص`، `at 5pm`.
  - الرقم وحده لا يُعدّ وقتاً، فتبقى مهمة مثل «قراءة 20 صفحة» كما هي.
- **القوائم والعروض**
  - عروض جاهزة: اليوم، القادمة، المهمة، الكل، المكتملة.
  - قوائم خاصة بك، لكل منها رمز ولون.
- **تفاصيل المهمة:** مهام فرعية، ملاحظات، تاريخ ووقت، تذكير، أولوية، ونجمة للمهام المهمة.
- **سحب وإفلات** لترتيب المهام، مع التراجع عن الحذف.
- **إحصائيات:** أيام الإنجاز المتتالية، وعدد مهام اليوم، ورسم لآخر 7 أيام.
- **التصميم:** زمردي وذهبي مع نجمة ثمانية، ووضع داكن وفاتح، و6 ألوان زينة.
- **النسخ الاحتياطي:** تصدير البيانات واستيرادها بملف JSON.

## تثبيت التطبيق على أندرويد

1. افتح رابط التحميل أعلاه من هاتفك.
2. عند فتح الملف سيطلب أندرويد السماح بتثبيت التطبيقات من هذا المصدر (المتصفح أو مدير الملفات). وافق.
3. ثبّت التطبيق ثم افتحه، واضغط على 🔔 في الأعلى للسماح بالإشعارات.

> تُحفظ مهامك على جهازك فقط. قبل حذف التطبيق صدّر نسخة احتياطية من الإعدادات ← تصدير.
> التحديثات موقّعة بالمفتاح نفسه، فيُثبَّت الإصدار الجديد فوق القديم دون فقدان البيانات.

---

## Development

The website is plain HTML/CSS/JS (`index.html`, `style.css`, `script.js`) served by GitHub Pages.
The Android app wraps the same files with [Capacitor](https://capacitorjs.com/).

| Path | Purpose |
| --- | --- |
| `script.js` | App logic, including the reminder engine (`Notifier`) |
| `sw.js` | Offline cache and notification buttons on the website |
| `src/native.js` | Exposes Capacitor plugins to `script.js` (bundled only into the app) |
| `scripts/build-web.mjs` | Copies the site into `www/` and bundles `native.js` |
| `android/` | Capacitor Android project (icons, theme, permissions, signing) |
| `resources/` | Source artwork for launcher icons and the splash screen |
| `downloads/mahami.apk` | The latest signed release build |

### Build the APK

Requirements: Node 20+, JDK 21, and the Android SDK (platform 36) with `ANDROID_HOME` set.

```bash
npm install
npm run apk        # builds www/, syncs Capacitor, assembles and signs the release APK,
                   # then copies it to downloads/mahami.apk
```

When you release a new version, bump `APP_VERSION` in `script.js` and `versionCode` / `versionName` in `android/app/build.gradle`.

**Signing:** the release key is `android/keystore/mahami-release.jks`, with its settings in `android/keystore.properties`.
It is committed on purpose so that every build can update the installed app without uninstalling it (which would erase local data).
If you fork this project, generate your own key.
