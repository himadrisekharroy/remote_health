$( document ).ready(function() {
	var urlParams = new URLSearchParams(window.location.search);
	var vChatSubsconfirm = urlParams.get('appt_confirm');

	if(vChatSubsconfirm)
	{
		$( "#appointment_history" ).trigger( "click" );
	}

	$("#search_doctor").focus(function(){
		$("#search_content").show();
		$("#non_search_content").hide();
	})

	$("#search_doctor").keyup(function(){
		if($("#search_doctor").val().length >= 4)
		{
			$("#search_content").html('<div style="width: 100%; text-align: center; padding-top: 100px;"> <img src="images/loading.gif"></div>');
			//ajax call
			$.get( api_url+"get_doctor_details.php", {func: "search_doctor", search_text:$("#search_doctor").val()})
			.done(function(data){
				console.log(data);
				data = JSON.parse(data);
				var html_str = '';
			 	if(!data.success)
			 	{	
			 		html_str='<ul class="list-group inner">';
			 		html_str +=		'<li class="list-group-item"> '+data.msg+' </li>';
			 		html_str +='</ul>';
			 	}
			 	else
			 	{
			 		html_str='<ul class="list-group inner">';
					for(var key in data.data)
		 			{
		 				var reviewCount =0;
		 				
		 				var reviewArray = data.data[key]['review'];
		 				if(Array.isArray(reviewArray)) reviewCount = reviewArray.length;
		 				
						html_str += '<li class="list-group-item">';			                    	
					    html_str +=                	'<div class="row doctor-details">';                   		
						html_str +=                    	'<div class="col-2 doctors">';
						html_str +=			             	'<img src="'+site_url+'images/doctor_image/'+data.data[key].image+'"  class="img-reponsive img-rounded" />';
						html_str +=			           	'</div>';
						html_str +=			           	'<div class="col-8">';
						html_str +=			           		'<b style="text-transform:uppercase">Dr. '+data.data[key].f_name+' '+data.data[key].l_name+'</b><br/>';
						html_str +=			           		'<small>'+data.data[key].designation+'</small><br/>';
						html_str +=			           		'<a href="view-review23.html?id='+data.data[key].id+'"><small>'+reviewCount+' Reviews</small></a><br/>';
						html_str +=			           		'<small>Fees: Rs. '+data.data[key].per_visit_change+'/-</small><br/>';
						html_str +=			           		'<small>Language Known: '+data.data[key].language_known+'</small><br/>';
						html_str +=			           	'</div>';
						
						html_str +=			           	'<div class="col-2">';
						
						html_str +=			           '</div>';
						html_str +=			       	'</div>';
						html_str +=			       	'<div class="row doctors-link7">';
						html_str +=			       		'<div class="col-4">';
						html_str +=			       			'<a href="doctor-profile10.html?id='+data.data[key].id+'"><i class="fa fa-id-card" aria-hidden="true"></i><br/><small>PROFILE</small></a> </div>';
						html_str +=			       			'<div class="col-4"><a href="javascript:void(0)" id="trans_to_chat" onclick="check_msg_subscription('+data.data[key].id+');"><i class="fa fa-comments-o" aria-hidden="true"></i><br/><small>CHAT</small></a> </div>';
						html_str +=			       			'<div class="col-4"><a href="user_app_book32.html?id='+data.data[key].id+'"><i class="fa fa-calendar" aria-hidden="true"></i><br/><small>BOOKING</small></a></div>';
						html_str +=	'		       	</div>';

						// html_str +=			       	'<div class="row doctors-link">';
						// html_str +=			       		'<div class="col-12">';
						// html_str +=			       			'<a href="doctor-profile10.html?id='+data.data[key].id+'"><small>VIEW PROFILE</small></a> &nbsp; | &nbsp;';
						// html_str +=			       			'<a id="trans_to_chat" onclick="check_msg_subscription('+data.data[key].id+');"><small>Conversation</small></a> &nbsp; | &nbsp;';
						// html_str +=			       			'<a href="user_app_book32.html?id='+data.data[key].id+'"><small>Appointment</small></a>';
						// html_str +=			       		'</div>';
						// html_str +=	'		       	</div>';	

						html_str += '</li>';
					}

					html_str +='</ul>';
			 	}
			 	$("#search_content").html(html_str);
			})
		}
	})

	$.get( api_url+"get_doctor_details.php", {func: "get_specialization"})
	 	.done(function(data){
	 	data = JSON.parse(data);

	 	var html_str = '<ul class="list-group">';

	 	for(var key in data.data)
	 	{
	 		html_str += '<li class="list-group-item" data-toggle="collapse" data-target="#sub'+data.data[key].id +'">';
			html_str +=    	'<div class="specialization spl_img">';
			html_str += 		'<img src="images/cardio.png"  class="img-reponsive img-rounded" />';
			html_str +=	    '</div>';
			html_str +=	    '<div class="spl_title">' + data.data[key].title+ '</div>';
			html_str +=	    '<div class="spl_btn" id="spl_btn'+ data.data[key].id +'"> <img src="images/plus.png"> </div>';
			html_str +=	    '<div class="clearfix"></div>';
			html_str +=		'<ul class="list-group inner collapse" id="sub'+ data.data[key].id +'">';
			html_str +=		'<li class="list-group-item"> Please Wait </li>';
			html_str +=		'</ul>'
			html_str += '</li>';
	 	}
	 	html_str +="</ul>";
		$("#specialization_container").html(html_str).find(".collapse").on('show.bs.collapse', function () {
            loadDoctor($(this).attr("id")); 
            var spl_btn_id = "spl_btn" + $(this).attr("id").replace("sub","");
            $("#"+spl_btn_id).html('<img src="images/minus.png">');
        }).on("hide.bs.collapse",function(){
        	var spl_btn_id = "spl_btn" + $(this).attr("id").replace("sub","");
            $("#"+spl_btn_id).html('<img src="images/plus.png">');
        });
	  	//alert( "Data Loaded: " + data );
	});

	$.get( api_url+"get_user_details.php", 
			{
				func: "get_personal_health_qn", 
				logged_user_id: storage.getItem("logged_user_id")
			})
		.done(function(data){
			//console.log(data);
			data = JSON.parse(data);
			
			var html_personal_health_qn ="";

			var answer = data.data_selected;

			for(var key in data.data)
		 	{
		 		var type = data.data[key].type;
		 		var question = data.data[key].question;
		 		var sex = data.data[key].for;
		 		var options = data.data[key].options;
		 		
		 		
		 		//if(sex.includes(storage.getItem("logged_user_sex")))
		 		//{
			 		if(type == "checkbox"){
			 			html_personal_health_qn += '<div class="row faded_backcolor mt-3"  style="color: #9b113a">';
						html_personal_health_qn += '	<div class="col-12">';
						html_personal_health_qn += '		<p><b>'+question+'</b></p>';

						for(var innerKey in options)
						{
							var checkedHtml ="";
							//console.log(answer.length);
							//console.log(answer[key]);
							if (typeof answer[key] !== 'undefined') 
							{
								if(answer[key].length > 0 && answer[key].includes(options[innerKey]))
								checkedHtml ="checked";
							}

							html_personal_health_qn +=	'<div class="custom-control custom-checkbox">';
							html_personal_health_qn +=		'<input type="checkbox" '+checkedHtml+' name="q'+key+"_"+innerKey+'" class="custom-control-input" id="'+key+"_"+innerKey+'" value="'+options[innerKey]+'">';
							html_personal_health_qn +=		'<label class="custom-control-label" name="l'+key+"_"+innerKey+'" for="'+key+"_"+innerKey+'">'+options[innerKey]+'</label>';
							html_personal_health_qn +=	'</div>';
						}
						
						html_personal_health_qn += '	</div>';
						html_personal_health_qn += '</div>';
			 		}
			 		else if(type == "date")
			 		{
			 			var date = "";
			 			if (typeof answer[key] !== 'undefined') 
						{
			 				if(answer[key].length > 0 && answer[key][0])
								date = answer[key][0]
						}
			 			html_personal_health_qn +=	'<div class="row mt-3" style="color: #9b113a">';
						html_personal_health_qn +=	'	<div class="col-12">';
						html_personal_health_qn +=	'		<div class="form-group">';
						html_personal_health_qn +=	'   		<label class="form-label" style="top:-30px;" for="'+key+'_">'+question+'</label>';
						html_personal_health_qn +=	'      		<input id="'+key+"_"+'" name="q'+key+"_"+'" class="form-input" type="date" value="'+date+'"/>';
						html_personal_health_qn +=	'    	</div>';
						html_personal_health_qn +=	'    </div>';
						html_personal_health_qn +=	'</div>';
			 		}
			 		else if(type == "number")
			 		{
			 			var nmbr = "";
			 			if (typeof answer[key] !== 'undefined') 
						{
			 				if(answer[key].length > 0 && answer[key][0])
								nmbr = answer[key][0]
						}
			 			html_personal_health_qn +=	'<div class="row mt-3" style="color: #9b113a">';
						html_personal_health_qn +=	'	<div class="col-12">';
						html_personal_health_qn +=	'		<div class="form-group">';
						html_personal_health_qn +=	'   		<label class="form-label" style="top:-30px;" for="'+key+"_"+'">'+question+'</label>';
						html_personal_health_qn +=	'      		<input id="'+key+"_"+'" name="q'+key+"_"+'" class="form-input" type="number" value="'+nmbr+'"/>';
						html_personal_health_qn +=	'    	</div>';
						html_personal_health_qn +=	'    </div>';
						html_personal_health_qn +=	'</div>';
			 		}
			 		else if(type == "text")
			 		{

			 			var nmbr = "";
			 			if (typeof answer[key] !== 'undefined') 
						{
			 				if(answer[key].length > 0 && answer[key][0])
								nmbr = answer[key][0]
						}
			 			html_personal_health_qn +=	'<div class="row mt-3" style="color: #9b113a">';
						html_personal_health_qn +=	'	<div class="col-12">';
						html_personal_health_qn +=	'		<div class="form-group">';
						html_personal_health_qn +=	'   		<label class="form-label" style="top:-30px;" for="'+key+"_"+'">'+question+'</label>';
						html_personal_health_qn +=	'      		<input id="'+key+"_"+'" name="q'+key+"_"+'" class="form-input" type="text" value="'+nmbr+'"/>';
						html_personal_health_qn +=	'    	</div>';
						html_personal_health_qn +=	'    </div>';
						html_personal_health_qn +=	'</div>';
			 		}
			 		else if(type == "textbox")
			 		{
			 			var txtbx = "";
			 			if (typeof answer[key] !== 'undefined') 
						{
			 				if(answer[key].length > 0 && answer[key][0])
								txtbx = answer[key][0]
						}
			 			html_personal_health_qn +=	'<div class="row mt-3" >';
						html_personal_health_qn +=	'	<div class="col-12">';
						html_personal_health_qn +=	'		<div class="form-group">';
						html_personal_health_qn +=	'      		<label class="form-label" style="top:-30px;" for="'+key+"_"+'">'+question+'</label>';
						html_personal_health_qn +=	'      		<textarea class="form-input" rows="5" name="q'+key+"_"+'" id="'+key+"_"+'" style="padding-top: 10px">'+txtbx+'</textarea>';
						html_personal_health_qn +=	'    	</div>';
						html_personal_health_qn +=	'    </div>';
						html_personal_health_qn +=	'</div>';
			 		}
			 		else if(type == "radio")
			 		{			 			
			 			html_personal_health_qn +=	'<div class="row faded_backcolor mt-3" style="color: #9b113a">';
					    html_personal_health_qn +=	'	<div class="col-12">';
						html_personal_health_qn +=	'		<p><b>'+question+'</b></p>';

						for(var innerKey in options)
						{
							var checkedHtml ="";
							if (typeof answer[key] !== 'undefined') 
							{							
							if(answer[key].length > 0 && answer[key].includes(options[innerKey]))
								checkedHtml ="checked";
							}
							html_personal_health_qn +=	'		<div class="custom-control custom-radio">';
							html_personal_health_qn +=	'		    <input type="radio" '+checkedHtml+' class="custom-control-input" value="'+options[innerKey]+'" id="'+key+"_"+innerKey+'" name="q'+key+"_"+'">';
							html_personal_health_qn +=	'		    <label class="custom-control-label" for="'+key+"_"+innerKey+'">'+options[innerKey]+'</label>';
							html_personal_health_qn +=	'		</div>';
						}
								
						html_personal_health_qn +=	'	</div>';
						html_personal_health_qn +=	'</div>';
			 		}
		 		//}
		 	}
		 	if(answer.general_feel)
		 	{
		 		$("#general_feel").val(answer.general_feel);
		 		$("#general_feel_val_show").html(answer.general_feel)	;
		 	}
		 	
		 	$("#logger_user_id").val(storage.getItem("logged_user_id"));
		 	$("#personal_health_qns").html(html_personal_health_qn);
		 	$("#general_feel_container").show();
		})

})

