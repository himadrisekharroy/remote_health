$( document ).ready(function() {
	var urlParams = new URLSearchParams(window.location.search);
	var appt_id = urlParams.get('appt_id');

	$.post( api_url+"get_video_chat_details.php", 
	{ 
		func: "user_initiate_chat", 
		appt_id: appt_id,
		user_id: storage.getItem("logged_user_id")
	})
	.done(function(data){
		console.log(data);
	    data = JSON.parse(data);
	    if(data.success)
	    {
	    	$("#video_chat_window").show();
	    	$("#loading_img").hide();
	    	$("#lert-danger").hide();

	    }
		else
		{

		}
	})
}) 
