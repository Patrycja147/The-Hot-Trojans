$($ => {
    $('#IndexTable').on('click', function () {
        getData($(this));
        $('#table-container').slideDown();
        $('#currency-select-container').slideUp('fast');
    });
    // filling select with currencies to choose
    $('#IndexSingle').on('click', function () {
        fetch('http://api.nbp.pl/api/exchangerates/tables/C')
            .then(response => {
                return response.json();
            })
            .then(data => {
                let currencies = [];
                data[0].rates.forEach(element => {
                    currencies.push({currency: element.currency, code: element.code});
                });
                $('#currency-code').empty().append('<option disabled selected>Wybierz walutę</option>');
                currencies.forEach(currency => {
                    $('#currency-code').append(`<option value='${currency.code}'>${currency.currency}</option>`);
                });
                $('#currency-select-container').slideDown();
            })
    });
    // fetching data for one currency
    let currencyCode = document.getElementById('currency-code');
    currencyCode.addEventListener('change', () => {
        getData($('#IndexSingle'), currencyCode.options[currencyCode.selectedIndex].value);
        $('#table-container').slideDown();
        $('.table-responsive').fadeOut(300).fadeIn(300);
    });
    // choosing another date for data
    $('#change-date').on('click', function () {
        let date = $('#table-date').val();
        if (date > getDate()) {
            alert('Brak danych dla wybranej daty.')
        } else {
            let select = undefined;
            if ($('#currency-select-container').css('display') !== 'none') {
                select = currencyCode.options[currencyCode.selectedIndex].value;
            }
            if (select !== 'Wybierz walutę' || select !== undefined) {
                getData($('#table-currencies-heading'), select, date);
            } else {
                getData($('#table-currencies-heading'), undefined, date);
            }
            $('.table-responsive').fadeOut(300).fadeIn(300);
        }
    });

    const getData = (element, code, date) => {
        const exchangeRate = 'http://api.nbp.pl/api/exchangerates/';
        let codeSet = (typeof code === 'undefined');
        let dateSet = (typeof date === 'undefined');
        let url = codeSet ? 'tables/C/' : `rates/C/${code}/`;
        url += dateSet ? '' : date;
        fetch(exchangeRate + url)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (codeSet) data = data[0];
                $('#table-currencies-heading').text(element.text());
                $('#table-date').val((codeSet) ? data.effectiveDate : data.rates[0].effectiveDate);
                $('tbody').empty();
                if (codeSet) {
                    data.rates.forEach(rate => {
                        $('tbody').append(`<tr><td>${rate.currency}</td><td>${rate.code}</td><td>${rate.bid}</td><td>${rate.ask}</td></tr>`);
                    });
                } else {
                    $('tbody').append(`<tr><td>${data.currency}</td><td>${data.code}</td><td>${data.rates[0].bid}</td><td>${data.rates[0].ask}</td></tr>`);
                }
            })
            .catch(error => {
                alert('Brak danych dla wybranej daty.')
            });
    };
    const getDate = () => {
        let date = new Date();
        return `${date.getFullYear()}-${((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)}-${date.getDate()}`
    };
    getData($('#IndexTable'));
});