function video_chat_call_patient(counter)
{
	var str = $("#year_id_"+counter).val()+"-"+(parseInt($("#month_id_"+counter).val())+1)+"-"+ $("#day_id_"+counter).val() +" "+ $("#time_id_"+counter).val();

	var appDate = new Date(str);
	var today = new Date();

	function alertDismissed() {
    	// do something
	}

	if ( appDate > today ) { 
		var monthNames = ["January", "February", "March", "April", "May", "June",  "July", "August", "September", "October", "November", "December"];

		navigator.notification.alert(
		    'Please come back on '+ monthNames[parseInt($("#month_id_"+counter).val())] + " " +$("#day_id_"+counter).val()+", "+$("#year_id_"+counter).val()+" at "+ $("#time_id_"+counter).val()+ " for your scheduled appointment.",  // message
		    alertDismissed,         // callback
		    'Appointment with '+$("#doctor_name_"+counter).val(),            // title
		    'Done'                  // buttonName
		);
	}
	else
	{
		$(".v-call a").html("Please Wait...");
		// initiate call
		$.post( api_url+"get_video_chat_details.php", 
		{ 
			func: "user_initiate_chat", 
			appt_id: $("#appt_id_"+counter).val(),
			user_id: storage.getItem("logged_user_id")
		})
		.done(function(data){
			//console.log(data);
		    data = JSON.parse(data);
		    if(data.success)
		    {
		    	$.post( api_url+"generate_opentok_credentials.php", 
				{
					appt_id: $("#appt_id_"+counter).val()
				})
				.done(function(data){
					console.log(data);
					data = JSON.parse(data);
					if(data.success)
		    		{
		    			window.location.href="video_chat_page33.html?appt_id="+$("#appt_id_"+counter).val();
		    		}
		    		else
		    		{
		    			alert("Call initiation issue. Unable to generate opentok session. Please contact Remote Health.");
		    		}
				})		    	
		    }
			else
			{
				alert("Call initiation issue. Please contact Remote Health.");
			}
		})

		//window.location.href="video_chat_page33.html?appt_id="+$("#appt_id_"+counter).val();
	}


}


