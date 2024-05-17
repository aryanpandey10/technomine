const axios = require('axios');
const { parseString } = require('xml2js');

// Function to handle SOAP request to the UpdatePasswordService
async function updatePassword(employeeID, password) {
  // Define the SOAP request payload
  let data = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <UpdatePassword xmlns="http://tempuri.org/">
        <EmployeeID>${employeeID}</EmployeeID>
        <Password>${password}</Password>
      </UpdatePassword>
    </soap:Body>
  </soap:Envelope>`;

  // Define Axios configuration
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://172.16.0.247/TechnomineNewHRWS/EmployeeService.asmx?op=UpdatePassword',
    headers: { 
      'Content-Type': 'text/xml', 
      'SOAPAction': 'http://tempuri.org/UpdatePassword'
    },
    data: data
  };

  try {
    // Send the SOAP request
    const response = await axios.request(config);

    // Parse the XML response
    const result = await parseXML(response.data);

    // Extract the data from the response
    const updatePasswordResult = result['soap:Envelope']['soap:Body'][0]['UpdatePasswordResponse'][0]['UpdatePasswordResult'][0];

    // Return the extracted data
    return { UpdatePasswordResult: updatePasswordResult };
  } catch (error) {
    // Handle errors
    throw new Error(error.message);
  }
}

// Function to parse XML response
function parseXML(xmlData) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = {
  updatePassword: updatePassword
};
