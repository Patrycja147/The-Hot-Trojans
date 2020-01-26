var miasta=[];
var humid=[];
var temperature=[];
var waluty=[];
var kupna=[];
var sprzedaze=[];
var charts=[];
let select = document.getElementById('state');
let showAirVisual = document.getElementById('idAirVisual');
let klucz = 'b9cd8e83-c786-4665-b952-d805581551c3';
showAirVisual.addEventListener('click', () => {
	$('#selectState').slideDown();
});

select.addEventListener('change', () => {
	miasta=[];
	humid=[];
	temperature=[];
	let state = select.options[select.selectedIndex].value;
	$.getJSON(
		"http://api.airvisual.com/v2/cities?state=" +
		state +
		"&country=POLAND&key=" + klucz, function(data1){
			var miastodl=data1.data.length;
			if (miastodl>5){miastodl=5}
			for (let i = 0; i < miastodl+1; i++) {
				if (i>=miastodl){
					and_to_this(textp,state,true)

				}else{
					var textp = data1.data[i].city;
					miasta.push(textp);
					and_to_this(textp,state,false)
				}


			}})
});


function and_to_this(city,state,bool){
    $.getJSON(
        "http://api.airvisual.com/v2/city?city="+city+"&state="+state+"&country=POLAND&key=" + klucz, function(data1){
        var wther= data1.data.current.weather;
        var temp = wther.tp;
        var hum = wther.hu;
        temperature.push(temp);
        humid.push(hum);
        if (bool){
			create_wchart(state,miasta,humid,temperature)
			}
        })
	}
	
	
function create_wchart(state,miasta,humid,temperature){
	
	var len = charts.length;
	var z;
	for (z=0;z<len;z++){
			charts[z].destroy()
			}
	var ctx = document.getElementById('my_chart').getContext('2d');
	var hum_color='rgba(10, 132, 255, 0.35)';
	var temp_color='rgba(255, 10, 10, 0.35)';
	var barChartData={
			type: 'bar',
			data: {
				labels: miasta,
				datasets: [{
					label: 'Humidity',
					data: humid,
					backgroundColor: 
						hum_color
					,
					borderWidth: 0
				},{
					label: 'Temperature',
					data: temperature,
					backgroundColor: temp_color,
					borderWidth: 0
				}
				]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				},
				responsive: true,
					legend: {
						position: 'top',
					},
					title: {
						display: true,
						text: 'Humidity and Temperature Chart in '+state
					}
			}
		};
	var wChart = new Chart(ctx, barChartData);
	charts.push(wChart)
}
function start(){
	
	$.getJSON(
		"http://api.nbp.pl/api/exchangerates/tables/C/?format=json", function(data1){
		var waludl=data1[0].rates.length;
		var walu=data1[0];
		for (let i = 0; i <= waludl; i++) {
			if (i!=waludl){
			var currency = walu.rates[i].currency;
			var kup = walu.rates[i].bid;
			var sprz = walu.rates[i].ask;
			waluty.push(currency);
			kupna.push(kup);
			sprzedaze.push(sprz);
	} else {
		function create_bchart() {
		var len = charts.length;
		for (let z=0;z<len;z++) {
				charts[z].destroy()
			}
		var ctx = document.getElementById('my_chart').getContext('2d');
		var buy_color='rgba(0, 193, 0,0.35)';
		var sell_color='rgba(230, 0, 0, 0.35)';
		var hajsChartData={
				type: 'bar',
				data: {
					labels: waluty,
					datasets: [{
						label: 'Kupno',
						data: kupna,
						backgroundColor: buy_color,
					
						borderWidth: 0
					}, {
						label: 'Sprzedaz',
						data: sprzedaze,
						backgroundColor: sell_color,
				
						borderWidth: 0
					}
					]
				},
				options: {
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
						}]
					},
					responsive: true,
						legend: {
							position: 'top',
						},
						title: {
							display: true,
							text: 'Ceny kupna i sprzedazy walut'
						}
				}
			};
		var wChart = new Chart(ctx, hajsChartData);
		charts.push(wChart);
		
		}
		document.querySelector('#idwaluta').addEventListener('click', () => {
			$('#selectState').slideUp();
			create_bchart();
		})
		}
    }}
	);
}
start();
