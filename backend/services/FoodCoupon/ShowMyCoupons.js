const axios = require('axios');
const { parseString } = require('xml2js');

// Function to parse XML response
function parseXML(xmlData) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Function to fetch coupons
async function getCoupons(employeeID, fromDate, toDate) {
  let data = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <ShowMyCoupons xmlns="http://tempuri.org/">
        <EmployeeID>${employeeID}</EmployeeID>
        <FromDate>${fromDate}</FromDate>
        <ToDate>${toDate}</ToDate>
      </ShowMyCoupons>
    </soap:Body>
  </soap:Envelope>`;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://172.16.0.247/TechnomineNewHRWS/AdminService.asmx?op=ShowMyCoupons',
    headers: { 
      'SOAPAction': 'http://tempuri.org/ShowMyCoupons', 
      'Content-Type': 'text/xml'
    },
    data: data
  };

  try {
    const response = await axios.request(config);

    const result = await parseXML(response.data);

    // Extract coupon data
    const couponsData = result['soap:Envelope']['soap:Body']['ShowMyCouponsResponse']['ShowMyCouponsResult']['diffgr:diffgram']['NewDataSet']['Table'];

    // If there are no coupons, return an empty array
    if (!couponsData) {
      return [];
    }

    // If there's only one coupon, wrap it in an array for consistency
    const coupons = Array.isArray(couponsData) ? couponsData : [couponsData];

    // Map coupons to desired format
    const formattedCoupons = coupons.map(coupon => ({
      couponCode: coupon['CouponCode'],
      date: coupon['Date'],
      mealType: coupon['MealType'],
      menu: coupon['Menu']
    }));

    return formattedCoupons;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getCoupons: getCoupons
};
