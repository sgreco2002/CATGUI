/**
 * 
 */

var sqlstring = null,
	get_hostname = null,
	get_ipaddr = null,
	get_username = null,
	get_password = null,
	get_rtp = null,
	get_envid = null,
	get_nport = null;

sqlstring = "SELECT * FROM CAT_SERVERS";

// start document Mngmt
$(document).ready(function(){
	
	//get value from Db
	var tableCont = $.parseJSON(utils.SendReq ('http://10.135.235.16:9999/inquiry',
			'GET', 
			'text/html', 
			sqlstring, 
			1000
	));
	
	for (var i = 0 ; i <= tableCont.length; i++){
		//new row
		$("#t_srvlist ").append(
			"<tr>" + 	"<td>" + tableCont[i].SRV_HOSTNAME + "</td>" +
						"<td>" + tableCont[i].SRV_IPADDR + "</td>" +
						"<td>" + tableCont[i].SRV_NPORT + "</td>" +
						"<td id=\"btncell\">" + 
						"<input id=\"info_" + tableCont[i].SRV_ID + "\" type=\"button\" value=\"detail\"></input>" +
						"<input id=\"delete_" + tableCont[i].SRV_ID + "\" type=\"button\" value=\"delete\"></input>" +
						"</td>" +
			"</tr>"
		);

		$("#info_" + tableCont[i].SRV_ID).bind("click", function(){

			var arr = [];
			var currSel = event.target.id;
			var underScore = currSel.indexOf("_") +1;
			var finalSrvId = currSel.substring(underScore, currSel.length);
			
			//Grepping big array only for selected id. 
			arr = $.grep(tableCont, function(a){
				return a.SRV_ID == finalSrvId;
			});
			
			openDetail(arr);
			
		});
		
		$("#delete_" + tableCont[i].SRV_ID).bind("click", function(){
			deleteServer( event.target.id, tableCont[i].SRV_HOSTNAME );
		});
		
	}

});

function deleteServer(srvid) {
	
	//delete server from Database and refresh database 
	var underscore = srvid.indexOf("_") +1;
	var finalsrvid = srvid.substring(underscore, srvid.length);
	
	sqlstring = "DELETE FROM CAT_SERVERS WHERE SRV_ID = " + finalsrvid; 
	
	response = utils.ManageHttpResponse( utils.SendReq ('http://10.135.235.16:9999/dbaction', 
			'POST', 
			'text/html', 
			sqlstring, 
			3000 
	));
	
	if (response == true) {location.reload();}
	
}

function openDetail(srvData){

	//store server info from current session	
	ManageSessionData.setDataInSession(srvData);
	//open remote html page with id in parameter
	window.open("ServerDetail.html" , "_self");
	
}