const { application } = require("express");
const nodemailer = require("nodemailer");
const axios = require("axios")
const crypto = require("crypto");
require("dotenv").config();


// Configure Nodemailer transporter- adwoa@tuaneka.ai
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    type: "OAuth2",
    user: "adwoa@tuaneka.ai",
    clientId: "b70843ad-8a0b-4495-b7aa-00fb6427e5f9",
    clientSecret: "zJe8Q~A2mhegvkWv_HryaRcFhJFWGWylHzsnlaXq",
    accessToken: "eyJ0eXAiOiJKV1QiLCJub25jZSI6Im5XRGNDOEFhRGl0OTlQZ3FUOUNVTzBuWTlOZGtIZ2NtLXFoSVhuUHNfNm8iLCJhbGciOiJSUzI1NiIsIng1dCI6IkpETmFfNGk0cjdGZ2lnTDNzSElsSTN4Vi1JVSIsImtpZCI6IkpETmFfNGk0cjdGZ2lnTDNzSElsSTN4Vi1JVSJ9.eyJhdWQiOiJodHRwczovL291dGxvb2sub2ZmaWNlMzY1LmNvbSIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2IyYzk1YTQyLWM1YTItNGVmOS1hZDU0LTBmN2IxZjcwZDI5ZS8iLCJpYXQiOjE3NDMwMjA0NDYsIm5iZiI6MTc0MzAyMDQ0NiwiZXhwIjoxNzQzMDI0NzgxLCJhY2N0IjowLCJhY3IiOiIxIiwiYWlvIjoiQVVRQXUvOFpBQUFBS293Mm1qcG9iaHVRUS9xcDNDZThRYU1mOWlKZXkvYzRxNXZ3cXJFNGhCdDFQU1daa3kyM1dMVmdrM2RPRjQ4SUllS3kvMkwxTzVkMWVza2J6Lyt1bGc9PSIsImFtciI6WyJwd2QiXSwiYXBwX2Rpc3BsYXluYW1lIjoiU01UUCBOb2RlLmpzIEFwcCIsImFwcGlkIjoiYjcwODQzYWQtOGEwYi00NDk1LWI3YWEtMDBmYjY0MjdlNWY5IiwiYXBwaWRhY3IiOiIxIiwiZW5mcG9saWRzIjpbXSwiZmFtaWx5X25hbWUiOiJPcGFyZSBTYWZvcm8iLCJnaXZlbl9uYW1lIjoiQWxmcmVkIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTU0LjE2MS4xMzguMTQ2IiwibG9naW5faGludCI6Ik8uQ2lRellXUXdaV0V6TnkxbU16azJMVFF3T0dJdFlUWTROUzB3TnpKbVpqTmhOalpoTVRVU0pHSXlZemsxWVRReUxXTTFZVEl0TkdWbU9TMWhaRFUwTFRCbU4ySXhaamN3WkRJNVpSb1FRV1IzYjJGQWRIVmhibVZyWVM1aGFTQUoiLCJuYW1lIjoiQWxmcmVkIE9wYXJlIFNhZm9ybyIsIm9pZCI6IjNhZDBlYTM3LWYzOTYtNDA4Yi1hNjg1LTA3MmZmM2E2NmExNSIsInB1aWQiOiIxMDAzMjAwNDY2NzI1RkRDIiwicmgiOiIxLkFVOEFRbHJKc3FMRi1VNnRWQTk3SDNEU25nSUFBQUFBQVBFUHpnQUFBQUFBQUFBNUFhdFBBQS4iLCJzY3AiOiJNYWlsLlJlYWRXcml0ZSBNYWlsLlNlbmQgU01UUC5TZW5kIFVzZXIuUmVhZCIsInNpZCI6IjAwMzEyYTA5LTVhMmItYjhkYi05MmM5LWQwNTljY2FhMDk5MiIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IlpRYXRfQ0N4ay1kdUUxRnlsdWRHWWk4RGxkdFV4elYwRDRxWVFFZHVSOWMiLCJ0aWQiOiJiMmM5NWE0Mi1jNWEyLTRlZjktYWQ1NC0wZjdiMWY3MGQyOWUiLCJ1bmlxdWVfbmFtZSI6IkFkd29hQHR1YW5la2EuYWkiLCJ1cG4iOiJBZHdvYUB0dWFuZWthLmFpIiwidXRpIjoiNENEZW9EbUF0RUNLZVN1ZDdOc29BUSIsInZlciI6IjEuMCIsIndpZHMiOlsiNjJlOTAzOTQtNjlmNS00MjM3LTkxOTAtMDEyMTc3MTQ1ZTEwIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19hdWRfZ3VpZCI6IjAwMDAwMDAyLTAwMDAtMGZmMS1jZTAwLTAwMDAwMDAwMDAwMCIsInhtc19pZHJlbCI6IjE2IDEifQ.dloe5Uxe80lUxdQ2OpxzDl7gcyQcW3U9vN7FUdK67qybNQd6oKkDOGJciiDQuBEUAz4XqPQDy6RJH0vk3piBZjOxZL077guUfndKuU--YGEqVNrmpV1SNerNN5xd3WtBe2vk_3SGPcwL767LPWxyd2gE0w8YCF-WXkd5Ni5T4Ob_2JuAeZzg06K8OpDOD5vMbIX8wZX3BBTzyXZvjA4V_LwHID1ZplvaqB6eeNyothgD8cD05CCtCAxaB6b-INl6AqHVI3AEFbwUFL6Y6zbiqnDdLLtGEKBUZmVep4Fr5NLMLO-N9T184I2GUJCD_bS46huS0pGhtwxfUws-Cxo2hw",
     refreshToken: "1.AU8AQlrJsqLF-U6tVA97H3DSnq1DCLcLipVEt6oA-2Qn5fk5AatPAA.AgABAwEAAABVrSpeuWamRam2jAF1XRQEAwDs_wUA9P-dXrW0mbN8gUygMf7r4_TbXED22FaNefcvA1xSEWbo4abJvZyROB30BkCo8hNWz6AMwGbim9EQt33dqo7ZD40uUQKIuoZMf7y-NkWD7pv9vMc6uNirEQBvZ22Li0UHTE4VgXt1wze3RilAwyN7cyYEsiZrLdOFn2OcBoRA8ngc0GDPJuXp6raf-U-99nn40-7iUd8Efc8RNFDnyS5GVsIGlTNb2JpnQvSFlfsvWUaBY8WshTa84WeGil_RzENAs2abm0S9E1DupuwxxjJ5aBTtunZ-dT7VgASYn7NcRk1SdYz8PmowZAxZviFXrH8Pk1jHq-xolovhCo7NPaUA9RFTrMaywczdtScjpY7_elF6wHDL4j3dPscFe__zjPRGp0FygQs3WbY75uOO_S4P5KRCuvXAvfKdmpZqvhEDMAUzUfN9aD2AUtRVn3xfv4q4z4gBEvU_TrocKMFVeKxEcNEWAVXNw8c_x6Gdnr2Nvw6CWNaMm61pPf1CqeRL4aKNlqRYLXQqeO-4nf3LpwcrGQ7uNTpT75RTj-IFCbCVz6lxOEzLs4SmOILoyrgOSPbbvTIBC-MYs4z_USyoGFDVY17z8cwSNSgNIRL-S--JRlqKQjdIjBNpAmA-LtM_dTQWtAHqePeBh6BX1PsDEsop1woFChFUHr5m_SeAR8mqK5TqcZlnAqfj8ETMLLd1OnFcaMSIwfE4Ltvg0leUqDXonzDPB6m-5chqplBi712Z4Sv2vLlHHKYxVqgyTgZpZo7qyRGofzgM5G-zjClHLhBmR0zRklmFQXRkbv6XGAdyuXkIOf5sHieW1PjZAGLsQdJWwXZiAFjjAtdZRoGd4f84mG2a1S-q1SeE-i5HolDuQN7OCFStVhqDaHBs8ZLmKa4fpaire8r57B4omACFGkvPbxZzyAl6mPUEgzcYralCE_0iHaqc_AtFq_UL5hnx-xE9GWdmzJu-p2ZYZ_oDi_lSxbfRcpX9VMlK9Ix5U2_gwjPHPNvU7O4s4FJ-aU_TrHc"
         },
}); 
// Configure Nodemailer transporter- adwoatuaneka@gmail.com
const transporter1 = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER2,
    pass: process.env.EMAIL_PASS2
  }
});

