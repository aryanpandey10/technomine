const axios = require('axios');
const { parseString } = require('xml2js');

// Function to book a coupon
async function bookCoupon(employeeID, date, mealType) {
  // Construct the XML request payload with dynamic values
  const data = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <BookCoupon xmlns="http://tempuri.org/">
        <EmployeeID>${employeeID}</EmployeeID>
        <Date>${date}</Date>
        <MealType>${mealType}</MealType>
      </BookCoupon>
    </soap:Body>
  </soap:Envelope>`;

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://172.16.0.247/TechnomineNewHRWS/AdminService.asmx?op=BookCoupon',
    headers: { 
      'SOAPAction': 'http://tempuri.org/BookCoupon', 
      'Content-Type': 'text/xml'
    },
    data: data
  };

  try {
    // Send the SOAP request
    const response = await axios.request(config);

    // Parse the XML response
    const result = await parseXML(response.data);

    // Extract BookCouponResult from the parsed XML
    const bookCouponResult = result['soap:Envelope']['soap:Body'][0]['BookCouponResponse'][0]['BookCouponResult'][0];
    
    // Return the BookCouponResult
    return bookCouponResult;
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
  bookCoupon: bookCoupon
};
