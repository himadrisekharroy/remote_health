var urlParams = new URLSearchParams(window.location.search)
var user_id = urlParams.get('user_id');

$("#doctor_images_show").html('<img src="'+site_url+'images/doctor_image/'+storage.getItem("logged_user_image")+'" width="50">');

$.post( api_url+"get_user_details.php", {func: "get_user_details_by_id", user_id: user_id})
	.done(function(data){
		//console.log(data);
	 	data = JSON.parse(data);
	 	if(data.success)
	 	{
	 		$("#user_img").attr("src", site_url+"images/user_images/"+data.data.image);
	 		$("#user_name").html(data.data.f_name+" "+data.data.l_name);
	 		$("#mobile").html(data.data.mobile);
	 		$("#email").html(data.data.email_id);
	 		$("#sex").html(data.data.gender);
	 		$("#age").html(data.data.age+" Yr");

	 		$("#content_screen").show();
	 		$("#loading_screen").slideUp();

	 		var heath_info_share_doc_ids = data.data.heath_info_share_doc_ids;
	 		if(heath_info_share_doc_ids.indexOf(storage.getItem("logged_user_id")) >= 0 )
	 		{
	 			get_patient_health_info(user_id);
	 		}
	 		else
	 		{
	 			var html_personal_health_qn ='<div class="alert alert-danger">';
				html_personal_health_qn +=	'<strong>Patient has not shared access to his personal health Information !</strong> ';
				html_personal_health_qn +='</div>';

				$("#personal_container").html(html_personal_health_qn);
			}
	 	}
	 	else
	 	{

	 	}
 	})

function get_patient_health_info(user_id)
{
 	$.post( api_url+"get_user_details.php", {func: "get_personal_health_qn", logged_user_id: user_id})
	.done(function(data){
		//console.log(data);
	 	data = JSON.parse(data);
	 	if(data.success)
	 	{
	 		var html_personal_health_qn ='<ul class="list-group inner">';
	 		var answer = data.data_selected;
	 		for(var key in data.data)
		 	{
		 		var sex = data.data[key].for;
		 		if(!sex.includes(storage.getItem("logged_user_sex"))) continue;

		 		var ans = new Array();
		 		if(answer[key])
		 		{
		 			ans = answer[key];
		 			ans = ans.join("<br/>");	
		 		}
		 		else
		 		{
		 			ans = "N/A";
		 		}
		 		

		 		html_personal_health_qn += '<li class="list-group-item">';			                    	
			    html_personal_health_qn +=                	'<div class="row doctor-details">';                   		
				html_personal_health_qn +=			           	'<div class="col-12">';
				html_personal_health_qn +=			           		'<b style="text-transform:uppercase">'+data.data[key].question+'</b><br/>';
				html_personal_health_qn +=			           	'</div>';
				html_personal_health_qn +=			       	'</div>';
				html_personal_health_qn +=			       	'<div class="row doctors-link">';
				html_personal_health_qn +=			       		'<div class="col-12">';
				html_personal_health_qn +=			       			'<a><small>'+ans+'</small></a>';
				html_personal_health_qn +=			       		'</div>';
				html_personal_health_qn +=	'		       	</div>';
				html_personal_health_qn += '</li>';
		 	}

		 	html_personal_health_qn += '<li class="list-group-item">';			                    	
		    html_personal_health_qn +=                	'<div class="row doctor-details">';                   		
			html_personal_health_qn +=			           	'<div class="col-12">';
			html_personal_health_qn +=			           		'<b style="text-transform:uppercase">How healthy do you feel in general?</b><br/>';
			html_personal_health_qn +=			           	'</div>';
			html_personal_health_qn +=			       	'</div>';
			html_personal_health_qn +=			       	'<div class="row doctors-link">';
			html_personal_health_qn +=			       		'<div class="col-12">';
			html_personal_health_qn +=			       			'<a><small>'+answer['general_feel']+'</small></a> &nbsp; &nbsp';
			html_personal_health_qn +=			       			'<a><small>out of 10.</small></a>';
			html_personal_health_qn +=			       		'</div>';
			html_personal_health_qn +=	'		       	</div>';
			html_personal_health_qn += '</li>';

		 html_personal_health_qn +='</ul>';

		 $("#personal_container").html(html_personal_health_qn);
	 	}
	 	else{

	 	}
	 })
}

$("#back_to_doctor_page27").click(function(){
	slideBabyRight("doctor_page27.html");
})