"use strict";

const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

let ccp;
let wallet;

const config = require("./config.json");

const crypto = require("crypto");

function generateUniqueID() {
  return crypto.randomBytes(2).toString("hex"); 
}

async function initialize(userType) {
  try {
    const ccpPath = path.resolve(
      __dirname,
      "../..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const walletPath = path.join(process.cwd(), "wallet");
    wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const identity = await wallet.get(userType);
    if (!identity) {
      console.log(
        `An identity for the ${userType} user does not exist in the wallet`
      );
      console.log("Run enrollAdmin.js and registerUser.js before retrying");
      return;
    }
  } catch (error) {
    console.error(`Failed transaction: ${error}`);
    process.exit(1);
  }
}

//Doctor functions
const nodemailer = require("nodemailer");

async function doctor_addEMR(userEmail, adderEmail, emrID, type, content) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "doctor",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("emr");

    const result = await contract.submitTransaction(
      "addEMR",
      userEmail,
      adderEmail,
      emrID,
      type,
      content
    );
    console.log(`Transaction successful. Result: ${result.toString()}`);

    await gateway.disconnect();

    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    const formattedDateTime = `${date} (${formattedTime})`;

    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: config.email.user, 
        pass: config.email.pass, 
      },
    });

    const uniqueID = generateUniqueID();
    const mailOptions = {
    from: "DeMR Team <demr.tcet@gmail.com>", 
    to: userEmail,
    replyTo: "demr.tcet@gmail.com", 
    subject: `New EMR Added [#${uniqueID}]`,
    html: `
        <p>Dear user,</p>
        <p>A new EMR has been added to your account on <strong>${formattedDateTime}</strong> with the following details:</p>
        <strong>EMR ID:</strong> ${emrID}<br>
        <strong>Type:</strong> ${type}
        <p>Please log in to your account to view the details.</p>
        <p>Thank you,<br><strong>The DeMR Team</strong></p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email: ${error}`);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    return result.toString();
  } catch (error) {
    console.error(`doctor_addEMR: Failed transaction: ${error}`);
    return error.toString();
  }
}

async function doctor_getEMR(emrID, doctorEmail) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "doctor",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("emr");

    const result = await contract.submitTransaction("getEMR", emrID, doctorEmail);
    console.log(`Transaction successful. Result: ${result.toString()}`);

    await gateway.disconnect();

    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    const formattedDateTime = `${date} (${formattedTime})`;

    const emrData = JSON.parse(result.toString());
    const patientEmail = emrData.recordOwner;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user, 
        pass: config.email.pass, 
      },
    });

    const uniqueID = generateUniqueID();
    const mailOptions = {
    from: "DeMR Team <demr.tcet@gmail.com>", 
    to: patientEmail, 
    subject: `Your EMR was viewed by a doctor [#${uniqueID}]`,
    html: `
        <p>Dear user,</p>
        <p>Your EMR with the following details has been accessed:</p>
        <strong>EMR ID:</strong> ${emrID}<br>
        <strong>Accessed By:</strong> Doctor with ID ${doctorEmail}<br>
        <strong>Accessed on (Date and Time):</strong><i>${formattedDateTime}</i>
        <p>If you did not authorize this access, please contact support immediately.</p>
        <p>Thank you,<br><strong>The DeMR Team</strong></p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email: ${error}`);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    return emrData.content; 
  } catch (error) {
    console.error(`doctor_getEMR: Failed transaction: ${error}`);
    return error.toString();
  }
}

// Patient functions
async function patient_addEMR(userEmail, adderEmail, emrID, type, content) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("emr");
    const result = await contract.submitTransaction(
      "addEMR",
      userEmail,
      adderEmail,
      emrID,
      type,
      content
    );
    console.log(`Transaction successful. Result is: ${result.toString()}`);

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(`patient_addEMR: Failed transaction: ${error}`);
    return error.toString();
  }
}

async function patient_getEMR(emrID, email) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("emr");

    const result = await contract.submitTransaction("getEMR", emrID, email);
    console.log(`Transaction successful. Result is: ${result.toString()}`);

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(`patient_getEMR: Failed to evaluate transaction: ${error}`);
    return error.toString();
  }
}

