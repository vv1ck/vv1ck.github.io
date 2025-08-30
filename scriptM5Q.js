document.addEventListener("DOMContentLoaded", () => {
    const amountInput = document.getElementById("amount");
    const currencySelect = document.getElementById("currency");
    const convertBtn = document.getElementById("convert-btn");
    const convertedAmountDisplay = document.getElementById("converted-amount");
    const exchangeRateInfoDisplay = document.getElementById("exchange-rate-info");
    const lastUpdateDisplay = document.getElementById("last-update");
    const langToggleBtn = document.getElementById("lang-toggle");

    const API_URL = "https://api.exchangerate-api.com/v4/latest/TRY"; // Base currency is TRY

    // Translations dictionary
    const translations = {
        ar: {
            hero_title: '<span class="text-fire">M5Q</span> -  ابو اللول',
            badge_pubg: '🎮 PUBG موبايل',
            badge_tiktok_creator: '🔥 منشئ محتوى TikTok',
            badge_live_streamer: '🔴 ستريمر مباشر',
            donate_now: 'ادعم M5Q الآن',

            video_title: 'شرح طريقة الدونيشن',
            video_desc: 'شاهد الفيديو التعليمي لتتعلم كيفية الدونيشن بسهولة',
            video_soon: 'قريباً',
            video_info: 'الفيديو سيوضح خطوات التسجيل والدفع في موقع الدعم',

            converter_title: 'حاسبة تحويل العملات',
            converter_desc: 'احسب قيمة دعمك بالليرة التركية لتسهيل عملية الدونيشن',
            converter_card_title: 'محول العملات إلى الليرة التركية',
            label_amount: 'المبلغ',
            placeholder_amount: 'أدخل المبلغ',
            label_currency: 'العملة',
            currency_usd: 'الدولار الأمريكي (USD)',
            currency_sar: 'الريال السعودي (SAR)',
            currency_qar: 'الريال القطري (QAR)',
            currency_kwd: 'الدينار الكويتي (KWD)',
            btn_convert: 'احسب المبلغ',
            result_title: 'المبلغ بالليرة التركية:',
            exchange_rate_text: 'سعر الصرف: 1 {CURRENCY} = {RATE} TRY',
            last_update_text: 'آخر تحديث: {DATETIME}',
            fetch_error: 'خطأ في جلب الأسعار',

            social_title: 'تابع M5Q على وسائل التواصل',
            social_desc: 'لا تفوت أحدث البثوث والمحتوى الحصري',
            donation_title: 'الدونيشن',
            visit_tiktok: 'زيارة TikTok',
            visit_jaco: 'زيارة Jaco Live',
            visit_kick: 'زيارة Kick',
            visit_instagram: 'زيارة Instagram',
            visit_youtube: 'زيارة Youtube',
            donate_action: 'ادعم الآن',
        },
        en: {
            hero_title: '<span class="text-fire">M5Q</span> - Abu Al-loul',
            badge_pubg: '🎮 PUBG Mobile',
            badge_tiktok_creator: '🔥 TikTok Creator',
            badge_live_streamer: '🔴 Live Streamer',
            donate_now: 'Donate to M5Q now',

            video_title: 'How to donate',
            video_desc: 'Watch the tutorial to learn how to donate easily',
            video_soon: 'Soon',
            video_info: 'The video will explain the registration and payment steps on the donation site',

            converter_title: 'Currency Converter',
            converter_desc: 'Calculate your support in Turkish Lira to make donating easier',
            converter_card_title: 'Convert to Turkish Lira',
            label_amount: 'Amount',
            placeholder_amount: 'Enter amount',
            label_currency: 'Currency',
            currency_usd: 'US Dollar (USD)',
            currency_sar: 'Saudi Riyal (SAR)',
            currency_qar: 'Qatari Riyal (QAR)',
            currency_kwd: 'Kuwaiti Dinar (KWD)',
            btn_convert: 'Convert',
            result_title: 'Amount in Turkish Lira:',
            exchange_rate_text: 'Exchange rate: 1 {CURRENCY} = {RATE} TRY',
            last_update_text: 'Last update: {DATETIME}',
            fetch_error: 'Failed to fetch exchange rates',

            social_title: 'Follow M5Q on social media',
            social_desc: "Don't miss the latest streams and exclusive content",
            donation_title: 'Donation',
            visit_tiktok: 'Visit TikTok',
            visit_jaco: 'Visit Jaco Live',
            visit_kick: 'Visit Kick',
            visit_instagram: 'Visit Instagram',
            visit_youtube: 'Visit YouTube',
            donate_action: 'Donate now',
        }
    };

    const getCurrentLang = () => localStorage.getItem('lang') || 'ar';
    const setCurrentLang = (lang) => localStorage.setItem('lang', lang);

    const t = (key, lang = getCurrentLang()) => {
        const langPack = translations[lang] || translations.ar;
        return langPack[key] !== undefined ? langPack[key] : key;
    };

    const applyTranslations = (lang) => {
        // html lang and dir
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        // Translate all nodes with data-i18n
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            el.innerHTML = t(key, lang);
        });

        // Placeholder for amount input
        amountInput.setAttribute('placeholder', t('placeholder_amount', lang));

        // Toggle button shows target language label
        if (langToggleBtn) {
            langToggleBtn.textContent = lang === 'ar' ? 'EN' : 'AR';
        }
    };

    const formatLastUpdate = (timestampSeconds) => {
        const ts = new Date(timestampSeconds * 1000);
        const lang = getCurrentLang();
        const locale = lang === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-US-u-ca-gregory';
        const dt = ts.toLocaleString(locale, { timeZone: 'Asia/Riyadh' });
        return t('last_update_text', lang).replace('{DATETIME}', dt);
    };

    const fetchExchangeRates = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data && data.rates) {
                // Rates are relative to TRY, so we need to invert them for other currencies to TRY
                const rates = {
                    USD: 1 / data.rates.USD,
                    SAR: 1 / data.rates.SAR,
                    QAR: 1 / data.rates.QAR,
                    KWD: 1 / data.rates.KWD
                };
                return { rates, time_last_updated: data.time_last_updated };
            } else {
                console.error("Invalid API response:", data);
                return null;
            }
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
            return null;
        }
    };

    const updateConversion = async () => {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = currencySelect.value;
        const lang = getCurrentLang();

        if (isNaN(amount) || amount <= 0) {
            convertedAmountDisplay.textContent = "0.00 TRY";
            exchangeRateInfoDisplay.textContent = "";
            lastUpdateDisplay.textContent = "";
            return;
        }

        const exchangeData = await fetchExchangeRates();

        if (exchangeData) {
            const rate = exchangeData.rates[fromCurrency];
            const result = amount * rate;
            convertedAmountDisplay.textContent = `${result.toFixed(2)} TRY`;
            exchangeRateInfoDisplay.textContent = t('exchange_rate_text', lang)
                .replace('{CURRENCY}', fromCurrency)
                .replace('{RATE}', rate.toFixed(4));

            lastUpdateDisplay.textContent = formatLastUpdate(exchangeData.time_last_updated);
        } else {
            convertedAmountDisplay.textContent = t('fetch_error', lang);
            exchangeRateInfoDisplay.textContent = "";
            lastUpdateDisplay.textContent = "";
        }
    };

    // Language toggle handler
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const nextLang = getCurrentLang() === 'ar' ? 'en' : 'ar';
            setCurrentLang(nextLang);
            applyTranslations(nextLang);
            // Recompute conversion with the new language strings
            updateConversion();
        });
    }

    // Initialize
    applyTranslations(getCurrentLang());

    amountInput.addEventListener("input", updateConversion);
    currencySelect.addEventListener("change", updateConversion);
    convertBtn.addEventListener("click", updateConversion);

    // Initial conversion on page load
    updateConversion();
});


