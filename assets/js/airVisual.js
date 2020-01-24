const key = '151045b9-a435-4b3e-afbb-7f394572988c';
let state = document.getElementById('voivodeship');
let city = document.getElementById('city');
const url = 'http://api.airvisual.com/v2/';

fetch(`${url}states?country=POLAND&key=${key}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let dataArray = data.data;
        Object.keys(dataArray).forEach(key => {
            $('#voivodeship').append(`<option value = "${dataArray[key].state}">${dataArray[key].state}</option>`)
        });
    });

let getCities = (state) => {
    fetch(`${url}cities?state=${state}&country=POLAND&key=${key}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let dataArray = data.data;
            Object.keys(dataArray).forEach(key => {
                $('#city').append(`<option value = "${dataArray[key].city}">${dataArray[key].city}</option>`);
            });
        })
};

// Modifying widget data
let getCitiesData = (city, state) => {
    fetch(`${url}city?city=${city}&state=${state}&country=POLAND&key=${key}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let dataArray = data.data;
            let weatherData = dataArray.current.weather;
            let pollutionData = dataArray.current.pollution;
            let {city, state} = dataArray;
            let {tp, pr, hu, ic} = weatherData;
            let {aqius} = pollutionData;
            let widgetElements = ['widget-city', 'widget-voivodeship', 'temperature', 'widget-pressure', 'widget-humidity', 'widget-aqi', 'widget-day', 'widget-time', 'widget-date',
                'widget-quality'];
            let widgetData = [city, state, tp, pr, hu, aqius, getDate({weekday: 'long'}), getDate({timeStyle: 'short'}), getDate(), airQuality[0]];
        });
};
getCitiesData('Krakow', 'Lesser Poland Voivodeship');
city.addEventListener('change', () => {
    getCitiesData(city.options[city.selectedIndex].value, state.options[state.selectedIndex].value);
});

const getDate = (options) => {
    let date = new Date();
    return date.toLocaleDateString('pl-PL', options);
};