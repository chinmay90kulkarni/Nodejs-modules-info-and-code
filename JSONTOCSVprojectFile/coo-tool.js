var fs = require("fs");
var jsonToCSV = require('json-to-csv');
var request = require("request");
var syncrequest = require("sync-request");

// Pedgree version check
const pedgree_url = "https://wicked-pedigree-service.w3ibm.mybluemix.net/api/packages/check?";

// License check
// POST body - { "licensetext": "Apache License Version", "name": "ayachit2" }
// Response - {"result":"success","auditid":138733}
const license_requestor = "ayachit2";
const license_url = "https://lct.w3ibm.mybluemix.net/submitlicensequick";

if(process.argv[2] === undefined){
	console.log("Project Path missing!"); 
	process.exit();
}

arrayEachen = [];
const fileName = process.argv[2] + "/jsontocsv.csv";
set = new Set();
var counter = 0;
var fileName="";
//check if package.json have dependancies and Dev-dependancies field or NOT
var fileContent = fs.readFileSync(process.argv[2] + "/package.json");
var obj = JSON.parse(fileContent);

if(obj.dependencies != null) 
	depen = Object.keys(obj.dependencies);
else 
	depen = "";

if(obj.devDependencies != null) 
	devdepen = Object.keys(obj.devDependencies);
else 
	devdepen = "";

// Store dependencies values to set to achieve uniqueness.
for (let item of depen) 
	set.add(item);  

for (let item of devdepen) 
	set.add(item);

set.forEach(function(element) {
	var eachen = "";
	var readLicenseFile = "";
	// Check every element have package.json or not
	try {
		var elementsPackageJsonfile = fs.readFileSync(process.argv[2] + "/node_modules/" + element + "/package.json");
		JSONdata = JSON.parse(elementsPackageJsonfile);
		repository = JSONdata.repository.url;
		repositoryURL = "https://" + repository.split("//")[1];
		
		eachen = {
			"Name": JSONdata.name,
			"Version": JSONdata.version,
			"license": JSONdata.license,
			"LTLF": repositoryURL
		};
	} catch(err){
		console.log("Error: ", err);
	}

	if(fs.existsSync(process.argv[2] + "/node_modules/" + element + "/license")){
		fileName = "/license";
	}else if(fs.existsSync(process.argv[2] + "/node_modules/" + element + "/license.md")){
		fileName = "/license.md";
	}else if(fs.existsSync(process.argv[2] + "/node_modules/" + element + "/license.txt")){
		fileName = "/license.txt";
	}else {
		filename = "/nothing";
	}


    
    // Check every element have LICENSE file or not
    try {
        readLicenseFile = fs.readFileSync(process.argv[2] + "/node_modules/" + element + fileName);
		eachen.LTLF = eachen.LTLF.replace(".git", "/blob/master/LICENSE");
    } catch(err) {
		if(err.code == "ENOENT"){ 
			eachen.LTLF = "-";
		}
    }  
	
	let new_ped_url = pedgree_url + "name=" + eachen.Name + "&version=" + eachen.Version;
    request(new_ped_url, function(err, response, body) {
		temp = JSON.parse(body);
		updateChange(temp);
    });

	function updateChange(data) {
		var need_review = data.needReview == false ? 'No' : 'Yes';
		
		let licenseResponse;
		console.log('license text for: ', element, ':', readLicenseFile.toString());
		
		if(readLicenseFile.toString() != null) {
			//synch request 
			licenseResponse = syncrequest("POST", license_url, {
				json: { 
					"licensetext": readLicenseFile.toString(), 
					"name": license_requestor
				}
			});
		}
		
		let auditid;
        if(licenseResponse) {
			licenseResponse = JSON.parse(licenseResponse.getBody('utf8'));
			auditid = licenseResponse.auditid;
		}
			
		eachen = {
			"Name": eachen.Name,
			"Version": eachen.Version,
			"license": data.displayLicense,
			"LTLF": eachen.LTLF,
			"Need Review": need_review,
			"Need Review Reason": data.needReviewReason,
			"Previous Reviewed Version": data.previousReviewedVersion,
			"auditid": auditid
		};
		
		arrayEachen.push(eachen);
		WriteToCSVFile(arrayEachen);
    }
});

// Writing data to csv file!
function WriteToCSVFile(pro) {
	jsonToCSV(pro, fileName).then(() => {   
	}) .catch(error => {
     // handle error
   })
}
