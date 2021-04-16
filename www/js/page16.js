$( document ).ready(function() {
	$('.mask').fadeIn(1000);	
	$('.mask').fadeTo("slow",0.8);	

	$("#doctor_id").val(storage.getItem("logged_user_id"));

	$("#user_image").attr("src",site_url+'images/doctor_image/'+storage.getItem("logged_user_image"));

	$("#showUploadOptions").click(function(){
	    		$("#showUploadContainer").slideToggle();
	    	})

	$("#doctor_signup_btn").prop('disabled', true); 


	$("#imageUpload").click(function() {
		fileChooser.open( function(file) {
            $(".alert-warning").slideDown();
        	$("#user_image").attr("src", file);
    		var imageURI = file;

			var options = new FileUploadOptions();
        	options.fileKey = "file";
        	options.fileName = "doctor_"+storage.getItem("logged_user_id")+".jpg";
        	options.mimeType = "image/jpeg";

        	var params = {};
            params.user_id = storage.getItem("logged_user_id");
            params.func = "user_change_image";

            options.params = params;
            options.chunkedMode = false;

        	var ft = new FileTransfer();
        	ft.upload(imageURI, api_url+"get_doctor_details.php", function(result){
	        	//alert('successfully uploaded ' + result.response);
	        	//console.log("at fileupload");
	        	console.log(result.response);

	        	data = JSON.parse(result.response);
			    if(data.success){
			    	localStorage.setItem('logged_user_image', data.image);
				   	$(".alert-success").html("<strong>Success:</strong>"+ data.msg).slideDown();
					setTimeout(function(){						    
					    $(".alert-success").slideUp();
						   
						}, 3000);
				}
			    else
			    {
			    	$(".alert-danger").html("<strong>Error:</strong>"+ data.msg).slideDown();
					setTimeout(function(){
					   $(".alert-danger").slideUp();
					}, 3000);
			    }
			}, function(error){
        		console.log(error);
            	//alert('error : ' + JSON.stringify(error));
            	$(".alert-danger").html("<strong>Error:</strong>"+ error).slideDown();
		    	$(".alert-warning").hide();
		    	$(".alert-success").hide()
		    	setTimeout(function(){
				   $(".alert-danger").slideUp();
				}, 3000);

        	}, options);
		},function(){
        	$(".alert-danger").html("<strong>Error:</strong> Upload proper image." ).slideDown();
					setTimeout(function(){
					   $(".alert-danger").slideUp();
					}, 3000);
        	
        });
	});

	var captureSuccess = function(mediaFiles) {
	    var i, path, len;
	    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
	        path = mediaFiles[i].fullPath;
	        // do something interesting with the file
	        $("#user_image").attr("src", path);
	        $("#is_image_changed").val(1); 
	        alert("okkyyyy");
	    }
	};

	// capture error callback
	var captureError = function(error) {
	    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
	    $("#is_image_changed").val(0); 
	};

	$("#imageCapture").click(function(){
		 var options = {
	        // Some common settings are 20, 50, and 100
	        quality: 80,
	        destinationType: Camera.DestinationType.FILE_URI,
	        // In this app, dynamically set the picture source, Camera or photo gallery
	        sourceType: Camera.PictureSourceType.CAMERA,
	        encodingType: Camera.EncodingType.JPEG,
	        mediaType: Camera.MediaType.PICTURE,
	        allowEdit: true,
	        correctOrientation: true  //Corrects Android orientation quirks
	    }
		
		navigator.camera.getPicture(
			function cameraSuccess(imageUri) {
		        $("#user_image").attr("src", imageUri);//
		        $(".alert-warning").slideDown();

	    		var imageURI = imageUri;

				var options = new FileUploadOptions();
	        	options.fileKey = "file";
	        	options.fileName = "doctor_"+storage.getItem("logged_user_id")+".jpg";
	        	options.mimeType = "image/jpeg";

	        	var params = {};
	            params.user_id = storage.getItem("logged_user_id");
	            params.func = "user_change_image";

	            options.params = params;
	            options.chunkedMode = false;

	        	var ft = new FileTransfer();
	        	ft.upload(imageURI, api_url+"get_doctor_details.php", function(result){
		        	//alert('successfully uploaded ' + result.response);
		        	//console.log("at fileupload");
		        	console.log(result.response);

		        	data = JSON.parse(result.response);
				    if(data.success){
				    	localStorage.setItem('logged_user_image', data.image);
					   	$(".alert-success").html("<strong>Success:</strong>"+ data.msg).slideDown();
						setTimeout(function(){						    
						    $(".alert-success").slideUp();
							    
							}, 3000);
					}
				    else
				    {
				    	$(".alert-danger").html("<strong>Error:</strong>"+ data.msg).slideDown();
						setTimeout(function(){
						   $(".alert-danger").slideUp();
						}, 3000);
				    }
				}, function(error){
	        		console.log(error);
	            	//alert('error : ' + JSON.stringify(error));
	            	$(".alert-danger").html("<strong>Error:</strong>"+ error).slideDown();
			    	$(".alert-warning").hide();
			    	$(".alert-success").hide()
			    	setTimeout(function(){
					   $(".alert-danger").slideUp();
					}, 3000);

	        	}, options);

		    }, 
		    function cameraError(error) {
		        console.debug("Unable to obtain picture: " + error, "app");
		        $("#is_image_changed").val(0); 
		    }, options);
	})

	function onSuccess(path) {
		$("#user_image").attr("src", path);
	}

	function onSuccess() {
	    console.log("Camera cleanup success.")
	}

	function onFail(message) {
	    alert('Failed because: ' + message);
	}
	


	$.post( api_url+"get_doctor_details.php", { func:"specialization_list"})
	.done(function(data){
        //alert(data);
        data = JSON.parse(data);
        for(var key in data.data)
        {
           $("#specialization_id").append(new Option(data.data[key]['title'], data.data[key]['id']));
        }
    
        $.post( api_url+"get_doctor_details.php", { func:"language_known"})
	     .done(function(data){
	        //alert(data);
	        data = JSON.parse(data);
	        var lang_html_str="";
	        for(var key in data.data)
	        {
	        	lang_html_str +='<div class="form-check-inline">';
				lang_html_str +='<label class="form-check-label">';
				lang_html_str +='<input type="checkbox" class="form-check-input" name="lang[]" value="'+data.data[key]['id']+'">'+ data.data[key]['title'];
				lang_html_str +='</label>';
				lang_html_str +='</div>';

	           $("#lang_html").html(lang_html_str);
	        }
	        
	        $.post( api_url+"get_doctor_details.php", 
	    	{ 	
	    		func:"get_doctor_data_by_id", 
	    		doc_id:storage.getItem("logged_user_id")
	    	})
			.done(function(data){
				var res = data.data;
				//console.log(data);
				$(".mask").hide();
				data = JSON.parse(data);
				$("#f_name").val(data.data.f_name);
				$("#l_name").val(data.data.l_name);
				$("#email").val(data.data.email_id);
				$("#dob").val(data.data.dob);
				$("#mobile").val(data.data.mobile);
				$('input[name="sex"][value="' + data.data.sex+ '"]').prop('checked', true);				
				$("#physician_id").val(data.data.phy_id);
				$("#designation").val(data.data.designation);
				$("#specialization_id").val(data.data.specialization_id);
				$("#about").val(data.data.about);    				
				$("#uploaded_cerificate_link").html(data.data.certificate);
				$("#uploaded_cerificate_link").attr("href",site_url+"certificate/"+data.data.certificate);
				$("#doctor_signup_btn").prop('disabled', false);

				var language_known_ids = data.data.language_known_ids;
				language_known_ids = language_known_ids.split(",");
				for(var key in language_known_ids)
	        	{
	        		var lang = language_known_ids[key].trim();
	        		console.log(lang);
	        		$('input[name="lang[]"][value="' + lang + '"]').attr('checked', true);	
	        	}
				
			})
		})
    })


	$("#doctor_edit_profile_form").submit(function(e){
		e.preventDefault();
		$(".alert").hide();

		if($('#lang_html :checkbox:checked').length > 0)
		{
			var formdata = new FormData($('#doctor_edit_profile_form')[0]);

			$(".alert-warning").slideDown();
			$("#doctor_signup_btn").prop('disabled', true);

			$.ajax({
				url         : api_url+"get_doctor_details.php",
				data        : formdata,// ? formdata : $("#form_sample_1").serialize(),
				cache       : false,
				contentType : false,
				processData : false,
				enctype: 'multipart/form-data',
				type        : 'POST',
				success     : function(data, textStatus, jqXHR){
					console.log(data);
					data = JSON.parse(data);
					$(".alert").hide();
					$("#doctor_signup_btn").prop('disabled', false);

					if(data.success)
					{
						$(".alert-success").html("<strong>Success:</strong>"+ data.msg).slideDown();
						setTimeout(function(){						    
						    $(".alert-success").slideUp();
						    window.location.reload();
						}, 3000);
					}
					else
					{
						$(".alert-danger").html("<strong>Error:</strong>"+ data.msg).slideDown();
						setTimeout(function(){
						   $(".alert-danger").slideUp();
						}, 3000);
					}				
				}
			});
		}
		else
		{
			$(".alert").hide();
			$(".alert-danger").html("<strong>Error:</strong> Please select known languages.").slideDown();
			$("#doctor_signup_btn").prop('disabled', false);
		}
	}) 
})