function loadDoctor(id)
{
	id = id.replace("sub", "");

	$.post( api_url+"get_doctor_details.php", {func: "get_specialist_doctor", specialization_id: id})
		.done(function(data){
			console.log(data);
	 	data = JSON.parse(data);

	 	var html_str = '';
	 	if(!data.success)
	 	{
	 		html_str +=		'<li class="list-group-item"> '+data.msg+' </li>';
	 	}
	 	else
	 	{
	 		for(var key in data.data)
		 	{
		 		var reviewCount =0;
 				
 				var reviewArray = data.data[key]['review'];
 				if(Array.isArray(reviewArray)) reviewCount = reviewArray.length;

		 		html_str += '<li class="list-group-item" id="list-group-item_">';			                    	
			    html_str +=                	'<div class="row doctor-details">';                   		
				html_str +=                    	'<div class="col-2 doctors">';
				html_str +=			             	'<img src="'+site_url+'images/doctor_image/'+data.data[key].image+'"  class="img-reponsive img-rounded" />';
				html_str +=			           	'</div>';
				html_str +=			           	'<div class="col-8">';
				html_str +=			           		'<b style="text-transform:uppercase">Dr. '+data.data[key].f_name+' '+data.data[key].l_name+'</b><br/>';
				html_str +=			           		'<small>'+data.data[key].designation+'</small><br/>';
				html_str +=			           		'<a href="view-review23.html?id='+data.data[key].id+'"><small>'+reviewCount+' Reviews</small></a><br/>';
				html_str +=			           		'<small>Fees: Rs. '+data.per_visit_change+'/-</small><br/>';
				html_str +=			           		'<small>Language Known: '+data.data[key].language_known+'</small><br/>';
				html_str +=			           	'</div>';
				html_str +=			           	'<div class="col-2">';
				
				html_str +=			           '</div>';
				html_str +=			       	'</div>';
				html_str +=			       	'<div class="row doctors-link7">';
				html_str +=			       		'<div class="col-4">';
				html_str +=			       			'<a href="doctor-profile10.html?id='+data.data[key].id+'"><i class="fa fa-id-card" aria-hidden="true"></i><br/><small>PROFILE</small></a> </div>';
				html_str +=			       			'<div class="col-4"><a href="javascript:void(0)" id="trans_to_chat" onclick="check_msg_subscription('+data.data[key].id+');"><i class="fa fa-comments-o" aria-hidden="true"></i><br/><small>CHAT</small></a> </div>';
				html_str +=			       			'<div class="col-4"><a href="user_app_book32.html?id='+data.data[key].id+'"><i class="fa fa-calendar" aria-hidden="true"></i><br/><small>BOOKING</small></a></div>';
				html_str +=			       		'</div>';
				html_str +=	'		       	</div>';
				html_str += '</li>';
		 	}
		}
		$("#sub"+id).html(html_str);
	 })
}

