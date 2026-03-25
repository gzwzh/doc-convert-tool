const fs = require('fs');
const path = require('path');

const localeDir = path.join(__dirname, '..', 'frontend', 'src', 'locales');

const repairs = {
  ar: {
    webHeader: {
      brand_subtitle: 'صندوق أدوات ذكي للتحويل والإنتاجية',
      nav: {
        home: 'الرئيسية',
        ai_tools: 'أدوات الذكاء الاصطناعي',
        office_tools: 'أدوات المكتب',
        multimedia: 'الوسائط المتعددة',
        development_tools: 'أدوات التطوير',
        text_processing: 'معالجة النصوص',
        file_processing: 'معالجة الملفات',
        system_tools: 'أدوات النظام',
        life_tools: 'أدوات الحياة',
        industry_news: 'أخبار الصناعة',
        software_customization: 'تخصيص البرمجيات'
      },
      search_aria: 'بحث',
      search_placeholder: 'ابحث عن الأدوات والتطبيقات وغيرها',
      theme_to_dark: 'التبديل إلى الوضع الداكن',
      theme_to_light: 'التبديل إلى الوضع الفاتح',
      menu_aria: 'قائمة التنقل',
      login_register: 'تسجيل الدخول / إنشاء حساب',
      login: 'تسجيل الدخول'
    },
    webFooter: {
      description: 'نوفّر أدوات ذكاء اصطناعي وخدمات استشارية عالية الجودة للأفراد والشركات لمساعدتك على الحفاظ على الكفاءة والقدرة التنافسية.',
      sections: {
        quick_links: 'روابط سريعة',
        tool_categories: 'فئات الأدوات',
        contact_us: 'اتصل بنا'
      },
      quick_links: {
        home: 'الرئيسية',
        ai_tools: 'أدوات الذكاء الاصطناعي',
        custom_service: 'خدمات استشارية',
        industry_news: 'أخبار الصناعة',
        feedback: 'الملاحظات'
      },
      tool_links: {
        text_processing: 'معالجة النصوص',
        image_generation: 'توليد الصور',
        office_tools: 'أدوات المكتب',
        file_processing: 'معالجة الملفات',
        code_development: 'تطوير البرمجيات'
      },
      contact: {
        company: 'الشركة',
        phone: 'الهاتف',
        address: 'العنوان',
        email: 'البريد الإلكتروني'
      },
      copyright: '© {{year}} {{brand}}. جميع الحقوق محفوظة.',
      user_agreement: 'اتفاقية المستخدم',
      privacy_policy: 'سياسة الخصوصية'
    },
    toolDetail: {
      options: {
        cleanup_options: 'خيارات التنظيف',
        docx_page_range_placeholder: 'مثال: 1-3,5',
        image_options: 'خيارات الصورة',
        image_quality: 'جودة الصورة',
        inline_css: 'CSS مضمن',
        json_indent: 'مسافة بادئة JSON',
        pipe: 'خط عمودي (|)',
        preview_html: 'معاينة HTML',
        quality_range: 'نطاق الجودة',
        remove_css: 'إزالة CSS',
        watermark_info: 'إعدادات العلامة المائية',
        watermark_text: 'نص العلامة المائية',
        watermark_size: 'حجم العلامة المائية',
        watermark_opacity: 'شفافية العلامة المائية',
        watermark_position: 'موضع العلامة المائية',
        watermark_angle: 'زاوية العلامة المائية',
        watermark_color: 'لون العلامة المائية'
      },
      messages: {
        files_added_success: 'تمت إضافة {{count}} ملف',
        folder_invalid_filtered: 'تمت تصفية {{count}} ملف غير صالح',
        folder_no_valid_files: 'لم يتم العثور على ملفات {{source}} صالحة في هذا المجلد',
        no_downloadable_files: 'لا توجد ملفات قابلة للتنزيل',
        saving_files: 'جارٍ حفظ الملفات...',
        save_success: 'تم حفظ {{count}} ملف',
        save_failed: 'فشل الحفظ: {{error}}',
        save_operation_failed: 'فشلت عملية الحفظ',
        cannot_access_folder: 'تعذر الوصول إلى المجلد المحدد',
        batch_download_started: 'بدأ التنزيل',
        packaging_files: 'جارٍ تجميع الملفات...',
        zip_download_success: 'اكتمل تنزيل ZIP',
        zip_download_failed: 'فشل تنزيل ZIP',
        conversion_cancelled: 'تم إلغاء التحويل',
        pdf_page_range_invalid: 'يرجى إدخال نطاق صفحات PDF صالح',
        docx_page_range_invalid: 'يرجى إدخال نطاق صفحات صالح، مثل 1-3,5',
        animation_delay_invalid: 'يرجى إدخال تأخير حركة صالح بين 10 و5000',
        background_color_invalid: 'يرجى إدخال لون خلفية صالح، مثل #ffffff',
        watermark_color_invalid: 'يرجى إدخال لون علامة مائية صالح، مثل #cccccc',
        ppt_video_wait: 'قد يستغرق تحويل PPT إلى فيديو بعض الوقت. يرجى الانتظار.',
        converting_video_wait: 'جارٍ تحويل الفيديو، يرجى الانتظار...',
        processing_files: 'جارٍ معالجة الملفات...',
        operation_cancelled: 'تم إلغاء العملية',
        not_implemented: 'هذا التحويل غير متاح بعد',
        conversion_success: 'تم التحويل بنجاح',
        conversion_completed_mixed: 'اكتمل التحويل. نجح {{success}} وفشل {{failed}}.',
        conversion_process_error: 'خطأ في عملية التحويل: {{error}}',
        restart_required: 'الميزة غير متاحة. يرجى إعادة تشغيل التطبيق والمحاولة مرة أخرى.',
        unknown_error: 'خطأ غير معروف'
      },
      breadcrumb_home: 'الرئيسية',
      breadcrumb_tools: 'أدوات {{source}}',
      breadcrumb_current: '{{source}} إلى {{target}}',
      title: 'محول {{source}} إلى {{target}}',
      file_list: 'قائمة الملفات',
      select_all: 'تحديد الكل',
      deselect_all: 'إلغاء تحديد الكل',
      cancel_conversion: 'إلغاء التحويل',
      no_files: 'لا توجد ملفات بعد. يرجى إضافتها من الأعلى.',
      status_converting: 'جارٍ التحويل...',
      download: 'تنزيل',
      download_file: 'تنزيل الملف',
      delete: 'حذف',
      error: 'خطأ',
      progress_processing: 'جارٍ المعالجة {{current}} / {{total}}',
      zip_download_title: 'تنزيل كملف ZIP',
      zip_download_desc: 'تجميع جميع الملفات المحولة في أرشيف ZIP واحد',
      download_to_folder_title: 'تنزيل إلى مجلد',
      html_preview: 'معاينة HTML'
    }
  },
  bn: {
    webHeader: {
      brand_subtitle: 'রূপান্তর ও উৎপাদনশীলতার স্মার্ট টুলবক্স',
      nav: {
        home: 'হোম',
        ai_tools: 'AI টুলস',
        office_tools: 'অফিস টুলস',
        multimedia: 'মাল্টিমিডিয়া',
        development_tools: 'ডেভেলপমেন্ট টুলস',
        text_processing: 'টেক্সট প্রসেসিং',
        file_processing: 'ফাইল প্রসেসিং',
        system_tools: 'সিস্টেম টুলস',
        life_tools: 'দৈনন্দিন টুলস',
        industry_news: 'ইন্ডাস্ট্রি নিউজ',
        software_customization: 'সফটওয়্যার কাস্টমাইজেশন'
      },
      search_aria: 'অনুসন্ধান',
      search_placeholder: 'টুল, অ্যাপ ইত্যাদি খুঁজুন',
      theme_to_dark: 'ডার্ক মোডে পরিবর্তন করুন',
      theme_to_light: 'লাইট মোডে পরিবর্তন করুন',
      menu_aria: 'নেভিগেশন মেনু',
      login_register: 'লগইন / রেজিস্টার',
      login: 'লগইন'
    },
    webFooter: {
      description: 'আমরা ব্যক্তি ও প্রতিষ্ঠানের জন্য মানসম্পন্ন AI টুল এবং পরামর্শ সেবা দিই, যাতে আপনি দক্ষ ও প্রতিযোগিতামূলক থাকতে পারেন।',
      sections: {
        quick_links: 'দ্রুত লিংক',
        tool_categories: 'টুল বিভাগ',
        contact_us: 'যোগাযোগ করুন'
      },
      quick_links: {
        home: 'হোম',
        ai_tools: 'AI টুলস',
        custom_service: 'পরামর্শ সেবা',
        industry_news: 'ইন্ডাস্ট্রি নিউজ',
        feedback: 'মতামত'
      },
      tool_links: {
        text_processing: 'টেক্সট প্রসেসিং',
        image_generation: 'ইমেজ জেনারেশন',
        office_tools: 'অফিস টুলস',
        file_processing: 'ফাইল প্রসেসিং',
        code_development: 'কোড ডেভেলপমেন্ট'
      },
      contact: {
        company: 'কোম্পানি',
        phone: 'ফোন',
        address: 'ঠিকানা',
        email: 'ইমেইল'
      },
      copyright: '© {{year}} {{brand}}. সর্বস্বত্ব সংরক্ষিত।',
      user_agreement: 'ব্যবহারকারী চুক্তি',
      privacy_policy: 'গোপনীয়তা নীতি'
    },
    toolDetail: {
      options: {
        cleanup_options: 'পরিষ্কার করার বিকল্প',
        docx_page_range_placeholder: 'উদাহরণ: 1-3,5',
        image_options: 'ছবির বিকল্প',
        image_quality: 'ছবির গুণমান',
        inline_css: 'ইনলাইন CSS',
        json_indent: 'JSON ইনডেন্ট',
        pipe: 'উল্লম্ব দাগ (|)',
        preview_html: 'HTML প্রিভিউ',
        quality_range: 'গুণমানের পরিসর',
        remove_css: 'CSS সরান',
        watermark_info: 'ওয়াটারমার্ক সেটিংস',
        watermark_text: 'ওয়াটারমার্ক টেক্সট',
        watermark_size: 'ওয়াটারমার্কের আকার',
        watermark_opacity: 'ওয়াটারমার্কের স্বচ্ছতা',
        watermark_position: 'ওয়াটারমার্কের অবস্থান',
        watermark_angle: 'ওয়াটারমার্কের কোণ',
        watermark_color: 'ওয়াটারমার্কের রং'
      },
      messages: {
        files_added_success: '{{count}}টি ফাইল যোগ করা হয়েছে',
        folder_invalid_filtered: '{{count}}টি অবৈধ ফাইল বাদ দেওয়া হয়েছে',
        folder_no_valid_files: 'এই ফোল্ডারে কোনো বৈধ {{source}} ফাইল পাওয়া যায়নি',
        no_downloadable_files: 'ডাউনলোডযোগ্য কোনো ফাইল নেই',
        saving_files: 'ফাইল সংরক্ষণ করা হচ্ছে...',
        save_success: '{{count}}টি ফাইল সংরক্ষণ করা হয়েছে',
        save_failed: 'সংরক্ষণ ব্যর্থ: {{error}}',
        save_operation_failed: 'সংরক্ষণ প্রক্রিয়া ব্যর্থ হয়েছে',
        cannot_access_folder: 'নির্বাচিত ফোল্ডারে প্রবেশ করা যাচ্ছে না',
        batch_download_started: 'ডাউনলোড শুরু হয়েছে',
        packaging_files: 'ফাইল প্যাকেজ করা হচ্ছে...',
        zip_download_success: 'ZIP ডাউনলোড সম্পন্ন',
        zip_download_failed: 'ZIP ডাউনলোড ব্যর্থ',
        conversion_cancelled: 'রূপান্তর বাতিল হয়েছে',
        pdf_page_range_invalid: 'অনুগ্রহ করে একটি বৈধ PDF পৃষ্ঠার পরিসর লিখুন',
        docx_page_range_invalid: 'অনুগ্রহ করে একটি বৈধ পৃষ্ঠার পরিসর লিখুন, যেমন 1-3,5',
        animation_delay_invalid: 'অনুগ্রহ করে 10 থেকে 5000 এর মধ্যে বৈধ অ্যানিমেশন বিলম্ব লিখুন',
        background_color_invalid: 'অনুগ্রহ করে একটি বৈধ ব্যাকগ্রাউন্ড রং লিখুন, যেমন #ffffff',
        watermark_color_invalid: 'অনুগ্রহ করে একটি বৈধ ওয়াটারমার্কের রং লিখুন, যেমন #cccccc',
        ppt_video_wait: 'PPT থেকে ভিডিও রূপান্তরে কিছু সময় লাগতে পারে। অনুগ্রহ করে অপেক্ষা করুন।',
        converting_video_wait: 'ভিডিও রূপান্তর করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...',
        processing_files: 'ফাইল প্রসেস করা হচ্ছে...',
        operation_cancelled: 'অপারেশন বাতিল হয়েছে',
        not_implemented: 'এই রূপান্তর এখনো বাস্তবায়িত হয়নি',
        conversion_success: 'সফলভাবে রূপান্তর করা হয়েছে',
        conversion_completed_mixed: 'রূপান্তর সম্পন্ন। {{success}}টি সফল, {{failed}}টি ব্যর্থ।',
        conversion_process_error: 'রূপান্তর প্রক্রিয়ায় ত্রুটি: {{error}}',
        restart_required: 'ফিচারটি এখন উপলব্ধ নয়। অনুগ্রহ করে অ্যাপটি পুনরায় চালু করে আবার চেষ্টা করুন।',
        unknown_error: 'অজানা ত্রুটি'
      },
      breadcrumb_home: 'হোম',
      breadcrumb_tools: '{{source}} টুলস',
      breadcrumb_current: '{{source}} থেকে {{target}}',
      title: '{{source}} থেকে {{target}} কনভার্টার',
      file_list: 'ফাইল তালিকা',
      select_all: 'সব নির্বাচন করুন',
      deselect_all: 'সব নির্বাচন বাতিল করুন',
      cancel_conversion: 'রূপান্তর বাতিল করুন',
      no_files: 'এখনও কোনো ফাইল নেই। উপরে থেকে যোগ করুন।',
      status_converting: 'রূপান্তর করা হচ্ছে...',
      download: 'ডাউনলোড',
      download_file: 'ফাইল ডাউনলোড করুন',
      delete: 'মুছুন',
      error: 'ত্রুটি',
      progress_processing: 'প্রসেস করা হচ্ছে {{current}} / {{total}}',
      zip_download_title: 'ZIP হিসেবে ডাউনলোড',
      zip_download_desc: 'সব রূপান্তরিত ফাইল একটিমাত্র ZIP আর্কাইভে প্যাক করুন',
      download_to_folder_title: 'ফোল্ডারে ডাউনলোড করুন',
      html_preview: 'HTML প্রিভিউ'
    }
  },
  fa: {
    webHeader: {
      brand_subtitle: 'جعبه‌ابزار هوشمند تبدیل و بهره‌وری',
      nav: {
        home: 'خانه',
        ai_tools: 'ابزارهای هوش مصنوعی',
        office_tools: 'ابزارهای اداری',
        multimedia: 'چندرسانه‌ای',
        development_tools: 'ابزارهای توسعه',
        text_processing: 'پردازش متن',
        file_processing: 'پردازش فایل',
        system_tools: 'ابزارهای سیستم',
        life_tools: 'ابزارهای کاربردی',
        industry_news: 'اخبار صنعت',
        software_customization: 'سفارشی‌سازی نرم‌افزار'
      },
      search_aria: 'جستجو',
      search_placeholder: 'ابزارها، برنامه‌ها و موارد دیگر را جستجو کنید',
      theme_to_dark: 'تغییر به حالت تیره',
      theme_to_light: 'تغییر به حالت روشن',
      menu_aria: 'منوی ناوبری',
      login_register: 'ورود / ثبت‌نام',
      login: 'ورود'
    },
    webFooter: {
      description: 'ما ابزارهای باکیفیت هوش مصنوعی و خدمات مشاوره‌ای را برای افراد و کسب‌وکارها ارائه می‌دهیم تا به شما در حفظ بهره‌وری و رقابت‌پذیری کمک کنیم.',
      sections: {
        quick_links: 'لینک‌های سریع',
        tool_categories: 'دسته‌بندی ابزارها',
        contact_us: 'تماس با ما'
      },
      quick_links: {
        home: 'خانه',
        ai_tools: 'ابزارهای هوش مصنوعی',
        custom_service: 'خدمات مشاوره',
        industry_news: 'اخبار صنعت',
        feedback: 'بازخورد'
      },
      tool_links: {
        text_processing: 'پردازش متن',
        image_generation: 'تولید تصویر',
        office_tools: 'ابزارهای اداری',
        file_processing: 'پردازش فایل',
        code_development: 'توسعه کد'
      },
      contact: {
        company: 'شرکت',
        phone: 'تلفن',
        address: 'آدرس',
        email: 'ایمیل'
      },
      copyright: '© {{year}} {{brand}}. تمامی حقوق محفوظ است.',
      user_agreement: 'توافق‌نامه کاربر',
      privacy_policy: 'سیاست حریم خصوصی'
    },
    toolDetail: {
      options: {
        cleanup_options: 'گزینه‌های پاک‌سازی',
        docx_page_range_placeholder: 'مثال: 1-3,5',
        image_options: 'گزینه‌های تصویر',
        image_quality: 'کیفیت تصویر',
        inline_css: 'CSS درون‌خطی',
        json_indent: 'تورفتگی JSON',
        pipe: 'خط عمودی (|)',
        preview_html: 'پیش‌نمایش HTML',
        quality_range: 'بازه کیفیت',
        remove_css: 'حذف CSS',
        watermark_info: 'تنظیمات واترمارک',
        watermark_text: 'متن واترمارک',
        watermark_size: 'اندازه واترمارک',
        watermark_opacity: 'شفافیت واترمارک',
        watermark_position: 'موقعیت واترمارک',
        watermark_angle: 'زاویه واترمارک',
        watermark_color: 'رنگ واترمارک'
      },
      messages: {
        files_added_success: '{{count}} فایل اضافه شد',
        folder_invalid_filtered: '{{count}} فایل نامعتبر فیلتر شد',
        folder_no_valid_files: 'هیچ فایل معتبر {{source}} در این پوشه پیدا نشد',
        no_downloadable_files: 'هیچ فایل قابل دانلودی موجود نیست',
        saving_files: 'در حال ذخیره فایل‌ها...',
        save_success: '{{count}} فایل ذخیره شد',
        save_failed: 'ذخیره‌سازی ناموفق بود: {{error}}',
        save_operation_failed: 'عملیات ذخیره‌سازی ناموفق بود',
        cannot_access_folder: 'امکان دسترسی به پوشه انتخاب‌شده وجود ندارد',
        batch_download_started: 'دانلود شروع شد',
        packaging_files: 'در حال بسته‌بندی فایل‌ها...',
        zip_download_success: 'دانلود ZIP کامل شد',
        zip_download_failed: 'دانلود ZIP ناموفق بود',
        conversion_cancelled: 'تبدیل لغو شد',
        pdf_page_range_invalid: 'لطفاً یک بازه معتبر صفحات PDF وارد کنید',
        docx_page_range_invalid: 'لطفاً یک بازه معتبر صفحات وارد کنید، مانند 1-3,5',
        animation_delay_invalid: 'لطفاً یک تأخیر انیمیشن معتبر بین 10 تا 5000 وارد کنید',
        background_color_invalid: 'لطفاً یک رنگ پس‌زمینه معتبر وارد کنید، مانند #ffffff',
        watermark_color_invalid: 'لطفاً یک رنگ واترمارک معتبر وارد کنید، مانند #cccccc',
        ppt_video_wait: 'تبدیل PPT به ویدیو ممکن است کمی زمان ببرد. لطفاً صبر کنید.',
        converting_video_wait: 'در حال تبدیل ویدیو، لطفاً صبر کنید...',
        processing_files: 'در حال پردازش فایل‌ها...',
        operation_cancelled: 'عملیات لغو شد',
        not_implemented: 'این تبدیل هنوز پیاده‌سازی نشده است',
        conversion_success: 'با موفقیت تبدیل شد',
        conversion_completed_mixed: 'تبدیل کامل شد. {{success}} موفق و {{failed}} ناموفق بود.',
        conversion_process_error: 'خطا در فرایند تبدیل: {{error}}',
        restart_required: 'این قابلیت در دسترس نیست. لطفاً برنامه را دوباره راه‌اندازی کرده و دوباره تلاش کنید.',
        unknown_error: 'خطای ناشناخته'
      },
      breadcrumb_home: 'خانه',
      breadcrumb_tools: 'ابزارهای {{source}}',
      breadcrumb_current: '{{source}} به {{target}}',
      title: 'مبدل {{source}} به {{target}}',
      file_list: 'فهرست فایل‌ها',
      select_all: 'انتخاب همه',
      deselect_all: 'لغو انتخاب همه',
      cancel_conversion: 'لغو تبدیل',
      no_files: 'هنوز فایلی وجود ندارد. لطفاً از بالا اضافه کنید.',
      status_converting: 'در حال تبدیل...',
      download: 'دانلود',
      download_file: 'دانلود فایل',
      delete: 'حذف',
      error: 'خطا',
      progress_processing: 'در حال پردازش {{current}} / {{total}}',
      zip_download_title: 'دانلود به‌صورت ZIP',
      zip_download_desc: 'همه فایل‌های تبدیل‌شده را در یک آرشیو ZIP بسته‌بندی کنید',
      download_to_folder_title: 'دانلود در پوشه',
      html_preview: 'پیش‌نمایش HTML'
    }
  },
  he: {
    webHeader: {
      brand_subtitle: 'ארגז כלים חכם להמרה ולפרודוקטיביות',
      nav: {
        home: 'דף הבית',
        ai_tools: 'כלי AI',
        office_tools: 'כלי משרד',
        multimedia: 'מולטימדיה',
        development_tools: 'כלי פיתוח',
        text_processing: 'עיבוד טקסט',
        file_processing: 'עיבוד קבצים',
        system_tools: 'כלי מערכת',
        life_tools: 'כלי שימוש יום-יומי',
        industry_news: 'חדשות התעשייה',
        software_customization: 'התאמת תוכנה'
      },
      search_aria: 'חיפוש',
      search_placeholder: 'חפש כלים, אפליקציות ועוד',
      theme_to_dark: 'מעבר למצב כהה',
      theme_to_light: 'מעבר למצב בהיר',
      menu_aria: 'תפריט ניווט',
      login_register: 'התחברות / הרשמה',
      login: 'התחברות'
    },
    webFooter: {
      description: 'אנו מספקים כלי AI ושירותי ייעוץ איכותיים ליחידים ולעסקים כדי לעזור לך לשמור על יעילות ותחרותיות.',
      sections: {
        quick_links: 'קישורים מהירים',
        tool_categories: 'קטגוריות כלים',
        contact_us: 'צור קשר'
      },
      quick_links: {
        home: 'דף הבית',
        ai_tools: 'כלי AI',
        custom_service: 'שירותי ייעוץ',
        industry_news: 'חדשות התעשייה',
        feedback: 'משוב'
      },
      tool_links: {
        text_processing: 'עיבוד טקסט',
        image_generation: 'יצירת תמונות',
        office_tools: 'כלי משרד',
        file_processing: 'עיבוד קבצים',
        code_development: 'פיתוח קוד'
      },
      contact: {
        company: 'חברה',
        phone: 'טלפון',
        address: 'כתובת',
        email: 'דוא"ל'
      },
      copyright: '© {{year}} {{brand}}. כל הזכויות שמורות.',
      user_agreement: 'הסכם משתמש',
      privacy_policy: 'מדיניות פרטיות'
    },
    toolDetail: {
      options: {
        cleanup_options: 'אפשרויות ניקוי',
        docx_page_range_placeholder: 'לדוגמה: 1-3,5',
        image_options: 'אפשרויות תמונה',
        image_quality: 'איכות תמונה',
        inline_css: 'CSS מוטבע',
        json_indent: 'כניסת JSON',
        pipe: 'קו אנכי (|)',
        preview_html: 'תצוגה מקדימה של HTML',
        quality_range: 'טווח איכות',
        remove_css: 'הסר CSS',
        watermark_info: 'הגדרות סימן מים',
        watermark_text: 'טקסט סימן מים',
        watermark_size: 'גודל סימן מים',
        watermark_opacity: 'אטימות סימן מים',
        watermark_position: 'מיקום סימן מים',
        watermark_angle: 'זווית סימן מים',
        watermark_color: 'צבע סימן מים'
      },
      messages: {
        files_added_success: '{{count}} קובץ/ים נוספו',
        folder_invalid_filtered: '{{count}} קובץ/ים לא תקינים סוננו',
        folder_no_valid_files: 'לא נמצאו קובצי {{source}} תקינים בתיקייה זו',
        no_downloadable_files: 'אין קבצים זמינים להורדה',
        saving_files: 'שומר קבצים...',
        save_success: '{{count}} קובץ/ים נשמרו',
        save_failed: 'השמירה נכשלה: {{error}}',
        save_operation_failed: 'פעולת השמירה נכשלה',
        cannot_access_folder: 'לא ניתן לגשת לתיקייה שנבחרה',
        batch_download_started: 'ההורדה התחילה',
        packaging_files: 'אורז קבצים...',
        zip_download_success: 'הורדת ZIP הושלמה',
        zip_download_failed: 'הורדת ZIP נכשלה',
        conversion_cancelled: 'ההמרה בוטלה',
        pdf_page_range_invalid: 'אנא הזן טווח עמודי PDF תקין',
        docx_page_range_invalid: 'אנא הזן טווח עמודים תקין, לדוגמה 1-3,5',
        animation_delay_invalid: 'אנא הזן השהיית אנימציה תקינה בין 10 ל-5000',
        background_color_invalid: 'אנא הזן צבע רקע תקין, לדוגמה #ffffff',
        watermark_color_invalid: 'אנא הזן צבע סימן מים תקין, לדוגמה #cccccc',
        ppt_video_wait: 'המרת PPT לווידאו עשויה לקחת זמן מה. אנא המתן.',
        converting_video_wait: 'ממיר וידאו, אנא המתן...',
        processing_files: 'מעבד קבצים...',
        operation_cancelled: 'הפעולה בוטלה',
        not_implemented: 'המרה זו עדיין לא מיושמת',
        conversion_success: 'ההמרה הושלמה בהצלחה',
        conversion_completed_mixed: 'ההמרה הושלמה. {{success}} הצליחו, {{failed}} נכשלו.',
        conversion_process_error: 'שגיאה בתהליך ההמרה: {{error}}',
        restart_required: 'התכונה אינה זמינה. אנא הפעל מחדש את האפליקציה ונסה שוב.',
        unknown_error: 'שגיאה לא ידועה'
      },
      breadcrumb_home: 'דף הבית',
      breadcrumb_tools: 'כלי {{source}}',
      breadcrumb_current: '{{source}} אל {{target}}',
      title: 'ממיר {{source}} ל-{{target}}',
      file_list: 'רשימת קבצים',
      select_all: 'בחר הכול',
      deselect_all: 'בטל בחירת הכול',
      cancel_conversion: 'בטל המרה',
      no_files: 'עדיין אין קבצים. אנא הוסף למעלה.',
      status_converting: 'ממיר...',
      download: 'הורד',
      download_file: 'הורד קובץ',
      delete: 'מחק',
      error: 'שגיאה',
      progress_processing: 'מעבד {{current}} / {{total}}',
      zip_download_title: 'הורד כ-ZIP',
      zip_download_desc: 'ארוז את כל הקבצים שהומרו בארכיון ZIP אחד',
      download_to_folder_title: 'הורד לתיקייה',
      html_preview: 'תצוגה מקדימה של HTML'
    }
  },
  de: {
    webFooter: {
      copyright: '© {{year}} {{brand}}. Alle Rechte vorbehalten.'
    },
    toolDetail: {
      options: {
        image_quality: 'Bildqualität',
        json_indent: 'JSON-Einrückung',
        quality_range: 'Qualitätsbereich',
        watermark_size: 'Wasserzeichengröße'
      },
      messages: {
        files_added_success: '{{count}} Datei(en) hinzugefügt',
        folder_invalid_filtered: '{{count}} ungültige Datei(en) wurden herausgefiltert',
        folder_no_valid_files: 'Keine gültigen {{source}}-Dateien in diesem Ordner gefunden',
        no_downloadable_files: 'Keine herunterladbaren Dateien verfügbar',
        cannot_access_folder: 'Auf den ausgewählten Ordner kann nicht zugegriffen werden',
        pdf_page_range_invalid: 'Bitte einen gültigen PDF-Seitenbereich eingeben',
        docx_page_range_invalid: 'Bitte einen gültigen Seitenbereich eingeben, z. B. 1-3,5',
        animation_delay_invalid: 'Bitte eine gültige Animationsverzögerung zwischen 10 und 5000 eingeben',
        background_color_invalid: 'Bitte eine gültige Hintergrundfarbe eingeben, z. B. #ffffff',
        watermark_color_invalid: 'Bitte eine gültige Wasserzeichenfarbe eingeben, z. B. #cccccc',
        restart_required: 'Funktion nicht verfügbar. Bitte starte die App neu und versuche es erneut.'
      },
      select_all: 'Alle auswählen',
      no_files: 'Noch keine Dateien. Bitte oben hinzufügen.',
      delete: 'Löschen'
    }
  },
  es: {
    webFooter: {
      copyright: '© {{year}} {{brand}}. Todos los derechos reservados.'
    },
    toolDetail: {
      options: {
        inline_css: 'CSS en línea',
        json_indent: 'Sangría JSON',
        watermark_size: 'Tamaño de la marca de agua',
        watermark_position: 'Posición de la marca de agua',
        watermark_angle: 'Ángulo de la marca de agua'
      },
      messages: {
        files_added_success: 'Se añadieron {{count}} archivo(s)',
        folder_invalid_filtered: 'Se filtraron {{count}} archivo(s) no válidos',
        folder_no_valid_files: 'No se encontraron archivos {{source}} válidos en esta carpeta',
        save_operation_failed: 'La operación de guardado falló',
        zip_download_failed: 'La descarga ZIP falló',
        conversion_cancelled: 'Conversión cancelada',
        pdf_page_range_invalid: 'Introduce un rango de páginas PDF válido',
        docx_page_range_invalid: 'Introduce un rango de páginas válido, por ejemplo 1-3,5',
        animation_delay_invalid: 'Introduce un retardo de animación válido entre 10 y 5000',
        background_color_invalid: 'Introduce un color de fondo válido, por ejemplo #ffffff',
        watermark_color_invalid: 'Introduce un color de marca de agua válido, por ejemplo #cccccc',
        ppt_video_wait: 'La conversión de PPT a video puede tardar un poco. Espera.',
        operation_cancelled: 'Operación cancelada',
        not_implemented: 'Esta conversión todavía no está implementada',
        conversion_success: 'Conversión completada',
        conversion_completed_mixed: 'Conversión finalizada. {{success}} correctas, {{failed}} fallidas.',
        conversion_process_error: 'Error en el proceso de conversión: {{error}}',
        restart_required: 'Función no disponible. Reinicia la aplicación e inténtalo de nuevo.'
      },
      cancel_conversion: 'Cancelar conversión',
      no_files: 'Aún no hay archivos. Añádelos arriba.'
    }
  },
  fr: {
    webFooter: {
      copyright: '© {{year}} {{brand}}. Tous droits réservés.'
    },
    toolDetail: {
      options: {
        image_quality: "Qualité de l'image",
        preview_html: 'Aperçu HTML',
        quality_range: 'Plage de qualité',
        watermark_info: 'Paramètres du filigrane',
        watermark_opacity: 'Opacité du filigrane'
      },
      messages: {
        files_added_success: '{{count}} fichier(s) ajouté(s)',
        folder_invalid_filtered: '{{count}} fichier(s) invalide(s) ont été filtré(s)',
        folder_no_valid_files: 'Aucun fichier {{source}} valide trouvé dans ce dossier',
        no_downloadable_files: 'Aucun fichier téléchargeable disponible',
        save_success: '{{count}} fichier(s) enregistré(s)',
        save_failed: "Échec de l'enregistrement : {{error}}",
        save_operation_failed: "Échec de l'opération d'enregistrement",
        cannot_access_folder: "Impossible d'accéder au dossier sélectionné",
        batch_download_started: 'Téléchargement démarré',
        zip_download_success: 'Téléchargement ZIP terminé',
        zip_download_failed: 'Échec du téléchargement ZIP',
        conversion_cancelled: 'Conversion annulée',
        animation_delay_invalid: "Veuillez saisir un délai d'animation valide entre 10 et 5000",
        background_color_invalid: "Veuillez saisir une couleur d'arrière-plan valide, par exemple #ffffff",
        ppt_video_wait: 'La conversion PPT en vidéo peut prendre un certain temps. Veuillez patienter.',
        converting_video_wait: 'Conversion de la vidéo en cours, veuillez patienter...',
        operation_cancelled: 'Opération annulée',
        not_implemented: "Cette conversion n'est pas encore implémentée",
        conversion_success: 'Conversion réussie',
        conversion_completed_mixed: 'Conversion terminée. {{success}} réussie(s), {{failed}} échouée(s).',
        restart_required: "Fonction indisponible. Redémarrez l'application et réessayez."
      },
      select_all: 'Tout sélectionner',
      deselect_all: 'Tout désélectionner',
      download: 'Télécharger',
      download_file: 'Télécharger le fichier',
      zip_download_title: 'Télécharger en ZIP',
      download_to_folder_title: 'Télécharger vers un dossier',
      html_preview: 'Aperçu HTML'
    }
  },
  hi: {
    webHeader: {
      brand_subtitle: 'स्मार्ट रूपांतरण और उत्पादकता टूलबॉक्स',
      nav: {
        home: 'होम',
        ai_tools: 'AI टूल',
        office_tools: 'ऑफिस टूल',
        multimedia: 'मल्टीमीडिया',
        development_tools: 'डेवलपमेंट टूल',
        text_processing: 'टेक्स्ट प्रोसेसिंग',
        file_processing: 'फाइल प्रोसेसिंग',
        system_tools: 'सिस्टम टूल',
        life_tools: 'दैनिक उपयोग के टूल',
        industry_news: 'उद्योग समाचार',
        software_customization: 'सॉफ्टवेयर कस्टमाइजेशन'
      },
      search_aria: 'खोजें',
      search_placeholder: 'टूल, ऐप आदि खोजें',
      theme_to_dark: 'डार्क मोड पर जाएँ',
      theme_to_light: 'लाइट मोड पर जाएँ',
      menu_aria: 'नेविगेशन मेनू',
      login_register: 'लॉगिन / रजिस्टर',
      login: 'लॉगिन'
    },
    webFooter: {
      description: 'हम व्यक्तियों और व्यवसायों के लिए उच्च-गुणवत्ता वाले AI टूल और परामर्श सेवाएँ प्रदान करते हैं, ताकि आप दक्ष और प्रतिस्पर्धी बने रहें।',
      sections: {
        quick_links: 'त्वरित लिंक',
        tool_categories: 'टूल श्रेणियाँ',
        contact_us: 'संपर्क करें'
      },
      quick_links: {
        home: 'होम',
        ai_tools: 'AI टूल',
        custom_service: 'परामर्श सेवाएँ',
        industry_news: 'उद्योग समाचार',
        feedback: 'फीडबैक'
      },
      tool_links: {
        text_processing: 'टेक्स्ट प्रोसेसिंग',
        image_generation: 'इमेज जेनरेशन',
        office_tools: 'ऑफिस टूल',
        file_processing: 'फाइल प्रोसेसिंग',
        code_development: 'कोड डेवलपमेंट'
      },
      contact: {
        company: 'कंपनी',
        phone: 'फोन',
        address: 'पता',
        email: 'ईमेल'
      },
      copyright: '© {{year}} {{brand}}. सर्वाधिकार सुरक्षित।',
      user_agreement: 'उपयोगकर्ता समझौता',
      privacy_policy: 'गोपनीयता नीति'
    },
    toolDetail: {
      options: {
        cleanup_options: 'साफ-सफाई विकल्प',
        docx_page_range_placeholder: 'उदाहरण: 1-3,5',
        image_options: 'इमेज विकल्प',
        image_quality: 'इमेज गुणवत्ता',
        inline_css: 'इनलाइन CSS',
        json_indent: 'JSON इंडेंट',
        pipe: 'ऊर्ध्वाधर रेखा (|)',
        preview_html: 'HTML पूर्वावलोकन',
        quality_range: 'गुणवत्ता सीमा',
        remove_css: 'CSS हटाएँ',
        watermark_info: 'वॉटरमार्क सेटिंग्स',
        watermark_text: 'वॉटरमार्क टेक्स्ट',
        watermark_size: 'वॉटरमार्क आकार',
        watermark_opacity: 'वॉटरमार्क अपारदर्शिता',
        watermark_position: 'वॉटरमार्क स्थिति',
        watermark_angle: 'वॉटरमार्क कोण',
        watermark_color: 'वॉटरमार्क रंग'
      },
      messages: {
        files_added_success: '{{count}} फाइल जोड़ी गई',
        folder_invalid_filtered: '{{count}} अमान्य फाइलें फ़िल्टर की गईं',
        folder_no_valid_files: 'इस फ़ोल्डर में कोई वैध {{source}} फाइल नहीं मिली',
        no_downloadable_files: 'डाउनलोड करने योग्य कोई फाइल उपलब्ध नहीं है',
        saving_files: 'फाइलें सहेजी जा रही हैं...',
        save_success: '{{count}} फाइलें सहेजी गईं',
        save_failed: 'सहेजना असफल: {{error}}',
        save_operation_failed: 'सहेजने की प्रक्रिया असफल रही',
        cannot_access_folder: 'चयनित फ़ोल्डर तक पहुँचा नहीं जा सकता',
        batch_download_started: 'डाउनलोड शुरू हो गया',
        packaging_files: 'फाइलें पैक की जा रही हैं...',
        zip_download_success: 'ZIP डाउनलोड पूरा हुआ',
        zip_download_failed: 'ZIP डाउनलोड असफल रहा',
        conversion_cancelled: 'रूपांतरण रद्द किया गया',
        pdf_page_range_invalid: 'कृपया वैध PDF पृष्ठ सीमा दर्ज करें',
        docx_page_range_invalid: 'कृपया वैध पृष्ठ सीमा दर्ज करें, जैसे 1-3,5',
        animation_delay_invalid: 'कृपया 10 से 5000 के बीच वैध एनीमेशन विलंब दर्ज करें',
        background_color_invalid: 'कृपया वैध पृष्ठभूमि रंग दर्ज करें, जैसे #ffffff',
        watermark_color_invalid: 'कृपया वैध वॉटरमार्क रंग दर्ज करें, जैसे #cccccc',
        ppt_video_wait: 'PPT से वीडियो रूपांतरण में कुछ समय लग सकता है। कृपया प्रतीक्षा करें।',
        converting_video_wait: 'वीडियो रूपांतरित किया जा रहा है, कृपया प्रतीक्षा करें...',
        processing_files: 'फाइलें संसाधित की जा रही हैं...',
        operation_cancelled: 'ऑपरेशन रद्द किया गया',
        not_implemented: 'यह रूपांतरण अभी लागू नहीं किया गया है',
        conversion_success: 'रूपांतरण सफल रहा',
        conversion_completed_mixed: 'रूपांतरण पूरा हुआ। {{success}} सफल, {{failed}} असफल।',
        conversion_process_error: 'रूपांतरण प्रक्रिया त्रुटि: {{error}}',
        restart_required: 'यह सुविधा उपलब्ध नहीं है। कृपया ऐप को पुनः प्रारंभ करें और फिर प्रयास करें।',
        unknown_error: 'अज्ञात त्रुटि'
      },
      breadcrumb_home: 'होम',
      breadcrumb_tools: '{{source}} टूल',
      breadcrumb_current: '{{source}} से {{target}}',
      title: '{{source}} से {{target}} कनवर्टर',
      file_list: 'फाइल सूची',
      select_all: 'सभी चुनें',
      deselect_all: 'सभी का चयन हटाएँ',
      cancel_conversion: 'रूपांतरण रद्द करें',
      no_files: 'अभी तक कोई फाइल नहीं है। कृपया ऊपर से जोड़ें।',
      status_converting: 'रूपांतरण हो रहा है...',
      download: 'डाउनलोड',
      download_file: 'फाइल डाउनलोड करें',
      delete: 'हटाएँ',
      error: 'त्रुटि',
      progress_processing: 'प्रसंस्करण {{current}} / {{total}}',
      zip_download_title: 'ZIP के रूप में डाउनलोड करें',
      zip_download_desc: 'सभी रूपांतरित फाइलों को एक ZIP आर्काइव में पैक करें',
      download_to_folder_title: 'फ़ोल्डर में डाउनलोड करें',
      html_preview: 'HTML पूर्वावलोकन'
    }
  },
  ja: {
    webHeader: {
      brand_subtitle: 'スマート変換と生産性ツールボックス',
      nav: {
        home: 'ホーム',
        ai_tools: 'AIツール',
        office_tools: 'オフィスツール',
        multimedia: 'マルチメディア',
        development_tools: '開発ツール',
        text_processing: 'テキスト処理',
        file_processing: 'ファイル処理',
        system_tools: 'システムツール',
        life_tools: '生活ツール',
        industry_news: '業界ニュース',
        software_customization: 'ソフトウェアカスタマイズ'
      },
      search_aria: '検索',
      search_placeholder: 'ツール、アプリなどを検索',
      theme_to_dark: 'ダークモードに切り替え',
      theme_to_light: 'ライトモードに切り替え',
      menu_aria: 'ナビゲーションメニュー',
      login_register: 'ログイン / 登録',
      login: 'ログイン'
    },
    webFooter: {
      description: '個人と企業向けに高品質なAIツールとコンサルティングサービスを提供し、効率と競争力の維持を支援します。',
      sections: {
        quick_links: 'クイックリンク',
        tool_categories: 'ツールカテゴリ',
        contact_us: 'お問い合わせ'
      },
      quick_links: {
        home: 'ホーム',
        ai_tools: 'AIツール',
        custom_service: 'コンサルティングサービス',
        industry_news: '業界ニュース',
        feedback: 'フィードバック'
      },
      tool_links: {
        text_processing: 'テキスト処理',
        image_generation: '画像生成',
        office_tools: 'オフィスツール',
        file_processing: 'ファイル処理',
        code_development: 'コード開発'
      },
      contact: {
        company: '会社',
        phone: '電話',
        address: '住所',
        email: 'メール'
      },
      copyright: '© {{year}} {{brand}}. 無断転載を禁じます。',
      user_agreement: '利用規約',
      privacy_policy: 'プライバシーポリシー'
    },
    toolDetail: {
      options: {
        cleanup_options: 'クリーンアップオプション',
        docx_page_range_placeholder: '例: 1-3,5',
        image_options: '画像オプション',
        image_quality: '画像品質',
        inline_css: 'インライン CSS',
        json_indent: 'JSON インデント',
        pipe: '縦棒 (|)',
        preview_html: 'HTML プレビュー',
        quality_range: '品質範囲',
        remove_css: 'CSS を削除',
        watermark_info: '透かし設定',
        watermark_text: '透かしテキスト',
        watermark_size: '透かしサイズ',
        watermark_opacity: '透かしの不透明度',
        watermark_position: '透かし位置',
        watermark_angle: '透かし角度',
        watermark_color: '透かし色'
      },
      messages: {
        files_added_success: '{{count}} 件のファイルを追加しました',
        folder_invalid_filtered: '{{count}} 件の無効なファイルを除外しました',
        folder_no_valid_files: 'このフォルダには有効な {{source}} ファイルが見つかりません',
        no_downloadable_files: 'ダウンロード可能なファイルがありません',
        saving_files: 'ファイルを保存しています...',
        save_success: '{{count}} 件のファイルを保存しました',
        save_failed: '保存に失敗しました: {{error}}',
        save_operation_failed: '保存操作に失敗しました',
        cannot_access_folder: '選択したフォルダにアクセスできません',
        batch_download_started: 'ダウンロードを開始しました',
        packaging_files: 'ファイルをパッケージしています...',
        zip_download_success: 'ZIP ダウンロードが完了しました',
        zip_download_failed: 'ZIP ダウンロードに失敗しました',
        conversion_cancelled: '変換をキャンセルしました',
        pdf_page_range_invalid: '有効な PDF ページ範囲を入力してください',
        docx_page_range_invalid: '有効なページ範囲を入力してください（例: 1-3,5）',
        animation_delay_invalid: '10 から 5000 の間で有効なアニメーション遅延を入力してください',
        background_color_invalid: '有効な背景色を入力してください（例: #ffffff）',
        watermark_color_invalid: '有効な透かし色を入力してください（例: #cccccc）',
        ppt_video_wait: 'PPT から動画への変換には時間がかかる場合があります。しばらくお待ちください。',
        converting_video_wait: '動画を変換しています。しばらくお待ちください...',
        processing_files: 'ファイルを処理しています...',
        operation_cancelled: '操作をキャンセルしました',
        not_implemented: 'この変換はまだ実装されていません',
        conversion_success: '変換に成功しました',
        conversion_completed_mixed: '変換が完了しました。成功 {{success}} 件、失敗 {{failed}} 件。',
        conversion_process_error: '変換処理エラー: {{error}}',
        restart_required: 'この機能は現在利用できません。アプリを再起動して再試行してください。',
        unknown_error: '不明なエラー'
      },
      breadcrumb_home: 'ホーム',
      breadcrumb_tools: '{{source}} ツール',
      breadcrumb_current: '{{source}} から {{target}}',
      title: '{{source}} から {{target}} への変換',
      file_list: 'ファイル一覧',
      select_all: 'すべて選択',
      deselect_all: 'すべて選択解除',
      cancel_conversion: '変換をキャンセル',
      no_files: 'まだファイルがありません。上から追加してください。',
      status_converting: '変換中...',
      download: 'ダウンロード',
      download_file: 'ファイルをダウンロード',
      delete: '削除',
      error: 'エラー',
      progress_processing: '処理中 {{current}} / {{total}}',
      zip_download_title: 'ZIP としてダウンロード',
      zip_download_desc: '変換されたすべてのファイルを 1 つの ZIP アーカイブにまとめます',
      download_to_folder_title: 'フォルダにダウンロード',
      html_preview: 'HTML プレビュー'
    }
  },
  ko: {
    webHeader: {
      brand_subtitle: '스마트 변환 및 생산성 도구함',
      nav: {
        home: '홈',
        ai_tools: 'AI 도구',
        office_tools: '오피스 도구',
        multimedia: '멀티미디어',
        development_tools: '개발 도구',
        text_processing: '텍스트 처리',
        file_processing: '파일 처리',
        system_tools: '시스템 도구',
        life_tools: '생활 도구',
        industry_news: '업계 뉴스',
        software_customization: '소프트웨어 맞춤 설정'
      },
      search_aria: '검색',
      search_placeholder: '도구, 앱 등을 검색하세요',
      theme_to_dark: '다크 모드로 전환',
      theme_to_light: '라이트 모드로 전환',
      menu_aria: '탐색 메뉴',
      login_register: '로그인 / 회원가입',
      login: '로그인'
    },
    webFooter: {
      description: '개인과 기업을 위한 고품질 AI 도구와 컨설팅 서비스를 제공하여 효율성과 경쟁력을 유지할 수 있도록 돕습니다.',
      sections: {
        quick_links: '빠른 링크',
        tool_categories: '도구 카테고리',
        contact_us: '문의하기'
      },
      quick_links: {
        home: '홈',
        ai_tools: 'AI 도구',
        custom_service: '컨설팅 서비스',
        industry_news: '업계 뉴스',
        feedback: '피드백'
      },
      tool_links: {
        text_processing: '텍스트 처리',
        image_generation: '이미지 생성',
        office_tools: '오피스 도구',
        file_processing: '파일 처리',
        code_development: '코드 개발'
      },
      contact: {
        company: '회사',
        phone: '전화',
        address: '주소',
        email: '이메일'
      },
      copyright: '© {{year}} {{brand}}. 모든 권리 보유.',
      user_agreement: '이용약관',
      privacy_policy: '개인정보 처리방침'
    },
    toolDetail: {
      options: {
        cleanup_options: '정리 옵션',
        docx_page_range_placeholder: '예: 1-3,5',
        image_options: '이미지 옵션',
        image_quality: '이미지 품질',
        inline_css: '인라인 CSS',
        json_indent: 'JSON 들여쓰기',
        pipe: '세로 막대 (|)',
        preview_html: 'HTML 미리보기',
        quality_range: '품질 범위',
        remove_css: 'CSS 제거',
        watermark_info: '워터마크 설정',
        watermark_text: '워터마크 텍스트',
        watermark_size: '워터마크 크기',
        watermark_opacity: '워터마크 불투명도',
        watermark_position: '워터마크 위치',
        watermark_angle: '워터마크 각도',
        watermark_color: '워터마크 색상'
      },
      messages: {
        files_added_success: '{{count}}개 파일이 추가되었습니다',
        folder_invalid_filtered: '{{count}}개 잘못된 파일이 필터링되었습니다',
        folder_no_valid_files: '이 폴더에서 유효한 {{source}} 파일을 찾을 수 없습니다',
        no_downloadable_files: '다운로드할 수 있는 파일이 없습니다',
        saving_files: '파일을 저장하는 중...',
        save_success: '{{count}}개 파일을 저장했습니다',
        save_failed: '저장 실패: {{error}}',
        save_operation_failed: '저장 작업에 실패했습니다',
        cannot_access_folder: '선택한 폴더에 접근할 수 없습니다',
        batch_download_started: '다운로드가 시작되었습니다',
        packaging_files: '파일을 패키징하는 중...',
        zip_download_success: 'ZIP 다운로드가 완료되었습니다',
        zip_download_failed: 'ZIP 다운로드에 실패했습니다',
        conversion_cancelled: '변환이 취소되었습니다',
        pdf_page_range_invalid: '유효한 PDF 페이지 범위를 입력하세요',
        docx_page_range_invalid: '예: 1-3,5 와 같은 유효한 페이지 범위를 입력하세요',
        animation_delay_invalid: '10에서 5000 사이의 유효한 애니메이션 지연 시간을 입력하세요',
        background_color_invalid: '예: #ffffff 와 같은 유효한 배경색을 입력하세요',
        watermark_color_invalid: '예: #cccccc 와 같은 유효한 워터마크 색상을 입력하세요',
        ppt_video_wait: 'PPT를 비디오로 변환하는 데 시간이 걸릴 수 있습니다. 잠시만 기다려 주세요.',
        converting_video_wait: '비디오를 변환하는 중입니다. 잠시만 기다려 주세요...',
        processing_files: '파일을 처리하는 중...',
        operation_cancelled: '작업이 취소되었습니다',
        not_implemented: '이 변환은 아직 구현되지 않았습니다',
        conversion_success: '변환이 완료되었습니다',
        conversion_completed_mixed: '변환 완료. 성공 {{success}}개, 실패 {{failed}}개.',
        conversion_process_error: '변환 프로세스 오류: {{error}}',
        restart_required: '기능을 사용할 수 없습니다. 앱을 다시 시작한 후 다시 시도하세요.',
        unknown_error: '알 수 없는 오류'
      },
      breadcrumb_home: '홈',
      breadcrumb_tools: '{{source}} 도구',
      breadcrumb_current: '{{source}}에서 {{target}}로',
      title: '{{source}}에서 {{target}}로 변환',
      file_list: '파일 목록',
      select_all: '모두 선택',
      deselect_all: '모두 선택 해제',
      cancel_conversion: '변환 취소',
      no_files: '아직 파일이 없습니다. 위에서 추가하세요.',
      status_converting: '변환 중...',
      download: '다운로드',
      download_file: '파일 다운로드',
      delete: '삭제',
      error: '오류',
      progress_processing: '처리 중 {{current}} / {{total}}',
      zip_download_title: 'ZIP으로 다운로드',
      zip_download_desc: '변환된 모든 파일을 하나의 ZIP 아카이브로 묶기',
      download_to_folder_title: '폴더에 다운로드',
      html_preview: 'HTML 미리보기'
    }
  },
  ru: {
    webHeader: {
      brand_subtitle: 'Умный набор инструментов для конвертации и продуктивности',
      nav: {
        home: 'Главная',
        ai_tools: 'Инструменты AI',
        office_tools: 'Офисные инструменты',
        multimedia: 'Мультимедиа',
        development_tools: 'Инструменты разработки',
        text_processing: 'Обработка текста',
        file_processing: 'Обработка файлов',
        system_tools: 'Системные инструменты',
        life_tools: 'Повседневные инструменты',
        industry_news: 'Новости отрасли',
        software_customization: 'Настройка ПО'
      },
      search_aria: 'Поиск',
      search_placeholder: 'Ищите инструменты, приложения и другое',
      theme_to_dark: 'Переключить на тёмную тему',
      theme_to_light: 'Переключить на светлую тему',
      menu_aria: 'Меню навигации',
      login_register: 'Войти / Регистрация',
      login: 'Войти'
    },
    webFooter: {
      description: 'Мы предоставляем качественные AI-инструменты и консультационные услуги для частных пользователей и бизнеса, помогая вам сохранять эффективность и конкурентоспособность.',
      sections: {
        quick_links: 'Быстрые ссылки',
        tool_categories: 'Категории инструментов',
        contact_us: 'Связаться с нами'
      },
      quick_links: {
        home: 'Главная',
        ai_tools: 'Инструменты AI',
        custom_service: 'Консультационные услуги',
        industry_news: 'Новости отрасли',
        feedback: 'Обратная связь'
      },
      tool_links: {
        text_processing: 'Обработка текста',
        image_generation: 'Генерация изображений',
        office_tools: 'Офисные инструменты',
        file_processing: 'Обработка файлов',
        code_development: 'Разработка кода'
      },
      contact: {
        company: 'Компания',
        phone: 'Телефон',
        address: 'Адрес',
        email: 'Эл. почта'
      },
      copyright: '© {{year}} {{brand}}. Все права защищены.',
      user_agreement: 'Пользовательское соглашение',
      privacy_policy: 'Политика конфиденциальности'
    },
    toolDetail: {
      options: {
        cleanup_options: 'Параметры очистки',
        docx_page_range_placeholder: 'Пример: 1-3,5',
        image_options: 'Параметры изображения',
        image_quality: 'Качество изображения',
        inline_css: 'Встроенный CSS',
        json_indent: 'Отступ JSON',
        pipe: 'Вертикальная черта (|)',
        preview_html: 'Предпросмотр HTML',
        quality_range: 'Диапазон качества',
        remove_css: 'Удалить CSS',
        watermark_info: 'Настройки водяного знака',
        watermark_text: 'Текст водяного знака',
        watermark_size: 'Размер водяного знака',
        watermark_opacity: 'Непрозрачность водяного знака',
        watermark_position: 'Положение водяного знака',
        watermark_angle: 'Угол водяного знака',
        watermark_color: 'Цвет водяного знака'
      },
      messages: {
        files_added_success: 'Добавлено файлов: {{count}}',
        folder_invalid_filtered: 'Отфильтровано недопустимых файлов: {{count}}',
        folder_no_valid_files: 'В этой папке не найдено допустимых файлов {{source}}',
        no_downloadable_files: 'Нет файлов для скачивания',
        saving_files: 'Сохранение файлов...',
        save_success: 'Сохранено файлов: {{count}}',
        save_failed: 'Ошибка сохранения: {{error}}',
        save_operation_failed: 'Операция сохранения не удалась',
        cannot_access_folder: 'Не удаётся получить доступ к выбранной папке',
        batch_download_started: 'Загрузка началась',
        packaging_files: 'Упаковка файлов...',
        zip_download_success: 'Загрузка ZIP завершена',
        zip_download_failed: 'Ошибка загрузки ZIP',
        conversion_cancelled: 'Конвертация отменена',
        pdf_page_range_invalid: 'Введите допустимый диапазон страниц PDF',
        docx_page_range_invalid: 'Введите допустимый диапазон страниц, например 1-3,5',
        animation_delay_invalid: 'Введите допустимую задержку анимации от 10 до 5000',
        background_color_invalid: 'Введите допустимый цвет фона, например #ffffff',
        watermark_color_invalid: 'Введите допустимый цвет водяного знака, например #cccccc',
        ppt_video_wait: 'Конвертация PPT в видео может занять некоторое время. Пожалуйста, подождите.',
        converting_video_wait: 'Идёт конвертация видео, пожалуйста, подождите...',
        processing_files: 'Обработка файлов...',
        operation_cancelled: 'Операция отменена',
        not_implemented: 'Эта конвертация ещё не реализована',
        conversion_success: 'Конвертация выполнена успешно',
        conversion_completed_mixed: 'Конвертация завершена. Успешно: {{success}}, неудачно: {{failed}}.',
        conversion_process_error: 'Ошибка процесса конвертации: {{error}}',
        restart_required: 'Функция недоступна. Перезапустите приложение и попробуйте снова.',
        unknown_error: 'Неизвестная ошибка'
      },
      breadcrumb_home: 'Главная',
      breadcrumb_tools: 'Инструменты {{source}}',
      breadcrumb_current: '{{source}} в {{target}}',
      title: 'Конвертер {{source}} в {{target}}',
      file_list: 'Список файлов',
      select_all: 'Выбрать все',
      deselect_all: 'Снять выделение',
      cancel_conversion: 'Отменить конвертацию',
      no_files: 'Файлов пока нет. Добавьте их выше.',
      status_converting: 'Конвертация...',
      download: 'Скачать',
      download_file: 'Скачать файл',
      delete: 'Удалить',
      error: 'Ошибка',
      progress_processing: 'Обработка {{current}} / {{total}}',
      zip_download_title: 'Скачать как ZIP',
      zip_download_desc: 'Упаковать все конвертированные файлы в один ZIP-архив',
      download_to_folder_title: 'Скачать в папку',
      html_preview: 'Предпросмотр HTML'
    }
  },
  id: {
    webFooter: {
      copyright: '© {{year}} {{brand}}. Hak cipta dilindungi.'
    }
  },
  it: {
    webFooter: {
      copyright: '© {{year}} {{brand}}. Tutti i diritti riservati.'
    },
    toolDetail: {
      options: {
        image_quality: 'Qualità immagine',
        quality_range: 'Intervallo di qualità',
        watermark_opacity: 'Opacità filigrana'
      },
      messages: {
        ppt_video_wait: 'La conversione da PPT a video può richiedere un po\' di tempo. Attendi.',
        not_implemented: 'Questa conversione non è ancora implementata'
      }
    }
  },
  ms: {
    webFooter: {
      copyright: '© {{year}} {{brand}}. Hak cipta terpelihara.'
    }
  },
  nl: {
    webFooter: {
      copyright: '© {{year}} {{brand}}. Alle rechten voorbehouden.'
    },
    toolDetail: {
      messages: {
        not_implemented: 'Deze conversie is nog niet geïmplementeerd'
      },
      zip_download_desc: 'Verpak alle geconverteerde bestanden in één ZIP-archief'
    }
  },
  sw: {
    webFooter: {
      copyright: '© {{year}} {{brand}}. Haki zote zimehifadhiwa.'
    }
  },
  pl: {
    webHeader: {
      nav: {
        ai_tools: 'Narzędzia AI',
        office_tools: 'Narzędzia biurowe',
        development_tools: 'Narzędzia deweloperskie',
        system_tools: 'Narzędzia systemowe',
        life_tools: 'Narzędzia codzienne'
      }
    },
    webFooter: {
      quick_links: {
        ai_tools: 'Narzędzia AI'
      },
      tool_links: {
        office_tools: 'Narzędzia biurowe'
      },
      copyright: '© {{year}} {{brand}}. Wszelkie prawa zastrzeżone.'
    },
    toolDetail: {
      options: {
        docx_page_range_placeholder: 'Przykład: 1-3,5',
        image_quality: 'Jakość obrazu',
        json_indent: 'Wcięcie JSON',
        preview_html: 'Podgląd HTML',
        quality_range: 'Zakres jakości',
        remove_css: 'Usuń CSS',
        watermark_opacity: 'Przezroczystość znaku wodnego',
        watermark_angle: 'Kąt znaku wodnego'
      },
      messages: {
        files_added_success: 'Dodano {{count}} plik(ów)',
        folder_invalid_filtered: 'Odfiltrowano {{count}} nieprawidłowych plików',
        folder_no_valid_files: 'Nie znaleziono prawidłowych plików {{source}} w tym folderze',
        no_downloadable_files: 'Brak plików do pobrania',
        saving_files: 'Zapisywanie plików...',
        save_success: 'Zapisano {{count}} plik(ów)',
        save_failed: 'Zapis nie powiódł się: {{error}}',
        save_operation_failed: 'Operacja zapisu nie powiodła się',
        cannot_access_folder: 'Nie można uzyskać dostępu do wybranego folderu',
        batch_download_started: 'Rozpoczęto pobieranie',
        packaging_files: 'Pakowanie plików...',
        zip_download_success: 'Pobieranie ZIP zakończone',
        zip_download_failed: 'Pobieranie ZIP nie powiodło się',
        pdf_page_range_invalid: 'Wprowadź prawidłowy zakres stron PDF',
        docx_page_range_invalid: 'Wprowadź prawidłowy zakres stron, na przykład 1-3,5',
        animation_delay_invalid: 'Wprowadź prawidłowe opóźnienie animacji od 10 do 5000',
        background_color_invalid: 'Wprowadź prawidłowy kolor tła, na przykład #ffffff',
        watermark_color_invalid: 'Wprowadź prawidłowy kolor znaku wodnego, na przykład #cccccc',
        ppt_video_wait: 'Konwersja PPT do wideo może chwilę potrwać. Poczekaj.',
        converting_video_wait: 'Trwa konwersja wideo, proszę czekać...',
        processing_files: 'Przetwarzanie plików...',
        conversion_success: 'Konwersja zakończona pomyślnie',
        conversion_completed_mixed: 'Konwersja zakończona. Sukces: {{success}}, niepowodzenie: {{failed}}.',
        conversion_process_error: 'Błąd procesu konwersji: {{error}}',
        restart_required: 'Funkcja niedostępna. Uruchom ponownie aplikację i spróbuj ponownie.',
        unknown_error: 'Nieznany błąd'
      },
      breadcrumb_home: 'Strona główna',
      breadcrumb_tools: 'Narzędzia {{source}}',
      file_list: 'Lista plików',
      cancel_conversion: 'Anuluj konwersję',
      no_files: 'Brak plików. Dodaj je powyżej.',
      delete: 'Usuń',
      error: 'Błąd',
      html_preview: 'Podgląd HTML'
    }
  },
  pt: {
    webFooter: {
      copyright: '© {{year}} {{brand}}. Todos os direitos reservados.'
    },
    toolDetail: {
      options: {
        cleanup_options: 'Opções de limpeza',
        image_options: 'Opções de imagem',
        json_indent: 'Indentação JSON',
        preview_html: 'Pré-visualizar HTML',
        watermark_info: 'Definições de marca de água',
        watermark_text: 'Texto da marca de água',
        watermark_size: 'Tamanho da marca de água',
        watermark_opacity: 'Opacidade da marca de água',
        watermark_position: 'Posição da marca de água',
        watermark_angle: 'Ângulo da marca de água',
        watermark_color: 'Cor da marca de água'
      },
      messages: {
        folder_invalid_filtered: 'Foram filtrados {{count}} ficheiro(s) inválido(s)',
        folder_no_valid_files: 'Não foram encontrados ficheiros {{source}} válidos nesta pasta',
        no_downloadable_files: 'Não há ficheiros disponíveis para descarregar',
        save_operation_failed: 'A operação de guardar falhou',
        cannot_access_folder: 'Não é possível aceder à pasta selecionada',
        zip_download_success: 'Transferência ZIP concluída',
        conversion_cancelled: 'Conversão cancelada',
        pdf_page_range_invalid: 'Introduza um intervalo de páginas PDF válido',
        docx_page_range_invalid: 'Introduza um intervalo de páginas válido, por exemplo 1-3,5',
        animation_delay_invalid: 'Introduza um atraso de animação válido entre 10 e 5000',
        background_color_invalid: 'Introduza uma cor de fundo válida, por exemplo #ffffff',
        watermark_color_invalid: 'Introduza uma cor de marca de água válida, por exemplo #cccccc',
        ppt_video_wait: 'A conversão de PPT para vídeo pode demorar um pouco. Aguarde.',
        converting_video_wait: 'A converter vídeo, aguarde...',
        operation_cancelled: 'Operação cancelada',
        not_implemented: 'Esta conversão ainda não está implementada',
        conversion_success: 'Conversão concluída com sucesso',
        conversion_completed_mixed: 'Conversão concluída. {{success}} com sucesso, {{failed}} falharam.',
        conversion_process_error: 'Erro no processo de conversão: {{error}}',
        restart_required: 'Funcionalidade indisponível. Reinicie a aplicação e tente novamente.'
      },
      breadcrumb_home: 'Início',
      cancel_conversion: 'Cancelar conversão',
      no_files: 'Ainda não existem ficheiros. Adicione-os acima.',
      zip_download_desc: 'Empacotar todos os ficheiros convertidos num único arquivo ZIP',
      html_preview: 'Pré-visualização HTML'
    }
  },
  pt_BR: {
    webFooter: {
      copyright: '© {{year}} {{brand}}. Todos os direitos reservados.'
    },
    toolDetail: {
      options: {
        cleanup_options: 'Opções de limpeza',
        image_options: 'Opções de imagem',
        json_indent: 'Indentação JSON',
        watermark_info: "Configurações de marca d'água",
        watermark_text: "Texto da marca d'água",
        watermark_size: "Tamanho da marca d'água",
        watermark_opacity: "Opacidade da marca d'água",
        watermark_position: "Posição da marca d'água",
        watermark_angle: "Ângulo da marca d'água",
        watermark_color: "Cor da marca d'água"
      },
      messages: {
        folder_invalid_filtered: 'Foram filtrados {{count}} arquivo(s) inválido(s)',
        folder_no_valid_files: 'Nenhum arquivo {{source}} válido foi encontrado nesta pasta',
        no_downloadable_files: 'Não há arquivos disponíveis para download',
        save_operation_failed: 'A operação de salvamento falhou',
        cannot_access_folder: 'Não é possível acessar a pasta selecionada',
        zip_download_success: 'Download do ZIP concluído',
        conversion_cancelled: 'Conversão cancelada',
        pdf_page_range_invalid: 'Insira um intervalo de páginas PDF válido',
        docx_page_range_invalid: 'Insira um intervalo de páginas válido, por exemplo 1-3,5',
        animation_delay_invalid: 'Insira um atraso de animação válido entre 10 e 5000',
        background_color_invalid: 'Insira uma cor de fundo válida, por exemplo #ffffff',
        watermark_color_invalid: "Insira uma cor de marca d'água válida, por exemplo #cccccc",
        ppt_video_wait: 'A conversão de PPT para vídeo pode demorar um pouco. Aguarde.',
        converting_video_wait: 'Convertendo vídeo, aguarde...',
        operation_cancelled: 'Operação cancelada',
        not_implemented: 'Esta conversão ainda não foi implementada',
        conversion_success: 'Conversão concluída com sucesso',
        conversion_completed_mixed: 'Conversão concluída. {{success}} com sucesso, {{failed}} falharam.',
        conversion_process_error: 'Erro no processo de conversão: {{error}}',
        restart_required: 'Recurso indisponível. Reinicie o aplicativo e tente novamente.'
      },
      breadcrumb_home: 'Início',
      cancel_conversion: 'Cancelar conversão',
      no_files: 'Ainda não há arquivos. Adicione-os acima.',
      zip_download_desc: 'Empacotar todos os arquivos convertidos em um único arquivo ZIP',
      html_preview: 'Visualização HTML'
    }
  },
  tr: {
    webFooter: {
      copyright: '© {{year}} {{brand}}. Tüm hakları saklıdır.'
    },
    toolDetail: {
      options: {
        cleanup_options: 'Temizleme seçenekleri',
        docx_page_range_placeholder: 'Örnek: 1-3,5',
        image_options: 'Görüntü seçenekleri',
        image_quality: 'Görüntü kalitesi',
        inline_css: 'Satır içi CSS',
        pipe: 'Dikey çizgi (|)',
        preview_html: 'HTML önizle',
        quality_range: 'Kalite aralığı',
        remove_css: 'CSS kaldır',
        watermark_info: 'Filigran ayarları',
        watermark_opacity: 'Filigran opaklığı',
        watermark_angle: 'Filigran açısı'
      },
      messages: {
        folder_invalid_filtered: '{{count}} geçersiz dosya filtrelendi',
        folder_no_valid_files: 'Bu klasörde geçerli {{source}} dosyası bulunamadı',
        no_downloadable_files: 'İndirilebilir dosya yok',
        save_failed: 'Kaydetme başarısız: {{error}}',
        save_operation_failed: 'Kaydetme işlemi başarısız oldu',
        cannot_access_folder: 'Seçilen klasöre erişilemiyor',
        batch_download_started: 'İndirme başladı',
        zip_download_success: 'ZIP indirme tamamlandı',
        zip_download_failed: 'ZIP indirme başarısız oldu',
        conversion_cancelled: 'Dönüştürme iptal edildi',
        pdf_page_range_invalid: 'Lütfen geçerli bir PDF sayfa aralığı girin',
        docx_page_range_invalid: 'Lütfen 1-3,5 gibi geçerli bir sayfa aralığı girin',
        animation_delay_invalid: 'Lütfen 10 ile 5000 arasında geçerli bir animasyon gecikmesi girin',
        background_color_invalid: 'Lütfen #ffffff gibi geçerli bir arka plan rengi girin',
        watermark_color_invalid: 'Lütfen #cccccc gibi geçerli bir filigran rengi girin',
        ppt_video_wait: "PPT'den videoya dönüştürme biraz zaman alabilir. Lütfen bekleyin.",
        converting_video_wait: 'Video dönüştürülüyor, lütfen bekleyin...',
        processing_files: 'Dosyalar işleniyor...',
        operation_cancelled: 'İşlem iptal edildi',
        not_implemented: 'Bu dönüşüm henüz uygulanmadı',
        conversion_success: 'Başarıyla dönüştürüldü',
        conversion_completed_mixed: 'Dönüştürme tamamlandı. {{success}} başarılı, {{failed}} başarısız.',
        conversion_process_error: 'Dönüştürme süreci hatası: {{error}}',
        restart_required: 'Özellik kullanılamıyor. Lütfen uygulamayı yeniden başlatıp tekrar deneyin.'
      },
      breadcrumb_tools: '{{source}} Araçları',
      title: '{{source}} - {{target}} Dönüştürücü',
      select_all: 'Tümünü seç',
      deselect_all: 'Seçimi kaldır',
      cancel_conversion: 'Dönüştürmeyi iptal et',
      no_files: 'Henüz dosya yok. Lütfen yukarıdan ekleyin.',
      status_converting: 'Dönüştürülüyor...',
      download: 'İndir',
      download_file: 'Dosyayı indir',
      progress_processing: 'İşleniyor {{current}} / {{total}}',
      zip_download_desc: 'Dönüştürülen tüm dosyaları tek bir ZIP arşivinde paketle',
      download_to_folder_title: 'Klasöre indir',
      html_preview: 'HTML önizlemesi'
    }
  },
  vi: {
    webFooter: {
      copyright: '© {{year}} {{brand}}. Bảo lưu mọi quyền.'
    },
    toolDetail: {
      options: {
        cleanup_options: 'Tùy chọn dọn dẹp',
        docx_page_range_placeholder: 'Ví dụ: 1-3,5',
        image_options: 'Tùy chọn hình ảnh',
        image_quality: 'Chất lượng hình ảnh',
        inline_css: 'CSS nội tuyến',
        json_indent: 'Thụt lề JSON',
        pipe: 'Dấu gạch đứng (|)',
        preview_html: 'Xem trước HTML',
        quality_range: 'Phạm vi chất lượng',
        remove_css: 'Xóa CSS',
        watermark_info: 'Cài đặt hình mờ',
        watermark_text: 'Văn bản hình mờ',
        watermark_size: 'Kích thước hình mờ',
        watermark_opacity: 'Độ mờ hình mờ',
        watermark_position: 'Vị trí hình mờ',
        watermark_angle: 'Góc hình mờ',
        watermark_color: 'Màu hình mờ'
      },
      messages: {
        files_added_success: 'Đã thêm {{count}} tệp',
        folder_invalid_filtered: 'Đã lọc {{count}} tệp không hợp lệ',
        folder_no_valid_files: 'Không tìm thấy tệp {{source}} hợp lệ trong thư mục này',
        no_downloadable_files: 'Không có tệp nào có thể tải xuống',
        saving_files: 'Đang lưu tệp...',
        save_success: 'Đã lưu {{count}} tệp',
        save_failed: 'Lưu thất bại: {{error}}',
        save_operation_failed: 'Thao tác lưu thất bại',
        cannot_access_folder: 'Không thể truy cập thư mục đã chọn',
        batch_download_started: 'Đã bắt đầu tải xuống',
        packaging_files: 'Đang đóng gói tệp...',
        zip_download_success: 'Đã tải ZIP xong',
        zip_download_failed: 'Tải ZIP thất bại',
        conversion_cancelled: 'Đã hủy chuyển đổi',
        pdf_page_range_invalid: 'Vui lòng nhập phạm vi trang PDF hợp lệ',
        docx_page_range_invalid: 'Vui lòng nhập phạm vi trang hợp lệ, ví dụ 1-3,5',
        animation_delay_invalid: 'Vui lòng nhập độ trễ hoạt ảnh hợp lệ trong khoảng 10 đến 5000',
        background_color_invalid: 'Vui lòng nhập màu nền hợp lệ, ví dụ #ffffff',
        watermark_color_invalid: 'Vui lòng nhập màu hình mờ hợp lệ, ví dụ #cccccc',
        ppt_video_wait: 'Chuyển đổi PPT sang video có thể mất một lúc. Vui lòng chờ.',
        converting_video_wait: 'Đang chuyển đổi video, vui lòng chờ...',
        processing_files: 'Đang xử lý tệp...',
        operation_cancelled: 'Thao tác đã bị hủy',
        not_implemented: 'Chuyển đổi này chưa được triển khai',
        conversion_success: 'Chuyển đổi thành công',
        conversion_completed_mixed: 'Chuyển đổi hoàn tất. Thành công {{success}}, thất bại {{failed}}.',
        conversion_process_error: 'Lỗi trong quá trình chuyển đổi: {{error}}',
        restart_required: 'Tính năng không khả dụng. Vui lòng khởi động lại ứng dụng rồi thử lại.',
        unknown_error: 'Lỗi không xác định'
      },
      breadcrumb_home: 'Trang chủ',
      breadcrumb_tools: 'Công cụ {{source}}',
      title: 'Bộ chuyển đổi {{source}} sang {{target}}',
      file_list: 'Danh sách tệp',
      select_all: 'Chọn tất cả',
      deselect_all: 'Bỏ chọn tất cả',
      cancel_conversion: 'Hủy chuyển đổi',
      no_files: 'Chưa có tệp nào. Vui lòng thêm ở trên.',
      status_converting: 'Đang chuyển đổi...',
      download: 'Tải xuống',
      download_file: 'Tải tệp',
      delete: 'Xóa',
      error: 'Lỗi',
      progress_processing: 'Đang xử lý {{current}} / {{total}}',
      zip_download_title: 'Tải dưới dạng ZIP',
      zip_download_desc: 'Đóng gói tất cả các tệp đã chuyển đổi vào một tệp ZIP',
      download_to_folder_title: 'Tải vào thư mục',
      html_preview: 'Xem trước HTML'
    }
  },
  tl: {
    webFooter: {
      copyright: '© {{year}} {{brand}}. Lahat ng karapatan ay nakalaan.'
    }
  },
  ta: {
    webHeader: {
      brand_subtitle: 'ஸ்மார்ட் மாற்றம் மற்றும் உற்பத்தித்திறன் கருவிப்பெட்டி',
      nav: {
        home: 'முகப்பு',
        ai_tools: 'AI கருவிகள்',
        office_tools: 'அலுவலக கருவிகள்',
        multimedia: 'பல்மீடியா',
        development_tools: 'உருவாக்க கருவிகள்',
        text_processing: 'உரை செயலாக்கம்',
        file_processing: 'கோப்பு செயலாக்கம்',
        system_tools: 'அமைப்பு கருவிகள்',
        life_tools: 'நாளாந்த கருவிகள்',
        industry_news: 'தொழில் செய்திகள்',
        software_customization: 'மென்பொருள் தனிப்பயனாக்கம்'
      },
      search_aria: 'தேடல்',
      search_placeholder: 'கருவிகள், பயன்பாடுகள் போன்றவற்றைத் தேடுங்கள்',
      theme_to_dark: 'டார்க் முறைக்கு மாற்று',
      theme_to_light: 'லைட் முறைக்கு மாற்று',
      menu_aria: 'வழிசெலுத்தல் பட்டி',
      login_register: 'உள்நுழை / பதிவு',
      login: 'உள்நுழை'
    },
    webFooter: {
      description: 'தனிநபர்கள் மற்றும் நிறுவனங்களுக்கு உயர்தர AI கருவிகளும் ஆலோசனை சேவைகளும் வழங்கி, உங்கள் செயல்திறன் மற்றும் போட்டித்தன்மையை պահպանிக்க உதவுகிறோம்.',
      sections: {
        quick_links: 'விரைவு இணைப்புகள்',
        tool_categories: 'கருவி வகைகள்',
        contact_us: 'எங்களை தொடர்புகொள்ள'
      },
      quick_links: {
        home: 'முகப்பு',
        ai_tools: 'AI கருவிகள்',
        custom_service: 'ஆலோசனை சேவைகள்',
        industry_news: 'தொழில் செய்திகள்',
        feedback: 'கருத்து'
      },
      tool_links: {
        text_processing: 'உரை செயலாக்கம்',
        image_generation: 'பட உருவாக்கம்',
        office_tools: 'அலுவலக கருவிகள்',
        file_processing: 'கோப்பு செயலாக்கம்',
        code_development: 'குறியீட்டு மேம்பாடு'
      },
      contact: {
        company: 'நிறுவனம்',
        phone: 'தொலைபேசி',
        address: 'முகவரி',
        email: 'மின்னஞ்சல்'
      },
      copyright: '© {{year}} {{brand}}. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
      user_agreement: 'பயனர் ஒப்பந்தம்',
      privacy_policy: 'தனியுரிமைக் கொள்கை'
    },
    toolDetail: {
      options: {
        cleanup_options: 'சுத்தப்படுத்தும் விருப்பங்கள்',
        docx_page_range_placeholder: 'உதாரணம்: 1-3,5',
        image_options: 'பட விருப்பங்கள்',
        image_quality: 'படத் தரம்',
        inline_css: 'Inline CSS',
        json_indent: 'JSON இடைவெளி',
        pipe: 'செங்குத்து கோடு (|)',
        preview_html: 'HTML முன்னோட்டம்',
        quality_range: 'தர வரம்பு',
        remove_css: 'CSS அகற்று',
        watermark_info: 'வாட்டர்மார்க் அமைப்புகள்',
        watermark_text: 'வாட்டர்மார்க் உரை',
        watermark_size: 'வாட்டர்மார்க் அளவு',
        watermark_opacity: 'வாட்டர்மார்க் தெளிவுத்தன்மை',
        watermark_position: 'வாட்டர்மார்க் இடம்',
        watermark_angle: 'வாட்டர்மார்க் கோணம்',
        watermark_color: 'வாட்டர்மார்க் நிறம்'
      },
      messages: {
        files_added_success: '{{count}} கோப்புகள் சேர்க்கப்பட்டன',
        folder_invalid_filtered: '{{count}} தவறான கோப்புகள் வடிகட்டப்பட்டன',
        folder_no_valid_files: 'இந்த அடைவில் செல்லுபடியாகும் {{source}} கோப்புகள் இல்லை',
        no_downloadable_files: 'பதிவிறக்கக்கூடிய கோப்புகள் இல்லை',
        saving_files: 'கோப்புகள் சேமிக்கப்படுகின்றன...',
        save_success: '{{count}} கோப்புகள் சேமிக்கப்பட்டன',
        save_failed: 'சேமிப்பு தோல்வி: {{error}}',
        save_operation_failed: 'சேமிப்பு செயல்பாடு தோல்வியுற்றது',
        cannot_access_folder: 'தேர்ந்தெடுக்கப்பட்ட அடைவிற்கு அணுக முடியவில்லை',
        batch_download_started: 'பதிவிறக்கம் தொடங்கியது',
        packaging_files: 'கோப்புகள் தொகுக்கப்படுகின்றன...',
        zip_download_success: 'ZIP பதிவிறக்கம் முடிந்தது',
        zip_download_failed: 'ZIP பதிவிறக்கம் தோல்வியுற்றது',
        conversion_cancelled: 'மாற்றம் ரத்து செய்யப்பட்டது',
        pdf_page_range_invalid: 'செல்லுபடியாகும் PDF பக்க வரம்பை உள்ளிடவும்',
        docx_page_range_invalid: 'செல்லுபடியாகும் பக்க வரம்பை உள்ளிடவும், உதா. 1-3,5',
        animation_delay_invalid: '10 முதல் 5000 வரை செல்லுபடியாகும் அனிமேஷன் தாமதத்தை உள்ளிடவும்',
        background_color_invalid: 'செல்லுபடியாகும் பின்னணி நிறத்தை உள்ளிடவும், உதா. #ffffff',
        watermark_color_invalid: 'செல்லுபடியாகும் வாட்டர்மார்க் நிறத்தை உள்ளிடவும், உதா. #cccccc',
        ppt_video_wait: 'PPT ஐ வீடியோவாக மாற்ற சில நேரம் ஆகலாம். தயவுசெய்து காத்திருக்கவும்.',
        converting_video_wait: 'வீடியோ மாற்றப்படுகிறது, தயவுசெய்து காத்திருக்கவும்...',
        processing_files: 'கோப்புகள் செயலாக்கப்படுகின்றன...',
        operation_cancelled: 'செயல்பாடு ரத்து செய்யப்பட்டது',
        not_implemented: 'இந்த மாற்றம் இன்னும் அமல்படுத்தப்படவில்லை',
        conversion_success: 'மாற்றம் வெற்றிகரமாக முடிந்தது',
        conversion_completed_mixed: 'மாற்றம் முடிந்தது. {{success}} வெற்றி, {{failed}} தோல்வி.',
        conversion_process_error: 'மாற்ற செயல்முறை பிழை: {{error}}',
        restart_required: 'இந்த வசதி கிடைக்கவில்லை. பயன்பாட்டை மீண்டும் தொடங்கி மறுபடியும் முயற்சிக்கவும்.',
        unknown_error: 'தெரியாத பிழை'
      },
      breadcrumb_home: 'முகப்பு',
      breadcrumb_tools: '{{source}} கருவிகள்',
      breadcrumb_current: '{{source}} இலிருந்து {{target}}',
      title: '{{source}} இலிருந்து {{target}} மாற்றி',
      file_list: 'கோப்பு பட்டியல்',
      select_all: 'அனைத்தையும் தேர்ந்தெடு',
      deselect_all: 'தேர்வை நீக்கு',
      cancel_conversion: 'மாற்றத்தை ரத்து செய்',
      no_files: 'இன்னும் கோப்புகள் இல்லை. மேலிருந்து சேர்க்கவும்.',
      status_converting: 'மாற்றப்படுகிறது...',
      download: 'பதிவிறக்கு',
      download_file: 'கோப்பைப் பதிவிறக்கு',
      delete: 'நீக்கு',
      error: 'பிழை',
      progress_processing: 'செயலாக்கம் {{current}} / {{total}}',
      zip_download_title: 'ZIP ஆக பதிவிறக்கு',
      zip_download_desc: 'மாற்றப்பட்ட அனைத்து கோப்புகளையும் ஒரு ZIP காப்பகத்தில் தொகுக்கவும்',
      download_to_folder_title: 'அடைவிற்கு பதிவிறக்கு',
      html_preview: 'HTML முன்னோட்டம்'
    }
  },
  th: {
    webHeader: {
      brand_subtitle: 'กล่องเครื่องมือแปลงและเพิ่มประสิทธิภาพอัจฉริยะ',
      nav: {
        home: 'หน้าแรก',
        ai_tools: 'เครื่องมือ AI',
        office_tools: 'เครื่องมือสำนักงาน',
        multimedia: 'มัลติมีเดีย',
        development_tools: 'เครื่องมือพัฒนา',
        text_processing: 'ประมวลผลข้อความ',
        file_processing: 'ประมวลผลไฟล์',
        system_tools: 'เครื่องมือระบบ',
        life_tools: 'เครื่องมือการใช้งานประจำวัน',
        industry_news: 'ข่าวอุตสาหกรรม',
        software_customization: 'ปรับแต่งซอฟต์แวร์'
      },
      search_aria: 'ค้นหา',
      search_placeholder: 'ค้นหาเครื่องมือ แอป และอื่นๆ',
      theme_to_dark: 'สลับเป็นโหมดมืด',
      theme_to_light: 'สลับเป็นโหมดสว่าง',
      menu_aria: 'เมนูนำทาง',
      login_register: 'เข้าสู่ระบบ / สมัครสมาชิก',
      login: 'เข้าสู่ระบบ'
    },
    webFooter: {
      description: 'เราให้บริการเครื่องมือ AI และบริการที่ปรึกษาคุณภาพสูงสำหรับบุคคลและธุรกิจ เพื่อช่วยให้คุณคงประสิทธิภาพและความสามารถในการแข่งขันไว้ได้',
      sections: {
        quick_links: 'ลิงก์ด่วน',
        tool_categories: 'หมวดหมู่เครื่องมือ',
        contact_us: 'ติดต่อเรา'
      },
      quick_links: {
        home: 'หน้าแรก',
        ai_tools: 'เครื่องมือ AI',
        custom_service: 'บริการที่ปรึกษา',
        industry_news: 'ข่าวอุตสาหกรรม',
        feedback: 'ข้อเสนอแนะ'
      },
      tool_links: {
        text_processing: 'ประมวลผลข้อความ',
        image_generation: 'สร้างภาพ',
        office_tools: 'เครื่องมือสำนักงาน',
        file_processing: 'ประมวลผลไฟล์',
        code_development: 'พัฒนาโค้ด'
      },
      contact: {
        company: 'บริษัท',
        phone: 'โทรศัพท์',
        address: 'ที่อยู่',
        email: 'อีเมล'
      },
      copyright: '© {{year}} {{brand}}. สงวนลิขสิทธิ์.',
      user_agreement: 'ข้อตกลงผู้ใช้',
      privacy_policy: 'นโยบายความเป็นส่วนตัว'
    },
    toolDetail: {
      options: {
        cleanup_options: 'ตัวเลือกการล้างข้อมูล',
        docx_page_range_placeholder: 'ตัวอย่าง: 1-3,5',
        image_options: 'ตัวเลือกภาพ',
        image_quality: 'คุณภาพภาพ',
        inline_css: 'CSS แบบอินไลน์',
        json_indent: 'การเยื้อง JSON',
        pipe: 'เครื่องหมายขีดตั้ง (|)',
        preview_html: 'พรีวิว HTML',
        quality_range: 'ช่วงคุณภาพ',
        remove_css: 'ลบ CSS',
        watermark_info: 'การตั้งค่าลายน้ำ',
        watermark_text: 'ข้อความลายน้ำ',
        watermark_size: 'ขนาดลายน้ำ',
        watermark_opacity: 'ความทึบของลายน้ำ',
        watermark_position: 'ตำแหน่งลายน้ำ',
        watermark_angle: 'มุมลายน้ำ',
        watermark_color: 'สีลายน้ำ'
      },
      messages: {
        files_added_success: 'เพิ่มไฟล์แล้ว {{count}} ไฟล์',
        folder_invalid_filtered: 'กรองไฟล์ที่ไม่ถูกต้องออกแล้ว {{count}} ไฟล์',
        folder_no_valid_files: 'ไม่พบไฟล์ {{source}} ที่ถูกต้องในโฟลเดอร์นี้',
        no_downloadable_files: 'ไม่มีไฟล์ให้ดาวน์โหลด',
        saving_files: 'กำลังบันทึกไฟล์...',
        save_success: 'บันทึกไฟล์แล้ว {{count}} ไฟล์',
        save_failed: 'บันทึกล้มเหลว: {{error}}',
        save_operation_failed: 'การบันทึกล้มเหลว',
        cannot_access_folder: 'ไม่สามารถเข้าถึงโฟลเดอร์ที่เลือกได้',
        batch_download_started: 'เริ่มดาวน์โหลดแล้ว',
        packaging_files: 'กำลังจัดแพ็กไฟล์...',
        zip_download_success: 'ดาวน์โหลด ZIP เสร็จสมบูรณ์',
        zip_download_failed: 'ดาวน์โหลด ZIP ล้มเหลว',
        conversion_cancelled: 'ยกเลิกการแปลงแล้ว',
        pdf_page_range_invalid: 'กรุณากรอกช่วงหน้าของ PDF ที่ถูกต้อง',
        docx_page_range_invalid: 'กรุณากรอกช่วงหน้าที่ถูกต้อง เช่น 1-3,5',
        animation_delay_invalid: 'กรุณากรอกการหน่วงแอนิเมชันที่ถูกต้องระหว่าง 10 ถึง 5000',
        background_color_invalid: 'กรุณากรอกสีพื้นหลังที่ถูกต้อง เช่น #ffffff',
        watermark_color_invalid: 'กรุณากรอกสีลายน้ำที่ถูกต้อง เช่น #cccccc',
        ppt_video_wait: 'การแปลง PPT เป็นวิดีโออาจใช้เวลาสักครู่ โปรดรอ',
        converting_video_wait: 'กำลังแปลงวิดีโอ โปรดรอ...',
        processing_files: 'กำลังประมวลผลไฟล์...',
        operation_cancelled: 'การดำเนินการถูกยกเลิก',
        not_implemented: 'การแปลงนี้ยังไม่ได้รับการพัฒนา',
        conversion_success: 'แปลงสำเร็จ',
        conversion_completed_mixed: 'การแปลงเสร็จสิ้น สำเร็จ {{success}} ล้มเหลว {{failed}}',
        conversion_process_error: 'เกิดข้อผิดพลาดในกระบวนการแปลง: {{error}}',
        restart_required: 'ฟีเจอร์นี้ยังใช้งานไม่ได้ โปรดรีสตาร์ทแอปแล้วลองอีกครั้ง',
        unknown_error: 'ข้อผิดพลาดที่ไม่รู้จัก'
      },
      breadcrumb_home: 'หน้าแรก',
      breadcrumb_tools: 'เครื่องมือ {{source}}',
      breadcrumb_current: '{{source}} เป็น {{target}}',
      title: 'ตัวแปลง {{source}} เป็น {{target}}',
      file_list: 'รายการไฟล์',
      select_all: 'เลือกทั้งหมด',
      deselect_all: 'ยกเลิกการเลือกทั้งหมด',
      cancel_conversion: 'ยกเลิกการแปลง',
      no_files: 'ยังไม่มีไฟล์ โปรดเพิ่มจากด้านบน',
      status_converting: 'กำลังแปลง...',
      download: 'ดาวน์โหลด',
      download_file: 'ดาวน์โหลดไฟล์',
      delete: 'ลบ',
      error: 'ข้อผิดพลาด',
      progress_processing: 'กำลังประมวลผล {{current}} / {{total}}',
      zip_download_title: 'ดาวน์โหลดเป็น ZIP',
      zip_download_desc: 'รวมไฟล์ที่แปลงแล้วทั้งหมดไว้ใน ZIP ไฟล์เดียว',
      download_to_folder_title: 'ดาวน์โหลดไปยังโฟลเดอร์',
      html_preview: 'พรีวิว HTML'
    }
  },
  uk: {
    webHeader: {
      brand_subtitle: 'Розумний набір інструментів для конвертації та продуктивності',
      nav: {
        home: 'Головна',
        ai_tools: 'AI-інструменти',
        office_tools: 'Офісні інструменти',
        multimedia: 'Мультимедіа',
        development_tools: 'Інструменти розробки',
        text_processing: 'Обробка тексту',
        file_processing: 'Обробка файлів',
        system_tools: 'Системні інструменти',
        life_tools: 'Повсякденні інструменти',
        industry_news: 'Новини галузі',
        software_customization: 'Налаштування ПЗ'
      },
      search_aria: 'Пошук',
      search_placeholder: 'Шукайте інструменти, застосунки тощо',
      theme_to_dark: 'Перемкнути на темну тему',
      theme_to_light: 'Перемкнути на світлу тему',
      menu_aria: 'Меню навігації',
      login_register: 'Увійти / Зареєструватися',
      login: 'Увійти'
    },
    webFooter: {
      description: 'Ми надаємо якісні AI-інструменти та консультаційні послуги для людей і бізнесу, допомагаючи вам зберігати ефективність і конкурентоспроможність.',
      sections: {
        quick_links: 'Швидкі посилання',
        tool_categories: 'Категорії інструментів',
        contact_us: 'Зв’яжіться з нами'
      },
      quick_links: {
        home: 'Головна',
        ai_tools: 'AI-інструменти',
        custom_service: 'Консультаційні послуги',
        industry_news: 'Новини галузі',
        feedback: 'Зворотний зв’язок'
      },
      tool_links: {
        text_processing: 'Обробка тексту',
        image_generation: 'Генерація зображень',
        office_tools: 'Офісні інструменти',
        file_processing: 'Обробка файлів',
        code_development: 'Розробка коду'
      },
      contact: {
        company: 'Компанія',
        phone: 'Телефон',
        address: 'Адреса',
        email: 'Ел. пошта'
      },
      copyright: '© {{year}} {{brand}}. Усі права захищено.',
      user_agreement: 'Угода користувача',
      privacy_policy: 'Політика конфіденційності'
    },
    toolDetail: {
      options: {
        cleanup_options: 'Параметри очищення',
        docx_page_range_placeholder: 'Приклад: 1-3,5',
        image_options: 'Параметри зображення',
        image_quality: 'Якість зображення',
        inline_css: 'Вбудований CSS',
        json_indent: 'Відступ JSON',
        pipe: 'Вертикальна риска (|)',
        preview_html: 'Попередній перегляд HTML',
        quality_range: 'Діапазон якості',
        remove_css: 'Видалити CSS',
        watermark_info: 'Налаштування водяного знака',
        watermark_text: 'Текст водяного знака',
        watermark_size: 'Розмір водяного знака',
        watermark_opacity: 'Непрозорість водяного знака',
        watermark_position: 'Положення водяного знака',
        watermark_angle: 'Кут водяного знака',
        watermark_color: 'Колір водяного знака'
      },
      messages: {
        files_added_success: 'Додано файлів: {{count}}',
        folder_invalid_filtered: 'Відфільтровано недійсних файлів: {{count}}',
        folder_no_valid_files: 'У цій папці не знайдено дійсних файлів {{source}}',
        no_downloadable_files: 'Немає файлів для завантаження',
        saving_files: 'Збереження файлів...',
        save_success: 'Збережено файлів: {{count}}',
        save_failed: 'Не вдалося зберегти: {{error}}',
        save_operation_failed: 'Операція збереження не вдалась',
        cannot_access_folder: 'Немає доступу до вибраної папки',
        batch_download_started: 'Завантаження розпочато',
        packaging_files: 'Пакування файлів...',
        zip_download_success: 'ZIP завантаження завершено',
        zip_download_failed: 'Не вдалося завантажити ZIP',
        conversion_cancelled: 'Конвертацію скасовано',
        pdf_page_range_invalid: 'Введіть дійсний діапазон сторінок PDF',
        docx_page_range_invalid: 'Введіть дійсний діапазон сторінок, наприклад 1-3,5',
        animation_delay_invalid: 'Введіть дійсну затримку анімації від 10 до 5000',
        background_color_invalid: 'Введіть дійсний колір тла, наприклад #ffffff',
        watermark_color_invalid: 'Введіть дійсний колір водяного знака, наприклад #cccccc',
        ppt_video_wait: 'Конвертація PPT у відео може тривати деякий час. Будь ласка, зачекайте.',
        converting_video_wait: 'Триває конвертація відео, будь ласка, зачекайте...',
        processing_files: 'Обробка файлів...',
        operation_cancelled: 'Операцію скасовано',
        not_implemented: 'Цю конвертацію ще не реалізовано',
        conversion_success: 'Конвертацію успішно завершено',
        conversion_completed_mixed: 'Конвертацію завершено. Успішно: {{success}}, неуспішно: {{failed}}.',
        conversion_process_error: 'Помилка процесу конвертації: {{error}}',
        restart_required: 'Функція недоступна. Перезапустіть застосунок і спробуйте знову.',
        unknown_error: 'Невідома помилка'
      },
      breadcrumb_home: 'Головна',
      breadcrumb_tools: 'Інструменти {{source}}',
      breadcrumb_current: '{{source}} у {{target}}',
      title: 'Конвертер {{source}} у {{target}}',
      file_list: 'Список файлів',
      select_all: 'Вибрати все',
      deselect_all: 'Скасувати вибір',
      cancel_conversion: 'Скасувати конвертацію',
      no_files: 'Файлів ще немає. Додайте їх вище.',
      status_converting: 'Триває конвертація...',
      download: 'Завантажити',
      download_file: 'Завантажити файл',
      delete: 'Видалити',
      error: 'Помилка',
      progress_processing: 'Обробка {{current}} / {{total}}',
      zip_download_title: 'Завантажити як ZIP',
      zip_download_desc: 'Запакувати всі конвертовані файли в один ZIP-архів',
      download_to_folder_title: 'Завантажити в папку',
      html_preview: 'Попередній перегляд HTML'
    }
  },
  ur: {
    webHeader: {
      brand_subtitle: 'اسمارٹ تبدیلی اور پیداواری ٹول باکس',
      nav: {
        home: 'ہوم',
        ai_tools: 'AI ٹولز',
        office_tools: 'آفس ٹولز',
        multimedia: 'ملٹی میڈیا',
        development_tools: 'ڈیولپمنٹ ٹولز',
        text_processing: 'متن کی پروسیسنگ',
        file_processing: 'فائل پروسیسنگ',
        system_tools: 'سسٹم ٹولز',
        life_tools: 'روزمرہ ٹولز',
        industry_news: 'صنعتی خبریں',
        software_customization: 'سافٹ ویئر کسٹمائزیشن'
      },
      search_aria: 'تلاش',
      search_placeholder: 'ٹولز، ایپس وغیرہ تلاش کریں',
      theme_to_dark: 'ڈارک موڈ پر جائیں',
      theme_to_light: 'لائٹ موڈ پر جائیں',
      menu_aria: 'نیویگیشن مینو',
      login_register: 'لاگ اِن / رجسٹر',
      login: 'لاگ اِن'
    },
    webFooter: {
      description: 'ہم افراد اور کاروبار کے لیے معیاری AI ٹولز اور مشاورتی خدمات فراہم کرتے ہیں تاکہ آپ مؤثر اور مسابقتی رہ سکیں۔',
      sections: {
        quick_links: 'فوری لنکس',
        tool_categories: 'ٹول کی اقسام',
        contact_us: 'ہم سے رابطہ کریں'
      },
      quick_links: {
        home: 'ہوم',
        ai_tools: 'AI ٹولز',
        custom_service: 'مشاورتی خدمات',
        industry_news: 'صنعتی خبریں',
        feedback: 'رائے'
      },
      tool_links: {
        text_processing: 'متن کی پروسیسنگ',
        image_generation: 'تصویر بنانا',
        office_tools: 'آفس ٹولز',
        file_processing: 'فائل پروسیسنگ',
        code_development: 'کوڈ ڈویلپمنٹ'
      },
      contact: {
        company: 'کمپنی',
        phone: 'فون',
        address: 'پتہ',
        email: 'ای میل'
      },
      copyright: '© {{year}} {{brand}}. جملہ حقوق محفوظ ہیں۔',
      user_agreement: 'صارف معاہدہ',
      privacy_policy: 'رازداری کی پالیسی'
    },
    toolDetail: {
      options: {
        cleanup_options: 'صفائی کے اختیارات',
        docx_page_range_placeholder: 'مثال: 1-3,5',
        image_options: 'تصویر کے اختیارات',
        image_quality: 'تصویر کا معیار',
        inline_css: 'ان لائن CSS',
        json_indent: 'JSON انڈینٹ',
        pipe: 'عمودی لکیر (|)',
        preview_html: 'HTML پیش نظارہ',
        quality_range: 'معیار کی حد',
        remove_css: 'CSS ہٹائیں',
        watermark_info: 'واٹرمارک کی ترتیبات',
        watermark_text: 'واٹرمارک متن',
        watermark_size: 'واٹرمارک کا سائز',
        watermark_opacity: 'واٹرمارک کی شفافیت',
        watermark_position: 'واٹرمارک کی جگہ',
        watermark_angle: 'واٹرمارک کا زاویہ',
        watermark_color: 'واٹرمارک کا رنگ'
      },
      messages: {
        files_added_success: '{{count}} فائلیں شامل کی گئیں',
        folder_invalid_filtered: '{{count}} غلط فائلیں فلٹر کر دی گئیں',
        folder_no_valid_files: 'اس فولڈر میں کوئی درست {{source}} فائل نہیں ملی',
        no_downloadable_files: 'ڈاؤن لوڈ کے لیے کوئی فائل دستیاب نہیں',
        saving_files: 'فائلیں محفوظ کی جا رہی ہیں...',
        save_success: '{{count}} فائلیں محفوظ ہو گئیں',
        save_failed: 'محفوظ کرنا ناکام: {{error}}',
        save_operation_failed: 'محفوظ کرنے کی کارروائی ناکام رہی',
        cannot_access_folder: 'منتخب فولڈر تک رسائی ممکن نہیں',
        batch_download_started: 'ڈاؤن لوڈ شروع ہو گیا',
        packaging_files: 'فائلیں پیک کی جا رہی ہیں...',
        zip_download_success: 'ZIP ڈاؤن لوڈ مکمل ہو گیا',
        zip_download_failed: 'ZIP ڈاؤن لوڈ ناکام رہا',
        conversion_cancelled: 'تبدیلی منسوخ کر دی گئی',
        pdf_page_range_invalid: 'براہ کرم درست PDF صفحہ رینج درج کریں',
        docx_page_range_invalid: 'براہ کرم درست صفحہ رینج درج کریں، مثلاً 1-3,5',
        animation_delay_invalid: 'براہ کرم 10 سے 5000 کے درمیان درست اینیمیشن تاخیر درج کریں',
        background_color_invalid: 'براہ کرم درست پس منظر کا رنگ درج کریں، مثلاً #ffffff',
        watermark_color_invalid: 'براہ کرم درست واٹرمارک رنگ درج کریں، مثلاً #cccccc',
        ppt_video_wait: 'PPT کو ویڈیو میں تبدیل ہونے میں کچھ وقت لگ سکتا ہے۔ براہ کرم انتظار کریں.',
        converting_video_wait: 'ویڈیو تبدیل کی جا رہی ہے، براہ کرم انتظار کریں...',
        processing_files: 'فائلیں پراسیس کی جا رہی ہیں...',
        operation_cancelled: 'کارروائی منسوخ کر دی گئی',
        not_implemented: 'یہ تبدیلی ابھی نافذ نہیں کی گئی',
        conversion_success: 'تبدیلی کامیاب رہی',
        conversion_completed_mixed: 'تبدیلی مکمل ہو گئی۔ {{success}} کامیاب، {{failed}} ناکام۔',
        conversion_process_error: 'تبدیلی کے عمل میں خرابی: {{error}}',
        restart_required: 'یہ فیچر دستیاب نہیں۔ براہ کرم ایپ دوبارہ شروع کریں اور پھر کوشش کریں.',
        unknown_error: 'نامعلوم خرابی'
      },
      breadcrumb_home: 'ہوم',
      breadcrumb_tools: '{{source}} ٹولز',
      breadcrumb_current: '{{source}} سے {{target}}',
      title: '{{source}} سے {{target}} کنورٹر',
      file_list: 'فائل فہرست',
      select_all: 'سب منتخب کریں',
      deselect_all: 'سب کا انتخاب ختم کریں',
      cancel_conversion: 'تبدیلی منسوخ کریں',
      no_files: 'ابھی تک کوئی فائل نہیں۔ براہ کرم اوپر سے شامل کریں.',
      status_converting: 'تبدیل کیا جا رہا ہے...',
      download: 'ڈاؤن لوڈ',
      download_file: 'فائل ڈاؤن لوڈ کریں',
      delete: 'حذف کریں',
      error: 'خرابی',
      progress_processing: 'پراسیسنگ {{current}} / {{total}}',
      zip_download_title: 'ZIP کے طور پر ڈاؤن لوڈ کریں',
      zip_download_desc: 'تمام تبدیل شدہ فائلوں کو ایک ZIP آرکائیو میں پیک کریں',
      download_to_folder_title: 'فولڈر میں ڈاؤن لوڈ کریں',
      html_preview: 'HTML پیش نظارہ'
    }
  }
};

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
        target[key] = {};
      }
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

function applyRepairs() {
  for (const [locale, patch] of Object.entries(repairs)) {
    const filePath = path.join(localeDir, `${locale}.json`);
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
    deepMerge(json, patch);
    fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
    console.log(`repaired ${locale}`);
  }
}

applyRepairs();
