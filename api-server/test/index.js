'use strict';

require('dotenv').config();
const Lab = require('lab');
const Code = require('code');
const Composer = require('../index');


const lab = exports.lab = Lab.script();


lab.experiment('App', () => {

    lab.test('it composes a server', (done) => {

        Composer((err, composedServer) => {
            if(err) { done(err); }

            Code.expect(composedServer).to.be.an.object();
            done();
        });
    });
});
