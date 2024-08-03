const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', '..')));

// Handle email sending with department information
app.post('/send_mail', (req, res) => {
    const selectedProducts = req.body.products;
    const product = Array.isArray(selectedProducts) ? selectedProducts.join(', ') : selectedProducts;

    // const selectedDepartment = req.body.result;
    // const departments = Array.isArray(selectedDepartment) ? selectedProducts.join(', ') : selectedProducts;
    
    const depts = {
        "Biochemistry": ["FG-2021 Semi Analyzer", "FGBC-22 Fully Auto", "BS-230", "BS-240E", "BS-430", "BS-600M", "HbA1c Analyst", "HA-8180V", "HA 8380V", "HA - 8180T", "Indiko Analyser", "Indiko plus Analyser", "Gpp 100 protin Analyser", "Nepholometer Analyze", "E60 Electrolyte Analyzer"],
        "Hematology": ["FG-21D", "BC-700", "BC-720", "BC-760", "BC-780", "BC-6000", "BC-6200", "ESR Roller 20 MC", "ESR Roller 20 LC"],
        "Immunology": ["CL960I", "Liaison XL Analyser"],
        "Clinical Urinalysis": ["Mission U120 Smart Analyser", "Mission U500 Urine Analyser"],
        "Point of Care": ["Blood Ammonia pa-4140", "Electrolyte se 1520", "I core 2100", "Cardiochek Plus", "AIC NOW +", "Glucometers"],
        "Microbiology": ["Phadia 200 and Phaidia 250 Analyser", "Sonsititre Nephelometer", "Sonsititre ARTS 20 System", "Sonsititre AIM Automoded Inoculation"],
        "Delivery System": ["Sensititre Opti Read", "Sensititre Vizion Digital Mic Viewing System"],
        "Speciality": ["Auto Delfia Analyser", "Deffia Analyser", "Victor 2D Analyser", "Delfia Express Analyser"]
    };
    let result = [];
    for (const department in depts) {
        for (const productt of selectedProducts) {
            if (depts[department].includes(productt)) {
                if (!result.includes(department)) {
                    result.push(department);
                }
                //break; // Found a matching product, move to the next department
            }
        }
    }
    const departments = Array.isArray(result) ? result.join(', ') : result;

    const { title, name, mobile, email, productInterest, appointmentDate, appointmentTime } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'admin@gmail.com',//mail id of the company
            pass: 'password'//app password of the company's mail id
        }
    });

    const adminMailOptions = {
        from: 'admin@gmail.com',//mail id of the company
        to: 'admin@gmail.com',//mail id of the company
        subject: 'New Appointment Request',
        html: `
        <div style="font-family:Verdana, Geneva, Tahoma, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; border: 2px solid black; border-radius: 10px;">
        <div style="text-align: center;">
            <img src="https://i.imgur.com/uQDT9hC.png" alt="Company Logo" style="width: 500px; height: auto; margin-bottom: 20px;">
        </div>
        <hr style="border: 1px solid black;">
       New appointment request received:
        <table style="border:1px solid black; border-collapse: collapse; width: 100%;">
            <tr>
                <td style="border: 1px solid black; padding: 8px;"><strong>Name</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${title} ${name}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;"><strong>Mobile</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${mobile}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;"><strong>Email</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${email}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;"><strong>Product Interest</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${productInterest}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;"><strong>Department</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${departments}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;"><strong>Product Items</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${product}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;"><strong>Appointment Date</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${appointmentDate}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;"><strong>Appointment Time</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${appointmentTime}</td>
            </tr>
        </table>
    </div>
        `
    };

    const userMailOptions = {
        from: 'admin@gmail.com',//mail id of the company
        to: email,//customer mail id which was given in the webpage by them
        subject: 'Appointment Request Confirmation',
        html: `
        <div style="font-family:Verdana, Geneva, Tahoma, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; border: 2px solid black; border-radius: 10px;">
        <div style="text-align: center;">
            <img src="https://i.imgur.com/uQDT9hC.png" alt="Company Logo" style="width: 500px; height: auto; margin-bottom: 20px;">
        </div>
        <hr style="border: 1px solid black;">
        <p>Dear ${title} <strong>${name}</strong>,</p>
        <p>Thank you for your appointment request.</p>
        <table style="border:1px solid black; border-collapse: collapse; width: 100%;">
            <tr>
                <td style="border: 1px solid black; padding: 8px;"><strong>Product Interest</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${productInterest}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;"><strong>Department</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${departments}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;"><strong>Product Items</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${product}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;"><strong>Appointment Date</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${appointmentDate}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px;"><strong>Appointment Time</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${appointmentTime}</td>
            </tr>
        </table>
        <p>We will get back to you shortly to confirm your appointment.</p>
        <br>
        <p>Best regards,</p>
        <p style="color: rgb(67, 177, 50);"><strong>Fusion Green</strong></p>
    </div>
        `
    };

    transporter.sendMail(adminMailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(`
            <script>
                alert("admin Failed");
            </script>`);
        }
        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                return res.status(500).send(`
                <script>
                    alert("user Failed");
                </script>`);
            }
            res.send(`
            <script>
                alert("Success");
                window.location.href = '/';
            </script>`);
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
