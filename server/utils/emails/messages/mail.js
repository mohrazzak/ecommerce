exports.message = (token) => `
  <p>Change Password</p>
  <p>To change your account password click 
   <a href="${process.env.DepURI}/reset/${token}">here</a>
   </p>
  `;
