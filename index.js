const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const fs = require("fs");
const pdfparser = require("pdf-parse");

// middleware
app.use(cors());

app.get("/data", (req, res) => {
  const pdfFile = fs.readFileSync("Invoice.pdf");
  pdfparser(pdfFile, {
    max: 1,
  })
    .then((data) => {
      const a = data.text.split("\n");
      const obj = { ...a };
      const productName = obj[2];
      const productAddress = obj[3] + "," + obj[4] + "," + obj[5];
      const companyNumber = obj[6];
      const vatNumber = obj[7];
      const from = { productName, productAddress, companyNumber, vatNumber };

      const customerName = obj[10];
      const customerAddress = obj[11] + "," + obj[12] + "," + obj[13];
      const email = obj[14].split(":")[1];
      const to = { customerName, customerAddress, email };

      const invoiceDate = obj[15].split(":")[1];
      const printDate = obj[16].split(":")[1];
      const paymentDate = obj[17].split(":")[1];
      const dateInfo = { invoiceDate, printDate, paymentDate };

      const taxInvoiceNumber = obj[20].split(":")[1].slice(0, 16);

      const productDesc = obj[27];
      const timePeriod = obj[28];
      const amount = obj[30];
      const productDetails = {
        taxInvoiceNumber,
        productDesc,
        timePeriod,
        amount,
      };

      const exchangeRate = obj[40].split(":")[1];
      const customerNumber = obj[41].split(":")[1];
      const OrderId = obj[42].split(":")[1];
      const PayReference = obj[43].split(":")[1];
      const paymentDetails = {
        exchangeRate,
        customerNumber,
        OrderId,
        PayReference,
      };

      const result = { from, to, dateInfo, productDetails, paymentDetails };

      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/", (req, res) => {
  res.send("I'm good.");
});
app.listen(port, () => {
  console.log("I'm running from", port);
});
