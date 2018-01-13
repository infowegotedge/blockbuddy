$(function() {
    
    $(document).on("click", ".panel-header .panel-maximize", function(event) {
        var panel = $(this).parents(".panel:first");
        if (panel.hasClass("maximized")) {
            map.invalidateSize();
        }
        else {
            map.invalidateSize();
        }
    });

    /**** FINANCIAL CHARTS: HIGHSTOCK ****/

    $('*[data-jquery-clock]').each(function() {
        var t = $(this);
        var seconds = new Date().getSeconds(),
            hours = new Date().getHours(),
            mins = new Date().getMinutes(),
            sdegree = seconds * 6,
            hdegree = hours * 30 + (mins / 2),
            mdegree = mins * 6;
        var updateWatch = function() {
            sdegree += 6;
            if (sdegree % 360 == 0) {
                mdegree += 6;
            }
            hdegree += (0.1 / 12);
            var srotate = "rotate(" + sdegree + "deg)",
                hrotate = "rotate(" + hdegree + "deg)",
                mrotate = "rotate(" + mdegree + "deg)";
            $(".jquery-clock-sec", t).css({
                "-moz-transform": srotate,
                "-webkit-transform": srotate,
                '-ms-transform': srotate
            });
            $(".jquery-clock-hour", t).css({
                "-moz-transform": hrotate,
                "-webkit-transform": hrotate,
                '-ms-transform': hrotate
            });
            $(".jquery-clock-min", t).css({
                "-moz-transform": mrotate,
                "-webkit-transform": mrotate,
                '-ms-transform': mrotate
            });
        }
        updateWatch();
        setInterval(function() {
            $(".jquery-clock-sec, .jquery-clock-hour, .jquery-clock-min").addClass('jquery-clock-transitions');
            updateWatch();
        }, 1000);
        $(window).focus(function() {
            $(".jquery-clock-sec, .jquery-clock-hour, .jquery-clock-min").addClass('jquery-clock-transitions');
        });
        $(window).blur(function() {
            $(".jquery-clock-sec, .jquery-clock-hour, .jquery-clock-min").removeClass('jquery-clock-transitions');
        });
    });

    // panel-stat-chart, visitors-chart
    var widgetMapHeight = $('.widget-map').height();
    var pstatHeadHeight = $('.panel-stat-chart').parent().find('.panel-header').height() + 12;
    var pstatBodyHeight = $('.panel-stat-chart').parent().find('.panel-body').height() + 15;
    var pstatheight = widgetMapHeight - pstatHeadHeight - pstatBodyHeight + 30;
    $('.panel-stat-chart').css('height', pstatheight);
    var clockHeight = $('.jquery-clock ').height();
    var widgetProgressHeight = $('.widget-progress-bar').height();
    
    var visitorsData = {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
            {
                label: "New Visitors",
                backgroundColor: "rgba(200,200,200,0.5)",
                borderColor: "rgba(200,200,200,1)",
                pointBackgroundColor: "rgba(200,200,200,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(200,200,200,1)",
                data: [4275, 4321, 7275, 6512, 5472, 6540, 7542, 5475, 6547, 7454, 9544, 10245]
            },
            {
                label: "Returning visitors",
                backgroundColor: "rgba(49, 157, 181,0.5)",
                borderColor: "rgba(49, 157, 181,0.7)",
                pointBackgroundColor: "rgba(49, 157, 181,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(49, 157, 181,1)",
                data: [3255, 3758, 4538, 2723, 6752, 6534, 8760, 7544, 5424, 4244, 6547, 7857]
            }
        ]
    };
    var chartOptions = {
        tooltips : {
            cornerRadius: 0,
            tooltipTemplate: "dffdff",
            multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
        },
        legend:{
            display: false
        },
        backgroundColor:"#fff",
        scales:
        {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }]
        }
    };

    if($('#visitors-chart').length){
        var ctx = document.getElementById("visitors-chart").getContext("2d");
        var myNewChart = new Chart(ctx, {
            type: "line",
            data: visitorsData,
            options: chartOptions
        });
     }

    /* Progress Bar  Widget */
    if ($('.widget-progress-bar').length) {
        $(window).load(function() {
            setTimeout(function() {
                $('.widget-progress-bar .stat1').progressbar();
            }, 900);
            setTimeout(function() {
                $('.widget-progress-bar .stat2').progressbar();
            }, 1200);
            setTimeout(function() {
                $('.widget-progress-bar .stat3').progressbar();
            }, 1500);
            setTimeout(function() {
                $('.widget-progress-bar .stat4').progressbar();
            }, 1800);
        });
    };

   
    
});

function generateNotifDashboard(content) {
    var position = 'topRight';
    if ($('body').hasClass('rtl')) position = 'topLeft';
    var n = noty({
        text: content,
        type: 'success',
        layout: position,
        theme: 'made',
        animation: {
            open: 'animated bounceIn',
            close: 'animated bounceOut'
        },
        timeout: 4500,
        callback: {
            onShow: function() {
                $('#noty_topRight_layout_container, .noty_container_type_success').css('width', 350).css('bottom', 10);
            },
            onCloseClick: function() {
                setTimeout(function() {
                    $('#quickview-sidebar').addClass('open');
                }, 500)
            }
        }
    });
}