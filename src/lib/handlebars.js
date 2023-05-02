const {format} = require ('timeago.js');
const helpers = {};
helpers.timeago = (timestamp)=>{
    return format  (timestamp);
};
module.exports = helpers;
//Se utiliza para saber cuanto tiempo ha pasado de la publicacion
// dos horas despues por ejemplo