const axios = require('axios');
const { parseString } = require('xml2js');

const GetEmployeeBasicDetailService = {
  getEmployeeBasicDetail: async function(employeeID) {
    try {
      const data = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <GetEmployeeBasicDetail xmlns="http://tempuri.org/">
            <EmployeeID>${employeeID}</EmployeeID>
          </GetEmployeeBasicDetail>
        </soap:Body>
      </soap:Envelope>`;

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://172.16.0.247/TechnomineNewHRWS/EmployeeService.asmx?op=GetEmployeeBasicDetail',
        headers: { 
          'Content-Type': 'text/xml', 
          'SOAPAction': 'http://tempuri.org/GetEmployeeBasicDetail'
        },
        data: data
      };

      const response = await axios.request(config);
      
      // Parse the XML response using xml2js
      const parsedResponse = await parseXML(response.data);

      // Extract the EmployeeName from the parsed response
      const employeeName = parsedResponse['soap:Envelope']['soap:Body'][0]['GetEmployeeBasicDetailResponse'][0]['GetEmployeeBasicDetailResult'][0]['diffgr:diffgram'][0]['NewDataSet'][0]['Table'][0]['EmployeeName'][0];

      return employeeName;
    } catch (error) {
      throw error;
    }
  }
};

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

module.exports = GetEmployeeBasicDetailService;
