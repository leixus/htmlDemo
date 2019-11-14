angular.module('app', ['finance2'])
        .controller('AppController',
                ['currencyConverter', '$scope',
                    function (currencyConverter, $scope) {
                        this.qty = 1;
                        this.cost = 2;
                        this.inCurr = 'EUR';
                        this.currencies = currencyConverter.currencies;

                        this.total = function total(outCurr) {
                            return currencyConverter.convert(this.qty * this.cost, this.inCurr, outCurr);
                        };

                        this.pay = function pay() {
                            window.alert("谢谢！");
                        };
                    }
                ]
        );