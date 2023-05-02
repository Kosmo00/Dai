const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async(passwor) =>{
 const salt = await bcrypt.genSalt(10);
 const hash = await bcrypt.hash(passwor,salt);
return hash;
}

helpers.matchPassword =  async(passwor,savePassword)=>{
    try {
       return await bcrypt.compare(passwor, savePassword);
    }catch(Error){
        console.log(Error);
    }
};


module.exports = helpers;