$("#personal_health_form").submit(function(e){
	e.preventDefault();
	$("#personal_health_submit_btn").prop('disabled', true);
	$(".alert-warning").show();
	$(".alert-success").slideUp();
	$(".alert-danger").slideUp();

	var formdata = new FormData($('#personal_health_form')[0]);

	$.ajax({
		url         : api_url+"get_user_details.php",
		data        : formdata,// ? formdata : $("#form_sample_1").serialize(),
		cache       : false,
		contentType : false,
		processData : false,
		enctype: 'multipart/form-data',
		type        : 'POST',
		success     : function(data, textStatus, jqXHR){
			console.log(data)
	   		data = JSON.parse(data);

	   		$("#personal_health_submit_btn").prop('disabled', false);
        	
        	if(data.success)
	    	{
	    		$(".alert-success").html("<strong>Success:</strong>"+ data.msg).slideDown();
				$(".alert-danger").slideUp();
				$(".alert-warning").slideUp();
		    	setTimeout(function(){				   
				    $(".alert-success").slideUp();
				}, 4000);
	    	}
	    	else
	    	{
	    		$(".alert-danger").html("<strong>Error:</strong>"+ data.msg).slideDown();
		    	$(".alert-success").slideUp(); 	
		    	$(".alert-warning").slideUp();
		    	setTimeout(function(){
				   $(".alert-danger").slideUp();
				}, 4000);

	    	}

        }
    });
})

