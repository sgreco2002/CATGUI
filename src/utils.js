/**
 * http://usejsdoc.org/
 */
var msgtype = {
         normal: 0,
         confirm: 1
}

var utils = {
	SendReq:function(l_url, l_reqtype, l_contentType, l_body, l_timeout ){
		
		var resp = null;
		
		$.ajax({
			url: l_url,
			type: l_reqtype,
			contentType: l_contentType,
			async: false,
			headers: {'Access-Control-Allow-Headers': 'body'},
			headers: {'body': l_body},
			timeout: l_timeout
		})			
		.done(function(data){
			resp = data;
		})
		.fail(function(xhr, status, error){
			resp = l_url + " " + status;
		});
		
		return resp;
	},
	
	ManageHttpResponse: function(resp) {
	
		var msgrtrn = null;
		var goahead = false;
	
		if (resp == "[]") {resp = "noserv";}
		
		switch(true){
			
		case /noserv/g.test(resp):
			//server already exists check
			msgrtrn = "No server found";
			goahead = true;
			break;
			
			//inser success
		case /OK: 1/g.test(resp):
			msgrtrn = "DB Action success";
			goahead = true;
			break;
		
		case /SRV_ID/g.test(resp):
			//server already exists check
			msgrtrn = "Server already exists!";
			goahead = false;
			break;
			
		case /no more pool/i.test(resp):
			//server already exists check
			msgrtrn = "Unable to reach database \n" + resp ;
			goahead = false;
			break;
			
			//error on sending request
		default:
			msgrtrn = "Error While sending request to node - \n" + resp;
			goahead = false;
			break;
		
		}
		
		alert(msgrtrn);
		return goahead;
	},
	AlertManager:function(message, type) {
		type = type || msgtype.normal;
		
		switch (type){
		
		case 0:
			alert(message);
			break;
		
		case 1:
			if (confirm(message)){
				return 1;
			} 
			else {
				return 0;
			}
			
			break;
		}
	}
};

var ManageSessionData = {
		setDataInSession: function (data) {
		var userObjectstring = JSON.stringify(data);
		window.sessionStorage.setItem('userdata', userObjectstring);
		},
		
		getDataFromSession: function() {
		var userData = window.sessionStorage.getItem('userdata');
		return JSON.parse(userData);
		}
};
