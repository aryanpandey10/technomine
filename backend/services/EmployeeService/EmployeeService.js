const axios = require('axios');
const { parseString } = require('xml2js');

// Function to handle SOAP request to the EmployeeService
async function login(employeeID, password) {
  // Define the SOAP request payload
  let data = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Login xmlns="http://tempuri.org/">
        <EmployeeID>${employeeID}</EmployeeID>
        <Password>${password}</Password>
      </Login>
    </soap:Body>
  </soap:Envelope>`;

  // Define Axios configuration
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://172.16.0.247/TechnomineNewHRWS/EmployeeService.asmx?op=Login',
    headers: { 
      'Content-Type': 'text/xml', 
      'SOAPAction': 'http://tempuri.org/Login'
    },
    data: data
  };

  try {
    // Send the SOAP request
    const response = await axios.request(config);

    // Parse the XML response
    const result = await parseXML(response.data);

    // Extract the data from the response
    const loginResult = result['soap:Envelope']['soap:Body'][0]['LoginResponse'][0]['LoginResult'][0];
    
    // Return the extracted data
    return { LoginResult: loginResult };
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
  login: login
};
