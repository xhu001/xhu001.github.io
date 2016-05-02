var Global = {
	HeaderUser : function(e){
		var btn = $('.HeaderUserBtn'),
			list = $('.HeaderUserList'),
			hide = function(){
				btn.removeClass('is_click');
				list.animate({'top':'45px','opacity':0}, 300,function(){
					list.hide();
					list.stop();
				});
			};
		if (!list.is(':animated')) {
			if (btn.hasClass('is_click')) {
				hide();
			}else{
				btn.addClass('is_click');
				list.show().animate({'top':'60px','opacity':1}, 300);
				$(document).one('click',hide);
			};
		};
		e.stopPropagation();
	},
	Slides : function(){
		var num = 1,
			iTimer,
			list = $('.SlidesBox li'),
			len = list.length,
			show = function(){
				if(num >len-1){
					num = 0;
				}
				if(num < 0){
					num = len-1;
				}
				list.removeClass('this');
				list.eq(num).addClass('this');
				num++;
			},
		    stop = function(){
		    	$('.SlidesBox a').mouseover(function(){
		    		clearInterval(timer);
		    		clearInterval(iTimer);
		    	})
		    }(),
		    up = function(){
		    	$('.SlidesUp').click(function(){
		    		if (!list.is(':animated')) {
		    			num = num-2;
		    			show();
		    		}
		    		
		    	})
		    }(),
		    next = function(){
		    	$('.SlidesNext').click(function(){
		    		if (!list.is(':animated')) {
		    			show();
		    		}
		    		
		    	})
		    }(),
		    timer = setInterval(show,3000),
		    start = function(){
		    	$('.SlidesBox a').mouseout(function(){
		    		setTimeout(function(){
		    			clearInterval(iTimer);
		    			iTimer  = setInterval(show,3000);
		    		},5000)
		    		
		    	});
		    }();
	},
	Slides1 : function(){
		var num = 1,
			iTimer,
			list = $('.SlidesBox1 li'),
			len = list.length,
			show = function(){
				if(num >len-1){
					num = 0;
				}
				if(num < 0){
					num = len-1;
				}
				list.removeClass('this');
				list.eq(num).addClass('this');
				num++;
			},
		    stop = function(){
		    	$('.SlidesBox1 a').mouseover(function(){
		    		clearInterval(timer);
		    		clearInterval(iTimer);
		    	})
		    }(),
		    up = function(){
		    	$('.SlidesUp1').click(function(){
		    		if (!list.is(':animated')) {
		    			num = num-2;
		    			show();
		    		}
		    		
		    	})
		    }(),
		    next = function(){
		    	$('.SlidesNext1').click(function(){
		    		if (!list.is(':animated')) {
		    			show();
		    		}
		    		
		    	})
		    }(),
		    timer = setInterval(show,3000),
		    start = function(){
		    	$('.SlidesBox1 a').mouseout(function(){
		    		setTimeout(function(){
		    			clearInterval(iTimer);
		    			iTimer  = setInterval(show,3000);
		    		},5000)
		    		
		    	});
		    }();
	},
	Banner :function(){

		var num = 1,
			iTimer,
			list = $('.BannerBox li'),
			len = list.length,
			show = function(){
				if(num >len-1){
					num = 0;
				}
				if(num < 0){
					num = len-1;
				}

				list.removeClass('this');
				list.eq(num).addClass('this');
				$('.SlidesStop li').removeClass('this');
				$('.SlidesStop li').eq(num).addClass('this');
				num++;
			},
		    stop = function(){
		    	
		    		clearInterval(timer);
		    		clearInterval(iTimer);
		    	
		    },
		    up = function(){
		    	$('.BannerPre').click(function(){
		    		if (!list.is(':animated')) {
		    			num = num-2;
		    			show();
		    		}
		    		
		    	})
		    }(),
		    next = function(){
		    	$('.BannerNext').click(function(){
		    		if (!list.is(':animated')) {
		    			show();
		    		}
		    		
		    	})
		    }(),
		    timer = setInterval(show,5000),
		    start = function(){
		    	$('.BannerSlider a').mouseout(function(){
		    		setTimeout(function(){
		    			clearInterval(iTimer);
		    			iTimer  = setInterval(show,3000);
		    		},5000)
		    		
		    	});
		    }();
		    $('.BannerSlider a').mouseover(function(){
		    	stop();
		    })
		    $('.SlidesStop li').click(function(){
		    	stop();
		    	num = $(this).index();
		    	show();
		    })
	}
};
$(function(){
	//头部用户下拉
	$('.HeaderUserBtn').click(Global.HeaderUser);
	//数字
	Base.Form.isNumber($('.isNumber'));
	//轮播图
	Global.Slides();
	Global.Slides1();
	Global.Banner();
	//图片延迟加载
	$("img.lazy").lazyload({effect: "fadeIn" , threshold :280});
	//购物车
	$('.ShoppingCarAdd').click(Common.ShoppingAdd);
	//验证码
	$('.VerifyChange').click(function(){

		Common.Verify($(this));

	});
});