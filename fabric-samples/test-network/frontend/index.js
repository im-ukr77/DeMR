// Combined index.js

$(document).ready(function () {
  // Patient
  $("#grantViewB").click(grantViewAccess);
  $("#revokeViewB").click(revokeViewAccess);
  $("#grantAddB").click(grantAddAccess);
  $("#revokeAddB").click(revokeAddAccess);
  $("#viewEMRFPatient").submit(getEMR);

  $("#viewEMRList").submit(viewAllEMR);
  $("#viewAddAccessList1").submit(viewAddAccessList);
  $("#viewUserForEMR").submit(viewAllUserForEMR);

  // Admin
  $("#addUserF").submit(addUser);

  // Doctor
  $("#addEMRFDoctor").submit(addEMRDoctor);
  $("#viewEMRF").submit(getEMRDoctor);

  // Lab
  $("#addEMRF").submit(addEMRLab);
});

// Patient functions
const grantViewAccess = function (event) {
  event.preventDefault();

  const formData = $("#viewAccessF").serializeArray();
  const userEmail = formData[0].value;
  const viewerEmail = formData[1].value;
  const emrID = formData[2].value;

  $.ajax({
    url: "http://localhost:3000/patient/grantViewAccess", 
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      viewerEmail: viewerEmail,
      emrID: emrID,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
      } else {
        // $('#emrdata').val(resData);
        // $('#emrdata').display("inline");
        // $('#emrdata').css('display', 'inline');
        swal("Success", resData, "success");
        $("#viewAccessF").trigger("reset");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
  // $.ajax({
  //     url: 'http://localhost:3000/unsold',
  //     method: 'GET',
  //     accepts: "application/json",
  //     success: function(data) {
  //         populateUnsoldProducts(data);
  //     },
  //     error: function(error) {
  //         alert(JSON.stringify(error));
  //     }
  // });
};

const revokeViewAccess = function (event) {
  event.preventDefault();

  const formData = $("#viewAccessF").serializeArray();
  const userEmail = formData[0].value;
  const viewerEmail = formData[1].value;
  const emrID = formData[2].value;
  console.log(formData);
  $.ajax({
    url: "http://localhost:3000/patient/revokeViewAccess",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      viewerEmail: viewerEmail,
      emrID: emrID,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
      } else {
        // $('#emrdata').val(resData);
        // $('#emrdata').display("inline");
        // $('#emrdata').css('display', 'inline');
        swal("Success", resData, "success");
        $("#viewAccessF").trigger("reset");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

const grantAddAccess = function (event) {
  event.preventDefault();

  const formData = $("#addAccessF").serializeArray();
  const userEmail = formData[0].value;
  const adderEmail = formData[1].value;

  $.ajax({
    url: "http://localhost:3000/patient/grantAddAccess", 
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      adderEmail: adderEmail,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
      } else {
        // $('#emrdata').val(resData);
        // $('#emrdata').display("inline");
        // $('#emrdata').css('display', 'inline');
        swal("Success", resData, "success");
        $("#addAccessF").trigger("reset");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

const revokeAddAccess = function (event) {
  event.preventDefault();

  const formData = $("#addAccessF").serializeArray();
  const userEmail = formData[0].value;
  const adderEmail = formData[1].value;
  console.log(formData);
  $.ajax({
    url: "http://localhost:3000/patient/revokeAddAccess",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      adderEmail: adderEmail,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
      } else {
        // $('#emrdata').val(resData);
        // $('#emrdata').display("inline");
        // $('#emrdata').css('display', 'inline');
        swal("Success", resData, "success");
        $("#addAccessF").trigger("reset");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

const getEMR = function (event) {
  event.preventDefault();

  const formData = $("#viewEMRFPatient").serializeArray();
  const userEmail = formData[0].value;
  const emrID = formData[1].value;

  $.ajax({
    url: "http://localhost:3000/patient/getEMR",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      emrID: emrID,
    }),
    contentType: "application/json",
    success: function (resData) {
      // Ensure the response is parsed correctly
      let parsedData;
      try {
        parsedData = typeof resData === "string" ? JSON.parse(resData) : resData;
      } catch (error) {
        swal("Error", "Failed to parse response from server", "error");
        console.error("Parsing error:", error);
        return;
      }

      const emrContent = parsedData.content;
      if (emrContent) {
        $("#emrdata").val(emrContent);
        $("#emrdata").css("display", "inline"); 
      } else {
        swal("Error", "EMR content not found in response", "error");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.error("AJAX error:", error);
    },
  });
};

const viewAllEMR = function (event) {
  event.preventDefault();
  console.log(" viewAllEMR sending ...");
  const formData = $("#viewEMRList").serializeArray();
  console.log(formData);
  const userEmail = formData[0].value;

  $.ajax({
    url: "http://localhost:3000/patient/viewAllEMR",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
    }),
    contentType: "application/json",
    success: function (resData) {
      resData = JSON.parse(resData);
      if (resData.toString().indexOf("Error:") != -1) {
        swal("Oops", resData, "error");
      } else {
        createTable(resData, "viewALlEMR");
      }

      // appendProduct(JSON.parse(data));
    },
    error: function (error) {
      //alert(error);
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

const viewAddAccessList = function (event) {
  event.preventDefault();
  console.log(" viewAddAccessList sending ...");
  const formData = $("#viewAddAccessList1").serializeArray();
  console.log(formData);
  const userEmail = formData[0].value;

  $.ajax({
    url: "http://localhost:3000/patient/viewAllUsersWithAddAccess",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
    }),
    contentType: "application/json",
    success: function (resData) {
      // alert(resData);
      resData = JSON.parse(resData);
      console.log(" viewAddAccessList result ::" + resData);
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
        $("#emrdataviewAddAccessListDiv").css("display", "none");
      } else {
        $("#emrdataviewAddAccessListDiv").val(resData);
        // $('#emrdata').display("inline");
        $("#emrdataviewAddAccessListDiv").css("display", "inline");
        createTable(resData, "viewAddAccessList");
      }

      // appendProduct(JSON.parse(data));
    },
    error: function (error) {
      //alert(error);
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

const viewAllUserForEMR = function (event) {
  event.preventDefault();
  console.log(" viewAllUserForEMR sending ...");
  const formData = $("#viewUserForEMR").serializeArray();
  console.log(formData);
  const userEmail = formData[0].value;
  const emrID = formData[1].value;

  $.ajax({
    url: "http://localhost:3000/patient/getGrantedUserForEMR",
    method: "POST",
    data: JSON.stringify({
      emrID: emrID,
      userEmail: userEmail,
    }),
    contentType: "application/json",
    success: function (resData) {
      // alert(resData);
      resData = JSON.parse(resData);
      console.log(" viewAllUserForEMR result ::" + resData);
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
        $("#emrdataviewUserForEMRDiv").css("display", "none");
      } else {
        $("#emrdataviewUserForEMRDiv").val(resData);
        // $('#emrdata').display("inline");
        $("#emrdataviewUserForEMRDiv").css("display", "inline");
        createTable(resData, "viewAllUserForEMR");
      }

      // appendProduct(JSON.parse(data));
    },
    error: function (error) {
      //alert(error);
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

function createTable(data, type) {
  let tableBody;

  if (type === "viewALlEMR") {
    tableBody = document.querySelector("#viewAllEMRList tbody");
  } else if (type === "viewAddAccessList") {
    tableBody = document.querySelector("#viewAddAccessList tbody");
  } else if (type === "viewAllUserForEMR") {
    tableBody = document.querySelector("#viewAllUserForEMR tbody");
  }

  tableBody.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const tableRow = document.createElement("tr");

    for (let j = 0; j < data[i].length; j++) {
      if (type === "viewALlEMR" && j === 1) continue;

      const tableCell = document.createElement("td");
      tableCell.textContent = data[i][j];
      tableRow.appendChild(tableCell);
    }

    tableBody.appendChild(tableRow);
  }
}

// Admin functions
const addUser = function (event) {
  event.preventDefault();

  const formData = $("#addUserF").serializeArray();
  const name = formData[0].value;
  const email = formData[1].value;
  const type = formData[2].value;

  $.ajax({
    url: "http://localhost:3001/admin/addEntityUser", 
    method: "POST",
    data: JSON.stringify({
      name: name,
      email: email,
      type: type,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
      } else {
        // $('#emrdata').val(resData);
        // $('#emrdata').display("inline");
        // $('#emrdata').css('display', 'inline');
        swal("Success", resData, "success");
        $("#addUserF").trigger("reset");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

// Doctor functions
const addEMRDoctor = function (event) {
  event.preventDefault();

  const formData = $("#addEMRFDoctor").serializeArray();
  const userEmail = formData[0].value;
  const adderEmail = formData[1].value;
  const emrID = formData[2].value;
  const content = formData[3].value;

  $.ajax({
    url: "http://localhost:3002/doctor/addEMR", 
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      adderEmail: adderEmail,
      emrID: emrID,
      type: "medical", 
      content: content,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
      } else {
        // $('#emrdata').val(resData);
        // $('#emrdata').display("inline");
        // $('#emrdata').css('display', 'inline');
        swal("Success", resData, "success");
        $("#addEMRF").trigger("reset");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

// async getEMR(ctx, emrID, email)
const getEMRDoctor = function (event) {
  event.preventDefault();

  const formData = $("#viewEMRF").serializeArray();
  const emrID = formData[0].value;
  const doctorEmail = formData[1].value;

  $.ajax({
    url: "http://localhost:3002/doctor/getEMR", 
    method: "POST",
    data: JSON.stringify({
      emrID: emrID,
      userEmail: doctorEmail,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
        $("#emrdataDoctor").css("display", "none");
      } else {
        $("#emrdataDoctor").val(resData);
        // $('#emrdata').display("inline");
        $("#emrdataDoctor").css("display", "inline");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

// Lab functions
const addEMRLab = function (event) {
  event.preventDefault();

  const formData = $("#addEMRF").serializeArray();
  const userEmail = formData[0].value;
  const adderEmail = formData[1].value;
  const emrID = formData[2].value;
  const type = "test";
  const content = formData[3].value;

  $.ajax({
    url: "http://localhost:3003/lab/addEMR",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      adderEmail: adderEmail,
      emrID: emrID,
      type: type,
      content: content,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
        $("#addEMRF").trigger("reset");
      } else {
        // $('#emrdata').val(resData);
        // $('#emrdata').display("inline");
        // $('#emrdata').css('display', 'inline');
        swal("Success", resData, "success");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};