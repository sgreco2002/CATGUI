/**
 * http://usejsdoc.org/
 * 
 */

var canSave = null;
var input_hostname = null;
var input_ip = null;
var input_username = null;
var input_passwd = null;
var input_rtp = null;
var input_nport = null;
var alertvalue = null;
var sqlstring = null;
var response = null;
var l_fval = new String;
var frm_arr = $(":password,:text");

// START manage document after load -----------------------------------------------------------------------------
$(document).ready(function(){
	
	//START manage button click -----------------------------------------------------------------------------
	$("#b_save").bind("click", function (){
		canSave=true;
		alertvalue="";
		
		var frm_arr = $(":password,:text");
		
		//START check on data integrity  -------------------------------------------------------------
		for (var i = 0 ; i < frm_arr.length ; i++) {
			l_fval = frm_arr[i].value;
			
			if (l_fval == "") {
				alertvalue += "value for " + frm_arr[i].name + " cannot be null!\n";
				canSave=false;
			}
			
			if (frm_arr[i].name == "i_srvipaddress"){
				if (l_fval.indexOf(".") < 1 ){
					alertvalue +="field '" +frm_arr[i].name + "' doesn't seem to be an ip address\n";
					canSave=false;
				};
			}
			
			if (frm_arr[i].name == "i_srvrtp"){
				if (l_fval.indexOf("/") > -1 || l_fval.indexOf("\\") > -1){
					alertvalue += "field '" +frm_arr[i].name + "' doesn't seem to have correct path separator\n";
					canSave=false;
				};
			}
			
			if (frm_arr[i].name == "i_srvhostname") { input_hostname = l_fval; }
			if (frm_arr[i].name== "i_srvipaddress") { input_ip = l_fval; }
			if (frm_arr[i].name == "i_srvusername") { input_username = l_fval; }
			if (frm_arr[i].name == "i_srvpassword") { input_passwd = l_fval; }
			if (frm_arr[i].name == "i_srvrtp") { input_rtp = l_fval; }
			if (frm_arr[i].name == "i_srvnodeport") { input_nport = l_fval; }
		}
		//END check on data integrity  -------------------------------------------------------------
		
		if (alertvalue) {
			utils.AlertManager(alertvalue);
			alertvalue="";
		};	
		
		if (canSave == true) {
			
			// check on DB if server already exists using http req metod to main node.
			sqlstring = "select * from CAT_SERVERS where SRV_HOSTNAME = '" + input_hostname + "' or SRV_IPADDR = '" + input_ip + "'";
						
			response = utils.ManageHttpResponse(utils.SendReq ('http://10.135.235.16:9999/inquiry', 
					'GET', 
					'text/html', 
					sqlstring, 
					3000 
			));
			
			//to change
			if ( response == true )
			{	
				
				//START send insert request -------------------------------------------------------------
				sqlstring = "insert into CAT_SERVERS values ( " +
				"DEFAULT," +
				"'" + input_hostname + "'," +
				"'" + input_ip + "'," +
				"'" + input_username + "'," +
				"'" + input_passwd + "'," +
				"'" + input_rtp + "'," +
				"\'001\'," + 
				"'" + input_nport + "'" + 
				")"
				;
				
				console.log(sqlstring);
					
				response = utils.ManageHttpResponse( utils.SendReq ('http://10.135.235.16:9999/dbaction',
						'POST', 
						'text/html', 
						sqlstring, 
						3000
				));			
				
				if (response = 'DB Action success') {
					for (var i = 0 ; i < frm_arr.length ; i++) {
						frm_arr[i].value = "";
					}
				}
				//END send inquiry request -------------------------------------------------------------
			}
		}
	});
	//END manage button click -----------------------------------------------------------------------------
});
//END manage document after load -----------------------------------------------------------------------------