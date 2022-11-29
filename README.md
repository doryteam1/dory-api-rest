# GUÍA DE INSTALACIÓN API REST

## Dependencias 

Las versiones y los nombres de las librerías utilizadas en el desarrollo del api rest son las siguientes:

Node.js v14.17.3  
MySQL versión 2.35.1.  
bcrypt: 5.0.1   
cors: 2.8.5  
dayjs: 1.11.3  
express: 4.17.2   
google-auth-library: 7.14.1  
http-errors: 2.0.0  
jwt-simple: 0.5.6   
moment: 2.29.1  
mysql2: 2.2.5  
nodemailer: 6.7.2    
socket.io: 4.5.2  

     
	Herramientas 

	Git versión 2.35.1. 
	MySQL Workbench 8.0 CE. 
	Visual Studio Code.  











	Servicios proveídos por el api rest

	Áreas de experticia:    Maneja toda la información relacionada con las áreas de experticia de los usuarios.

	Asociaciones:  Administra toda la información relacionada con las asociaciones de los usuarios.

	Buscar granjas: Utiliza toda la información relacionada con la búsqueda de las granjas en el sistema.

	Buscar pescadores:   Permite obtener toda la información relacionada con la búsqueda de los pescadores en el sistema.

	Buscar piscicultores: Permite adquirir toda la información relacionada con la búsqueda de los piscicultores en el sistema.

	Buscar usuarios por email: Obtiene toda la información relacionada con la búsqueda de los usuarios por email en el sistema.

	Categorías:  Maneja toda la información relacionada con las categorías de temas y novedades.

	Chat:  Adquiere toda la información relacionada con los mensajes en el chat.

	Compartir:  Permite compartir un enlace a un email.

	Conócenos:  Nos muestra una descripción breve de Dory.

	Contáctenos:   Permite la comunicación de los usuarios con Dory.

	Corregimientos: Nos muestra toda la información relacionada con los corregimientos del departamento donde nos ubicamos.

	Dashboard: Muestra la información del dashboard.

	Departamentos: Muestra toda la información relacionada con los departamentos del territorio colombiano.

	Enlaces rápidos: Muestra todos los enlaces de las imágenes ubicadas debajo del dashboard.

	Especies:  Presenta toda la información de las especies en las granjas.

	Etnias: Expone toda la información de las etnias de los usuarios.

	Eventos: Muestra toda la información relacionada con los eventos.

	Fotos:   Administra todas las fotos de las granjas.

	Granjas: Manipula toda la información relacionada con las granjas.

	Infraestructuras: Maneja toda la información relacionada con las infraestructuras que tienen las granjas.

	Integrantes: Expone toda la información relacionada con los integrantes del equipo de trabajo.

	Login: Presenta toda la información relacionada con los login de usuarios.

	Mensajes:  Expone toda la información relacionada con los mensajes del chat.

	Modalidades: Muestra toda la información relacionada con las modalidades de los eventos.

	Municipios: Enseña toda la información relacionada con los municipios de los departamentos del territorio colombiano.

	Negocios: Maneja toda la información relacionada con los negocios de los usuarios.

	Normatividades: Muestra toda la información relacionada con las normatividades.

	Nosotros: Maneja toda la información relacionada con la plataforma piscícola Dory.

	Novedades: Expone toda la información relacionada con las novedades.

	Pescadores:  Permite exhibir toda la información de los pescadores en el sistema.

	Piscicultores: Permite exhibir toda la información de los piscicultores en el sistema.

	Proveedores: Muestra toda la información de los proveedores en el sistema.

	Proyectos: Expone toda la información de los proyectos.

	Publicaciones: Enseña toda la información de las publicaciones de los usuarios.

	Reseñas: Muestra todas las reseñas de los usuarios con las granjas.

	Search: Muestra todas las búsquedas en el índex de la plataforma Dory.

	Sectores: Expone toda la información de los sectores del municipio.

	Sexos: Exhibe toda la información de los sexos de los usuarios.

	Slider: Expone toda la información del carrusel de slide usado en la plataforma piscícola Dory.

	Subregiones: Muestra toda la información de las subregiones de los departamentos.

	Tipos de asociaciones: Exhibe todos los tipos de asociaciones en la plataforma piscícola Dory.

	Tipos de eventos: Expone toda la información de los tipos de eventos en el sistema.

	Tipos de normatividades: Enseña toda la información de los tipos de normatividades en el sistema.

	Tipos de novedades:  Muestra toda la información de los tipos de novedades en el sistema.

	Tipos de Usuarios: Exhibe toda la información de los tipos de usuarios en el sistema.

	Top Alert: Expone la información del top alert.

	Usuarios: Administrar toda la información relacionada con los usuarios.

	Vehículos: Permite mostrar toda la información de los vehículos de los usuarios.

	Veredas: Muestra la información de las veredas de los diferentes municipios.