const date = new Date();
const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

// Ensure Paystack secret key is loaded
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY_TEST;
if (!paystackSecretKey) {
  console.error("Error: PAYSTACK_SECRET_KEY is not set in .env file");
  process.exit(1);
}



// START:: Generate Invoice Email
const generateInvoice = async (req, res) => {
  const { file_id, business_name, customer_email, business_email, business_address, items, taxableAmount, vat, paymentDate, currency } = req.body;

  if (!customer_email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const htmlContent = `
 <html>
  <body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px; text-align: center;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; 
                border: 2px solid rgba(0, 0, 0, 0.5); box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); text-align: left;">
      
      <!-- Invoice Header -->
      <table width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="width: 50%; text-align: left;">
            <h3 style="margin: 0;">Invoice</h3>
            <img style="width:130px; height: 55px" src="https://drive.google.com/uc?export=view&id=${file_id}" />
            <p><strong>${business_name}</strong></p>
            <p>${business_address}</p>
            <p>${customer_email}</p>
          </td>
          <td style="width: 50%; text-align: right;">
            <p><strong>Invoice Number: INV-${Math.floor(1000 + Math.random() * 9000)}</strong></p>
            <p>Invoice Date: ${formattedDate}</p>
            <p>Payment Due: ${paymentDate}</p>
            <p><strong>Amount Due: ${(
      items.reduce((total, item) => total + ((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)), 0) +
      (parseFloat(taxableAmount) || 0) +
      (parseFloat(vat) || 0)
    ).toFixed(2) + " " + currency
    }</strong></p>
          </td>
        </tr>
      </table>

      <!-- Items Table -->
      <table width="100%" border="1" style="border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background: #333; color: white;">
            <th style="padding: 10px;">Service</th>
            <th style="padding: 10px;">Quantity</th>
            <th style="padding: 10px;">Price</th>
          </tr>
        </thead>
        <tbody>
  ${items.map(item => `
    <tr>
      <td style="padding: 10px;">
        <strong>${item.name}</strong><br>
        <small>${item.description}</small>
      </td>
      <td style="padding: 10px;">${item.quantity}</td>
<td style="padding: 10px;">${(Number(item.price) || 0).toFixed(2)}</td>
    </tr>
  `).join('')}
</tbody>
      </table>

     <!-- Total Section -->
<table width="100%" style="border-collapse: collapse; margin-top: 20px">
  <tr>
    <td style="width: 50%; font-weight: bold;">Sub Total:</td>
    <td style="width: 50%; text-align: right;">
    ${(
      items.reduce((total, item) => total + ((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)), 0) +
      (parseFloat(taxableAmount) || 0) +
      (parseFloat(vat) || 0)
    ).toFixed(2) + " " + currency
    }
    </td>
  </tr>
  <tr>
    <td style="width: 50%; font-weight: bold;">Taxable Amount:</td>
    <td style="width: 50%; text-align: right;">${taxableAmount + " " + currency} </td>
  </tr>
  <tr>
    <td style="width: 50%; font-weight: bold;">VAT:</td>
    <td style="width: 50%; text-align: right;">${vat + " " + currency}</td>
  </tr>
  <tr style="border-top: 1px solid #ddd;">
    <td style="width: 50%; font-weight: bold;">Amount Due:</td>
    <td style="width: 50%; text-align: right;">
    ${(
      items.reduce((total, item) => total + ((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)), 0) +
      (parseFloat(taxableAmount) || 0) +
      (parseFloat(vat) || 0)
    ).toFixed(2) + " " + currency
    }
    </td>
  </tr>
</table>

      <!-- Payment Info -->
      <table width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="width: 65%; vertical-align: top; font-size: 10px; line-height: 0.9">
            <p style="margin-top: 20px; color: rgb(250, 71, 0);">NOTES AND TERMS</p>
            <p>TeamAlfy Web Services</p>
            <p>FWST/J#WAN: N202530012</p>
            <p>Account Number: 12-1234-123456-12</p>
            <p><strong>Please use INV-${Math.floor(1000 + Math.random() * 9000)} as a reference number.</strong></p>
            <p>For any questions, contact <strong>Admin@teamalfy.com</strong></p>
          </td>
          <td style="text-align: right; padding-top:25px;">
            <p>Pay online <br>
              <a href="https://bay.stripe.com" target="_blank">https://bay.stripe.com</a>
            </p>
            <img style="width:80px" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://bay.stripe.com" 
                 alt="QR Code" />
          </td>
        </tr>
      </table>

    </div>
  </body>
</html>
`;


  const htmlContent2 = `
<html>
 <body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px; text-align: center;">
 <p> You made an invoice to ${customer_email} with the following details: </p>
   <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; 
               border: 2px solid rgba(0, 0, 0, 0.5); box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); text-align: left;">
     
     <!-- Invoice Header -->
     <table width="100%" style="border-collapse: collapse;">
       <tr>
         <td style="width: 50%; text-align: left;">
           <h3 style="margin: 0;">Invoice</h3>
           <img style="width:130px; height: 55px" src="https://drive.google.com/uc?export=view&id=${file_id}" />
           <p><strong>${business_name}</strong></p>
           <p>${business_address}</p>
           <p>${customer_email}</p>
         </td>
         <td style="width: 50%; text-align: right;">
           <p><strong>Invoice Number: INV-${Math.floor(1000 + Math.random() * 9000)}</strong></p>
           <p>Invoice Date: ${formattedDate}</p>
           <p>Payment Due: ${paymentDate}</p>
           <p><strong>Amount Due: ${(
      items.reduce((total, item) => total + ((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)), 0) +
      (parseFloat(taxableAmount) || 0) +
      (parseFloat(vat) || 0)
    ).toFixed(2) + " " + currency
    }</strong></p>
         </td>
       </tr>
     </table>

     <!-- Items Table -->
     <table width="100%" border="1" style="border-collapse: collapse; text-align: left;">
       <thead>
         <tr style="background: #333; color: white;">
           <th style="padding: 10px;">Service</th>
           <th style="padding: 10px;">Quantity</th>
           <th style="padding: 10px;">Price</th>
         </tr>
       </thead>
       <tbody>
 ${items.map(item => `
   <tr>
     <td style="padding: 10px;">
       <strong>${item.name}</strong><br>
       <small>${item.description}</small>
     </td>
     <td style="padding: 10px;">${item.quantity}</td>
<td style="padding: 10px;">${(Number(item.price) || 0).toFixed(2)}</td>
   </tr>
 `).join('')}
</tbody>
     </table>

    <!-- Total Section -->
<table width="100%" style="border-collapse: collapse; margin-top: 20px">
 <tr>
   <td style="width: 50%; font-weight: bold;">Sub Total:</td>
   <td style="width: 50%; text-align: right;">
     ${items.reduce((total, item) => total + ((parseFloat(item.price * item.quantity) || 0) * (parseInt(item.quantity) || 1)), 0).toFixed(2) + " " + currency}
   </td>
 </tr>
 <tr>
   <td style="width: 50%; font-weight: bold;">Taxable Amount:</td>
   <td style="width: 50%; text-align: right;">${taxableAmount + " " + currency} </td>
 </tr>
 <tr>
   <td style="width: 50%; font-weight: bold;">VAT:</td>
   <td style="width: 50%; text-align: right;">${vat + " " + currency}</td>
 </tr>
 <tr style="border-top: 1px solid #ddd;">
   <td style="width: 50%; font-weight: bold;">Amount Due:</td>
   <td style="width: 50%; text-align: right;">
     ${(
      items.reduce((total, item) => total + ((parseFloat(item.price * item.quantity) || 0) * (parseInt(item.quantity) || 1)), 0) +
      (parseFloat(taxableAmount) || 0) +
      (parseFloat(vat) || 0)
    ).toFixed(2) + " " + currency
    }
   </td>
 </tr>
</table>

     <!-- Payment Info -->
     <table width="100%" style="border-collapse: collapse;">
       <tr>
         <td style="width: 65%; vertical-align: top; font-size: 10px; line-height: 0.9">
           <p style="margin-top: 20px; color: rgb(250, 71, 0);">NOTES AND TERMS</p>
           <p>TeamAlfy Web Services</p>
           <p>FWST/J#WAN: N202530012</p>
           <p>Account Number: 12-1234-123456-12</p>
           <p><strong>Please use INV-${Math.floor(1000 + Math.random() * 9000)} as a reference number.</strong></p>
           <p>For any questions, contact <strong>Admin@teamalfy.com</strong></p>
         </td>
         <td style="text-align: right; padding-top:25px;">
           <p>Pay online <br>
             <a href="https://bay.stripe.com" target="_blank">https://bay.stripe.com</a>
           </p>
           <img style="width:80px" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://bay.stripe.com" 
                alt="QR Code" />
         </td>
       </tr>
     </table>

   </div>
 </body>
</html>
`;


  try {
    await transporter1.sendMail({
      from: process.env.EMAIL_USER3,
      to: customer_email,
      subject: "Your Invoice from Adwoa",
      html: htmlContent
    });
    await transporter1.sendMail({
      from: process.env.EMAIL_USER3,
      to: business_email,
      subject: "Your Invoice from Adwoa",
      html: htmlContent2
    });
    res.status(200).json({ message: "Invoice email sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email", details: error });
  }
};
// END:: Generate Invoice Email

/// START:: Generate Invoice Email with Paystack Payment Link
const invoicepayment = async (req, res) => {
  const { customer_email, items, business_email, customer_name, customer_phone, customer_location } = req.body;

  if (!customer_email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Generate invoice total
  const priceString = items[0]?.price || "GHS 0"; // Fallback if undefined
  const totalAmount = parseFloat(priceString.replace(/\D/g, '')); 

  // Step 1: Initialize Paystack Payment
  const paystackResponse = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email: customer_email,
      amount: totalAmount * 100, // Amount in pesewas/kobo
    },
    {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  // Dynamically generate payment URL
  const paymentUrl = paystackResponse.data.data.authorization_url; // Get correct payment URL

  // HTML Email Template to customers
  const htmlContent = `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px; text-align: center;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; 
                  border: 2px solid rgba(0, 0, 0, 0.5); box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); text-align: left;">
        
        <!-- Invoice Header -->
        <table width="100%" style="border-collapse: collapse;">
          <tr>
            <td style="width: 50%; text-align: left;">
              <h3 style="margin: 0;">Invoice</h3>
              <img style="width:130px; height: 55px" src="https://tuaneka.com/images/home/footer-logo.webp" />
              <p><strong>Tuaneka invoice Ltd</strong></p>
              <p>P. O. Box 666</p>
              <p>${customer_email}</p>
            </td>
            <td style="width: 50%; text-align: right;">
              <p><strong>Invoice Number: INV-${Math.floor(1000 + Math.random() * 9000)}</strong></p>
              <p>Invoice Date: ${new Date().toLocaleDateString()}</p>
              <p>Payment Due: ${new Date().toLocaleDateString()}</p>
              <p><strong>Amount Due: GHS ${totalAmount}</strong></p>
            </td>
          </tr>
        </table>

        <!-- Items Table -->
        <table width="100%" border="1" style="border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: #333; color: white;">
              <th style="padding: 10px;">Service</th>
              <th style="padding: 10px;">Quantity</th>
              <th style="padding: 10px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td style="padding: 10px;">
                  <strong>${item.product_name}</strong><br>
                  <small>${item.product_description}</small>
                </td>
                <td style="padding: 10px;">${item.quantity}</td>
                <td style="padding: 10px;">${item.price}</td>
              </tr>`).join('')}
          </tbody>
        </table>

        <!-- Total Section -->
        <table width="100%" style="border-collapse: collapse; margin-top: 20px">
          <tr>
            <td style="width: 50%; font-weight: bold;">Sub Total:</td>
            <td style="width: 50%; text-align: right;">${totalAmount}</td>
          </tr>
          <tr>
            <td style="width: 50%; font-weight: bold;">Taxable Amount:</td>
            <td style="width: 50%; text-align: right;">0</td>
          </tr>
          <tr>
            <td style="width: 50%; font-weight: bold;">VAT:</td>
            <td style="width: 50%; text-align: right;">0</td>
          </tr>
          <tr style="border-top: 1px solid #ddd;">
            <td style="width: 50%; font-weight: bold;">Amount Due:</td>
            <td style="width: 50%; text-align: right;">GHS ${totalAmount}</td>
          </tr>
        </table>

        <!-- Payment Info -->
        <table width="100%" style="border-collapse: collapse;">
          <tr>
            <td style="width: 65%; vertical-align: top; font-size: 10px; line-height: 0.9">
              <p style="margin-top: 20px; color: rgb(250, 71, 0);">NOTES AND TERMS</p>
              <p>TeamAlfy Web Services</p>
              <p>FWST/J#WAN: N202530012</p>
              <p>Account Number: 12-1234-123456-12</p>
              <p><strong>Please use INV-${Math.floor(1000 + Math.random() * 9000)} as a reference number.</strong></p>
              <p>For any questions, contact <strong>Admin@teamalfy.com</strong></p>
            </td>
            <td style="text-align: right; padding-top:25px;">
              <p>Pay online <br>
                <a style="color: rgb(238, 67, 0)" href="${paymentUrl}" target="_blank" style="
                display: inline-block;
                background: rgb(238, 67, 0);
                color: white;
                padding: 12px 20px;
                text-decoration: none;
                font-weight: bold;
                border-radius: 5px;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);" target="_blank">Pay Now</a>
              </p>
              <img style="width:70px" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(paymentUrl)}" 
                   alt="QR Code" />
            </td>
          </tr>
        </table>

    

      </div>
          <!-- Payment Button -->
        <div style="text-align: center; margin-top: 20px;">
          <a href="${paymentUrl}" target="_blank" style="
            display: inline-block;
            background: rgb(238, 67, 0);
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          ">
            Click to Pay Now
          </a>
        </div>
    </body>
  </html>`;

    // HTML Email Template to Business

  const htmlContent2 = `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px; text-align: center;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; 
                  border: 2px solid rgba(0, 0, 0, 0.5); box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);">
