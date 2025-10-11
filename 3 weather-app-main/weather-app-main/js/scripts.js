console.log('Hola holitas');

const url = `https://api.open-meteo.com/v1/forecast?latitude=43.3713&longitude=-8.396&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m&current=precipitation,wind_speed_10m,apparent_temperature,relative_humidity_2m,temperature_2m`

fetch(url)
    .then(resp => resp.json())
    .then(data => {
        const datos = data;
        console.log(datos);
        
    })

