require('dotenv').config();
const jwt = require('jsonwebtoken');

// This is a test script to decode JWT tokens
function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded successfully:');
    console.log('User ID:', decoded.userId);
    console.log('Issued at:', new Date(decoded.iat * 1000));
    console.log('Expires at:', new Date(decoded.exp * 1000));
    console.log('Full payload:', decoded);
    return decoded;
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    return null;
  }
}

// Example usage - you can paste a token here to decode it
const testToken = process.argv[2];
if (testToken) {
  console.log('🔍 Decoding token:', testToken.substring(0, 20) + '...');
  decodeToken(testToken);
} else {
  console.log('Usage: node decode-token.js <jwt_token>');
  console.log('Paste a JWT token as an argument to decode it');
}
