import fs from 'fs'

import axios from 'axios';

class Busquedas {

    historial = [];
    dbPath = './db/database.json'

    
    constructor() {
        //*: Leer DB si existe
        this.leerDB();
    }

    get paramsMapbox( ) {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit:': '6',
            'language': 'es'
        }
    }

    get paramsOpenWeather( ) {
        return {
            'appid': process.env.OPENWEATHER,
            'units': 'metric',
            'lang': 'es'
        }
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( letra => letra[0].toUpperCase() + letra.substring(1) );
            palabras = palabras.join(' ');

            return palabras;

        })
    }

    async ciudades( lugar = '' ){ //Capitulo 69

        try {
            const instance = axios.create({ //Capitulo 75
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const { data } = await instance.get();
            const { features } = data;
            return features.map( lugar => ({ //Pongo primero parentecis, porque asi digo que devolvere un OBJETO de manera implicita
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            })) 
            
        } catch (error) {
            return [];
            
        }
    }

    async clima( lat = '', lon = '' ){

        try {

            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {
                    ...this.paramsOpenWeather,
                    lat,
                    lon
                }
            })

            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                desc: `${ weather[0].description }`,
                min: `${ main.temp_min }° grados`,
                max: `${ main.temp_max }° grados`,
                temp: `${ main.temp }° grados.`
            }
            
        } catch (error) {
            console.log(error)
        }

    }

    agregarHistorial( lugar = '' ){

        //*: Prevenir duplicidad
        if( this.historial.includes( lugar.toLocaleLowerCase() )) return;

        //*: Limitar a 5 elementos en el historial
        this.historial = this.historial.splice(0,4);

        this.historial.unshift( lugar.toLocaleLowerCase() );
        
        const payload = {
            historial: this.historial,
        }

        //*: Guardar en DB
        fs.writeFileSync( this.dbPath, JSON.stringify(payload) );

    }

    leerDB() {

        if( !fs.existsSync( this.dbPath ) ) return;

        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8', } );
        const data = JSON.parse( info );

        this.historial = data.historial;

    }



}

export default Busquedas;