async function patient_grantViewAccess(userEmail, viewerEmail, emrID) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("emr");

    const result = await contract.submitTransaction(
      "grantViewAccess",
      userEmail,
      viewerEmail,
      emrID
    );

    console.log(`Transaction successful. Result is: ${result.toString()}`);

    await gateway.disconnect();

    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: config.email.user, 
        pass: config.email.pass, 
      },
    });
    const uniqueID = generateUniqueID();
    const mailOptions = {
    from: "DeMR Team <demr.tcet@gmail.com>", 
    to: viewerEmail, 
    replyTo: "demr.tcet@gmail.com",
    subject: `EMR View Access Granted [#${uniqueID}]`,
    html: `
        <p>Hello,</p>
        <p>You have been granted <strong>view access</strong> to an EMR with the following details:</p>
        <strong>EMR ID:</strong> ${emrID}
        <p>Please log in to your account to view the EMR.</p>
        <p>Thank you,<br><strong>The DeMR Team</strong></p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email: ${error}`);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    return result.toString();
  } catch (error) {
    console.error(`patient_grantViewAccess: Failed transaction: ${error}`);
    return error.toString();
  }
}

async function patient_revokeViewAccess(userEmail, viewerEmail, emrID) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("emr");

    const result = await contract.submitTransaction(
      "revokeViewAccess",
      userEmail,
      viewerEmail,
      emrID
    );
    console.log(`Transaction successful. Result: ${result.toString()}`);

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(
      `patient_revokeViewAccess: Failed to evaluate transaction: ${error}`
    );
    return error.toString();
  }
}

async function patient_grantAddAccess(userEmail, adderEmail) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("emr");

    const result = await contract.submitTransaction(
      "grantAddAccess",
      userEmail,
      adderEmail
    );

    console.log(`Transaction successful. Result is: ${result.toString()}`);

    await gateway.disconnect();

    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    const formattedDateTime = `${date} (${formattedTime})`;

    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: config.email.user,
        pass: config.email.pass, 
      },
    });
    
    const uniqueID = generateUniqueID();
    const mailOptions = {
      from: "DeMR Team <demr.tcet@gmail.com>", 
      to: adderEmail, 
      replyTo: "demr.tcet@gmail.com",
      subject: `EMR Add Access Granted [#${uniqueID}]`,
      html: `
        <p>Hello,</p>
        <p>You have been granted access on <strong>${formattedDateTime}</strong> to <strong>add EMRs</strong> for the following patient:</p>
        <strong>Patient ID:</strong> ${userEmail}
        <p>Please log in to your account to add EMRs.</p>
        <p>Thank you,<br><strong>The DeMR Team</strong></p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email: ${error}`);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    return result.toString();
  } catch (error) {
    console.error(`patient_grantAddAccess: Failed transaction: ${error}`);
    return error.toString();
  }
}

async function patient_revokeAddAccess(userEmail, viewerEmail) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("emr");
    const result = await contract.submitTransaction(
      "revokeAddAccess",
      userEmail,
      viewerEmail
    );
    console.log(`Transaction successful. Result is: ${result.toString()}`);

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(`patient_revokeAddAccess: Failed transaction: ${error}`);
    return error.toString();
  }
}

