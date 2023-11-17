const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const options = { useNewUrlParser: true };

mongoose.Promise = global.Promise;
mongoose
	.connect(process.env.URL_MONGODB, options)
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
