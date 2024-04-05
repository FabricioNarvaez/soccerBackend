const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();
const config = require('./config');

mongoose.Promise = global.Promise;
mongoose
	.connect(config.mongodbURL)
	.then(() => {
		console.log(`La conexión a la base de datos se ha realizado correctamente.`);

		app.set('port', process.env.PORT || 3000);

		app.listen(app.get('port'), () => {
			console.log(`Servidor corriendo en el puerto: ${app.get('port')}`);
		});
	})
	.catch((err) => {
		console.log(`Error al conectar a la base de datos.`);
		console.log(err);
	});
