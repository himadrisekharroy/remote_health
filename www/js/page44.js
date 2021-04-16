var urlParams = new URLSearchParams(window.location.search)
var app_id = urlParams.get('app_id');

$.post( api_url+"get_doctor_details.php", { func:"specialization_list"})
     .done(function(data){
        //alert(data);
        data = JSON.parse(data);
        for(var key in data.data)
        {
           $("#specialization_id").append(new Option(data.data[key]['title'], data.data[key]['id']));
        }
        $("#doctor_signup_btn").prop('disabled', false);
    })

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
        $("#doctor_signup_btn").prop('disabled', false);
    })

    $.post( api_url+"get_doctor_details.php", { func:"nurse_provided_service"})
     .done(function(data){
        console.log(data);
       data = JSON.parse(data);
       var service_html_str = ""
        for(var key in data.data)
        {
        	service_html_str +='<div class="form-check-inline">';
			service_html_str +='<label class="form-check-label">';
			service_html_str +='<input type="checkbox" class="form-check-input" name="service_ids[]" value="'+data.data[key]['id']+'">'+ data.data[key]['title'];
			service_html_str +='</label>';
			service_html_str +='</div>';           
        }
        $("#service_html").html(service_html_str);

        $("#doctor_signup_btn").prop('disabled', false);
    })

$("#doctor_signup_form").submit(function(e){
	e.preventDefault();
	$("#doctor_signup_btn").prop('disabled', true);
	$(".alert-warning").show();
	$(".alert-success").slideUp();
	$(".alert-danger").slideUp();

	if($('#lang_html :checkbox:checked').length > 0)
	{
		var formdata = new FormData($('#doctor_signup_form')[0]);

		$.ajax({
         url         : api_url+"get_doctor_details.php",
         data        : formdata,// ? formdata : $("#form_sample_1").serialize(),
         cache       : false,
         contentType : false,
         processData : false,
         enctype: 'multipart/form-data',
         type        : 'POST',
         success     : function(data, textStatus, jqXHR){
           console.log(data)
            data = JSON.parse(data);
           	if(data.success)
		    {
		    	$("#doctor_signup_form input").val("");

		    	$("#form_without_otp").slideUp();
		    	$("#form_otp").slideDown();
		    	$(".bottom").hide();
		    	$("#generated_otp").val(data.code);
		    	$("#insert_doctor_id").val(data.insert_doctor_id);
		    	$(".alert-success").html("<strong>Success:</strong>"+ data.msg).slideDown();
		    	setTimeout(function(){
				    $(".alert-danger").slideUp();
				    $(".alert-success").slideUp();
				}, 3000);
		    }
		    else
		    {
		    	$(".alert-danger").html("<strong>Error:</strong>"+ data.msg).slideDown();
		    	$("#user_login_password").val("");	    	
		    	$("#doctor_signup_btn").prop('disabled', false);
		    	setTimeout(function(){
				   $(".alert-danger").slideUp();
				}, 3000);
		    }
		    $(".alert-warning").hide();
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

$("#d_otp").keyup(function(){
	if($("#d_otp").val().length >= 4)
	{
		if($("#generated_otp").val() == $("#d_otp").val())
		{
			$(".alert-warning").html("<strong>Please Wait...: System is processing. </strong>").slideDown();
			$.post( api_url+"get_doctor_details.php", { func:"activate_nurse", doctor_id:$("#insert_doctor_id").val()})
     		.done(function(data){
        		//alert(data);
        		data = JSON.parse(data);
        		if(data.success)
		    	{
		    		$(".alert-success").html("<strong>Success: Registration Successful. Please Wait...</strong>").slideDown();
		    		setTimeout(function(){
					   window.location.href="login-nurse43.html";	
					}, 3000);		    		
		    	}
		    	else
		    	{
		    		$(".alert-danger").html("<strong>Error: Please try again later.</strong>").slideDown();
					setTimeout(function(){
					    $(".alert-danger").slideUp();
					}, 3000);
		    	}
    		})
			
		}
		else
		{
			$(".alert-danger").html("<strong>Error: Wrong OTP.</strong>").slideDown();
			setTimeout(function(){
			    $(".alert-danger").slideUp();
			}, 3000);
		}
	}
})
