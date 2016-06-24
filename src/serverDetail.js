/**
 * http://usejsdoc.org/
 */


//START manage document after load -----------------------------------------------------------------------------
$(document).ready(function(){
	
	alertvalue = "";
	
	$(".c_edit").prop("disabled",true);
	$(".c_noedit").prop("disabled",true);
	$("#b_update").prop("disabled",true);

	//getting data from current session
	var srvArr = ManageSessionData.getDataFromSession('userdata');
	var frm_arr = $(":text,:password");
	
	//fill the form
	$("#i_srvid").val(srvArr[0].SRV_ID);
	$("#i_srvhostname").val(srvArr[0].SRV_HOSTNAME);
	$("#i_srvipaddress").val(srvArr[0].SRV_IPADDR);
	$("#i_srvusername").val(srvArr[0].SRV_USERNAME);
	$("#i_srvpassword").val(srvArr[0].SRV_PASSWORD);
	$("#i_srvnodeport").val(srvArr[0].SRV_NPORT);
	$("#i_srvrtp").val(srvArr[0].SRV_RTP);

	//edit button can lock \ unlcok fields
	$("#b_edit").bind("click", function(){
		if ($(".c_edit").prop("disabled") == true) {
			$(".c_edit").prop("disabled", false);
		}
		else {
			$(".c_edit").prop("disabled", true);
			$("#b_update").prop("disabled", true);
		}
	
	});
	
	$("#b_update").bind("click", function(){
		
		var canSave=true;
		
		//START check data -----------------------------------------------------------------------------
		for (var i = 0 ; i < frm_arr.length ; i++) {
			l_fval = frm_arr[i].value;
			
			l_fval = l_fval.trim(l_fval);
			
			if (l_fval == "") {
				alertvalue += "value for " + frm_arr[i].id + " cannot be null!\n";
				canSave=false;
			}
			
			if (frm_arr[i].id == "i_srvipaddress"){
				if (l_fval.indexOf(".") < 1 ){
					alertvalue +="field '" +frm_arr[i].id + "' doesn't seem to be an ip address\n";
					canSave=false;
				};
			}
			
			if (frm_arr[i].id == "i_srvrtp"){
				if (l_fval.indexOf("/") < 1 ){
					alertvalue += "field '" +frm_arr[i].id + "' doesn't seem to have correct path separator\n";
					canSave=false;
				};
			}
			
			if (frm_arr[i].id == "i_srvhostname") { input_hostname = l_fval; }
			if (frm_arr[i].id== "i_srvipaddress") { input_ip = l_fval; }
			if (frm_arr[i].id == "i_srvusername") { input_username = l_fval; }
			if (frm_arr[i].id == "i_srvpassword") { input_passwd = l_fval; }
			if (frm_arr[i].id == "i_srvrtp") { input_rtp = l_fval; }
			if (frm_arr[i].id == "i_srvnodeport") { input_nport = l_fval; }
		}
		//END check data -----------------------------------------------------------------------------
		
		if (alertvalue) {
			utils.AlertManager(alertvalue);
			alertvalue="";
		};	
		
		if (canSave == true) {
			
			//START send update request -------------------------------------------------------------
			sqlstring = "UPDATE CAT_SERVERS SET " +
			" SRV_HOSTNAME = '" + input_hostname + "'," +
			" SRV_IPADDR = '" + input_ip + "'," +
			" SRV_USERNAME = '" + input_username + "'," +
			" SRV_PASSWORD = '" + input_passwd + "'," +
			" SRV_RTP = '" + input_rtp + "'," +
			" SRV_ENV_ID = \'001\'," + 
			" SRV_NPORT = '" + input_nport + "' " +
			" WHERE SRV_ID = " + srvArr[0].SRV_ID + " "
			;
			
			console.log(sqlstring);
				
			var resp = utils.ManageHttpResponse( utils.SendReq ('http://10.135.235.16:9999/dbaction',
					'POST', 
					'text/html', 
					sqlstring, 
					3000
			));
			
			if (resp = 'DB Action success') {
				window.open("ServersMain.html" , "_self");
			}
			
			//END update request --------------------------------------------------------------------
		}
		
		
	});
	
	//if any value change on field, save button become available
	$(".c_edit").on("change", function() {
		$("#b_update").prop("disabled",false);
	});

});
//--------------------------------------------------------------------------------------------------------------
