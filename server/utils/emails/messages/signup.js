exports.message = (token) => `
  <p>Thanks for joining us!</p>
  <p>To activate your account click 
   <a href="${process.env.DepURI}/confirm/${token}">here</a>
   </p>
  `;