// Admin Registration
async function admin_addEntityUser(name, email, type) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin1",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("emr");

    const result = await contract.submitTransaction("addEntityUser", name, email, type);
    console.log(`Transaction successful. Result is: ${result.toString()}`);

    await gateway.disconnect();

    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    const formattedDateTime = `${date} (${formattedTime})`;

    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: config.email.user, 
        pass: config.email.pass, 
       },
    });

    const uniqueID = generateUniqueID();
    const mailOptions = {
      from: "DeMR Team <demr.tcet@gmail.com>",
      to: email,
      replyTo: "demr.tcet@gmail.com",
      subject: `Registration Successful [#${uniqueID}]`,
      html: `
        <p>Hello <strong>${name}</strong>,</p>
        <p>You have been successfully registered as a <strong>${type}</strong> on the DeMR platform.</p>
        <p><strong>Registration Details:</strong></p>
        <ul>
          <li><strong>Date and Time:</strong> <i>${formattedDateTime}</i></li>
          <li><strong>Registration ID:</strong> #${uniqueID}</li>
          <li><strong>Role:</strong> ${type}</li>
        </ul>
        <p>DeMR (Decentralized Electronic Medical Records) is a cutting-edge platform designed to:</p>
        <ul>
          <li>Ensure <strong>secure and decentralized storage</strong> of medical records.</li>
          <li>Provide <strong>role-based access control</strong> for enhanced privacy.</li>
          <li>Enable seamless sharing of medical data between authorized users.</li>
        </ul>
        <p>We are excited to have you on board! Please log in to your account to explore the platform and manage your electronic medical records.</p>
        <p>If you have any questions or need assistance, feel free to reach out to us at <strong>demr.tcet@proton.me</strong></p>
        <p>Thank you for choosing DeMR!</p>
        <p>Warm regards,<br><strong>The DeMR Team</strong><br><i>Redefining Electronic Medical Records</i></p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email: ${error}`);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    return result.toString();
  } catch (error) {
    console.error(`admin_addUser: Failed transaction: ${error}`);
    return error.toString();
  }
}

async function viewAllEMR(email) {
  try {
    // create a new gateway for connecting to our peer node.
    console.log("viewAllEMR: " + email);
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    // get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // get the contract from the network.
    const contract = network.getContract("emr");

    // evaluate the specified transaction.
    const result = await contract.submitTransaction("viewAllEMR", email);
    console.log(
      `Transaction has been evaluated. Result is: ${result.toString()}`
    );

    await gateway.disconnect();
    console.log("viewAllEMR: " + typeof result);
    return result;
  } catch (error) {
    console.error(`viewAllEMR: Failed to evaluate transaction: ${error}`);
    return error.toString();
  }
}

async function viewAllUsersWithAddAccess(email) {
  try {
    // create a new gateway for connecting to our peer node.
    const gateway = new Gateway();

    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    // get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // get the contract from the network.
    const contract = network.getContract("emr");

    // evaluate the specified transaction.
    const result = await contract.submitTransaction(
      "viewAllUsersWithAddAccess",
      email
    );
    console.log(
      `Transaction has been evaluated. Result is: ${result.toString()}`
    );

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(
      `viewAllUsersWithAddAccess: Failed to evaluate transaction: ${error}`
    );
    return error.toString();
  }
}

// Get granted
async function getGrantedUserForEMR(emrID, email) {
  try {
    // create a new gateway for connecting to our peer node.
    const gateway = new Gateway();

    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    // get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // get the contract from the network.
    const contract = network.getContract("emr");

    console.log(`send transaction emrID` + emrID + " email" + email);

    // evaluate the specified transaction.
    const result = await contract.submitTransaction(
      "getGrantedUserForEMR",
      emrID,
      email
    );

    console.log(` Result is:: ` + result);
    console.log(
      `Transaction has been evaluated. Result is: ${result.toString()}`
    );

    await gateway.disconnect();

    return result.toString(); 
  } catch (error) {
    console.error(
      `getGrantedUserForEMR: Failed to evaluate transaction: ${error}`
    );
    return error.toString();
  }
}

exports.initialize = initialize;

exports.doctor_addEMR = doctor_addEMR;
exports.doctor_getEMR = doctor_getEMR;

exports.patient_addEMR = patient_addEMR;
exports.patient_getEMR = patient_getEMR;
exports.patient_grantViewAccess = patient_grantViewAccess;
exports.patient_revokeViewAccess = patient_revokeViewAccess;
exports.patient_revokeAddAccess = patient_revokeAddAccess;
exports.patient_grantAddAccess = patient_grantAddAccess;
exports.viewAllEMR = viewAllEMR;
exports.viewAllUsersWithAddAccess = viewAllUsersWithAddAccess;
exports.getGrantedUserForEMR = getGrantedUserForEMR;
exports.admin_addEntityUser = admin_addEntityUser;