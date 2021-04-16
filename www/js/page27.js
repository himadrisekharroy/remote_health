var appHistoryIds = new Array();
var appHistorytimings = new Array();

$( document ).ready(function() {


$("#doctor_images_show").html('<img src="'+site_url+'images/doctor_image/'+storage.getItem("logged_user_image")+'" width="50">');
 	
	patient_text_chats(); 	

	$("#doc_appointment_history").click(function(){
		$(".tab_container").hide();
		$("#appointment_history_container").show();
		$(".tab_link").removeClass("active");
		$("#doc_appointment_history").addClass("active");

		var loadingHtml = 	'<div class="alert alert-warning" >';
		loadingHtml +=			'<strong>Wait!</strong> Processing time....';
		loadingHtml +=		'</div>';
		$("#upcommong_appts").html(loadingHtml);
		$("#recent_appts").html(loadingHtml);

		get_app_history();

		check_user_chat_initiation();
	});

 })

function patient_text_chats()
{
	$.post( api_url+"get_text_chat_details.php", {func: "get_doc_chat_users", doc_id: storage.getItem("logged_user_id")})
		.done(function(data){
		console.log(data);
	 	data = JSON.parse(data);
	 	if(data.success)
	 	{
	 		html_str='<h3 >List of patients</h3><ul class="list-group inner">';
	 		for(var key in data.data)
			{
				html_str += '<li class="list-group-item">';			                    	
			    html_str +=                	'<div class="row doctor-details">';                   		
				html_str +=                    	'<div class="col-2 doctors">';
				html_str +=			             	'<img src="'+site_url+'images/user_images/'+data.data[key].image+'"  class="img-reponsive img-rounded" />';
				html_str +=			           	'</div>';
				html_str +=			           	'<div class="col-8">';
				html_str +=			           		'<b style="text-transform:uppercase">'+data.data[key].f_name+' '+data.data[key].l_name+'</b><br/>';
				html_str +=			           		'<small>'+data.data[key].mobile+'</small><br/>';
				html_str +=			           		'<small>'+data.data[key].gender+" "+data.data[key].age+'</small><br/>';
				html_str +=			           	'</div>';
				html_str +=			           	'<div class="col-2">';
				html_str +=			           '</div>';
				html_str +=			       	'</div>';
				html_str +=			       	'<div class="row doctors-link7">';
				html_str +=			       		'<div class="col-4"><a href="doctor-profile-self11.html?user_id='+data.data[key].id+'"><i class="fa fa-id-card" aria-hidden="true"></i><br/><small>PROFILE</small></a> </div>';
				html_str +=			       		'<div class="col-4"><a href="doctor-chat28.html?user_id='+data.data[key].id+'"><i class="fa fa-comments-o" aria-hidden="true"></i><br/><small>CHAT <b> ('+data.data[key].unread_count+')</b></small></a> </div>';
				html_str +=			       		'<div class="col-4"><a href="javascript:void(0)" onclick="open_appt_tab();"><i class="fa fa-calendar" aria-hidden="true"></i><br/><small>BOOK</small></a></div>';
				html_str +=	'		       	</div>';
				html_str += '</li>';
			}
	 		html_str +='</ul>';
	 	}
	 	else
	 	{
	 		html_str='<ul class="list-group inner">';
	 		html_str +=		'<li class="list-group-item"> '+data.msg+' </li>';
	 		html_str +='</ul>';
	 	}
	 	$("#patient_container").html(html_str);

	 	setTimeout(function(){ 
			patient_text_chats();
		}, 3000);
	 })
}
function get_app_history()
{
	var ct= new Date();
	var d = ct.getDate();
	if(d < 10) d= "0"+d;

	var mh = ct.getMonth();
	mh = mh+1;
	if(mh < 10) mh = "0"+mh;
	var yr = ct.getFullYear();

	var h = ct.getHours();
	var m = ct.getMinutes();
	var s = ct.getSeconds();
	if(h < 10) h = "0"+h; 
	if(m < 10) m = "0"+m;
	if(s < 10) s = "0"+s;

	$.post( api_url+"get_video_chat_details.php", 
	{ 
		func: "get_doctor_appointments", 
		doc_id: storage.getItem("logged_user_id"),
		today: yr +"-"+mh+"-"+ d +" "+h + ":" + m + ":" + s
	})
	.done(function( data ) {
	    //alert( "Data Loaded: " + data );
	    var months_arr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	    // console.log(data);
	    data = JSON.parse(data);
	    if(data.upcomming.success)
	    {
	    	var counter =0;
	    	var appt_html ='<ul class="list-group inner">';
	    	for(var key in data.upcomming.data)
		 	{
		 		appHistoryIds[counter] = data.upcomming.data[key].id;
		 		appHistorytimings[counter] = data.upcomming.data[key].time;


		 		appt_html +='<li class="list-group-item">';
                appt_html +='	<div class="row doctor-details">';                    		
                appt_html +='    	<div class="col-2 doctors">';
			    appt_html +='         	<img src="'+site_url+'images/user_images/'+data.upcomming.data[key].image+'"   class="img-reponsive img-rounded" />';
			    appt_html +='       	</div>';
			    appt_html +='       	<div class="col-7">';
			    appt_html +='       		<b>'+data.upcomming.data[key].f_name+" "+data.upcomming.data[key].l_name+'</b><br/>';
			    appt_html +='       		<small>'+data.upcomming.data[key].mobile+'</small><br/>';
			    appt_html +='       		<small>'+data.upcomming.data[key].age+'Yr '+data.upcomming.data[key].gender+'</small><br/>';	
			    appt_html +='       	</div>';
			    appt_html +='       	<div class="col-3 v-call">';
			   // appt_html +='				<a onclick="video_chat_call_doctor('+counter+')"><img src="images/v_chat_icon.png"/></a>';
			    appt_html +='       	</div>';

			    appt_html +='   	</div>';
			    appt_html +='   	<div class="row doctors-link">';
			    appt_html +='			<div class="col-2"><img src="images/app_book_confirm.png" style="width:50px;"/></div>';
			    appt_html +='   		<div class="col-10">';
			    appt_html +='   			<b style="font-size:20px;">'+data.upcomming.data[key].time+'</b><div style="margin-top:-10px;"><small>'+months_arr[data.upcomming.data[key].month]+' '+data.upcomming.data[key].day+', '+data.upcomming.data[key].year+'</small></div>';
			    appt_html +='   		</div>';							       		
			    appt_html +='   	</div>';
			    appt_html +='		<div class="row doctors-link7">';
				appt_html +='			<div class="col-4"><a href="doctor-profile-self11.html?user_id='+data.upcomming.data[key].user_id+'"><i class="fa fa-id-card" aria-hidden="true"></i><br/><small>PROFILE</small></a> </div>';
				appt_html +='			<div class="col-4"><a href="javascript:void(0)" onclick="open_chat_tab();"><i class="fa fa-comments-o" aria-hidden="true"></i><br/><small>CHAT </small></a> </div>';
				appt_html +='			<div class="col-4"><a href="doctor-profile-self11.html?user_id='+data.upcomming.data[key].user_id+'"><i class="fa fa-heartbeat" aria-hidden="true"></i><br/><small>HEALTH</small></a></div>';
				appt_html +='		</div>';
			   	appt_html +='</li>';

			   	counter++;
		 	}
	    	appt_html +='</ul>';
	    	$("#upcommong_appts").html(appt_html);
	    	
	    }
		else
		{
			var appt_html ='<div class="alert alert-danger" >';
				appt_html += '<strong>Warning!</strong> '+data.upcomming.msg+'!!!';
				appt_html += '</div>';
			$("#upcommong_appts").html(appt_html);
	
		}

		if(data.previous.success)
		{
			var appt_html ='<ul class="list-group inner">';
	    	for(var key in data.previous.data)
		 	{
		 		var user_name = data.previous.data[key].f_name+" "+data.previous.data[key].l_name;
		 		var user_img_src = site_url+'images/user_images/'+data.previous.data[key].image;
		 		var user_age_gender = data.previous.data[key].age+'Yr. '+data.previous.data[key].gender;
		 		appt_html +='<li class="list-group-item">';
                appt_html +='	<div class="row doctor-details">';                    		
                appt_html +='    	<div class="col-2 doctors">';
			    appt_html +='         	<img src="'+user_img_src+'"   class="img-reponsive img-rounded" />';
			    appt_html +='       	</div>';
			    appt_html +='       	<div class="col-10">';
			    appt_html +='       		<b>'+user_name+'</b><br/>';
			    appt_html +='       		<small>'+data.previous.data[key].mobile+'</small><br/>';
			    appt_html +='       		<small>'+user_age_gender+'</small><br/>';
			    appt_html +='       	</div>';
			    
			    appt_html +='   	</div>';
			    appt_html +='   	<div class="row doctors-link">';
			    appt_html +='			<div class="col-2"><img src="images/app_book_confirm.png" style="width:50px;"/></div>';
			    appt_html +='   		<div class="col-5">';
			    appt_html +='   			<b style="font-size:20px;">'+data.previous.data[key].time+'</b><div style="margin-top:-10px;"><small>'+months_arr[data.previous.data[key].month]+' '+data.previous.data[key].day+', '+data.previous.data[key].year+'</small></div>';
			    appt_html +='   		</div>';
			    appt_html +='			<div class="col-5 text-right">';
			    appt_html +='			<a href="prescription-upload41.html?app_id='+data.previous.data[key].id+'" class="reschedule" >Advice</a>';
			    appt_html +='			<a href="javascript:void(0);" class="reschedule" onclick="open_box('+data.previous.data[key].id+',\''+ user_name+'\',\''+user_img_src+'\',\''+user_age_gender+'\',\''+data.previous.data[key].note+'\')">Note | <i class="fa fa-angle-down" aria-hidden="true"></i></a>';
			    appt_html +='	    	</div>';
			    appt_html +='   	</div>';
			    appt_html +='		<div class="row doctors-link7">';
				appt_html +='			<div class="col-4"><a href="doctor-profile-self11.html?user_id='+data.previous.data[key].user_id+'"><i class="fa fa-id-card" aria-hidden="true"></i><br/><small>PROFILE</small></a> </div>';
				appt_html +='			<div class="col-4"><a href="javascript:void(0)" onclick="open_chat_tab()"><i class="fa fa-comments-o" aria-hidden="true"></i><br/><small>CHAT</small></a> </div>';
				appt_html +='			<div class="col-4"><a href="doctor-profile-self11.html?user_id='+data.previous.data[key].user_id+'"><i class="fa fa-heartbeat" aria-hidden="true"></i><br/><small>HEALTH</small></a></div>';
				appt_html +='		</div>';
			   	appt_html +='</li>';
		 	}
	    	appt_html +='</ul>';
	    	$("#recent_appts").html(appt_html);
		}
		else
		{
			var appt_html ='<div class="alert alert-danger" >';
				appt_html += '<strong>Warning!</strong> '+data.previous.msg+'!!!';
				appt_html += '</div>';
			$("#recent_appts").html(appt_html);
		}
		setTimeout(function(){ 
			get_app_history();
		}, 5000);
	})
	
}
function video_chat_call_doctor(counter)
{
	navigator.notification.beep(2);
}

