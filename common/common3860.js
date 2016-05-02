var Common = {
	shareWechat : function (title,desc,imgUrl,link){
	//默认分享
	var defaultTitle = document.title;
	var defaultDesc = document.title;
	var defaultImgUrl = 'http://www.heyjuice.cn/Public/Home/images/share_logo.png';
	var defaultLink = 'http://www.heyjuice.cn/Tuan/Product';

	//自定义分享
	var shareTitle = title;
	var shareDesc = desc;
	var shareImgUrl = imgUrl;
	var shareLink = link;

	return shareData = {
	  title: shareTitle ? shareTitle : defaultTitle,
	  desc: shareDesc ? shareDesc : defaultDesc,
	  imgUrl: shareImgUrl ? shareImgUrl : defaultImgUrl,
	  link: shareLink ? shareLink : defaultLink,
	};
	
	},
	uploadResule : function(type, url, info){
		if (url!='') {
			window.location.reload();
		}else{
			Common.Prompt.alert({
				tips : info,
				enter_text : '确认'
			});
		}
	},

	/**
	 * 验证码操作
	 */
	Captcha : function(obj, value, type ,fn){
		obj.click(function(){
			var data = {
				'tel' : value.val(),
				'type' : type
			};
			if (data['tel']) {
				Base.Http.ajax({
					url : '/Captcha/index',
					data : data,
					success : function(data){
						if (data['status']==1) {
							fn(data['data']);
						}else{
							Common.Prompt.alert({
								tips : data['info'],
								enter_text : '确认'
							});
						}
					}
				});
			}else{
				Common.Prompt.alert({
					tips : '电话不能为空！',
					enter_text : '确认'
				});
			}
		});
	},
	/**
	 * 倒计时
	 */
	Timer : function(obj){
		var second = obj.html();
        if(second!=''){
        	obj.html(second);
	        obj.parent('.CaptchaTimer').addClass('disabled');
	        $(document).data({'flagTimer':'false'});
	        var timer = setInterval(function(){
	            if (second==1) {
	                clearInterval(timer);
	                obj.parent('.CaptchaTimer').removeClass('disabled');
	                $(document).data({'flagTimer':'true'});
	                obj.html('');
	            }else{
	                second --;
	                obj.html(second);
	            }
	        },1000);
        }else{
        	$(document).data({'flagTimer':'true'});
        }
	},
	/**
	 * 城市级联
	 */
	Cascade : function(city, area){

		var Layout = {
			city : function(id){
				var _city = [];
				for(var i = 0 ; i < city.length ; i++){
					if (city[i]['pid']==id) {
						_city.push(city[i]);
					};
				};
				var option = '<option value="">选择城市</option>';
				if (id) {
					for(var i = 0 ; i < _city.length ; i++){
						option += '<option value="'+_city[i]['id']+'">'+_city[i]['city_name']+'</option>';
					}
				}
				
				return option;
			},
			area : function(id){
				var _area = [];
				for(var i = 0 ; i < area.length ; i++){
					if (area[i]['pid']==id) {
						_area.push(area[i]);
					};
				};
				var option = '<option value="">选择区域</option>';
				if (id) {
					for(var i = 0 ; i < _area.length ; i++){
						option += '<option value="'+_area[i]['id']+'">'+_area[i]['area_name']+'</option>';
					}
				}
				
				return option;
			}
		};

		$(document)
		.on('change', '.Province', function(event) {
			var __city = $(this).parents('.Cascade').find('.City');
			var layout = Layout.city($(this).val());
			__city.html(layout).change();
		})
		.on('change', '.City', function(event) {
			var __area = $(this).parents('.Cascade').find('.Area');
			var layout = Layout.area($(this).val());
			__area.html(layout).change();
		});
		$('.Province').change();
	},
	Address : function(type){
		var layout = arguments[1] ? arguments[1] : 'web';

		var _Address = {
			change : function(){
				$('.AddressRow.this').click();
				_Address.ShippingShow();
			},
			add : {
				open : function(){
					$(this).hide();
					$('.AddressList').hide();
					$('.AddressWrap').append($('#AddressNewLayout').html());
				},
				exit : function(){
					$('.AddressNew').show();
					$('.AddressNewForm').remove();
					$('.AddressWrap').show();
					$('.AddressList').show();
				}
			},
			del : function(){
				var address_id = $(this).attr('data-address-id');
				Common.Prompt.confirm({
					tips : '确认删除此条地址吗？',
					enter_text : '确认',
					exit_text : '取消',
					callback : {
						enter : function(){	
							$('.MarkWrap').html('').hide();				
							Base.Http.ajax({
								url : '/Customer/address_del?type='+type,
								data : {'id':address_id},
								context : $(this),
								success : function(data, obj){
									if (data['status']==1) {
										$('.AddressWrap').replaceWith(data['data']);
										_Address.change();
										window.location.reload();
									}else{
										Common.Prompt.alert({
											tips : data['info'],
											enter_text : '确认'
										});
									}
								}
							});
						}
					}
				})
				
			},
			edit : {
				open : function(){
					$('.AddressNew').hide();
					$('.AddressList').hide();
					var layout = $(this).parents('.AddressRow').next('.AddressEditLayout').html();
					$('.AddressWrap').append(layout);
					$('.AddressEditForm').find('.Province').change();
				},
				exit : function(){
					$('.AddressNew').show();
					$('.AddressList').show();
					$('.AddressEditForm').remove();
				}
			},
			save : function(){
				var id = $(this).attr('data-address-id');
				if (id&&id!='') {
					var data = Base.Form.serialize($('.AddressEditValue'));
					data['id'] = id;
				}else{
					var data = Base.Form.serialize($('.AddressNewValue'));
				}
				Base.Http.ajax({
					url : '/Customer/address_save?type='+type,
					data : data,
					success : function(data){
						if (data['status']==1) {
							var dom = $(data['data']);
							$('.AddressWrap').replaceWith(dom);
							_Address.change();

						}else{
							Common.Prompt.alert({
								tips : data['info'],
								enter_text : '确认'
							});
						}
					}
				});
			},
			default : function(){
				var address_id = $(this).attr('data-address-id');
				Base.Http.ajax({
					url : '/Customer/address_default?type='+type,
					data : {'id':address_id},
					context : $(this),
					success : function(data, obj){
						if (data['status']==1) {
							$('.AddressWrap').replaceWith(data['data']);
							_Address.change();
						}else{
							Common.Prompt.alert({
								tips : data['info'],
								enter_text : '确认'
							});
						}
					}
				});
			},
			select : function(){
				$(this).addClass('this').siblings('.AddressRow').removeClass('this');
				_Address.ShippingShow();
			},

			ShippingShow : function(){

				if (layout == 'web') {
					var  shipping_city = $("input[name='shipping_city']").val();
					if(shipping_city){
						var shipping_city_arr = shipping_city.split(',')
						var city = $('.AddressRow.this').attr('data-city-id');
						if (shipping_city_arr.indexOf(city)>=0) {
							$('.ShippingOne').show();
							$('.ShippingEvery').prop("checked",'2');
						}else{
							$('.ShippingOne').hide();
							$('.ShippingEvery').prop("checked",'2');
						}
					}
				}
			},

		};
		$(document)
		.on('click', '.AddressNew', _Address.add.open)
		.on('click', '.AddressDel', _Address.del)
		.on('click', '.AddressEdit', _Address.edit.open)
		.on('click', '.AddressEditExit', _Address.edit.exit)
		.on('click', '.AddressEditSubmit', _Address.save)
		.on('click', '.AddressSetDefault', _Address.default)
		.on('click', '.AddressNewExit', _Address.add.exit)
		.on('click', '.AddressNewSubmit', _Address.save)
		.on('click', '.AddressRow', _Address.select);
		_Address.ShippingShow();
	},
	/**
	 * [Order description]
	 * @param {[type]} __payment_coupon [在线付款优惠金额]
	 */
	Order : function(__payment_coupon){
		var _Order = (function(){
			var coupon_money = 0;
			var virtual_money = 0;
			var delivery_money = 0;
			var product_money = $('.ProductMoney').html();

			

			var money = function(){
				var payment_id = $('.PaymentType:checked').val();
				var payment_coupon = 0;
				if (payment_id==2) {
					payment_coupon += Number(__payment_coupon);
				}
				$('.CouponMoney').html(parseInt(coupon_money)+parseInt(payment_coupon));
				if (Number(virtual_money)>Number(product_money)+Number(delivery_money)-Number(coupon_money)-Number(payment_coupon)) {
					virtual_money = Number(product_money)+Number(delivery_money)-Number(coupon_money)-Number(payment_coupon);
				};
				$('.VirtualMoney').html(Math.round(virtual_money*100)/100);
				$('.DeliveryMoney').html(Math.round(delivery_money*100)/100);
				var order_money = Number(product_money)+Number(delivery_money)-Number(coupon_money)-Number(virtual_money)-Number(payment_coupon);
				$('.OrderMoney').html('￥'+Math.round(order_money*100)/100);
			};
			var options = function(data){
				var list = '<option value="">选择收货日期</option>';
				var _data = data || [];
				for( var i = 0 ; i < _data.length ; i ++ ){
					list += '<option value="'+_data[i]+'">'+_data[i]+'</option>';
				}
				return list;
			};
			return {
				virtual : function(){
					var virtual = $(this).val();
					if (virtual) {
						Base.Http.ajax({
							url : '/Order/virtual',
							data : {'virtual_money':virtual},
							context : $(this),
							success : function(data){
								if (data['status']==1) {
									virtual_money = data['data'];
									money();
								}else{
									Common.Prompt.alert({
										tips : data['info'],
										enter_text : '确认'
									});
								}
							}
						});
					}else{
						virtual_money = 0;
						money();
					}
				},
				coupon : function(){
					var coupon = $(this).val();
					// var productList = $('.SelectedProductList');
					var productIdList = [];
					$('.SelectedProductList').each(function(index, el) {
						productIdList[index] = $(this).attr('data-product-id');
					});
					if (coupon) {
						Base.Http.ajax({
							url : '/Order/coupon',
							data : {'coupon':coupon,'productIdList':productIdList	},
							context : $(this),
							success : function(data){
								if (data['status']==1) {
									coupon_money = data['data']['money'];
									money();
								}else{
									Common.Prompt.alert({
										tips : data['info'],
										enter_text : '确认'
									});
								}
							}
						});
					}else{
						coupon_money = 0;
						money();
					}
				},
				submit : function(){
					var data = Base.Form.serialize($('.AddOrderValue'));
					Base.Http.ajax({
						url : '/Order/add',
						data : data,
						beforeSend : function(){
							Common.Prompt.stop({
								tips : '订单提交中。。。'
							});
						},
						success : function(data){
							if (data['status']==1) {
								Common.Prompt.alert({
									tips : '订单提交成功！',
									enter_text : '确认',
									callback : {
										enter : function(){
											window.location.href = data['data'];
										}
									}
								});
							}else{
								 if(data['status']==2){
									Common.Prompt.alert({
										tips : data['info'],
										enter_text : '确认',
										callback : {
											enter : function(){
												window.location.href = data['data'];
											}
										}
									});
								}else{
									Common.Prompt.alert({
										tips : data['info'],
										enter_text : '确认'
									});
								}
							}
						}
					});
				},
				payment : function(){
					$('.PaymentType').parent('label').removeClass('this');
					$(this).parent('label').addClass('this');
					$('.payment_info').hide();
					$('.payment_info').eq($(this).parent('label').index()).show();
					money();
				},
				shipping : function(){
					$('.ShippingType').parent('label').removeClass('this');
					$(this).parent('label').addClass('this');
					$('.shipping_info').hide();
					$('.shipping_info').eq($(this).parent('label').index()).show();
					money();
				},
				delivery : function(obj){

					var shipping_id = $('.ShippingType:checked').val();

					Base.Http.ajax({

						url : '/Order/delivery_money',

						data : {'city_id':obj.attr('data-city-id'),'shipping_id':shipping_id},

						context : obj,

						success : function(data){

							if (data['status']==1) {

								var d_money = data['data'] || [];

								var sum = 0;

								for( var i = 0 ; i < data['data'].length ; i ++ ){

									var _row = data['data'][i];

									var row = $('.SelectedProductList'+_row['product_id']);

									row.attr('data-product-delivery',_row['product_delivery_money']);

									row.find('.ReceiverDate').html(options(_row['product_date']));
									if (shipping_id == 1) {
										sum += Number(row.attr('data-product-cycle'))*Number(row.attr('data-product-num'))*Number(row.attr('data-product-delivery'));
									}else{
										sum += Number(row.attr('data-product-num'))*Number(row.attr('data-product-delivery'));
									}
								}

								delivery_money = sum;
								
								money();

							}else{
								Common.Prompt.alert({
									tips : data['info'],
									enter_text : '确认'
								});
							}
						}
					});
				}
			}
		}());

		$(document)
		.on('change', '.OrderVirtual', _Order.virtual)
		.on('change', '.OrderCoupon', _Order.coupon)
		.on('click', '.PaymentType', _Order.payment)
		.on('click', '.ShippingType', _Order.shipping)
		.on('click', '.AddOrderSubmit', _Order.submit)

		.on('click', '.ShippingType', function(){
			_Order.delivery($('.AddressRow.this'));
		}) //配送方式更改触发计算配送费

		.on('click', '.AddressRow', function(){
			_Order.delivery($(this));
		});
		//默认计算配送费用及可配送日期
		_Order.delivery($('.AddressRow.this'));
		// //默认使用优惠券
		$('.OrderCoupon').change();
		$('.OrderVirtual').change();
	},
	ShoppingCarNum : function() {

		var num = $.cookie('ShoppingCarCount');

		var layout = '<sapn class="shopping_num_1 ShoppingCarNum">'+num+'</span>';

		$('.ShoppingCarNum').remove();

		$('.ShoppingCarLink').append(layout);

	},
	ShoppingAdd : function(){

		var product_id = $(this).attr('data-product-id');
		var data = {'product_id':product_id,'qty':1};
		Base.Http.ajax({
			url : '/ShoppingCar/update',
			data : data,
			success : function(data){
				if (data['status']==1) {
					Common.ShoppingCarNum();
					
					Common.Prompt.confirm({
						tips : '产品已添加到购物车！',
						enter_text : '去购物车结算',
						exit_text : '继续购物',
						callback : {
							enter : function(){
								window.location.href = '/ShoppingCar';
							}
						}
					});
				}else if(data['status']==80){

					Common.Prompt.confirm({
						tips : '很抱歉，今天到货的福利已经发完。但迟到总比错过强，现在下单明天即可收货。',
						enter_text : '立即订购',
						exit_text : '取消',
						callback : {
							enter : function(){
								Common.ShoppingCarNum();
								window.location.href = '/ShoppingCar';
							}
						}
					});

				}else if(data['status']==2) {

					Common.Prompt.confirm({
						tips : data['info'],
						enter_text : '确认',
						exit_text : '取消',
						callback : {
							enter : function(){
								Common.ShoppingCarNum();
								window.location.href = '/Index';
							}
						}
					});
				}else{
					Common.Prompt.alert({
						tips : data['info'],
						enter_text : '确认'
					});

				}

			}
		});

	},
	Prompt : (function(){

		var wrap = function(){

			return $('.MarkWrap');

		};
	
		var layout = function(layout){

			return ['<div class="mask_box">','<div class="mask_tit"><a href="javascript:;" class="close MaskClose"></a></div>',layout,'</div>'].join('');

		};

		var base = function(options){

			var options = options || {};

			var btn = {

				close : $('.MaskClose').data('name','close'),

				enter : $('.MaskEnter').data('name','enter'),

				exit : $('.MaskExit').data('name','exit'),

			};

			for( var k in btn ){

				btn[k].click(function(event){

					var _callback = options[$(this).data('name')];

					if (_callback) {

						_callback();

						wrap().hide().html('');

					}else{

						wrap().hide().html('');

					};

				});

			};

		};

		var auto = function(temp,fn){

			var auto_num = $('.MaskAuto');

			var temp = temp;

			auto_num.html(temp);

			var timer = setInterval(function(){

				temp--;

				auto_num.html(temp);

				if (temp==0) {

					if(fn){

						fn();

					}else{

						wrap().hide().html('');

					};

					clearInterval(timer);

				};

			}, 1000);

		};

		return {

			alert : function(options){

				wrap().show().html(layout(['<div class="mask_info">'+options['tips']+'</div>','<div class="mask_btn">','<a href="javascript:;" class="MaskEnter mask_btn_2">'+options['enter_text']+'</a>','</div>'].join('')));

				base(options['callback']);

			},

			confirm : function(options){

				wrap().show().html(layout(['<div class="mask_info">'+options['tips']+'</div>','<div class="mask_btn">','<a href="javascript:;" class="mask_btn_1 MaskExit">'+options['exit_text']+'</a>','<a href="javascript:;" class="MaskEnter mask_btn_2">'+options['enter_text']+'</a>','</div>'].join('')));

				base(options['callback']);

			},

			auto : function(options){

				wrap().show().html(layout(['<div class="mask_info">'+options['tips']+'</div>','<div class="mask_auto MaskAuto">'+3+'</div>','</div>'].join('')));

				base(options['callback']);

				auto(options['temp'],options['fn']);

			},

			stop : function(options){

				wrap().show().html(layout(['<div class="mask_info">'+options['tips']+'</div>','</div>'].join('')));

			}

		}
	
	}()),
	Pull : function(url, data, interval){
		var _pull = function(){
			Base.Http.ajax({
				url : url,
				data : data,
				success : function(data){
					if (data['status']==1) {
						if (data['info']=='success') {
							window.location.href = data['data'];
						}else{
							setTimeout(_pull, interval);
						}
					}else{
						Common.Prompt.alert({
							tips : data['info'],
							enter_text : '确认'
						});
					}
				}
			});
		}
		_pull();
	},
	Product : (function(){

		return {

			set : function(){

				var obj = $(this);

				var name = obj.attr('data-product-name');
				var info = obj.attr('data-product-info');
				var price = obj.attr('data-product-price');
				var id = obj.attr('data-product-id');

				$('.ProductName').html(name);
				$('.ProductInfo').html(info);
				$('.ProductPrice').html(price);
				$('.ShoppingCarAdd').attr('data-product-id',id);
				$('.ShoppingCarAdd').attr('hjtag','inside|btn|buy|'+id+'');
				$('.CheckProduct'+id).addClass('this').siblings('.CheckProduct').removeClass('this');

			}

		}

	}()),
	Verify : function(obj){

		var temp = Math.floor(new Date().getTime()/1000);

		obj[0].src = '/Verify/index?temp='+temp;

	}
};
$(document).on('change','.ReceiverDate84',function(){
	var pro_id = $('.SelectedProductList').attr('data-product-id');
	if (pro_id == 84) {

		var stringTime = $(this).val();;
		var timestamp2 = Date.parse(new Date(stringTime));
		timestamp2 = timestamp2 / 1000 ;
		var timer ='';
		for(var i =0; i<4; i++){
			
			timer += userDate(timestamp2) +'<br>';
			timestamp2 = timestamp2+(7 * 24 * 3600);
			
		}
		
		$('.ReceiverDateLater').html(timer);
	};

})
function userDate(uData){
  var myDate = new Date(uData*1000);
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1;
  if(month < 9){
  	month = '0'+month;
  }

  var day = myDate.getDate();
   if(day < 10){
  	day = '0'+day;
  }
  return year + '-' + month + '-' + day;
}

//用户登录日志
var accesslog = function(){
	var url = document.URL;
	var referrer = document.referrer;
	Base.Http.ajax({
		url : '/AccessLog',
		data : {'url':url,'referrer':referrer},
		success : function(data, obj){
		}
	})
}();

