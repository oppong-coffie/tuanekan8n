const express = require("express");
const { generateInvoice, invoicepayment, openLink, sendMail, sendPaymentLink, verifyPaymentWebhook, sendkfcinvoice } = require("../controllers/controller");

const router = express.Router();

router.post("/generate", generateInvoice);
router.post("/invoicepayment", invoicepayment);
router.post("/mail", sendMail);
router.get("/openlink", openLink);
router.post("/send-payment-link", sendPaymentLink);
router.post("/verify-payment-webhook", verifyPaymentWebhook);
router.post("/sendkfcinvoice", sendkfcinvoice);

module.exports = router;
