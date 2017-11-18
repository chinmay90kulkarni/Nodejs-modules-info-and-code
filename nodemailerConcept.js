var nodemailer = require("nodemailer");


let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {      
        user: "", 
        pass: "" 
    }
});


let options = {
    from:"",
    to : "",
    subject: "Tst mail",
    text : "Hello How are you?"
};

transporter.sendMail(option0s,(error,info)=>{
    if(error){
        console.log("Error arises!" + error);
    }else
        console.log("Msg sent!" + info);

});
