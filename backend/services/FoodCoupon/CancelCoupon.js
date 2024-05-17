const axios = require('axios');
const { parseString } = require('xml2js');

async function cancelCoupon(couponCode) {
  let data = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <CancelCoupon xmlns="http://tempuri.org/">
        <CouponCode>${couponCode}</CouponCode>
      </CancelCoupon>
    </soap:Body>
  </soap:Envelope>`;

  let config = {
    method: 'post',
    url: 'http://172.16.0.247/TechnomineNewHRWS/AdminService.asmx?op=CancelCoupon',
    headers: { 
      'SOAPAction': 'http://tempuri.org/CancelCoupon', 
      'Content-Type': 'text/xml'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    const result = await parseXML(response.data);
    const cancelResult = result['soap:Envelope']['soap:Body'][0]['CancelCouponResponse'][0]['CancelCouponResult'][0];
    return cancelResult;
  } catch (error) {
    throw new Error(error.message);
  }
}

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
  cancelCoupon: cancelCoupon
};
