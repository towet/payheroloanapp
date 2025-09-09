// Simple payment callback handler without external dependencies

// Working Netlify function to handle payment callback from PayHero - copied from genesis project
exports.handler = async (event, context) => {
  // Process POST request only
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ status: 'error', message: 'Method not allowed' })
    };
  }
  
  try {
    // Parse the callback data
    const callbackData = JSON.parse(event.body);
    
    // Log the callback for debugging
    console.log('Payment callback received:', JSON.stringify(callbackData, null, 2));
    
    // Extract payment info from PayHero callback
    const response = callbackData.response || {};
    const checkoutRequestId = response.CheckoutRequestID;
    const externalReference = response.ExternalReference;
    
    if (checkoutRequestId) {
      // Log payment data for debugging (in production, you would store this in a database)
      const paymentData = {
        checkout_request_id: checkoutRequestId,
        external_reference: externalReference,
        status: response.Status === 'Success' ? 'SUCCESS' : 'FAILED',
        amount: response.Amount,
        phone_number: response.Phone,
        mpesa_receipt_number: response.MpesaReceiptNumber,
        result_desc: response.ResultDesc,
        result_code: response.ResultCode
      };
      
      console.log(`Payment status received for ${checkoutRequestId}:`, paymentData);
    }
    
    // Acknowledge receipt of callback
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'success', message: 'Callback received successfully' })
    };
  } catch (error) {
    console.error('Callback processing error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'error', message: 'Failed to process callback' })
    };
  }
};
