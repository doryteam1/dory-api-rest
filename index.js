const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const departamentosRouter = require('./routes/departamentos');
const tipos_usuariosRouter = require('./routes/tipos_usuarios');
const infraestructurasRouter = require('./routes/infraestructuras');
const areas_experticiasRouter = require('./routes/areas_experticias');
const especiesRouter = require('./routes/especies');
const tipos_eventosRouter = require('./routes/tipos_eventos');
const modalidadesRouter = require('./routes/modalidades');
const chatsRouter = require('./routes/chats');
const categoriasRouter = require('./routes/categorias');
const productosRouter = require('./routes/productos');
const tipos_asociacionesRouter = require('./routes/tipos_asociaciones');
const municipiosRouter = require('./routes/municipios');
const corregimientosRouter = require('./routes/corregimientos');
const veredasRouter = require('./routes/veredas');
const asociacionesRouter = require('./routes/asociaciones');
const infraestructuras_granjasRouter = require('./routes/infraestructuras_granjas');
const asociaciones_usuariosRouter = require('./routes/asociaciones_usuarios');
const granjasRouter = require('./routes/granjas');
const subregionesRouter = require('./routes/subregiones');
const proyectosRouter = require('./routes/proyectos');
const sectoresRouter = require('./routes/sectores');
const proyectos_municipiosRouter = require('./routes/proyectos_municipios');
const proyectos_subregionesRouter = require('./routes/proyectos_subregiones');
const proyectos_departamentosRouter = require('./routes/proyectos_departamentos');
const especies_usuariosRouter = require('./routes/especies_usuarios');
const tipos_normatividadesRouter = require('./routes/tipos_normatividades');
const vehiculosRouter = require('./routes/vehiculos');
const tipos_novedadesRouter = require('./routes/tipos_novedades');
const normatividadesRouter = require('./routes/normatividades');
const novedadesRouter = require('./routes/novedades');
const fotosRouter = require('./routes/fotos');
const mensajesRouter = require('./routes/mensajes');
const resenasRouter = require('./routes/resenas');
const eventosRouter = require('./routes/eventos');
const usuariosRouter = require('./routes/usuarios');
const granjasDepartamentoRouter = require('./routes/granjas-departamento');
const piscicultoresAsociacionRouter = require('./routes/piscicultores-asociacion');
const pescadoresAsociacionRouter = require('./routes/pescadores-asociacion');
const granjasMunicipioRouter = require('./routes/granjas-municipio');
const granjaRouter = require('./routes/granja');
const pescadoresMunicipioRouter = require('./routes/pescadores-municipio');
const piscicultoresMunicipioRouter = require('./routes/piscicultores-municipio');
const usuarioRouter = require('./routes/usuario');
const municipiosDepartamentoRouter = require('./routes/municipios-departamento');
const corregimientosMunicipioRouter = require('./routes/corregimientos-municipio');
const veredasMunicipioRouter = require('./routes/veredas-municipio');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/index.html');
});

app.use('/departamentos', departamentosRouter)
app.use('/tipos_usuarios', tipos_usuariosRouter)
app.use('/infraestructuras', infraestructurasRouter)
app.use('/areas_experticias', areas_experticiasRouter)
app.use('/especies', especiesRouter)
app.use('/tipos_eventos', tipos_eventosRouter)
app.use('/modalidades', modalidadesRouter)
app.use('/chats', chatsRouter)
app.use('/categorias', categoriasRouter)
app.use('/productos', productosRouter)
app.use('/tipos_asociaciones', tipos_asociacionesRouter)
app.use('/municipios', municipiosRouter)
app.use('/corregimientos', corregimientosRouter)
app.use('/veredas', veredasRouter)
app.use('/asociaciones', asociacionesRouter)
app.use('/infraestructuras_granjas', infraestructuras_granjasRouter)
app.use('/asociaciones_usuarios', asociaciones_usuariosRouter)
app.use('/granjas', granjasRouter)
app.use('/subregiones', subregionesRouter)
app.use('/proyectos', proyectosRouter)
app.use('/sectores', sectoresRouter)
app.use('/proyectos_municipios', proyectos_municipiosRouter)
app.use('/proyectos_subregiones', proyectos_subregionesRouter)
app.use('/proyectos_departamentos', proyectos_departamentosRouter)
app.use('/especies_usuarios', especies_usuariosRouter)
app.use('/tipos_normatividades', tipos_normatividadesRouter)
app.use('/vehiculos', vehiculosRouter)
app.use('/tipos_novedades', tipos_novedadesRouter)
app.use('/normatividades', normatividadesRouter)
app.use('/fotos', fotosRouter)
app.use('/mensajes', mensajesRouter)
app.use('/resenas', resenasRouter)
app.use('/eventos', eventosRouter)
app.use('/usuarios', usuariosRouter)
app.use('/novedades', novedadesRouter)
app.use('/api/granjas/departamento', granjasDepartamentoRouter)
app.use('/api/piscicultores/asociacion', piscicultoresAsociacionRouter)
app.use('/api/pescadores/asociacion', pescadoresAsociacionRouter)
app.use('/api/granjas/municipio', granjasMunicipioRouter)//error en ejecucion en servidor
app.use('/api/granja', granjaRouter)
app.use('/api/pescadores/municipio', pescadoresMunicipioRouter)
app.use('/api/piscicultores/municipio', piscicultoresMunicipioRouter)
app.use('/api/usuario', usuarioRouter)
app.use('/api/municipios/departamento', municipiosDepartamentoRouter)
app.use('/api/corregimientos/municipio', corregimientosMunicipioRouter)
app.use('/api/veredas/municipio', veredasMunicipioRouter)

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});
    return;
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});