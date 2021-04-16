 $( document ).ready(function() {

 	var selected_doctor_ids = [];

 	$("#search_doctor").focus(function(){
		$("#search_content").show();
		$("#non_search_content").hide();
	})

 	$("#search_doctor").focusout(function() {
 		if($("#search_doctor").val() == "" )
 		{
 			var html = '<div class="alert alert-warning" style="padding-top: 10px;">';
			html +=  '<strong>Search !!! </strong> Use Name, Designation, Mobile No, Email ';
			html +='</div>';
 			$("#search_content").hide().html("");
			$("#non_search_content").show();	
 		}
 		
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
		 				
						html_str += '<li class="list-group-item" id="list-group-item_'+data.data[key].id+'">';			                    	
					    html_str +=                	'<div class="row doctor-details">';                   		
						html_str +=                    	'<div class="col-2 doctors">';
						html_str +=			             	'<img src="'+site_url+'images/doctor_image/'+data.data[key].image+'"  class="img-reponsive img-rounded" />';
						html_str +=			           	'</div>';
						html_str +=			           	'<div class="col-8">';
						html_str +=			           		'<b style="text-transform:uppercase">Dr. '+data.data[key].f_name+' '+data.data[key].l_name+'</b><br/>';
						html_str +=			           		'<small>'+data.data[key].designation+'</small><br/>';						
						html_str +=			           		'<small>Fees: Rs. '+data.data[key].per_visit_change+'/-</small><br/>';
						html_str +=			           		'<small>Language Known: '+data.data[key].language_known+'</small><br/>';
						html_str +=			           	'</div>';						
						html_str +=			           	'<div class="col-2">';	
						html_str +=							'<input type="checkbox" name="share_doc_id" value="'+ data.data[key].id +'" id="share_doc_id_'+ data.data[key].id +'">';					
						html_str +=			           '</div>';
						html_str +=			       	'</div>';
						html_str += '</li>';
					}

					html_str +='</ul>';
			 	}
			 	$("#search_content").html(html_str).find(".list-group-item").on("click", function(){
					var id = $(this).attr("id");
					id = id.replace("list-group-item_", "");

					if($("#share_doc_id_"+ id). prop("checked") == true)
					{
						$(this).removeClass("doctor_selected");
						$("#share_doc_id_"+ id).prop('checked', false);
						var index = selected_doctor_ids.indexOf(id);
 
					    if (index > -1) {
					       selected_doctor_ids.splice(index, 1);
					    }
					}
					else
					{
						$(this).addClass("doctor_selected");
						$("#share_doc_id_"+ id).prop('checked', true);

						selected_doctor_ids.push(id);
					}

				});
			})
		}
	})

 	$.get( api_url+"get_user_details.php", {func: "share_health_info_doc_ids", user_id: storage.getItem("logged_user_id")})
 	.done(function(data){
 		console.log(data);
 		data = JSON.parse(data);
 		for(var key in data.data)
	 	{
 			selected_doctor_ids.push(data.data[key]);
 		}
 		console.log(selected_doctor_ids);
 	})

	$.get( api_url+"get_doctor_details.php", {func: "get_specialization"})
	 	.done(function(data){
	 	data = JSON.parse(data);

	 	var html_str = '<ul class="list-group">';

	 	for(var key in data.data)
	 	{
	 		html_str += '<li class="list-group-item" data-target="#sub'+data.data[key].id +'">';
			html_str +=    	'<span class="specialization">';
			html_str += 		'<img src="images/cardio.png"  class="img-reponsive img-rounded" />';
			html_str +=	    '</span>';
			html_str +=	    '<a href="javascript:void(0)" class="list-group-item-a" id="shd'+ data.data[key].id +'">'+data.data[key].title+'</a>';
			html_str +=		'<ul class="list-group inner collapse" id="sub'+ data.data[key].id +'">';
			html_str +=		'<li class="list-group-item"> Please Wait </li>';
			html_str +=		'</ul>'
			html_str += '</li>';
	 	}
	 	html_str +="</ul>";
		$("#specialization_container").html(html_str).find(".list-group-item-a").on('click', function () {
			//alert( "Data Loaded: " + $(this).attr("id") );
			$(".collapse").slideUp();

			var id = $(this).attr("id");
			id = id.replace("shd", "");
			
			$("#sub"+id).slideDown();


            loadDoctor($(this).attr("id"));            
        });;
	  	
	});

 	function loadDoctor(id)
	{
		id = id.replace("shd", "");

		$.post( api_url+"get_doctor_details.php", {func: "get_specialist_doctor", specialization_id: id})
			.done(function(data){
			//	console.log(data);
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
			 		var class_name = "";
			 		var check = "";
			 		console.log(selected_doctor_ids);
			 		console.log(selected_doctor_ids.indexOf(data.data[key].id));

			 		if(selected_doctor_ids.indexOf(data.data[key].id) >= 0 )
			 		{
			 			class_name = "doctor_selected";
			 			check = "checked";
			 		}

			 		html_str += '<li class="list-group-item '+class_name+'" id="list-group-item_'+data.data[key].id+'">';			                    	
				    html_str +=                	'<div class="row doctor-details">';                   		
					html_str +=                    	'<div class="col-2 doctors">';
					html_str +=			             	'<img src="'+site_url+'images/doctor_image/'+data.data[key].image+'"  class="img-reponsive img-rounded" />';
					html_str +=			           	'</div>';
					html_str +=			           	'<div class="col-8">';
					html_str +=			           		'<b style="text-transform:uppercase">Dr. '+data.data[key].f_name+' '+data.data[key].l_name+'</b><br/>';
					html_str +=			           		'<small>'+data.data[key].designation+'</small><br/>';					
					html_str +=			           		'<small>Fees: Rs. '+data.per_visit_change+'/-</small><br/>';
					html_str +=			           		'<small>Language Known: '+data.data[key].language_known+'</small><br/>';
					html_str +=			           	'</div>';
					html_str +=			           	'<div class="col-2">';	
					html_str +=							'<input type="checkbox" name="share_doc_id" value="'+ data.data[key].id +'" id="share_doc_id_'+ data.data[key].id +'" '+check+'>';
					html_str +=			           '</div>';
					html_str +=			       	'</div>';					
					html_str += '</li>';
			 	}
			}
			$("#sub"+id).html(html_str).find(".list-group-item").on("click", function(){
				var id = $(this).attr("id");
				id = id.replace("list-group-item_", "");

				if($("#share_doc_id_"+ id). prop("checked") == true)
				{
					$(this).removeClass("doctor_selected");
					$("#share_doc_id_"+ id).prop('checked', false);
					var index = selected_doctor_ids.indexOf(id);
 
				    if (index > -1) {
				       selected_doctor_ids.splice(index, 1);
				    }
				}
				else
				{
					$(this).addClass("doctor_selected");
					$("#share_doc_id_"+ id).prop('checked', true);
					selected_doctor_ids.push(id);
				}

			});
		 })
	}

	$("#share_btn").click(function(){
		if(selected_doctor_ids.length > 0)
		{
			$("#share_btn_wait").show();
			$("#share_btn").hide();

			$.post( api_url+"get_user_details.php", 
			{ 
				user_id: storage.getItem("logged_user_id"),
				selected_doctor_ids: selected_doctor_ids, 
				func:"share_health_info"
			})
		  	.done(function( data ) {
		  		data = JSON.parse(data);
		  		if(data.success)
		  		{
		  			alert(data.msg);
		  			$("#share_btn_wait").hide();
					$("#share_btn").show();
		  			window.location.href="user_page7.html";
		  		}
		  		
		  	})
		}
		else
		{
			alert("Please Choose at-least one Doctor.");
		}
	})
 })