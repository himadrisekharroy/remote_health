var urlParams = new URLSearchParams(window.location.search)
var app_id = urlParams.get('app_id');

$("#app_id").val(app_id);

$("#doctor_images_show").html('<img src="'+site_url+'images/doctor_image/'+storage.getItem("logged_user_image")+'" width="50">');

$.post( api_url+"get_video_chat_details.php", {func: "get_user_details_by_app_id", app_id: app_id})
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
	 		//console.log(data.data.file)
	 		if(!data.data.file)
	 		{
	 			var msg = '<div class="alert alert-danger">';
	 			msg +=	  '<strong>Warning!</strong> No Prescription / Medication / Advice file found.</div>';
	 			$("#pres_link").html(msg);
	 		}
	 		else
	 		{
 				var file_link_html = '<div class="button1">';
				file_link_html += '<a href="javascript:void(0)" onclick="download_pres(\''+ data.data.file_link+'\');">View File</a>';
				file_link_html += '</div>';

			   	$("#pres_link").html(file_link_html);
	 			
	 		}
	 	}
	 	else
	 	{

	 	}
 	})

$("#back_to_doctor_page27").click(function(){
	slideBabyRight("doctor_page27.html");
})

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
        //$("#user_image").attr("src", imageUri);//
        $(".alert-warning").slideDown();

		var imageURI = imageUri;

		var options = new FileUploadOptions();
    	options.fileKey = "file";
    	options.fileName = "pres_"+app_id+".jpg";
    	options.mimeType = "image/jpeg";

    	var params = {};
        params.app_id = $("#app_id").val();;
        params.func = "save_prescription";

        options.params = params;
        options.chunkedMode = false;

    	var ft = new FileTransfer();
    	ft.upload(imageURI, api_url+"get_video_chat_details.php", function(result){
        	//alert('successfully uploaded ' + result.response);
        	//console.log("at fileupload");
        	console.log(result.response);

        	data = JSON.parse(result.response);
		    if(data.success){
		    	
			   	$(".alert-success").html("<strong>Success:</strong>"+ data.msg).slideDown();
			   	$(".alert-warning").hide();
		   		var file_link_html = '<div class="button1">';
				file_link_html += '<a href="javascript:void(0)" onclick="download_pres(\''+ data.file_link+'\');">View File</a>';
				file_link_html += '</div>';

			   	$("#pres_link").html(file_link_html);
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
    }, options);
})

//====================================================================//
//====================================================================//

$("#imageUpload").click(function() {
	fileChooser.open( function(file) {
        $(".alert-warning").slideDown();
    	//$("#user_image").attr("src", file);
		var imageURI = file;
		
		//console.log(file);

		window.FilePath.resolveNativePath(
			file, 
			function(orgFile){
				var orgFile = orgFile.split('/').pop(); 
				//console.log(orgFile);

				var options = new FileUploadOptions();
		    	options.fileKey = "file";
		    	options.fileName = imageURI;
		    	//options.mimeType = "image/jpeg";

		    	var params = {};
		        params.app_id = $("#app_id").val();
		        params.orgFile = orgFile;
		        params.func = "save_prescription";

		        options.params = params;
		        options.chunkedMode = false;

		    	var ft = new FileTransfer();
		    	ft.upload(imageURI, api_url+"get_video_chat_details.php", function(result){
		        	//alert('successfully uploaded ' + result.response);
		        	//console.log("at fileupload");
		        	//console.log(result.response);

		        	data = JSON.parse(result.response);
				    if(data.success){
				    	
					   	$(".alert-success").html("<strong>Success:</strong>"+ data.msg).slideDown();
					   	$(".alert-warning").hide();
					   	var file_link_html = '<div class="button1">';
    					file_link_html += '<a href="javascript:void(0)" onclick="download_pres(\''+ data.file_link+'\');">View File</a>';
    					file_link_html += '</div>';

					   	$("#pres_link").html(file_link_html);
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
			function(){
		    	alert("File path error.");
		    });

		}, function(){
			$(".alert-danger").html("<strong>Error:</strong> Upload proper file." ).slideDown();
				setTimeout(function(){
				   $(".alert-danger").slideUp();
				}, 3000);		    	
		});
		
});

function download_pres(base_pres)
{
	window.open("http://remotehealth.org/doctor-prescription?" + base_pres, '_system'); 
	return false;
}