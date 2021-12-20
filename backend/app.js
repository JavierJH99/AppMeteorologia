const https = require('https')

const express = require('express')
const app = express()

var cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = 3100
const key = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqamgzQGFsdS51YS5lcyIsImp0aSI6I' +
'jE4ZWQxNDJkLWJhNjQtNDQxZi1iMDgzLTVmNDllNjI3YTBjOSIsImlzcyI6IkFFTUVUIi' +
'wiaWF0IjoxNjM3OTIxNjIyLCJ1c2VySWQiOiIxOGVkMTQyZC1iYTY0LTQ0MWYtYjA4My01Z' +
'jQ5ZTYyN2EwYzkiLCJyb2xlIjoiIn0.aAiyEyNWXKpZyQT3dkRkL7ZTWhSByMYfG7nHixGYGsc';

const settingsMunicipios = {
    hostname: 'opendata.aemet.es',
    path: '/opendata/api/maestro/municipios?api_key=' + key,
    method: 'GET',
}

function settingsForMunicipio(codigo){
    settingsPrediccion = {
        hostname: 'opendata.aemet.es',
        path: '/opendata/api/prediccion/especifica/municipio/diaria/' + codigo + '?api_key=' + key,
        method: 'GET',
    }
    return settingsPrediccion;
}

app.get('/', (req,res) => {
    let datos = '';
    const subReq = https.request(settingsMunicipios, result => {
        result.setEncoding('binary');
    
        result.on('data', (chunk) => {
            datos += chunk;
        }).on('end', () => { 
            res.send(datos);
        });
    })
    
    subReq.on('error', error => {
        res.send(error)
    })
    
    subReq.end();   
})

app.post('/', (req, res) => {
    let datos = '';
    const subReq = https.request(settingsForMunicipio(req.body.codigo), result => {
        result.setEncoding('binary');
        result.on('data', (chunk) => {
            datos += chunk;
        }).on('end', () => {

            let datosPrediccion = '';
            const subReq2 = https.request((JSON.parse(datos)).datos, result2 => {
                result2.setEncoding('binary');
                result2.on('data', (chunk) => {
                    datosPrediccion += chunk;
                }).on('end', () => {
                    //Devuelve los datos de predicción del día siguiente
                    res.send((JSON.parse(datosPrediccion))[0].prediccion.dia[1]);
                });
            })
            
            subReq2.on('error', error => {
                res.send(error)
            })
            
            subReq2.end();
            //console.log((JSON.parse(datos)).datos);
        });
    })
    
    subReq.on('error', error => {
        res.send(error)
    })
    
    subReq.end();
})

app.listen(port, () => {console.log(`Servidor iniciado en http://localhost:${port}`)})