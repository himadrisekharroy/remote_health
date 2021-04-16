jQuery(document).ready(function($) {
    var urlParams = new URLSearchParams(window.location.search);
	var doc_id = urlParams.get('id');
    var appt_id = urlParams.get('appt_id');

    if(appt_id)
    {
        $("#reschedule_bottom_link").show();
        $("#booked_bottom_link").hide();
    }
    var today = new Date();
    getAppointmentTiming(doc_id, today.getDay(), today.getDate(), today.getMonth(), today.getFullYear())
    
    $("#app_year").val(today.getFullYear());
    $("#app_month").val(today.getMonth());
    $("#app_day").val(today.getDay());
    $("#app_date").val(today.getDate());

    $("#app_doc_id").val(doc_id);
    Calendar.setup(
    {          
        parentElement: 'embeddedCalendar',
        selectHandler: function(response){
            var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            console.log(response.date);
            var d= new Date(response.date);
            
            if(d.getTime() >= today.getTime())
            {
                var timeSlotsHtml   =   '<div class="alert alert-warning" >';
                timeSlotsHtml   +=  '   <strong>Wait!</strong> Processing time.....';
                timeSlotsHtml   +=  '</div>';
                console.log(d.getDay());
                $("#time_slots").html(timeSlotsHtml);
                
                 $("#app_year").val(d.getFullYear());
                 $("#app_month").val(d.getMonth());
                 $("#app_day").val(d.getDay());
                 $("#app_date").val(d.getDate());
                
                
                $.post( api_url+"get_video_chat_details.php", {
                    func: "get_slot_by_nurse_id", 
                    doc_id: doc_id,
                    user_id: storage.getItem("logged_user_id"),
                    day_id: d.getDay(),
                    date:   d.getDate(),
                    month:  d.getMonth(),
                    year:   d.getFullYear()
                })
                .done(function(data){
                console.log(data);
                    data = JSON.parse(data);
                    if(data.success)
                    {
                        var timeSlotsHtml="";
                        var timeSlotarray = data.data;
                        var ln = timeSlotarray.length;
                        
                        for(var key=0; key < (ln-1); key++) //because last element not show
                        {
                            var className = 'class="single_slot"';
                            if(data.data[key].booked) className = 'class="single_slot disable"';
                            
                            var st = data.data[key].time;
                            st = st.split(":");
                            var c = new Date().getTime() ;
                            var t =  new Date(response.date) ;
                            t.setHours(parseInt(st[0]));
                            t.setMinutes(parseInt(st[1]));
                            t.setSeconds(0);
                            t = t.getTime();
                            //console.log(c +"=="+t);
                            if(c >= t) className = 'class="single_slot disable"';

                            timeSlotsHtml +='<a href="javascript:void(0)" '+className+'>'+ data.data[key].time+' - '+data.data[key].time_f+'</a>';
                        }
                        $("#time_slots").html(timeSlotsHtml);
                    }
                    else
                    {
                        var timeSlotsHtml   =   '<div class="alert alert-danger" >';
                        timeSlotsHtml   +=  '   <strong>Not available!</strong> Please choose another date.....';
                        timeSlotsHtml   +=  '</div>';
                        $("#time_slots").html(timeSlotsHtml);
                    }
                });
            }
            else
            {
                var timeSlotsHtml   =   '<div class="alert alert-danger" >';
                timeSlotsHtml   +=  '   <strong>Not available!</strong> Please choose future date.....';
                timeSlotsHtml   +=  '</div>';
                $("#time_slots").html(timeSlotsHtml);
            }
        }
    })
    
    function getAppointmentTiming(doc_id, day_id, date, month, year) // same function code written in calender selectHandler function
    {
        var timeSlotsHtml   =   '<div class="alert alert-warning" >';
        timeSlotsHtml   +=  '   <strong>Wait!</strong> Processing time.....';
        timeSlotsHtml   +=  '</div>';
        $("#time_slots").html(timeSlotsHtml);
        
        
        $.post( api_url+"get_video_chat_details.php", {
            func: "get_slot_by_nurse_id", 
            doc_id: doc_id,
            user_id: storage.getItem("logged_user_id"),
            day_id: day_id,
            date:   date,
            month:  month,
            year:   year
        })
		.done(function(data){
            console.log(data);
            data = JSON.parse(data);
            if(data.success)
            {
                var timeSlotsHtml="";
                var timeSlotarray = data.data;
                var ln = timeSlotarray.length;
                
                for(var key=0; key < ln; key++) //because last element not show
                {
                    var className = 'class="single_slot"';
                    if(data.data[key].booked) className = 'class="single_slot disable"';

                    var st = data.data[key].time;
                    st = st.split(":");
                    var c = new Date().getTime() ;
                    var t =  new Date()
                    t.setDate(parseInt(date));
                    t.setMonth(parseInt(month));
                    t.setFullYear(parseInt(year));
                    t.setHours(parseInt(st[0]));
                    t.setMinutes(parseInt(st[1]));
                    t.setSeconds(0);
                    t = t.getTime() ;
                    if(data.data[key].booked) className = 'class="single_slot disable"';
                    //console.log(c +"=="+t);
                     if(c >= t) className = 'class="single_slot disable"';
                    timeSlotsHtml +='<a href="javascript:void(0)" '+className+'>'+data.data[key].time+' - '+data.data[key].time_f+'</a>';
                }
                $("#time_slots").html(timeSlotsHtml);
            }
            else
            {
                var timeSlotsHtml   =   '<div class="alert alert-danger" >';
                timeSlotsHtml   +=  '   <strong>Not available!</strong> Please choose another date.....';
				timeSlotsHtml   +=  '</div>';
                $("#time_slots").html(timeSlotsHtml);
            }
        });
    }
    
    $("#time_slots").on("click",".single_slot", function(){
        $(".single_slot").removeClass("active");
        if(!$(this).hasClass('disable'))
        {            
            $(this).addClass('active');
            var start_time = $(this).html().split(" - ");
            start_time = start_time[0];
            $("#app_time").val(start_time);
            //alert(start_time);
        }
        else
        {
           $("#app_time").val(''); 
        }
    });
    
    $("#appointment_book_next").click(function(){
        if(!$("#app_time").val())
        {
            alert("Please select a slot.");
        }
        else
        {
            var r = confirm("Sure To procceed...");
            if(r == true)
            {
                $("#app_book_form").submit(); 
            }
            
        }
    })
    $("#appointment_book_reschedule").click(function(){
        if(!$("#app_time").val())
        {
            alert("Please select a slot.");
        }
        else
        {
            var time = $("#app_time").val();
            time = time.split(":");

            var c = new Date().getTime();
            var t = new Date();
            t.setDate(parseInt($("#app_date").val()));
            t.setMonth(parseInt($("#app_month").val()));
            t.setFullYear(parseInt($("#app_year").val()));
            t.setHours(parseInt(time[0]));
            t.setMinutes(parseInt(time[1]));
            t.setSeconds(0);
            t = t.getTime();
            if(c > t)
                alert("Please select any future time time slot!!!");
            else
            {
                var r = confirm("Sure To procceed...");
                if(r == true)
                {
                    console.log($("#app_date").val());
                    console.log($("#app_month").val());
                    console.log($("#app_year").val());

                    $("#mask_layer").show();
                    $.post( api_url+"get_video_chat_details.php", {
                    func: "reschedule_appt", 
                    appt_id: appt_id ,
                    app_date:   $("#app_date").val(),
                    app_month:  $("#app_month").val(),
                    app_year:   $("#app_year").val(),
                    app_time: $("#app_time").val()
                    })
                    .done(function(data){
                       // console.log(data);
                        data = JSON.parse(data);
                        if(data.success)
                        {
                            alert("Appointment rescheduling is successful. Please wait...");
                            window.location.href="video_chat_book_reschedule36.html?appt_id="+appt_id;
                        }
                        else
                        {
                            alert("Appontment rescheduling is unsuccessful. Please Try again later ");
                            $("#mask_layer").hide();
                        }
                    })
                }
            }
        }
    })
})
