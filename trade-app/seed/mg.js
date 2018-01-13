import Migrate from './migration';

async function mg() {

    await Migrate.migrate();
    
}



module.exports = mg;