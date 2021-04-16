var api_url="http://remotehealth.org/telemed_api/";
var site_url="http://remotehealth.org/";
var storage = window.localStorage;

jQuery(document).ready(function($) {
	
	if(storage.getItem("logged_user_type") == 'd')
	{

		$("#user_name_show").html("<br/>Dr. " + storage.getItem("logged_user_name"));
		$("#user_images_show").html('<img src="'+site_url+"images/doctor_image/"+storage.getItem("logged_user_image")+'" width="50">')
		$("#tans_to_patients").show();
		$("#tans_to_physician").hide();
		$("#tans_to_practice").show();	
		$("#user_type_str").html("Doctor");	

	}
	else if(storage.getItem("logged_user_type") == 'jd')
	{

		$("#user_name_show").html("<br/>Dr. " + storage.getItem("logged_user_name"));
		$("#user_images_show").html('<img src="'+site_url+"images/doctor_image/"+storage.getItem("logged_user_image")+'" width="50">')
		$("#tans_to_patients").show();
		$("#tans_to_physician").hide();
		$("#user_type_str").html("Doctor");

	}
	else if(storage.getItem("logged_user_type") == 'jn')
	{

		$("#user_name_show").html("<br/> " + storage.getItem("logged_user_name"));
		$("#user_images_show").html('<img src="'+site_url+"images/doctor_image/"+storage.getItem("logged_user_image")+'" width="50">')
		$("#tans_to_patients").show();
		$("#tans_to_physician").hide();
		$("#user_type_str").html("Nurse");
		$("#tans_to_practice").hide();

	}
	else if(storage.getItem("logged_user_type") == 'sn')
	{

		$("#user_name_show").html("<br/> " + storage.getItem("logged_user_name"));
		$("#user_images_show").html('<img src="'+site_url+"images/doctor_image/"+storage.getItem("logged_user_image")+'" width="50">')
		$("#tans_to_patients").show();
		$("#tans_to_physician").hide();
		$("#user_type_str").html("Nurse");
		$("#tans_to_practice").hide();

	}
	else if(storage.getItem("logged_user_type") == 'u')
	{
		$("#user_name_show").html("<br/>"+storage.getItem("logged_user_name"));

		$("#user_images_show").html('<img src="'+site_url+"images/user_images/"+storage.getItem("logged_user_image")+'" width="50">')
		$("#tans_to_patients").hide();
		$("#tans_to_physician").show();
		$("#tans_to_practice").hide();
		$("#tans_to_convtime").hide();
		
	}
	


	$('input:not([type="radio"])').focus(function(){
		console.log("ok");
	  	$(this).parents('.form-group').addClass('focused');
	});

	$('input:not("#otp, #d_otp")').blur(function(){
		var inputValue = $(this).val();
	  	if ( inputValue == "" ) {
	    	$(this).removeClass('filled');
	    	$(this).parents('.form-group').removeClass('focused');  
	  	} else {
	    	$(this).addClass('filled');
	  	}
	})  

	$("#tans_to_index2").click(function(){
		if($("#styled-checkbox-4"). prop("checked") == true){
			slideBaby("index2.html");
		}
		else
		{
			alert("Please accept lisence Agreement.")
		}
	});

	$("#tans_to_index3").click(function(){
		slideBaby("index3.html");
	});

	$("#tans_to_signup_btn").click(function(){
		slideBaby("signup-btn4.html");
	})

	$("#tans_to_signin_user").click(function(){
		slideBaby("login-user5.html");
	})

	$("#back_to_index3").click(function(){
		slideBabyRight("index3.html");
	})
	////////////////////////////////////////////
	$("#tans_to_my_profile").click(function(){
		if(storage.getItem("logged_user_type") == 'u')
			slideBaby("member-profile9.html");
		else if(storage.getItem("logged_user_type") == 'jn')
			slideBaby("nurse-view-profile46.html");
		else if(storage.getItem("logged_user_type") == 'sn')
			slideBaby("nurse-view-profile46.html");
		else
			slideBaby("doctor-view-profile29.html");
	});
	$("#tans_to_change_password").click(function(){
		slideBaby("change-password22.html");
	});

	$("#tans_to_physician").click(function(){
		slideBaby("user_page7.html");
	});

	$("#tans_to_nurse").click(function(){
		slideBaby("user_nurse_search45.html");
	});

	$("#tans_to_make_appointment").click(function(){
		slideBabyRight("user_page7.html");
	});

	$("#tans_to_contact").click(function(){
		slideBaby("contact-us14.html");
	});

	$("#tans_to_feedback").click(function(){
		slideBaby("send-feedback-form18.html");
	});

	$("#tans_to_share").click(function(){
		slideBaby("share19.html");
	});

	$("#tans_to_privacy").click(function(){
		slideBaby("privacy-policy12.html");
	});

	$("#tans_to_terms").click(function(){
		slideBaby("terms-use13.html");
	});
	$("#tans_to_faq").click(function(){
		slideBaby("faq21.html");
	});
	$("#trans_to_change_profile").click(function(){
		slideBaby("member-change-profile15.html");
	});

	$("#tans_to_patients").click(function(){
		slideBabyRight("doctor_page27.html");
	})

	$("#tans_to_convtime").click(function(){
		slideBabyRight("chat_timimg30.html");
	})

	$("#tans_to_conftime").click(function(){
		slideBabyRight("video_chat_timimg31.html");
	})

	$("#signout_link").click(function(){
		var r = confirm("Are you sure!");
		if(r)
		{
			storage.clear();
			window.location.href="index1.html";	
		}	
	})

	$("#user_login_form").submit(function(e){
		e.preventDefault();
		$("#user_login_btn").prop('disabled', true);
		$(".alert-success").slideUp();
		$(".alert-danger").slideUp();
		$(".alert-warning").slideDown();

		$.post( api_url+"get_user_details.php", 
			{ 
				user_login_email: $("#user_login_email").val(), 
				user_login_password: $("#user_login_password").val(), 
				func:"user_login"
			})
		  .done(function( data ) {
		    //alert( "Data Loaded: " + data );
		    console.log(data);
		    data = JSON.parse(data);
		    $(".alert-warning").slideUp();
		    if(data.success)
		    {
		    	$(".alert-success").html("<strong>Success:</strong> "+ data.msg).slideDown();

		    	localStorage.setItem('logged_user_id', data.id);
		    	localStorage.setItem('logged_user_name', data.f_name +" "+ data.l_name);
		    	localStorage.setItem('logged_user_f_name', data.f_name);
		    	localStorage.setItem('logged_user_l_name', data.l_name);
		    	localStorage.setItem('logged_user_image', data.image);
		    	localStorage.setItem('logged_user_type', "u");
		    	localStorage.setItem('logged_user_sex', data.sex);
		    	localStorage.setItem('logged_user_email', $("#user_login_email").val());
		    	localStorage.setItem('logged_user_dob', data.dob);
		    	localStorage.setItem('logged_user_ph', data.mobile);
		    	setTimeout(function(){
				   slideBaby("user_page7.html");
				}, 3000);
		    }
		    else
		    {
		    	$(".alert-danger").html("<strong>Error:</strong> "+ data.msg).slideDown();
		    	$("#user_login_password").val("");
		    	$("#user_login_email").val("");
		    	$("#user_login_btn").prop('disabled', false);
		    	setTimeout(function(){
				   $(".alert-danger").slideUp();
				}, 3000);
		    }
		  });
	})

	$("#doctor_login_form").submit(function(e){
		e.preventDefault();
		$("#doctor_login_btn").prop('disabled', true);
		$(".alert-success").slideUp();
		$(".alert-danger").slideUp();
		$(".alert-warning").slideDown();

		$.post( api_url+"get_doctor_details.php", 
			{ 
				user_login_email: $("#user_login_email").val(), 
				user_login_password: $("#user_login_password").val(), 
				func:"doctor_login"
			})
		  .done(function( data ) {
		    //alert( "Data Loaded: " + data );
		    console.log(data);
		    data = JSON.parse(data);
		    $(".alert-warning").slideUp();
		    if(data.success)
		    {
		    	$(".alert-success").html("<strong>Success:</strong> "+ data.msg).slideDown();

		    	localStorage.setItem('logged_user_id', data.id);
		    	localStorage.setItem('logged_user_name', data.f_name +" "+ data.l_name);
		    	localStorage.setItem('logged_user_f_name', data.f_name);
		    	localStorage.setItem('logged_user_l_name', data.l_name);
		    	localStorage.setItem('logged_user_image', data.image);
		    	localStorage.setItem('logged_user_type', data.type);
		    	localStorage.setItem('logged_user_sex', data.sex);
		    	localStorage.setItem('logged_user_email', $("#user_login_email").val());
		    	localStorage.setItem('logged_user_dob', data.dob);
		    	localStorage.setItem('logged_user_ph', data.mobile);
		    	setTimeout(function(){
				   slideBaby("doctor_page27.html");
				}, 3000);
		    }
		    else
		    {
		    	$(".alert-danger").html("<strong>Error:</strong> "+ data.msg).slideDown();
		    	$("#user_login_password").val("");
		    	$("#user_login_email").val("");
		    	$("#doctor_login_btn").prop('disabled', false);
		    	setTimeout(function(){
				   $(".alert-danger").slideUp();
				}, 3000);
		    }
		  });
	})

	$("#user_login_email").focus(function(){
		$(".bottom").hide();
	})

	$("#user_login_password").focus(function(){
		$(".bottom").hide();
	})

	$("#user_login_email").focusout(function(){
	 	$(".bottom").show();
	})

	$("#user_login_password").focusout(function(){
	$(".bottom").show();
	})


	$("#tans_to_doc_login_btn").click(function(){
		slideBaby("login-doctor26.html");
	})

	$("#user_login_btn_link").click(function(){
		slideBaby("login-user5.html");
		//$( "#user_login_btn" ).trigger( "click" );
	})

	$("#trans_to_membersignup").click(function(){
		slideBaby("member-signup6.html");
	})

	$("#trans_to_doctorsignup").click(function(){
		slideBaby("doctor-signup8.html");
	})

	$("#back_to_signup_btn").click(function(){
		slideBabyRight("index3.html");
	})

	$("#tans_to_practice").click(function(){
		window.location.href="add-practice42.html";
	})

	$("#dob").click(function(){
		var options = {
		  date: new Date(),
		  mode: 'date'
		};

		datePicker.show(options, function(date){
			var dobDay= new Date(date);
			var dd= dobDay.getDate();
			var mm = dobDay.getMonth()+1;
			var yyyy = dobDay.getFullYear();
			if(dd<10) dd="0"+dd;
			if(mm<10) mm= "0"+mm;

			dobDay = yyyy+"-"+mm+"-"+dd;
			$("#dob").val(dobDay);
		  	//alert("date result " + date);  
		});
	})

	// $("#member_signup_form input").focus(function(){
	// 	$("#user_login_btn_link").hide();
	// 	$("#user_signup_btn_link").show();
	// 	$(".bottom").hide();
	// })

	// $("#member_signup_form input").focusout(function(){
	// 	$("#user_login_btn_link").show();
	// 	$("#user_signup_btn_link").hide();
	// 	$(".bottom").show();
	// })

	// $("#user_login_btn_link").click(function(){
	// 	slideBabyRight("login-user5.html");
	// });

	$("#member_signup_form").submit(function(e){
		e.preventDefault();
		$("#member_signup_btn").prop('disabled', true);
		$(".alert-success").slideUp();
		$(".alert-danger").slideUp();
		$(".alert-warning").show();
		$.post( api_url+"get_user_details.php", 
			{ 
				f_name: $("#f_name").val(), 
				l_name: $("#l_name").val(), 
				email:$("#email").val(),
				password: $("#password").val(),
				dob: $("#dob").val(),
				mobile: $("#mobile").val(),
				sex: $("input[name='sex']:checked"). val(),
				func:"user_registration"
			})
		.done(function( data ) {
		    //alert( "Data Loaded: " + data );
		    console.log(data);
		    data = JSON.parse(data);
		    if(data.success)
		    {
		    	$("#member_signup_form input").val("");

		    	$("#form_without_otp").slideUp();
		    	//$("#form_otp").slideDown();
		    	$(".bottom").hide();
		    	$("#generated_otp").val(data.code);
		    	$("#insert_user_id").val(data.insert_user_id);
		    	$(".alert-success").html("<strong>Success:</strong>"+ data.msg).slideDown();
				$("#succ_u_login_redirect").show();
		    	setTimeout(function(){
				    $(".alert-danger").slideUp();
				    $(".alert-success").slideUp();
				}, 3000);
		    }
		    else
		    {
		    	$(".alert-danger").html("<strong>Error:</strong>"+ data.msg).slideDown();
		    	$("#user_login_password").val("");	    	
		    	$("#member_signup_btn").prop('disabled', false);
		    	setTimeout(function(){
				   $(".alert-danger").slideUp();
				}, 3000);
		    }
		    $(".alert-warning").hide();
		 }) 

	})

	$("#otp").keyup(function(){
		if($("#otp").val().length >= 4)
		{
			if($("#generated_otp").val() == $("#otp").val())
			{
				$(".alert-warning").html("<strong>Please Wait: System is processing...</strong>").slideDown();
		    	$.post( api_url+"get_user_details.php", { func:"activate_user", user_id:$("#insert_user_id").val()})
		    	.done(function(data){
	        		//alert(data);
	        		data = JSON.parse(data);
	        		if(data.success)
			    	{
			    		$(".alert-warning").hide();
			    		$(".alert-success").html("<strong>Success: Registration Successful. Please Wait...</strong>").slideDown();
			    		setTimeout(function(){
					    	window.location.href="login-user5.html";
						}, 3000);			    		
			    	}
				    else
				    {
				    	$(".alert-warning").hide();
				    	$(".alert-danger").html("<strong>Error: Please try again later.</strong>").slideDown();
				    	setTimeout(function(){
					    	$(".alert-danger").slideUp();
						}, 3000);
				    }
				}) ;   	
			}
			else
			{
				$(".alert-warning").hide();
				$(".alert-danger").html("<strong>Error: Wrong OTP.</strong>").slideDown();
				setTimeout(function(){
				    $(".alert-danger").slideUp();
				}, 3000);
			}
		}
	})
	//============ page 7 ============================//
	$("#physician_search").click(function(){
		$("#search_content").hide();
		$("#non_search_content").show();
		$(".tab_container").hide();
		$("#physician_search_container").show();
		$(".tab_link").removeClass("active");
		$("#physician_search").addClass("active");
		$("#seach_input").slideDown();
	})

	$("#personal_health").click(function(){
		$("#search_content").hide();
		$("#non_search_content").show();
		$(".tab_container").hide();	
		$("#personal_health_container").show();
		$(".tab_link").removeClass("active");
		$("#personal_health").addClass("active");
		$("#seach_input").slideUp();
	})

	$("#appointment_history").click(function(){
		$("#search_content").hide();
		$("#non_search_content").show();
		$(".tab_container").hide();
		$("#appointment_history_container").show();
		$(".tab_link").removeClass("active");
		$("#appointment_history").addClass("active");
		$("#seach_input").slideUp();	

		var loadingHtml = 	'<div class="alert alert-warning" >';
		loadingHtml +=			'<strong>Wait!</strong> Processing time....';
		loadingHtml +=		'</div>';
		$("#upcommong_appts").html(loadingHtml);
		$("#recent_appts").html(loadingHtml);
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
			func: "get_user_appointments", 
			user_id: storage.getItem("logged_user_id"),
			today: yr +"-"+mh+"-"+ d +" "+h + ":" + m + ":" + s,
		})
		.done(function( data ) {
		    //alert( "Data Loaded: " + data );
		    var months_arr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		    console.log(data);
		    data = JSON.parse(data);
		    if(data.upcomming.success)
		    {
		    	var appt_html ='<ul class="list-group inner">';
		    	var counter =0;
		    	for(var key in data.upcomming.data)
			 	{
			 		appt_html +='<li class="list-group-item">';
	                appt_html +='	<div class="row doctor-details">';                    		
	                appt_html +='    	<div class="col-2 doctors">';
				    appt_html +='         	<img src="'+site_url+'images/doctor_image/'+data.upcomming.data[key].image+'"   class="img-reponsive img-rounded" />';
				    appt_html +='       	</div>';
				    appt_html +='       	<div class="col-7">';
				    appt_html +='       		<b>Dr. '+data.upcomming.data[key].f_name+" "+data.upcomming.data[key].l_name+'</b><br/>';
				    appt_html +='       		<small>'+data.upcomming.data[key].designation+'</small><br/>';
				    appt_html +='       		<small>'+data.upcomming.data[key].title+'</small><br/>';
				    appt_html +='       		<small>Rs '+data.upcomming.data[key].per_visit_change+'/-</small><br/>';	
				    appt_html +='				<small>Language Known: '+data.data[key].language_known+'</small><br/>';
				    appt_html +='       	</div>';
				    appt_html +='       	<div class="col-3 v-call">';
				    appt_html +='				<a onclick="video_chat_call_patient('+ counter +')"><img src="images/v_chat_icon.png"/></a>';
				    appt_html +='       	</div>';

				    appt_html +='   	</div>';
				    appt_html +='   	<div class="row doctors-link">';
				    appt_html +='			<div class="col-2"><img src="images/app_book_confirm.png" style="width:50px;"/></div>';
				    appt_html +='   		<div class="col-3">';
				    appt_html +='   			<div style="margin-top:-5px;"><b style="font-size:16px;">'+data.upcomming.data[key].time+'</b></div><div style="margin-top:-10px;"><small>'+months_arr[data.upcomming.data[key].month]+' '+data.upcomming.data[key].day+'</small></div><div style="margin-top:-8px"><small>'+data.upcomming.data[key].year+'</small></div>';
				    appt_html +='   		</div>';
				    appt_html +='			<div class="col-3 text-center">';
				    appt_html +='				<a href="javascript:void(0);" class="reschedule cancel" onclick="appt_cancel('+counter+')">Cancel</a>';		
				    appt_html +='			</div>';
				    appt_html +='			<div class="col-4 text-right">';
				    appt_html +='				<a href="javascript:void(0);" class="reschedule" onclick="appt_reschedule('+counter+')">Reschedule</a>';		
				    appt_html +='			</div>';
				    appt_html +='		</div>'
				    appt_html +='   	<input type="hidden" id="appt_id_'+counter+'" value="'+data.upcomming.data[key].id+'" />';
				    appt_html +='   	<input type="hidden" id="doc_id_'+counter+'" value="'+data.upcomming.data[key].doc_id+'" />';
				    appt_html +='   	<input type="hidden" id="month_id_'+counter+'" value="'+data.upcomming.data[key].month+'" />';
				    appt_html +='   	<input type="hidden" id="day_id_'+counter+'" value="'+data.upcomming.data[key].day+'" />';
				    appt_html +='   	<input type="hidden" id="year_id_'+counter+'" value="'+data.upcomming.data[key].year+'" />';
				    appt_html +='   	<input type="hidden" id="time_id_'+counter+'" value="'+data.upcomming.data[key].time+'" />';
				    appt_html +='   	<input type="hidden" id="doctor_name_'+counter+'" value="Dr. '+data.upcomming.data[key].f_name+" "+data.upcomming.data[key].l_name+'" />';
				    appt_html +='</li>';

				   	counter ++;
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
			 		var doc_name = 'Dr. '+ data.previous.data[key].f_name+" "+data.previous.data[key].l_name;

			 		appt_html +='<li class="list-group-item">';
	                appt_html +='	<div class="row doctor-details">';                    		
	                appt_html +='    	<div class="col-2 doctors">';
				    appt_html +='         	<img src="'+site_url+'images/doctor_image/'+data.previous.data[key].image+'"   class="img-reponsive img-rounded" />';
				    appt_html +='       	</div>';
				    appt_html +='       	<div class="col-10">';
				    appt_html +='       		<b>Dr. '+data.previous.data[key].f_name+" "+data.previous.data[key].l_name+'</b><br/>';
				    appt_html +='       		<small>'+data.previous.data[key].designation+'</small><br/>';
				    appt_html +='       		<small>'+data.previous.data[key].title+'</small><br/>';
				    appt_html +='       		<small>Fees: Rs '+data.previous.data[key].per_visit_change+'/-</small><br/>';
				    appt_html +='				<small>Language Known: '+data.data[key].language_known+'</small><br/>';
				    appt_html +='       	</div>';
				    
				    appt_html +='   	</div>';
				    appt_html +='   	<div class="row doctors-link">';
				    appt_html +='			<div class="col-2"><img src="images/app_book_confirm.png" style="width:50px;"/></div>';
				    appt_html +='   		<div class="col-4">';
				    appt_html +='   			<b style="font-size:20px;">'+data.previous.data[key].time+'</b><div style="margin-top:-10px;"><small>'+months_arr[data.previous.data[key].month]+' '+data.previous.data[key].day+', '+data.previous.data[key].year+'</small></div>';
				    appt_html +='   		</div>';

				    appt_html +='			<div class="col-3 text-right">';
			    	appt_html +='				<a href="javascript:void(0);" class="pres_dwn_btn" onclick="open_perscription(\''+ doc_name+'\',\''+data.previous.data[key].image+'\',\''+data.previous.data[key].file+'\',\''+data.previous.data[key].pres+'\')"> Prescription </a>';
			    	appt_html +='	    	</div>';
					
					appt_html +='			<div class="col-3 text-right">';
			    	appt_html +='				<a href="javascript:void(0);" class="reschedule" onclick="open_box(\''+ doc_name+'\',\''+data.previous.data[key].image+'\',\''+data.previous.data[key].note+'\')"> Note </a>';
			    	appt_html +='	    	</div>';				    
				    appt_html +='   	</div>';
				   	appt_html +='</li>';
			 	}
		    	appt_html +='</ul>';
		    	$("#recent_appts").html(appt_html);
			}
			else
			{
				var appt_html ='<div class="alert alert-danger" >';
					appt_html += '<strong>Warning!</strong> '+data.upcomming.msg+'!!!';
					appt_html += '</div>';
				$("#recent_appts").html(appt_html);
			}
		})


	})

	$("#right_menu").click(function(){
	  	document.getElementById("mySidenav").style.width = "250px";
	  	$('#mask').fadeIn(1000);	
		
	})

	$(".closebtn").click(function() {
	  document.getElementById("mySidenav").style.width = "0";
	  $('#mask').fadeOut(1000);
	});

	$('#mask').click(function(){
		document.getElementById("mySidenav").style.width = "0";
	  	$('#mask').fadeOut(1000);
	})

	$("#status .btn-on").click(function(){	
		//alert("ok"); UPCOMMING
		$("#upcommong_appts").show();
		$("#recent_appts").hide();
	})
	$("#status .btn-off").click(function(){
		//alert("ok"); Recent
		$("#upcommong_appts").hide();
		$("#recent_appts").show();
	})

