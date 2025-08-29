document.addEventListener("DOMContentLoaded", () => {
    const amountInput = document.getElementById("amount");
    const currencySelect = document.getElementById("currency");
    const convertBtn = document.getElementById("convert-btn");
    const convertedAmountDisplay = document.getElementById("converted-amount");
    const exchangeRateInfoDisplay = document.getElementById("exchange-rate-info");
    const lastUpdateDisplay = document.getElementById("last-update");

    const API_URL = "https://api.exchangerate-api.com/v4/latest/TRY"; // Base currency is TRY

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
            exchangeRateInfoDisplay.textContent = `سعر الصرف: 1 ${fromCurrency} = ${rate.toFixed(4)} TRY`;

            const lastUpdateTimestamp = new Date(exchangeData.time_last_updated * 1000);
            lastUpdateDisplay.textContent = `آخر تحديث: ${lastUpdateTimestamp.toLocaleString()}`;
        } else {
            convertedAmountDisplay.textContent = "خطأ في جلب الأسعار";
            exchangeRateInfoDisplay.textContent = "";
            lastUpdateDisplay.textContent = "";
        }
    };

    amountInput.addEventListener("input", updateConversion);
    currencySelect.addEventListener("change", updateConversion);
    convertBtn.addEventListener("click", updateConversion);

    // Initial conversion on page load
    updateConversion();
});