function check_user_chat_initiation(){
	var date = new Date();
	var cMnt = date.getHours() *60 + date.getMinutes();

	//console.log(date);


	var appFtime = new Array();

	if(appHistorytimings[0])
	{
		appFtime = appHistorytimings[0].split(":");	
		appFtime = parseInt(appFtime[0])*60+ parseInt(appFtime[1]);

		var appEtime = parseInt(appFtime) + 15; // appointment end time

		console.log(appHistorytimings[0]+"==="+cMnt+"=="+appFtime+"==="+appEtime);

		if(cMnt >= appFtime && cMnt <= appEtime)
		{
			$.post( api_url+"get_video_chat_details.php", 
			{ 
				func: "check_user_initiate_chat", 
				doc_id: storage.getItem("logged_user_id"),
				appt_id: appHistoryIds[0]					
			})
			.done(function(data){
				console.log(data);
    			data = JSON.parse(data);
    			if(data.success)
    			{
    				setInterval(function(){
    					navigator.vibrate(1000);
    				},2500);

    				navigator.notification.alert(
					    'Patient on call',  // message
					    connectCall,         // callback
					    'Calling.....',            // title
					    'Connect'                  // buttonName
					);

					function connectCall()
					{
						window.location.href="video_chat_doc_page34.html?appt_id="+appHistoryIds[0];
					}
    			}
    			else
    			{
    				setTimeout(function(){ 
						 check_user_chat_initiation();
					}, 1000);
    			}
			})
		}
		else
		{
			setTimeout(function(){ 
				 check_user_chat_initiation();
			}, 1000);
		}		
	}	
	else
	{
		setTimeout(function(){ 
			 check_user_chat_initiation();
		}, 1000);
	}	
}