1. Configuraciones previas

	Instalar servidor de base de datos MySQL

Instale el servidor de base de datos en un servicio de la nube de su preferencia. Guarde el hostname, nombre de la base de datos, nombre de usuario y password de la base de datos. Estos se usarán en los siguientes pasos.	    

	2. Ejecutar el script NewCreateDB.sql en la base de datos creada en el punto anterior. 

Nota: Debe ingresar al script y cambiar el nombre de la base de datos.
 

	3. Ejecutar el script PoblarBD.sql en la base de datos creada en el punto 1, para establecer los datos iniciales.


2.  Instale GIT

Ingrese al enlace https://git-scm.com y siga las instrucciones para llevar a cabo la instalación.


3. Ingrese a GitHub

Cree una cuenta en GitHub en https://github.com  o ingrese si ya tiene una.


4. Cree un nuevo repositorio privado














 
Guarde la dirección del nuevo repositorio será usada más adelante.

5. Acceda al código fuente

Alternativa 1 (recomendada): 

git clone https://github.com/doryteam1/dory-api-rest.git
cd dory-api-rest

Alternativa 2:

cd src/dory-api-rest
git init

Ahora usted se encuentra en el directorio que contiene el código fuente de la aplicación.


6. Adicione un nuevo remoto

Estando en el directorio dory-api-rest ejecute el siguiente comando:

git remote add dory https://github.com/***.git

Remplace la url usada en el comando por la url del nuevo repositorio guardada en el punto 3.
Esto adiciona un nuevo remoto en el repositorio dory-api-rest




7. Cree la rama “master”

git checkout -b master 

8. Suba el código al nuevo repositorio

git push dory master

Ahora el código fuente de la aplicación se encuentra en el nuevo repositorio. 

Nota: Asegúrese de tener configurada la cuenta de git con un usuario que tenga los permisos necesarios para realizar este procedimiento.


9. Ingrese a Heroku

Cree una cuenta en Heroku en https://signup.heroku.com/login o ingrese si ya tiene una.


10. Cree una app en Heroku
 










Heroku usa contenedores para ejecutar y escalar todas las aplicaciones. Estos contenedores se denominan Dynos. 

Remplace el nombre de la aplicación (App name) por el de su preferencia.
Diligencie el formulario y haga clic en el botón Create app





11. Configurar App 

Para configurar la app en Heroku realice los siguientes pasos:
	
1. Seleccione GitHub como método de despliegue.
	
		


2. Presione el botón Connect to GitHub

	
3. Inicie sesión con su usuario y contraseña de GitHub para conectarse a Heroku

4. Conecte la App con el nuevo repositorio

Seleccione el nuevo repositorio creado en el punto 3

5. Seleccione la rama master para despliegues automáticos.

 
Presione el botón Enable Automatic Deploys para activar los despliegues automáticos.

12. Despliegue la App


Presione el botón Deploy Branch para realizar un despliegue manual de la rama master.
Una vez terminado el proceso la app se encuentra online.

13. Configure las Variables de entorno en Heroku


En la pestaña “Settings” de la aplicación en la sección “Config Vars” configurar las siguientes variables de entorno:

DB_HOST: Host donde se encuentra alojado el servidor de bases de datos mysql.
 
DB_NAME: Nombre de la base de datos.

DB_USER:  Usuario de la base de datos.

DB_PASSWORD: Password de usuario de la base de datos

DORY_WEB_APP_URL: Url de la aplicación web dory (La puede obtener una vez termine la guía de instalación de la aplicación web).



14. Verifique

 
En la sección Settings de la app encontrará la sección “Domains”. En esta encontrará la url base para acceder al api rest. Añada el sufijo api al final de la dirección y verifique su funcionamiento en postman.

