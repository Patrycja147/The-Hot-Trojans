//use defer to include in page
// const key = '151045b9-a435-4b3e-afbb-7f394572988c';
const key = 'b9cd8e83-c786-4665-b952-d805581551c3';
let state = document.getElementById('voivodeship');
let city = document.getElementById('city');
let widgetContainer = $('#widget-container');
const url = 'http://api.airvisual.com/v2/';
const airQuality = [{level: 'Good', color: '#A5CE39', min: 0, max: 50}, {level: 'Moderate', color: '#FFF700', min: 51, max: 100},
    {level: 'Unhealthy for Sensitive Groups', color: '#F57E20', min:101, max:150}, {level: 'Unhealthy', color: '#F01821', min: 151, max: 200},
    {level: 'Very Unhealthy', color: '#A5004A', min: 201, max: 300}, {level: 'Hazardous', color: '#8d1819', min: 301, max: 500}];
const translation = [
    {
        "poangielsku": "Greater Poland",
        "popolsku": "Wielkopolska"
    },
    {
        "poangielsku": "Kujawsko-Pomorskie",
        "popolsku": "Kujawsko-Pomorskie"
    },
    {
        "poangielsku": "Lesser Poland Voivodeship",
        "popolsku": "Małopolska"
    },
    {
        "poangielsku": "Lodz Voivodeship",
        "popolsku": "Łódzkie"
    },
    {
        "poangielsku": "Lower Silesia",
        "popolsku": "Dolnośląskie"
    },
    {
        "poangielsku": "Lublin",
        "popolsku": "Lublin"
    },
    {
        "poangielsku": "Lubusz",
        "popolsku": "Lubuskie"
    },
    {
        "poangielsku": "Mazovia",
        "popolsku": "Mazowieckie"
    },
    {
        "poangielsku": "Opole Voivodeship",
        "popolsku": "Opolskie"
    },
    {
        "poangielsku": "Podlasie",
        "popolsku": "Podlaskie"
    },
    {
        "poangielsku": "Pomerania",
        "popolsku": "Pomorskie"
    },
    {
        "poangielsku": "Silesia",
        "popolsku": "Śląskie"
    },
    {
        "poangielsku": "Subcarpathian Voivodeship",
        "popolsku": "Podkarpackie"
    },
    {
        "poangielsku": "Swietokrzyskie",
        "popolsku": "Świętokrzyskie"
    },
    {
        "poangielsku": "Warmia-Masuria",
        "popolsku": "Warmińsko-Mazurskie"
    },
    {
        "poangielsku": "West Pomerania",
        "popolsku": "Zachodniopomorskie"
    }
];

const qualityPickerColor = (aqi) => {
    let level = '', color = '';
    airQuality.forEach(object => {
      if (aqi >= object.min && aqi <= object.max) {
          color = object.color;
          level = object.level;
      }
    });
    return [level, color];
};

fetch(`${url}states?country=POLAND&key=${key}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let translate = '';
        let dataArray = data.data;
        Object.keys(dataArray).forEach(key => {
            translation.forEach(object => {
                if (dataArray[key].state === object.poangielsku) {
                    translate = object.popolsku;
                }
            });
            $('#voivodeship, #state').append(`<option value = "${dataArray[key].state}">${translate}</option>`);
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

state.addEventListener('change', () => {
    $('#city')
        .show()
        .find('option')
        .remove()
        .end();
    $('#city')
        .append('<option value="" disabled selected>Lista miast</option>');
    getCities(state.options[state.selectedIndex].value);
    $('#city-form-group').parent().slideDown();
});

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
            let airQuality = qualityPickerColor(aqius);
            let widgetElements = ['widget-city', 'widget-voivodeship', 'temperature', 'widget-pressure', 'widget-humidity', 'widget-aqi', 'widget-day', 'widget-time', 'widget-date',
                'widget-quality'];
            let widgetData = [city, state, tp, pr, hu, aqius, getDate({weekday: 'long'}), getDate({timeStyle: 'short'}), getDate(), airQuality[0]];
            $('#widget-air-quality').css('background-color', airQuality[1]);
            $('#weather-icon').css('background-image', `url(./assets/img/weather-icons/${ic}.png)`);
            for (let i = 0; i < widgetElements.length; i++) {
                for (let j = 0; j < widgetData.length; j++) {
                    (i === 2) ? document.getElementById(widgetElements[i]).innerHTML = widgetData[i] + '°C' : document.getElementById(widgetElements[i]).innerHTML = widgetData[i];
                }
            }
        });
};

getCitiesData('Krakow', 'Lesser Poland Voivodeship');
widgetContainer.delay(400).fadeIn(300);
city.addEventListener('change', () => {
    getCitiesData(city.options[city.selectedIndex].value, state.options[state.selectedIndex].value);
    widgetContainer.fadeOut(300).fadeIn(300);
});

const getDate = (options) => {
    let date = new Date();
    return date.toLocaleDateString('pl-PL', options);
};