<div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 10px; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">

  <!-- Logo -->
  <div style="margin-bottom: 20px;">
    <img src="https://tuaneka.com/images/home/footer-logo.webp" alt="Company Logo" style="width: 140px; height: auto;" />
  </div>

  <!-- Order Notification Message -->
  <h2 style="color: #222; font-size: 20px;">🛒 New Order Received</h2>
  <p style="font-size: 15px; color: #666; margin-bottom: 1px;">A customer has placed an order. Below are the details:</p>

  <!-- Customer Details -->
  <div style="text-align: left; margin-left:100px; background: white; border-radius: 8px; box-shadow: inset 0 0 8px rgba(0,0,0,0.05);">
    <p style="font-size: 12px; margin: 6px 0;"><strong>👤 Name:</strong> ${customer_name}</p>
    <p style="font-size: 12px; margin: 6px 0;"><strong>📍 Location:</strong> ${customer_location}</p>
    <p style="font-size: 12px; margin: 6px 0;"><strong>📧 Email:</strong> <a href="mailto:${customer_email}" style="color: #007bff; text-decoration: none;">${customer_email}</a></p>
    <p style="font-size: 12px; margin: 6px 0;"><strong>📞 Phone:</strong> <a href="tel:${customer_phone}" style="color: #007bff; text-decoration: none;">${customer_phone}</a></p>
  </div>

