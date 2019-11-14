angular.module('finance2', [])
        .factory('currencyConverter', function() {
            const currencies =
                            ['USD', 'EUR', 'CNY'],
                    usdToForeignRates = {
                        USD: 1,
                        EUR: 0.74,
                        CNY: 6.09
                    };
            return {
                currencies: currencies,
                convert: convert
            };
            function convert(amount, inCurr, outCurr) {
                return amount * usdToForeignRates[outCurr] / usdToForeignRates[inCurr];
            }
        });