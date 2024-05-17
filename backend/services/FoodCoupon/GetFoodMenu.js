const axios = require('axios');
const { parseString } = require('xml2js');

async function getFoodMenu(date) {
  // Construct the XML request payload with the dynamic date value
  let data = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <GetFoodMenu xmlns="http://tempuri.org/">
        <Date>${date}</Date>
      </GetFoodMenu>
    </soap:Body>
  </soap:Envelope>`;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://172.16.0.247/TechnomineNewHRWS/AdminService.asmx?op=GetFoodMenu',
    headers: { 
      'SOAPAction': 'http://tempuri.org/GetFoodMenu', 
      'Content-Type': 'text/xml'
    },
    data: data
  };

  try {
    // Send the SOAP request
    const response = await axios.request(config);

    // Parse the XML response
    const result = await parseXML(response.data);

    // Extract MealType and Menu from the parsed XML
    const tables = result['soap:Envelope']['soap:Body'][0]['GetFoodMenuResponse'][0]['GetFoodMenuResult'][0]['diffgr:diffgram'][0]['NewDataSet'][0]['Table'];
    
    // Map over all tables to get meal types and menus
    const meals = tables.map(table => ({
      mealType: table['MealType'][0],
      menu: table['Menu'][0]
    }));

    // Return the extracted data
    return meals;
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
  getFoodMenu: getFoodMenu
};
