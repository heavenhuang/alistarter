(function($){
	/*$('#showPosData').click(function(e){
		chrome.tabs.query({highlighted:true,windowType:'normal'}, function(tabs){
			var tabId = tabs[0].id;
			chrome.tabs.sendRequest(tabId, 'posData', function(state){});
		});
	});*/
	$('.link').click(function(e){
		var $e = $(this);
		chrome.tabs.query({highlighted:true,windowType:'normal'}, function(tabs){
			var tabId = tabs[0].id;
			var tabIndex = tabs[0].index;
			var nextTabIndex = tabIndex + 1;
			var url = $e.attr("href");
			chrome.tabs.create({index:nextTabIndex,url:url});
		});
	});
	var BodyView = Backbone.View.extend({

		el: "body",

		events: {
			"click #editPage":  "edit",
			"click #showPageClick":   "viewData",
			'click #showTrace': 'viewTrace',
			'click #showTraffic': 'viewTraffic',
			'click #showTrend': 'viewTrend'
		},

		edit: function() {
			chrome.tabs.query({highlighted:true,windowType:'normal'}, function(tabs){
				chrome.tabs.sendRequest(tabs[0].id, 'editPage', function(data){
					if (data.spm) {
						var uri = 'http://cms.cn.alibaba-inc.com/page/build_visual_page.html?action=pageManager&event_submit_do_locate_from_spm=true&spm=' + data.spm;
						chrome.tabs.create({index:tabs[0].index + 1,url:uri});
					}
				});
			})
		},
		getDate: function(){
			var t = new Date(),
				t_1 = new Date(),
				t_7 = new Date(),
				d = ['', ''],
				n = 0;
			t_1.setTime(t.getTime() - 1000*60*60*24); //前一天
			t_7.setTime(t.getTime() - 1000*60*60*24*7); //前七天
			var yymmdd = '';
			_.each([t_1, t_7], function(y){
				_.each([y.getFullYear(), y.getMonth() + 1, y.getDate()], function(i){
					if (i < 10){
						d[n] += '-0' + i.toString();
					}else if(i > 1000){
						d[n] += i.toString();
					}else{
						d[n] += '-' + i.toString();
					}
				});
				n++;
			});

			return d;
		},
		viewData: function(){
			var yymmdd = this.getDate()[0];
			chrome.tabs.query({highlighted:true,windowType:'normal'}, function(tabs){
				var uri = "http://ipage.alibaba-inc.com/dataview/view/pageView.htm?date=" + yymmdd +"&url=" + tabs[0].url.split('//')[1].split('?')[0];
				chrome.tabs.create({index:tabs[0].index + 1,url:uri});
			})
		},
		viewTraffic: function(){
			var yymmdd = this.getDate()[0];
			chrome.tabs.query({highlighted:true,windowType:'normal'}, function(tabs){
				var uri = "http://ipage.alibaba-inc.com/dataview/path/path.htm?date=" + yymmdd +"&url=" + tabs[0].url.split('//')[1].split('?')[0];
				chrome.tabs.create({index:tabs[0].index + 1,url:uri});
			})
		},

		viewTrend: function(){
			var yymmdd_1 = this.getDate()[0],
				yymmdd_7 = this.getDate()[1];
			chrome.tabs.query({highlighted:true,windowType:'normal'}, function(tabs){
				var uri = "http://ipage.alibaba-inc.com/dataview/trends/trends.htm?url=" + tabs[0].url.split('//')[1].split('?')[0] + '&date=' + yymmdd_1;
				chrome.tabs.create({index:tabs[0].index + 1,url:uri});
			})
		},

		viewTrace: function() {
			chrome.tabs.query({highlighted:true,windowType:'normal'}, function(tabs){
				chrome.tabs.sendRequest(tabs[0].id, 'viewTrace', function(data){
					if (data == 'success') {
						//$('#showTrace').html('取消参数显示');
					}
				});
			})
		}

	});
	var body = new BodyView;

})(jQuery);

