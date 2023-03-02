import * as dotenv from 'dotenv'
import { inquirerMenu, leerInput, listarLugares, pausa } from "./helpers/inquirer.js"
import Busquedas from "./model/busquedas.js";

dotenv.config();

const main = async() => {

    let opt;
    const busquedas = new Busquedas();

    do {

        opt = await inquirerMenu();
        
        switch (opt) {
            case 1:
                //*: Mostrar Mensaje
                const lugar = await leerInput( 'Ciudad:' );
                
                //*: Buscar Lugar
                const lugares = await busquedas.ciudades( lugar );
                
                //* Seleccionar Lugar
                const idL = await listarLugares( lugares );
                if( idL === 0 ) continue;
                const { nombre, lat, lng } = lugares.find( ({ id }) => id === idL );

                //*: Guardar en Historial
                busquedas.agregarHistorial( nombre );
                
                //*: Clima
                const clima = await busquedas.clima( lat, lng );
                
                //*: Mostrar resultado
                console.log('\nInformación de la ciudad\n');
                console.log(`${ 'Ciudad:'.yellow } ${ nombre }`);
                console.log(`${ 'Latitud:'.yellow } ${ lat }`);
                console.log(` ${ 'Longitud:'.yellow } ${ lng }`);
                console.log(`${ 'Temperatura:'.yellow } ${ clima.temp }`);
                console.log(`${ 'Mínima:'.yellow } ${ clima.min }`);
                console.log(`${ 'Máxima:'.yellow } ${ clima.max }`);
                console.log(`${ 'Como está el clima:'.yellow } ${ clima.desc }`);
    
                break;
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, index) => {
                    const i = `${index + 1}.`.green;
                    console.log(` ${ i } ${ lugar }`)
                });
                break;
            case 0:
                break;
        }

        if( opt !== 0 ) await pausa(); 
        
        
    } while (opt !== 0);

}

main();