//============== page 7 =======================//
//=============================================//

	$('#slider1').owlCarousel({
        margin: 10,
        loop: true,
        autoplay:true,
        autoplayTimeout:2000,
        autoplayHoverPause: true, 
        smartSpeed: 450,
        dots:false,
        rtl: true
      })
      $('#slider2').owlCarousel({
        margin: 10,
        loop: true,
        autoplay:true,
        autoplayTimeout:2000,
        autoplayHoverPause: true,
        dots:false, 
        rtl: false
      })
      $('#slider3').owlCarousel({
        margin: 10,
        loop: true,
        autoplay:true,
        autoplayTimeout:2000,
        autoplayHoverPause: true, 
        dots:false,
        rtl: true
      })
});

function slideBaby(link) {
    var options = {
    	"direction": 'left',
	    "duration": 300,
	    "href" : link
    };
    window.plugins.nativepagetransitions.slide(
      options,
      function (msg) {console.log("SUCCESS: " + JSON.stringify(msg))},
      function (msg) {console.log("ERROR: "   + JSON.stringify(msg))}
    );
  }

  function slideBabyRight(link) {
    var options = {
    	"direction": 'right',
	    "duration": 300,
	    "href" : link
    };
    window.plugins.nativepagetransitions.slide(
      options,
      function (msg) {console.log("SUCCESS: " + JSON.stringify(msg))},
      function (msg) {console.log("ERROR: "   + JSON.stringify(msg))}
    );
  }

function check_msg_subscription(doc_id)
{
	$.post( api_url+"get_text_chat_details.php", {func: "check_subscription_validity", user_id: storage.getItem("logged_user_id")})
	.done(function(data){
		console.log(data);
 		//alert(data);
 		data = JSON.parse(data);
 		if(data.success)
 		{
 			window.location.href="patient-chat24.html?id="+doc_id;
 		}
 		else
 		{
 			window.location.href="message-subscription25.html?id="+doc_id;
 		}
 	})
}
