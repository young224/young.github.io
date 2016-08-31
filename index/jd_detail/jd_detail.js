//在全局和所有元素类型的父类型的原型中，封装相同的$方法
//专用于在各种情况下用选择器查询元素对象
//接收一个字符串格式的选择器作为参数
//返回找到的一个元素对象或多个元素对象的数组
window.$=HTMLElement.prototype.$=function(selector){
	//如果在全局直接调$，就在document范围内查询
	//否则，就在当前元素范围内查询
	var elems=
	(this==window?document:this).querySelectorAll(selector);
	if(!elems){//如果没找到结果
		return null;
	}else if(elems.length==1){//如果只找到一个结果
		return elems[0];
	}else{//否则
		return elems;
	}
}
window.onload=function(){
	/*顶部弹出菜单*/
	//找到类名为app_jd和service的li，保存在变量lis中
	var lis=$(".app_jd,.service");
	for(var i=0;i<lis.length;i++){//遍历lis中每个li
		//	为当前li绑定onmouseover事件
		lis[i].addEventListener("mouseover",function(){
		//找到当前li下的直接子元素a，修改其class属性为"hover"
			this.$("."+this.className+">a").className=
												"hover";
		//在当前li下，找id属性以_items结尾的元素对象，直接修改其display属性为显示
			this.$("[id$='_items']").style.display=
												"block";
		},false);
		//在当前li下，找id属性以_items结尾的元素对象，直接修改其display属性为隐藏
		lis[i].addEventListener("mouseout",function(){
			this.$("."+this.className+">a").className="";
			this.$("[id$='_items']").style.display="none";
		},false);
	}

	/*全部商品分类*/
	//找到id为category的div元素，直接为其onmouseover和onmouseout绑定相同的事件处理函数
	$("#category").onmouseover=
		$("#category").onmouseout=function(){
		//如果id为cate_box的ul的display属性为"block"?
		//	将其display改为""，否则改为"block"
		$("#cate_box").style.display=
			$("#cate_box").style.display=="block"?
											"":"block";
	}

	//找到id为cate_box的ul下的所有直接子元素li,保存在变量lis中
	var lis=$("#cate_box>li");
	for(var i=0;i<lis.length;i++){//遍历lis中每个li
		//为当前li绑定onmouseover事件
		lis[i].addEventListener("mouseover",function(){
		//找到当前li下的h3元素，修改样式类为hover
			this.$("h3").className="hover";
		//找到当前li下的类名为"sub_cate_box"的div，改为显示
			this.$(".sub_cate_box").style.display="block";
		},false);
	
		//为当前li绑定onmouseout事件
		//找到当前li下的类名为"sub_cate_box"的div，改为隐藏
		lis[i].addEventListener("mouseout",function(){
		//找到当前li下的h3元素，清除样式类
			this.$("h3").className="";
			this.$(".sub_cate_box").style.display="none";
		},false);
	}

	/*商品详情中的标签页*/
	/*在ul下每个li下的a中手动定义属性data-i为0,1,2,-1,3*/
	//找到id为product_detail下的class为main_tabs的ul
	var ul=$("#product_detail>.main_tabs");
	//为ul绑定单击事件
	ul.onclick=function(){
		var e=window.event||arguments[0];//获得事件对象e
		var target=e.srcElement||e.target;//获得目标元素
		if(target.nodeName=="A"){//	如果target是a元素
		//找到id为product_detail下的class为main_tabs下的class为current的元素，清除class样式
			$("#product_detail>.main_tabs>.current")
											.className="";
		//设置target的父元素的class为current
			target.parentNode.className="current";
		//找到ul之后所有id属性以"product_"开头的元素，保存在变量contents中
			var contents=
		$("#product_detail>.main_tabs~[id^='product_']");
			if(target.dataset.i!=-1){//如果target的i!=-1
			//遍历contents中每个元素
				for(var i=0;i<contents.length;i++){
				//如果循环变量i!=target的i
				//就将当前元素隐藏
				//否则，将当前元素显示
					contents[i].style.display=
					  i!=target.dataset.i?"none":"block";
				}
			}else{//否则
			//遍历contents中每个元素
			//隐藏当前元素
				for(var i=0;i<contents.length;i++){
					contents[i].style.display="none";
				}
			}
		}
	}

	picture.init();//window.onload中初始化picture对象
	console.log(picture);
}
var picture={//封装放大图功能的对象
	LIWIDTH:62,//每个小图片li的固定宽度
	LEFT:20,//ul的起始left值
	ul:null,//包含小图片li的ul，是移动的主体
	aback:null, //左侧按钮-->右移一个li
	afor:null, //右侧按钮-->左移一个li
	moved:0,//记录ul左移的次数，每左移一次+1,右移-1
	liCount:0,//记录li的总数

	maskH:0,//mask的高
	maskW:0,//mask的宽
	maxTop:0,//mask可用的最大top值
	maxLeft:0,//mask可用的最大left值

	//如果liCount-moved==5，就禁用afor
	//如果moved==0，就禁用aback
	init:function(){
		var self=this;//留住this在self变量中
		//找到id为icon_list的ul，保存在ul属性中
		self.ul=$("#icon_list");
		//找到id为icon_list下的所有li，获得length属性，保存在liCount属性中
		self.liCount=$("#icon_list>li").length;
		//找到id为preview下h1下第一个a，保存在aback中
		self.aback=$("#preview>h1>a:first-child");
		self.afor=$("#preview>h1>a:first-child+a");
		//为aback和afor绑定相同单击事件处理函数

		self.aback.onclick=self.afor.onclick=function(){
			//	this-->a    self-->picture对象
			//如果当前a元素的className属性中不包含_disabled
			if(this.className.indexOf("_disabled")==-1){
			//如果当前a元素的className等于forward
			//	为moved属性+1,否则就-1 
			  self.moved+=this.className=="forward"?1:-1;
			//设置ul的left属性为-moved*LIWIDTH+20+px
				self.ul.style.left=
				 -self.moved*self.LIWIDTH+self.LEFT+"px";
				if(self.moved==0){//如果moved等于0
			//设置aback的className，加等于_disabled
					self.aback.className+="_disabled";
				}else if(self.liCount-self.moved==5){
				//否则，如果liCount-moved==5
				//设置afor的className，加等于_disabled
					self.afor.className+="_disabled";
				}else{//否则
					//设置aback的className为backward
					self.aback.className="backward";
					//设置afor的className为forward
					self.afor.className="forward";
				}
			}
		}

		//为ul绑定onmouseover事件
		self.ul.addEventListener("mouseover",function(){
			//	获得事件对象e
			var e=window.event||arguments[0];
			//  获得目标对象target
			var target=e.srcElement||e.target;
			if(target.nodeName=="IMG"){//如果target是img
				//获得target的src属性，保存在变量src中
				var src=target.src;
				//在src中找最后一个.的位置，保存在变量i中
				var i=src.lastIndexOf(".");
		//		拼接src开始位置~i之前的子字符串+-m+i~结尾的子字符串，将结果字符串设置到id为mImg的元素的src属性上
				$("#mImg").src=
					src.slice(0,i)+"-m"+src.slice(i);
			}
		},false);

		//为superMask绑定onmouseover和onmouseout为同一函数
		$("#superMask").onmouseover=
			$("#superMask").onmouseout=function(){
			//	如果id为mask的元素正在显示，
			if($("#mask").style.display=="block"){
			//		将id为mask的元素改为隐藏
				$("#mask").style.display="none";
			//      将id为largeDiv的元素也改为隐藏
				$("#largeDiv").style.display="none";
			}else{//	否则
			//		将id为mask的元素改为显示
				$("#mask").style.display="block";
			//		将id为largeDiv的元素也改为显示
				$("#largeDiv").style.display="block";
			//	获取id为mImg的src属性，保存在变量src中
				var src=$("#mImg").src;
			//   在src中找最后一个.的位置，保存在变量i中
				var i=src.lastIndexOf(".");
			//	设置id为largeDiv的元素的backgroundImage属性为：拼接src中0~i-2的子字符串+-l+i到结尾的子字符串
				$("#largeDiv").style.backgroundImage=
					"url("+src.slice(0,i-2)
						  +"-l"
						  +src.slice(i)
					+")";
			}
		}

		//获得id为mask的元素计算后的样式，保存在变量style中
		var style=getComputedStyle($("#mask"));
		//设置maskH属性为style中的height，去单位
		self.maskH=parseFloat(style.height);
		//设置maskW属性为style中的width，去单位
		self.maskW=parseFloat(style.width);
		//获得id为superMask的元素计算后的样式，保存在变量style中
		style=getComputedStyle($("#superMask"));
		//设置maxTop属性为style中的height去单位后-maskH
		self.maxTop=parseFloat(style.height)-self.maskH;
		//设置maxLeft属性为style中的width去单位后-maskW
		self.maxLeft=parseFloat(style.width)-self.maskW;
		//为superMask绑定onmousemove事件
		$("#superMask").onmousemove=function(){
			//	获得事件对象
			var e=window.event||arguments[0];
			//  获得鼠标相对于父元素的位置,分别保存在变量x和y中
			var x=e.offsetX,y=e.offsetY;
			//	计算用y-maskH/2,保存在变量top中
			//  计算用x-maskW/2,保存在变量left中
			var top=y-self.maskH/2 , left=x-self.maskW/2;
			//	如果top<0，就将top改为0
			//	否则，如果top>maxTop，就将top改为maxTop
			//	否则保持不变
			top=top<0?0:
				top>self.maxTop?self.maxTop:
				      top;
			//	如果left<0，就将left改为0
			//	否则，如果left>maxLeft，就将left改为maxLeft
			//	否则保持不变
			left=left<0?0:
				left>self.maxLeft?self.maxLeft:
						left;
			//	将id为mask的元素的top设置为top
			$('#mask').style.top=top+"px";
			//	将id为mask的元素的left设置为left
			$('#mask').style.left=left+"px";
			//修改largeDiv的背景位置
			$("#largeDiv").style.backgroundPosition=
				-left*16/7+"px -"+top*16/7+"px";
		}
	}
}