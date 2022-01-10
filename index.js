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
const pescadoresDepartamentoRouter = require('./routes/pescadores-departamento');
const piscicultoresDepartamentoRouter = require('./routes/piscicultores-departamento');
const asociacionesDepartamentoRouter = require('./routes/asociaciones-departamento');
const resenasGranjaRouter = require('./routes/resenas-granja');
const buscarGranjaRouter = require('./routes/buscar-granja');
const buscarPescadoresRouter = require('./routes/buscar-pescadores');
const buscarPiscicultoresRouter = require('./routes/buscar-piscicultores');
const usuarioEmailRouter = require('./routes/usuario-email');
const buscarNormatividadTipoRouter = require('./routes/buscar-normatividad-tipo');
const buscarNormatividadRouter = require('./routes/buscar-normatividad');
const buscarEventoTipoRouter = require('./routes/buscar-evento-tipo');
const buscarEventoCursoRouter = require('./routes/buscar-evento-curso');

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

app.use('/api/departamentos', departamentosRouter)
app.use('/api/tipos-usuarios', tipos_usuariosRouter)
app.use('/api/infraestructuras', infraestructurasRouter)
app.use('/api/areas-experticias', areas_experticiasRouter)
app.use('/api/especies', especiesRouter)
app.use('/api/tipos-eventos', tipos_eventosRouter)
app.use('/api/modalidades', modalidadesRouter)
app.use('/api/chats', chatsRouter)
app.use('/api/categorias', categoriasRouter)
app.use('/api/productos', productosRouter)
app.use('/api/tipos-asociaciones', tipos_asociacionesRouter)
app.use('/api/municipios', municipiosRouter)
app.use('/api/corregimientos', corregimientosRouter)
app.use('/api/veredas', veredasRouter)
app.use('/api/asociaciones', asociacionesRouter)
app.use('/api/infraestructuras-granjas', infraestructuras_granjasRouter)
app.use('/api/asociaciones_usuarios', asociaciones_usuariosRouter)
app.use('/api/granjas', granjasRouter)
app.use('/api/subregiones', subregionesRouter)
app.use('/api/proyectos', proyectosRouter)
app.use('/api/sectores', sectoresRouter)
app.use('/api/proyectos-municipios', proyectos_municipiosRouter)
app.use('/api/proyectos-subregiones', proyectos_subregionesRouter)
app.use('/api/proyectos-departamentos', proyectos_departamentosRouter)
app.use('/api/especies-usuarios', especies_usuariosRouter)
app.use('/api/tipos-normatividades', tipos_normatividadesRouter)
app.use('/api/vehiculos', vehiculosRouter)
app.use('/api/tipos-novedades', tipos_novedadesRouter)
app.use('/api/normatividades', normatividadesRouter)
app.use('/api/fotos', fotosRouter)
app.use('/api/mensajes', mensajesRouter)
app.use('/api/resenas', resenasRouter)
app.use('/api/eventos', eventosRouter)
app.use('/api/usuarios', usuariosRouter)/**/
app.use('/api/novedades', novedadesRouter)
app.use('/api/granjas/departamento', granjasDepartamentoRouter)
app.use('/api/piscicultores/asociacion', piscicultoresAsociacionRouter)
app.use('/api/pescadores/asociacion', pescadoresAsociacionRouter)
app.use('/api/granjas/municipio', granjasMunicipioRouter)
app.use('/api/granja', granjaRouter)
app.use('/api/pescadores/municipio', pescadoresMunicipioRouter)
app.use('/api/piscicultores/municipio', piscicultoresMunicipioRouter)
app.use('/api/usuario', usuarioRouter)
app.use('/api/municipios/departamento', municipiosDepartamentoRouter)
app.use('/api/corregimientos/municipio', corregimientosMunicipioRouter)
app.use('/api/veredas/municipio', veredasMunicipioRouter)
app.use('/api/pescadores/departamento', pescadoresDepartamentoRouter)
app.use('/api/piscicultores/departamento', piscicultoresDepartamentoRouter)
app.use('/api/asociaciones/departamento', asociacionesDepartamentoRouter)
app.use('/api/resenas/granja', resenasGranjaRouter)
app.use('/api/buscar/granja', buscarGranjaRouter)
app.use('/api/buscar/pescadores', buscarPescadoresRouter)
app.use('/api/buscar/piscicultores', buscarPiscicultoresRouter)
app.use('/api/piscicultores/municipio', piscicultoresMunicipioRouter)
app.use('/api/buscar/usuario/email', usuarioEmailRouter)
app.use('/api/buscar/normatividad/tipo', buscarNormatividadTipoRouter)
app.use('/api/buscar/normatividad', buscarNormatividadRouter)
app.use('/api/buscar/evento/tipo', buscarEventoTipoRouter)
app.use('/api/buscar/evento/curso', buscarEventoCursoRouter)

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