import inquirer from 'inquirer';
import 'colors';

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [ 
            {
                value: 1,
                name: `${ '1.'.yellow } Buscar ciudad`
            },
            {
                value: 2,
                name: `${ '2.'.yellow } Historial`
            },
            {
                value: 0,
                name: `${ '0.'.yellow } Salir`
            },

        ]
    }
];

const inquirerMenu = async() => {
    
    console.clear();
    console.log('==============================='.green)
    console.log('   Seleccione una opción  '.white)
    console.log('===============================\n'.green)

    const { opcion } = await inquirer.prompt( preguntas );

    return opcion;

}

const pausa = async() => {

    const pause = [
        {
            type: 'input',
            name: 'continuar',
            message: `Presione ${ 'enter'.green } para continuar.`  
    
        }
    ];

    console.log('\n')
    await inquirer.prompt(pause);
    
}

const listarLugares = async( lugares = [] ) => { //Capitulo 60

    const choices = lugares.map( (lugar, index) => {
        
        const i = `${index + 1}.`.green;
         
        return {
            value: lugar.id,
            name: `${ i } ${ lugar.nombre }`
        }
    });

    choices.unshift({
        value: 0,
        name: `${ '0.'.green } ${ 'Cancelar'.grey }`
    })

    const pantalla = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ];

    const { id } = await inquirer.prompt( pantalla );

    return id;
}

const leerInput = async( message ) => {
    
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ){
                if ( value.length === 0 ) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt( question );

    return desc

}

export {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares
};
