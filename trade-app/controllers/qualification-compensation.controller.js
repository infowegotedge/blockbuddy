import _ from 'lodash';

import QualificationCompensationHandler from "../handler/qualification-compensation.handler";

class QualificationCompensationController {

    createNewQualificationCompensationAction = async(  req, res ) => {

        try{

            res.json({ message: "New Qualification Compensation created", data: (await QualificationCompensationHandler.createNewQualificationCompensation( req.body )).getRecord });

        } catch ( err ) {

            res.boom.preconditionFailed( err.toString() );

        }

    }

}


export default new QualificationCompensationController();