function open_box(prev_appt_id, user_name, user_img_src,user_age_gender,note){
	$("#lb_user_name").html(user_name +" " +user_age_gender);
	$("#lb_user_image").attr("src",user_img_src);
	$("#appt_id").val(prev_appt_id);
	$("#note_text").val(note);
	$('.mask_note').fadeIn(1000);	
	$('.mask_note').fadeTo("slow",0.8);		
	$("#prev_appt_note").fadeIn(2000); 
}
function closebox()
{
	$('.mask_note').hide();
	$('#prev_appt_note').hide();
	$("#note_text").val("");	
}
$("#note_submit_link").click(function(){
	$(".alert").hide();
	$(".alert-warning").show();

	$.post( api_url+"get_video_chat_details.php", 
		{
			func: "save_past_appt_note", 
			appt_id: $("#appt_id").val(),
			note_text:$("#note_text").val()
		})
	.done(function(data){
	 	data = JSON.parse(data);
	 	console.log(data);
	 	if(data.success)
	 	{	 		
	 		$(".alert").hide();
	 		$(".alert-success").html(data.msg).show();
	 	}
	 	else
	 	{
	 		$(".alert").hide();	 		
	 		$(".alert-danger").html(data.msg).show();	 		
	 	}	 	
	 	setTimeout(function(){ 
	 		$(".alert").hide();
	 		$(".alert-display").show();	 		
	 	}, 3000);
	 })
})
function open_chat_tab()
{
	$( "#physician_search" ).trigger( "click" );
}
function open_appt_tab()
{
	$( "#doc_appointment_history" ).trigger( "click" );
	
}