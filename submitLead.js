const leadService = require('./leadService.js');

    /**
     * Submits lead data to the lead service. 
     * 
     * @param {object} data lead data
     * @param {function} serverErrorFn A function to be run when a 500 error is returned from the lead service
     * @returns {
     *  status: number,
     *  data: string
     * }
     */
const submitLead = async (data, serverErrorFn = () => null) => {

    const response = await leadService.send(data);

    if(response.status >= 200 && response.status < 300){
        return response.data
    } else if (response.status >= 500){
        return serverErrorFn();
    } else {
        throw new Error('Failed to submit lead. Response: ', response.data);
    }
}

module.exports = submitLead;