</div>

        <!-- Items Table -->
        <table width="100%" border="1" style="border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: #333; color: white;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px;">Quantity</th>
              <th style="padding: 10px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td style="padding: 10px;">
                <strong>${item.product_name}</strong><br>
                <small>${item.product_description}</small>
                </td>
                <td style="padding: 10px;">${item.quantity}</td>
                <td style="padding: 10px;">${item.price}</td>
              </tr>`).join('')}
          </tbody>
        </table>

        <!-- Total Amount Due -->
        <table width="100%" style="border-collapse: collapse; margin-top: 20px;">
          <tr style="border-top: 2px solid #ddd;">
            <td style="width: 50%; font-weight: bold; font-size: 16px; padding: 10px; text-align: left;">Amount Due:</td>
            <td style="width: 50%; font-size: 16px; padding: 10px; text-align: right;"><strong>GHS ${totalAmount}</strong></td>
          </tr>
        </table>

        <!-- Closing Message -->
        <p style="margin-top: 20px; font-size: 14px; color: #555;">
          Please review and process this order as soon as possible.
        </p>

      </div>
    </body>
  </html>`;


  // Set up nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER2,
      pass: process.env.EMAIL_PASS2,
    },
  });

  try {
    await transporter1.sendMail({
      from: process.env.EMAIL_USER3,
      to: customer_email,
      subject: "Your Invoice from TeamAlfy Web Services",
      html: htmlContent,
    });
    await transporter1.sendMail({
      from: process.env.EMAIL_USER3,
      to: business_email,
      subject: "An order has been made",
      html: htmlContent2,
    });

    res.status(200).json({ message: "Invoice email sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
};
// END:: Generate Invoice Email with Paystack Payment Link

// START:: Open paystack link

const openLink = async (req, res) => {
  try {
    const { amount, email } = req.query; // Extract from URL

    if (!amount || !email) {
      return res.status(400).json({ error: "Amount and email are required" });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount: Number(amount) * 100, // Convert to kobo
        email
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` // Use environment variables
        }
      }
    );

    return res.redirect(response.data?.data?.authorization_url); // Redirect user to Paystack payment page
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Failed to generate payment link",
      details: error.response?.data || error.message
    });
  }
};
// END:: Open paystack link

const sendMail = async (req, res) => {
  try {
    const { customer_email, price, customer_name, company_name, phone, select_boot_option } = req.body;

    if (!customer_email) {
      return res.status(400).json({ error: "Customer email is required" });
    }

// Step 1: Initialize Paystack Payment
let paymentUrl;
try {
  // Validate required fields
  if (!customer_email || !price) {
    return res.status(400).json({ error: "Customer email and price are required." });
  }

  const paystackResponse = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email: customer_email,
      amount: Number(price) * 100, // Convert to pesewas
      metadata: {
        customer_name: customer_name || "Unknown",
        company_name: company_name || "Unknown",
        select_boot_option: select_boot_option || "Unknown",
        phone: phone || "Unknown",
        purpose: "booking"
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST2}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!paystackResponse.data || !paystackResponse.data.data) {
    throw new Error("Paystack did not return a valid response.");
  }

  paymentUrl = paystackResponse.data.data.authorization_url; // Get correct payment URL
  console.log("✅ Payment URL generated:", paymentUrl);
} catch (paystackError) {
  console.error("❌ Paystack Error:", paystackError.response?.data || paystackError.message);
  return res.status(500).json({ error: "Failed to initialize payment. Try again later." });
}


    // Step 2: Prepare Email HTML Template
    const htmlContent = `
    <html>
    
      <body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px; text-align: center;">
      
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; 
                    border: 2px solid rgba(0, 0, 0, 0.5); box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); text-align: left;">
          
          <!-- Invoice Header -->
          <table width="100%" style="border-collapse: collapse;">
            <tr>
              <td style="width: 50%; text-align: left;">
                <h3 style="margin: 0;">Zuludesk Invoice</h3>
                <img style="width:130px; height: 55px" src="https://zuludesks.com/assets/images/icons/footer-logo.png" />
                <p><strong>${customer_name}</strong></p>
                <p>${company_name}  </p>
                <p>${customer_email}</p>
                <p>${phone}</p>
              </td>
              <td style="width: 50%; text-align: right;">
                <p><strong>Invoice Number: INV-${Math.floor(1000 + Math.random() * 9000)}</strong></p>
                <p>Invoice Date: ${new Date().toLocaleDateString()}</p>
                <p>Payment Due: ${new Date().toLocaleDateString()}</p>
                <p><strong>Amount Due: GHS ${price}</strong></p>
              </td>
            </tr>
          </table>
  
          <!-- Items Table -->
          <table width="100%" border="1" style="border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: #333; color: white;">
                <th style="padding: 10px;">Service</th>
                <th style="padding: 10px;">Quantity</th>
                <th style="padding: 10px;">Price</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td style="padding: 10px;">
                    <strong>${select_boot_option}</strong><br>
                  </td>
                  <td style="padding: 10px;">1</td>
                  <td style="padding: 10px;">${price}</td>
                </tr>
            </tbody>
          </table>
  
          <!-- Total Section -->
          <table width="100%" style="border-collapse: collapse; margin-top: 20px">
            <tr>
              <td style="width: 50%; font-weight: bold;">Sub Total:</td>
              <td style="width: 50%; text-align: right;">${price}</td>
            </tr>
            <tr>
              <td style="width: 50%; font-weight: bold;">Taxable Amount:</td>
              <td style="width: 50%; text-align: right;">0</td>
            </tr>
            <tr>
              <td style="width: 50%; font-weight: bold;">VAT:</td>
              <td style="width: 50%; text-align: right;">0</td>
            </tr>
            <tr style="border-top: 1px solid #ddd;">
              <td style="width: 50%; font-weight: bold;">Amount Due:</td>
              <td style="width: 50%; text-align: right;">GHS ${price}</td>
            </tr>
          </table>
  
          <!-- Payment Info -->
          <table width="100%" style="border-collapse: collapse;">
            <tr>
              <td style="width: 65%; vertical-align: top; font-size: 10px; line-height: 0.9">
                <p style="margin-top: 20px; color: rgb(250, 71, 0);">NOTES AND TERMS</p>
                <p>TeamAlfy Web Services</p>
                <p>FWST/J#WAN: N202530012</p>
                <p>Account Number: 12-1234-123456-12</p>
                <p><strong>Please use INV-${Math.floor(1000 + Math.random() * 9000)} as a reference number.</strong></p>
                <p>For any questions, contact <strong>Admin@teamalfy.com</strong></p>
              </td>
              <td style="text-align: right; padding-top:25px;">
                <p>Pay online <br>
                  <a style="color: rgb(238, 67, 0)" href="${paymentUrl}" target="_blank" style="
                  display: inline-block;
                  background: rgb(238, 67, 0);
                  color: white;
                  padding: 12px 20px;
                  text-decoration: none;
                  font-weight: bold;
                  border-radius: 5px;
                  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);" target="_blank">Pay Now</a>
                </p>
                <img style="width:70px" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(paymentUrl)}" 
                     alt="QR Code" />
              </td>
            </tr>
          </table>
  
      
  
        </div>
            <!-- Payment Button -->
          <div style="text-align: center; margin-top: 20px;">
            <a href="${paymentUrl}" target="_blank" style="
              display: inline-block;
              background: rgb(238, 67, 0);
              color: white;
              padding: 12px 20px;
              text-decoration: none;
              font-weight: bold;
              border-radius: 5px;
              box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            ">
              Click to Pay Now
            </a>
          </div>
      </body>
    </html>`;

    // Step 3: Send Email
    const mailOptions = {
      from: "adwoa@tuaneka.ai",
      to: customer_email, // Dynamic recipient
      subject: "Your Invoice from Zuludesk",
      html: htmlContent,
    };

    const info = await transporter1.sendMail(mailOptions);
    console.log("✅ Email sent successfully! Message ID:", info.messageId);

    res.status(200).json({ message: "Email sent successfully!", messageId: info.messageId });
  } catch (error) {
    console.error("❌ Error:", error.message || error);
    res.status(500).json({ error: "An error occurred while sending email." });
  }
};






// Function to send payment link via email
const sendPaymentLink = async (req, res) => {
  try {
    const { email, amount, name } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ error: "Email and amount are required" });
    }

   // Step 1: Initialize Paystack Payment
const paystackResponse = await axios.post(
  "https://api.paystack.co/transaction/initialize",
  {
    email,
    amount: Number(amount) * 100, // Convert to pesewas
    metadata: {
      customer_name: name, // Store name in metadata
    },
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST2}`,
      "Content-Type": "application/json",
    },
  }
);


    const paymentUrl = paystackResponse.data.data.authorization_url;

    // Step 2: Send Email with Payment Link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Payment Request",
      html: `
        <p>Dear ${name || "Customer"},</p>
        <p>You have a pending payment of <strong>GHS ${amount}</strong>.</p>
        <p>Click the button below to complete your payment:</p>
        <a href="${paymentUrl}" target="_blank" style="padding:10px 15px; background:green; color:white; text-decoration:none;">Pay Now</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Payment link sent successfully", paymentUrl });
  } catch (error) {
    console.error("Error sending payment link:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Webhook to verify payment and send data to TeamAlfy's webhook
const verifyPaymentWebhook = async (req, res) => {
  try {
    console.log("Webhook received:", req.body); // Debugging log

    const paystackSignature = req.headers["x-paystack-signature"];
    if (!paystackSignature) {
      console.error("❌ Missing Paystack Signature!");
      return res.status(400).json({ error: "Missing signature" });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY_TEST2; // Ensure it's the correct key
    const requestBody = JSON.stringify(req.body); // Raw string of the body

    // Compute the HMAC SHA512 hash
    // const hash = crypto.createHmac("sha512", secretKey).update(requestBody).digest("hex");

    // console.log("🔹 Computed Hash:", hash);
    console.log("🔹 Paystack Signature:", paystackSignature);

    // Ensure comparison is case insensitive
    // if (hash.toLowerCase() !== paystackSignature.toLowerCase()) {
    //   console.error("❌ Invalid webhook signature!");
    //   return res.status(401).json({ error: "Unauthorized webhook request" });
    // }

    // Webhook signature is valid
    // console.log("✅ Webhook signature verified!");

    const { event, data } = req.body;

    if (event === "charge.success" && data.status === "success") {
      console.log("✅ Payment verified successfully!", data);

      // Retrieve metadata
      const customerName = data.metadata?.customer_name || "Unknown";
      const companyName = data.metadata?.company_name || "Unknown";
      const selectBootOption = data.metadata?.select_boot_option || "Unknown";
      const phone = data.metadata?.phone || "Unknown";
      const purpose = data.metadata?.purpose || "Unknown";

      // Send payment details to TeamAlfy webhook
      try {
        await axios.get("https://teamalfy.app.n8n.cloud/webhook/2cdbe495-70fc-4a46-a180-588242d1ac3c", {
          params: {
            customer_email: data.customer.email,
            amount_paid: data.amount / 100,
            currency: data.currency,
            transaction_id: data.id,
            payment_status: data.status,
            payment_date: data.transaction_date,
            customer_name: customerName,
            company_name: companyName,
            select_boot_option: selectBootOption,
            phone: phone,
            purpose: purpose
          },
        });
        console.log("✅ Webhook sent to TeamAlfy successfully!");
      } catch (webhookError) {
        console.error("❌ Failed to send webhook to TeamAlfy:", webhookError.response?.data || webhookError.message);
      }

      return res.status(200).json({ message: "Payment verified and webhook sent" });
    } else {
      console.error("❌ Payment verification failed:", data);
      return res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (error) {
    console.error("❌ Error verifying payment:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




module.exports = { generateInvoice, invoicepayment, openLink, sendMail, sendPaymentLink, verifyPaymentWebhook }
