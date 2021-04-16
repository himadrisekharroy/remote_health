$( document ).ready(function() {
	var urlParams = new URLSearchParams(window.location.search)
	var id = urlParams.get('id');

	// if(storage.getItem("logged_user_type") == 'd') 
	// 	{
			$("#page_title").html('Doctor');			
		// }
  // 		else if(storage.getItem("logged_user_type") == 'jd')
		// { 
		// 	$("#page_title").html('Doctor');			
		// }
  // 		else
  // 		{
  // 			$("#page_title").html('Nurse');	  			
  // 		} 


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


	 	if(storage.getItem("logged_user_type") == 'd')
	 		$("#doc_name").html("Dr. "+ data.data.f_name+ " " +data.data.l_name);
	 	else if(storage.getItem("logged_user_type") == 'jd')
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
		
		$("#back_doc_details").attr("href","doctor-profile10.html?id="+id);
		if(storage.getItem("logged_user_type") == 'd')
			$("#back_doc_details").attr("href","doctor-view-profile29.html");

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
		call_view_review(id);
	});

	function call_view_review(id)
	{
	$.post( api_url+"get_doctor_details.php", {func: "view_review", doc_id: id})
	.done(function(data){
		console.log(data);
	 	data = JSON.parse(data);
	 	var reviewHtml ="";
	 	i=1;
	 	for(var key in data.data)
		{
			ratingHtml ="";
			ratingValue = data.data[key].rating;
			ratingValue = parseInt(ratingValue);

			for( var x = 1 ;x <= ratingValue; x++)
			{
				ratingHtml +='<img src="images/star.png" class="star">';
			}

			var image = data.data[key].image;
			 if(!image) image = "avatar.png";

			reviewHtml += '<div class="row faded_backcolor timing-fees">';
			reviewHtml += '		<div class="col-3 text-center" > ';
			reviewHtml += '			<img src="'+site_url+'images/user_images/'+image +'" class="img-reponsive img-rounded" style="width: 70px;">';
			reviewHtml += '		</div>';
			reviewHtml += '		<div class="col-9 text-left">';
			reviewHtml += '			<b>'+data.data[key].f_name+" "+data.data[key].l_name+'</b><br/>';
			reviewHtml += '			<small>'+ ratingHtml +'</small><br/>';			
			reviewHtml += '			<small id="visit">'+data.data[key].comments+'</small>';
			reviewHtml += '		</div>';
			reviewHtml += '	</div>';
			i++;
		}
		if(i==1)
		{
			reviewHtml +='<div class="alert alert-danger">';
			reviewHtml +='  <strong>Oops!</strong> No review found....';
			reviewHtml +='</div>'
		}
		$("#review_list").html(reviewHtml);
 	})
	}
}) 
 
