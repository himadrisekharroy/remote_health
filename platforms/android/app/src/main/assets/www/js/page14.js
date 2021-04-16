 $("#contact_form").submit(function(e){
	e.preventDefault();
	$("#contact_submit_btn").prop('disabled', true);
	$(".alert-success").slideUp();
	$(".alert-danger").slideUp();
	$.post( api_url+"contact_us_details.php", 
	{ 
		contact_us_name: $("#contact_us_name").val(), 
		contact_us_email: $("#contact_us_email").val(), 
		contact_us_comments: $("#contact_us_comments").val(), 
		contact_us_ph:$("#contact_us_ph").val(),
		func:"contact_submit"
	})
	.done(function(data){
		console.log(data);
	    data = JSON.parse(data);
	    if(data.success)
	    {
	    	$(".alert-success").html("<strong>Success:</strong> "+ data.msg).slideDown();
	    	$("#contact_us_name").val("");
	    	$("#contact_us_email").val("");
	    	$("#contact_us_comments").val(""); 
	    	$("#contact_us_ph").val(""); 
	    }
	    else
	    {
	    	$(".alert-danger").html("<strong>Error:</strong> "+ data.msg).slideDown();
	    	
	    	$("#contact_submit_btn").prop('disabled', false);	    	
	    }
	})
})
