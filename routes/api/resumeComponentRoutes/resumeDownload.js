const express = require('express');
const router = express.Router();
var html_to_pdf = require('html-pdf-node');
const pdfTemplate = require('../../../documents/index');
let options = { format: 'A4',path:`${__dirname}/Resume.pdf`};

router.post('/create-pdf', (req, res) => {
    //let file = [{ content: pdfTemplate(req.body) }];
    let file = { content: pdfTemplate(req.body),name:'Resume.pdf' };
    html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
        console.log("PDF Buffer:-", pdfBuffer);
        //res.send(pdfBuffer);
        res.send(Promise.resolve());
        console.log('Success');
      });
});


// Get - Send generated pdf to the client
router.get('/fetch-pdf', (req,res) => {
    res.sendFile(`${__dirname}/Resume.pdf`);
});


module.exports = router;