const axios = require('axios');

// PayHero API credentials for payment status checking
const API_USERNAME = 'LOV1coowH9xMzNtThWjF';
const API_PASSWORD = 'hAxiS4X7B8KWDO2QjdPa2zdEMn0dFw4JST5n0eoW';

// Generate Basic Auth Token
const generateBasicAuthToken = () => {
  const credentials = `${API_USERNAME}:${API_PASSWORD}`;
  return 'Basic ' + Buffer.from(credentials).toString('base64');
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const requestBody = JSON.parse(event.body);
    const { checkoutRequestId } = requestBody;
    
    if (!checkoutRequestId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'CheckoutRequestId is required' })
      };
    }
    
    console.log('Checking payment status for:', checkoutRequestId);
    
    // Query PayHero API for payment status
    const response = await axios({
      method: 'get',
      url: `https://backend.payhero.co.ke/api/v2/payments/${checkoutRequestId}`,
      headers: {
        'Authorization': generateBasicAuthToken(),
        'Content-Type': 'application/json'
      }
    });
    
    console.log('PayHero status response:', JSON.stringify(response.data, null, 2));
    
    // PayHero API returns different response structure
    // We need to check both the direct response and nested response
    const paymentData = response.data;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: paymentData,
        // Also include parsed status for easier frontend handling
        status: paymentData.ResultCode || paymentData.status,
        resultCode: paymentData.ResultCode,
        resultDesc: paymentData.ResultDesc
      })
    };
  } catch (error) {
    console.error('Payment status check error:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to check payment status',
        error: error.response?.data || error.message
      })
    };
  }
};