$("#share_with_doc").click(function(){
	var r = confirm("Are you sure to share your health information to the doctors?");
	if (r == true) {
	  window.location.href = "share_with_doctor40.html";
	  
	}
})

function appt_reschedule(counter)
{
	var time = $("#time_id_"+counter).val();
	time = time.split(":");

	var c = new Date().getTime();
	var t = new Date();
	t.setDate(parseInt($("#day_id_"+counter).val()));
	t.setMonth(parseInt($("#month_id_"+counter).val()));
	t.setFullYear(parseInt($("#year_id_"+counter).val()));
	t.setHours(parseInt(time[0]));
	t.setMinutes(parseInt(time[1]));
	t.setSeconds(0);
	t = t.getTime();

	var timeDiff = (t-c)/(1000*60); // mili sec to minute
	console.log(timeDiff);
	if(timeDiff < 30)
	{
		alert("You are not allowed to reschedule before 30 minutes of appointment!!");
	}
	else
	{
		var confm = confirm("Are you sure to reschedule the appointment!");
		if(confm)
		{
			window.location.href="user_app_book32.html?id=" + $("#doc_id_"+counter).val() +"&appt_id=" + $("#appt_id_"+counter).val();
		}
	}
}
function appt_cancel(counter)
{
	var r = confirm("Are you sure to cancel the appointment?!");
	if (r == true) {
		window.location.href="video_chat_book_cancel37.html?appt_id=" + $("#appt_id_"+counter).val();
	}
}

function open_box( doc_name, doc_img_src,note){
	if(!note) note = "No note found.";
	
	$("#lb_user_name").html(doc_name );
	$("#lb_user_image").attr("src",site_url+'images/doctor_image/'+doc_img_src);	
	$("#note_text").val(note);
	$('.mask_note').fadeIn(1000);	
	$('.mask_note').fadeTo("slow",0.8);		
	$("#prev_appt_note").fadeIn(2000); 
}
function open_perscription( doc_name, doc_img_src,pres, base_pres){
	if(pres == "null") 
	{
		pres = "Doctor have not uploaded your prescription yet.";
		$("#pres_down_btn").hide();
	}
	else
	{
		pres = "Doctor have uploaded your prescription.";	
		$("#pres_down_btn").show();
		$("#base_pres").val(base_pres);
	}	
	
	$("#pres_lb_user_name").html(doc_name );
	$("#pres_lb_user_image").attr("src",site_url+'images/doctor_image/'+doc_img_src);	
	$("#pres_note_text").html(pres);
	$('.mask_note').fadeIn(1000);	
	$('.mask_note').fadeTo("slow",0.8);		
	$("#pres_lb").fadeIn(2000); 
}
function closebox()
{
	$('.mask_note').hide();
	$('#prev_appt_note').hide();	
	$('#pres_lb').hide();	
}
function download_pres()
{
	window.open("http://remotehealth.org/doctor-prescription?" + $("#base_pres").val(), '_system'); 
	return false;
}