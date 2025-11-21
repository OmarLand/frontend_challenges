// Ejecuto al inicializar la pagina
document.addEventListener('DOMContentLoaded', () => {

    // Esto en teoría debería traerlo del form del HTML
    const city = 'A Coruña';    
    getCity( city );
    getCurrent( city );
    getDaily( city );
    renderCityDataCurrent( city );
    renderCurrent( city );

})

// Obtengo los datos de la Ciudad/Localidad
const getCity = (city) => {

    // const city='A Coruña'
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    return fetch(url)
        .then(response => response.json()  )
        .then(response => {
            const cities = response.results;
            const { name, country, longitude, latitude } = cities[0];            
            return { name, country, longitude, latitude };
        })
        .catch( error => console.error('>>> ', error) )
}

// Partiendo de City Obtengo las coordenadas y en nombre de la ciudad buscada
const getCurrent = async(location) => {

    const getCurrentWeather = await getCity(location);
    const { longitude, latitude } = getCurrentWeather;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code,temperature_2m,apparent_temperature,wind_speed_10m,precipitation,relative_humidity_2m`
    // console.log( 'URL:', url );
    
    return fetch(url)
        .then(response => response.json())
        .then(response => { return response})
        .catch(error => console.log('error...:', error) )       
}

//Renderizamos en HTML Datos actuales del Clima en el Background
const renderCityDataCurrent = async(city) => {
    const cityName = await getCity(city);
    const { name, country } = cityName
    // console.log( `Nombre de la Ciudad: ${name} Pais: ${country}` );

    const gettingMainWeather = await getCurrent(city);
    const { temperature_2m } = gettingMainWeather.current
    // console.log( `Grados: ${temperature_2m} ºC` );
    
    // Obtenemos la fecha actual del sistema y no del API
    const fecha = new Date().toLocaleDateString("en-US", {
        weekday : "long",
        day     : "numeric",
        month   : "long",
        year    : "numeric"
    });

    let html = `    
        <div class="background-weather-row">
            <div class="name-city">${name}, ${country}</div>
            <div class="current-date">${ fecha }</div>
        </div>
        <div class="current-temp">${Math.round(temperature_2m)} ºC</div>

    `

    document.getElementsByClassName('background-weather background-weather-flex')[0].innerHTML = html;

}

// Renderizamos el Clima en tarjeta de Feels like, etc...
const renderCurrent = async(location) => {
    const getDataCu = await getCurrent(location);
    const { precipitation, relative_humidity_2m,apparent_temperature, wind_speed_10m } = getDataCu.current;
    // console.log(`Precipitación de: ${precipitation} humedad aproximada de: ${relative_humidity_2m}, temperatura de: ${temperature_2m} y velocidad de viento de : ${wind_speed_10m}`);
    
    let html = `
        <div class="container">
            <div class="row">
                <div class="col-6 col-sm-3">  
                    <div class="card personal-card">
                        <div class="card-body">
                        <h3 class="card-title">Feels like</h3>
                        <p class="card-text">${Math.round(apparent_temperature)} ºC</p>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-sm-3">  
                    <div class="card personal-card">
                        <div class="card-body">
                        <h3 class="card-title">Humidity</h3>
                        <p class="card-text">${relative_humidity_2m} %</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-6 col-sm-3">  
                    <div class="card personal-card">
                        <div class="card-body">
                        <h3 class="card-title">Wind</h3>
                        <p class="card-text">${wind_speed_10m} Km/h</p>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-sm-3">  
                    <div class="card personal-card">
                        <div class="card-body">
                        <h3 class="card-title">Precipitation</h3>
                        <p class="card-text">${precipitation} mm</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementsByClassName('contain-cards')[0].innerHTML = html;

}

// Obtenemos la información del clima por días
const getDaily = async(location) => {
    const getDailyWeather = await getCity(location);
    const { longitude, latitude } = getDailyWeather;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min`    
    
    console.log( 'URL: ', url );

    fetch(url)
        .then( response => response.json() )
        .then( response => {return response} )
        .catch( error => console.log( 'Ha ocurrido un error: getDaily', error ) )

}