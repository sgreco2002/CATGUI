/**
 * http://usejsdoc.org/
 */
var sqlstring;
var serverlist = [];
/* DEBUG START
//load servers from database
sqlstring = "select * from CAT.CAT_SERVERS";
var srvDetail = utils.SendReq('http://10.135.235.16:9999/inquiry','GET','text/html',sqlstring,1000);

//load repositories from database
sqlstring = "select * from CAT.CAT_REPOS";
var repoDetail = utils.SendReq('http://10.135.235.16:9999/inquiry','GET','text/html',sqlstring,1000);

if (/error|Error/g.test(srvDetail) || /error|Error/g.test(repoDetail)) { 
	utils.AlertManager("Error sending request to Node. Page cannot be open.");
}

if (repoDetail == "[]") {
	if (utils.AlertManager("Seems that there is no repository configured. \n If you click 'OK' you have to set configuration manually,\nif you click 'cancel' you will redirect to repository creation page.\nDo you want to proceed?", msgtype.confirm ) == 0){
		window.open("CreateServer.html", "_self");
	}
}
else {
	repoDetail=$.parseJSON(repoDetail);
}

if (srvDetail == "[]") {
	utils.AlertManager("Seems that there is no server configured. you will redirect to server creation..");
	window.open("CreateServer.html", "_self");

}

srvDetail=$.parseJSON(srvDetail);

DEBUG END */

//START manage deployment after load -----------------------------------------------------------------------------
$(document).ready(function(){

	$(".c_hidd").hide();
	$("#i_dpl").prop("disabled", true);
	$("#i_bget").prop("disabled", true);
	$("#i_lblurl").text($("#i_rep :selected").val() + "/");
	$("#f_deploy").attr("action", "http://10.135.235.16:9999/upload");
	/* DEBUG START
	 * 
	for (var i=0; i < srvDetail.length; i++) {
		
		$("#i_srv")
		.append($("<option></option>")
				.attr("value", srvDetail[i].SRV_IPADDR)
				.text(srvDetail[i].SRV_HOSTNAME + " - " + srvDetail[i].SRV_IPADDR)
		);
	}
	
	if ( repoDetail.length > 0 ){
		for (var i=0; i < repoDetail.length; i++) {
			
			$("#i_rep")
			.append($("<option></option>")
					.attr("value", repoDetail[i].REP_URL)
					.text(repoDetail[i].REP_REPONAME)
			);
		}
		
		$("#i_rep")
		.append($("<option></option>")
				.attr("value", "http://fakeval")
				.text("faketest")
		);
	}
	
	DEBUG END */
	
	//BEGIN FAKE DATA
	$("#i_rep")
	.append($("<option></option>")
			.attr("value", "http://ciaone")
			.text("svn")
	);
	
	$("#i_srv")
	.append($("<option></option>")
			.attr("value", "10.10.10.10")
			.text("hostname" + " - " + "10.10.10.10")
	);

	$("#i_srv")
	.append($("<option></option>")
			.attr("value", "10.10.10.11")
			.text("hostname2" + " - " + "10.10.10.11")
	);
	
	//END FAKE DATA
	
	//manage event on form
	$("#i_rep").click(function(){
		$("#i_lblurl").text($("#i_rep :selected").val() + "/");
	});
	
	
	$("#i_addsrvbtn").bind("click", function(){
		var found = $.inArray($("#i_srv :selected").val(), serverlist);
		if ( found == -1 ){
			serverlist.push($("#i_srv :selected").val());
			
		}
		else {
			utils.AlertManager("Server already selected!");
		}
	});
	
	$(".c_radio").click(function(){
		if ( $("#i_radioL").is(":checked") ) {
			$("#i_upload").show();
			$("#i_divremote").hide();
			$("#i_btnsubmit").show();
		}
		else {
			$("#i_upload").hide();
			$("#i_divremote").show();
			$("#i_btnsubmit").hide();
		}
	});
	
	$("#f_deploy").submit(function() {
			
		$(this).ajaxSubmit({
			
			error: function(xhr) {
				utils.AlertManager("Error while uploading file - " + xhr.responseText);
			},
			success: function(response){
				utils.AlertManager("file uploaded successfully");
			}
		});
	
	//prevent page refresh
	return false;
	
	});
	
});