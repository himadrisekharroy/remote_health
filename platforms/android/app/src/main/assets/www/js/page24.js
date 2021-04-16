 $( document ).ready(function() {
	var urlParams = new URLSearchParams(window.location.search);

	var id = urlParams.get('id');

	$.post( api_url+"get_doctor_details.php", {func: "get_doctor_data_by_id", doc_id: id})
		.done(function(data){
		console.log(data);
	 	data = JSON.parse(data);
	 	
	 	var sex = "";
	 	if(data.data.sex == "m") sex = "Male";
	 	else if(data.data.sex == "f") sex = "Female";
	 	
	 	var image =data.data.image;
	 	if(!image) image = "no-doctor.png";
	 	
	 	image = site_url+'images/doctor_image/'+image;

	 	if(data.data.type == 'd')
	 		$("#doc_name").html("Dr. "+ data.data.f_name+ " " +data.data.l_name);
	 	else if(data.data.type == 'jd')
	 		$("#doc_name").html("Dr. "+ data.data.f_name+ " " +data.data.l_name);
	 	else
	 		$("#doc_name").html( data.data.f_name+ " " +data.data.l_name);

	 	$("#spec").html(data.data.specialization_title);
	 	$("#visit").html("Rs. "+ data.data.per_visit_change+"/-");
	 	$("#desig").html(data.data.designation);
	 	$("#age_sex").html(data.data.age +"Yr &nbsp; "+ sex);
		$("#email").html(data.data.email_id);
		$("#about_doctor_text").html(data.data.about);
		$("#doc_img").attr("src", image);

		$("#rate_review").attr("href","doctor-review-form17.html?id="+id);
		$("#view_review").attr("href", "view-review23.html?id="+id);

		var reviewCount = 0;
		var ratingValue = 0;
		for(var key in data.data.review)
		{
			ratingValue = ratingValue + parseInt(data.data.review[key].rating);
			reviewCount++;
		}
		
		ratingValue = ratingValue/reviewCount;
		ratingValue = parseInt(ratingValue);
		
		if(!ratingValue ) ratingValue = 1;
		
		ratingHtml ="";
		for( var x = 1 ;x <= ratingValue; x++)
		{
			ratingHtml +='<img src="images/star.png" class="star">';
		}
		$("#rating_star").html(ratingHtml);

		$("#docsec_loading").hide();
		$("#docsec").slideDown();
	});

	$.post( api_url+"get_text_chat_details.php", {func: "check_subscription_validity", user_id: storage.getItem("logged_user_id")})
	.done(function(data){
		console.log(data);
 		//alert(data);
 		data = JSON.parse(data);
 		if(data.success)
 		{ 			
 			readChat('1st_time');
 		}
 		else
 		{
 			window.location.href="message-subscription25.html?id="+id; // this is actuallly doctor id
 		}
 	})

	$("#back_to_user_page7").click(function(){
		slideBabyRight("user_page7.html");
	})
  		//alert($('#content_screen')[0].scrollHeight);
   		//$('#chat_message').scrollTop($('#chat_message')[0].scrollHeight);
   		//$('#content_screen').scrollTop($('#content_screen')[0].scrollHeight);

   $("#submit_chat").click(function(){
   		$('#chat_message_input').focus();
   		if($('#chat_message_input').val())
   			sendChat();
   })

   	$('#chat_message_input').keydown(function(event) {    
   		if (event.keyCode == 13) {
   			if($('#chat_message_input').val())
      			sendChat();
      		return false;
   		}
   	 });

    function sendChat()
    {
    	if($("#chat_message_input").val())
    	{
    		$.post( api_url+"get_text_chat_details.php", 
   			{
   				func: "save_message", 
   				user_id: storage.getItem("logged_user_id"),
   				doc_id:id,
   				msg: $("#chat_message_input").val(),
   				type:"u"
   			})
			.done(function(data){
			console.log(data);
	 		
			$("#chat_message_input").val("");
			$("#chat_message_input").blur();
	 		dataInner = JSON.parse(data);

	 		var chat_message = "";
			for(var key in dataInner.chat)
	 		{
	 			var d = new Date((dataInner.chat[key].time)*1000);
	 			var timeStr = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes();
	 				
	 			if(dataInner.chat[key].type == 'u')
	 			{	 				
	 				chat_message += '<div class="message darker">';
			  		chat_message += '<img src="'+site_url+"images/user_images/"+dataInner.uimage+'" alt="Avatar" class="right" style="width:100%;">';
			  		chat_message += '<p>'+dataInner.chat[key].msg+'</p>';
			  		chat_message += '<span class="time-left">'+timeStr+'</span>';
					chat_message += '</div>'
	 			}
	 			else
	 			{
	 				chat_message += '<div class="message">';
					chat_message += '	<img src="'+site_url+"images/doctor_image/"+dataInner.dimage+'" alt="Avatar" style="width:100%;">';
					chat_message += '  	<p>'+dataInner.chat[key].msg+'</p>';
					chat_message += '  	<span class="time-right">'+timeStr+'</span>';
					chat_message += '</div>';
	 			}
	 		}
			$("#chat_message").html(chat_message);
			$('.chat_message').height(parseInt($(document).height())-350);

			var height = 0;
			$('.message').each(function(i, value){
			    height += parseInt($(this).height());
			});

			height += '';
			$('.chat_message').scrollTop(999999);
	 		})
		}
    }

    function readChat(call_time){
    	$.post( api_url+"get_text_chat_details.php", {
					func: "get_message", 
					user_id: storage.getItem("logged_user_id"),
					doc_id:id,
					logged_user_type: storage.getItem("logged_user_type"),
					call_time: call_time
				})
		.done(function(dataInner){
			console.log(dataInner);
			dataInner = JSON.parse(dataInner);

			var chat_message = "";
			for(var key in dataInner.chat)
	 		{
	 			var d = new Date((dataInner.chat[key].time)*1000);
	 			var timeStr = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes();
	 				
	 			if(dataInner.chat[key].type == 'u')
	 			{		 				
	 				chat_message += '<div class="message darker">';
			  		chat_message += '<img src="'+site_url+"images/user_images/"+dataInner.uimage+'" alt="Avatar" class="right" style="width:100%;">';
			  		chat_message += '<p>'+dataInner.chat[key].msg+'</p>';
			  		chat_message += '<span class="time-left">'+timeStr+'</span>';
					chat_message += '</div>'
	 			}
	 			else
	 			{
	 				chat_message += '<div class="message">';
					chat_message += '	<img src="'+site_url+"images/doctor_image/"+dataInner.dimage+'" alt="Avatar" style="width:100%;">';
					chat_message += '  	<p>'+dataInner.chat[key].msg+'</p>';
					chat_message += '  	<span class="time-right">'+timeStr+'</span>';
					chat_message += '</div>';
	 			}
	 		}
			$("#chat_message").html(chat_message);

			$('.chat_message').height(parseInt($(document).height())-350);

			// var height = 0;
			// $('.message').each(function(i, value){
			//     height += parseInt($(this).height());
			// });

			// height += '';
			//if(call_time !='not_1st_time')
				$('.chat_message').scrollTop(9999999);

			setTimeout(function(){ 
				 readChat('not_1st_time');
			}, 6000);
		})
    }




});