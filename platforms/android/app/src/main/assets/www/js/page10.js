$( document ).ready(function() {
	var urlParams = new URLSearchParams(window.location.search)
	var id = urlParams.get('id');
	$.post( api_url+"get_doctor_details.php", {func: "get_doctor_data_by_id", doc_id: id})
		.done(function(data){
			//console.log(data);
	 	data = JSON.parse(data);
	 	
	 	var sex = "";
	 	if(data.data.sex == "m") sex = "Male";
	 	else if(data.data.sex == "f") sex = "Female";
	 	
	 	var image =data.data.image;
	 	if(!image) image = "no-doctor.png";
	 	
	 	image = site_url+'images/doctor_image/'+image;
	 	
	 	if(data.data.type== 'd')
	 		$("#doc_name").html("Dr. "+ data.data.f_name+ " " +data.data.l_name);
	 	else if(data.data.type == 'jd')
	 		$("#doc_name").html("Dr. "+ data.data.f_name+ " " +data.data.l_name);
	 	else
	 		$("#doc_name").html(data.data.f_name+ " " +data.data.l_name);

	 	$("#spec").html(data.data.specialization_title);
	 	$("#visit").html("Rs. "+ data.data.per_visit_change+"/-");
	 	$("#desig").html(data.data.designation);
	 	$("#age_sex").html(data.data.age +"Yr &nbsp; "+ sex);
		$("#email").html(data.data.email_id);
		$("#about_doctor_text").html(data.data.about);
		$("#doc_img").attr("src", image);
		$("#language_known").html(data.data.language_known);
		
		$("#rate_review").attr("href","doctor-review-form17.html?id="+id);
		$("#view_review").attr("href", "view-review23.html?id="+id);
		$("#app_book_link").attr("href","user_app_book32.html?id="+id);
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

		$("#loading_screen").hide();
		$("#content_screen").slideDown();
	});

	$.post( api_url+"get_text_chat_details.php", {func: "get_chat_timimg_by_doc_id", doc_id: id})
	.done(function(data){
		data = JSON.parse(data);
		if(data.success)
 		{
 			var htmlStr = "";
	 		for(var key in data.data)
			{
				var timimgStr = [];
				for(var inner_key in data.data[key])
				{
					var start_time = data.data[key][inner_key].start_time ;
					var end_time = data.data[key][inner_key].end_time;

					start_time = start_time.split(":").slice(0,-1).join(':');
					end_time = end_time.split(":").slice(0,-1).join(':');

					
					var set = start_time +" - "+ end_time;
					timimgStr.push(set);
				}

				timimgStr = timimgStr.join(" , <br/> ");

				htmlStr += '<small><b>'+getWeekDay(key) +': </b>'+timimgStr+'</small><br/>';
			}
			$("#chat_timimg").html(htmlStr);
 		}
 		else
 		{
 			$("#chat_timimg").html(data.msg);
 		}
		
	})

	$.post( api_url+"get_video_chat_details.php", {func: "get_chat_timimg_by_doc_id", doc_id: id})
	.done(function(data){
		data = JSON.parse(data);
		if(data.success)
 		{
 			var htmlStr = "";
	 		for(var key in data.data)
			{
				var timimgStr = [];
				for(var inner_key in data.data[key])
				{
					var start_time = data.data[key][inner_key].start_time ;
					var end_time = data.data[key][inner_key].end_time;

					start_time = start_time.split(":").slice(0,-1).join(':');
					end_time = end_time.split(":").slice(0,-1).join(':');

					
					var set = start_time +" - "+ end_time;
					timimgStr.push(set);
				}

				timimgStr = timimgStr.join(", <br/> ");

				htmlStr += '<small><b>'+getWeekDay(key) +': </b>'+timimgStr+'</small><br/>';
			}
			$("#video_timimg").html(htmlStr);
 		}
 		else
 		{
 			$("#video_timimg").html(data.msg);
 		}
		
	})

	$("#back_to_user_page7").click(function(){
		slideBabyRight("user_page7.html");
	})

	$("#trans_to_chat").click(function(){
		// check if seubscribe
		check_msg_subscription(id);  // go to script.js
			
	})
	function getWeekDay(day){			    
	    var weekdays = new Array(
	        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	    );	    
	    //var day = date.getDay();	    
	    return weekdays[day];
	}
}) 