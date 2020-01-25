$($ => {
    $('#IndexTable').on('click', function () {
        getData($(this));
    });

    // fetching data for one currency
    let currencyCode = document.getElementById('currency-code');
    currencyCode.addEventListener('change', () => {
        getData($('#IndexSingle'), currencyCode.options[currencyCode.selectedIndex].value);
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
    getData($('#IndexTable'));
});
