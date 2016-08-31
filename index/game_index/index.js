var game={
	data:[],//存储所有单元格数据的二维数组
	RN:4, //总行数
	CN:4, //总列数
	score:0,//保存当前分数
	state:1,//保存游戏状态：运行中,游戏结束
	RUNNING:1,//运行中
	GAMEOVER:0,//游戏结束
	getGridHTML:function(){//获得所有背景格的html代码
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		return '<div id="g'
			+arr.join('" class="grid"></div><div id="g')
			+'" class="grid"></div>';
	},
	getCellHTML:function(){//获得所有前景格的html代码
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		return '<div id="c'
			+arr.join('" class="cell"></div><div id="c')
			+'" class="cell"></div>';
	},
	start:function(){
		var panel=document.getElementById("gridPanel");
		panel.innerHTML=
			 this.getGridHTML()+this.getCellHTML();
		//将panel的高度，设置为RN*116+16+"px"
		panel.style.height=this.RN*116+16+"px";
		//将panel的宽度，设置为CN*116+16+"px"
		panel.style.width=this.CN*116+16+"px";
		this.data=[];//清空旧数组
		//r从0开始，到<RN结束，每次+1
		for(var r=0;r<this.RN;r++){
			this.data.push([]);//在data中压入一个空数组
		//	c从0开始，到<CN结束，每次+1
			for(var c=0;c<this.CN;c++){
		//		向data中r行，压入一个0
				this.data[r].push(0);
			}
		}
		this.score=0;//开始游戏时，分数重置为0
		this.state=this.RUNNING;//重置游戏状态为运行中
		//找到id为gameOver的div，设置display属性为none
		document.getElementById("gameOver")//->div
				.style.display="none";
		this.randomNum(); this.randomNum();
		this.updateView();
	},
	randomNum:function(){//在随机的空位置生成一个2或4
		if(!this.isFull()){//只有不满时，才尝试生成随机数
		for(;;){
			//在0~RN-1之间生成一个行下标，存在r中
			var r=Math.floor(Math.random()*this.RN);
			//在0~CN-1之间生成一个列下标，存在c中
			var c=Math.floor(Math.random()*this.CN);
			//如果data中r行c列等于0
			if(this.data[r][c]==0){
			//生成一个0~1随机数,如果>0.5,就在r行c列放入4
			//                                  否则放入2
				this.data[r][c]=Math.random()>0.5?4:2;
				break;//退出循环
			}
		}
		}
	},
	isFull:function(){
		for(var r=0;r<this.RN;r++){//遍历data
			for(var c=0;c<this.CN;c++){
				if(this.data[r][c]==0){//如果当前元素==0
					return false;//返回false
				}
			}
		}//(遍历结束)返回true
		return true;
	},
	moveLeft:function(){//左移所有行
		var before=this.data.toString();
		for(var r=0;r<this.RN;r++){//遍历data中每一行
			this.moveLeftInRow(r);//左移当前行
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.updateView();
		}
	},
	moveLeftInRow:function(r){//左移一行,传入要移动的行号
		//c从0开始，遍历当前行中的元素，到<CN-1结束,每次+1
		for(var c=0;c<this.CN-1;c++){
			//找到c之后下一个不为0的值得位置，存在nextc中
			var nextc=this.getNextInRow(r,c);
			if(nextc==-1){//如果nextc等于-1
				break;//   退出循环
			}else{//否则
			//	 如果当前位置等于0
				if(this.data[r][c]==0){
			//		将当前位置设置为下一个位置的值
					this.data[r][c]=this.data[r][nextc];
			//      将下一个位置设置为0
					this.data[r][nextc]=0;
					c--;//保证下次依然检查当前元素
				}else if(this.data[r][c]
						==this.data[r][nextc]){
			//   否则，如果当前位置等于下一位置
			//      将当前位置*2
					this.data[r][c]*=2;
					this.score+=this.data[r][c];
			//      将下一位置设为0
					this.data[r][nextc]=0;
				}
			}
		}
	},
	getNextInRow:function(r,c){//找r行c列位置之后，不为0的下一个位置
		//nextc从c+1开始，遍历r行剩余元素
		for(var nextc=c+1;nextc<this.CN;nextc++){
			if(this.data[r][nextc]!=0){//如果nextc不等于0
				return nextc;//返回nextc
			}
		}//(循环结束)返回-1
		return -1;
	},
	moveRight:function(){//右移所有行,类似于moveLeft
		var before=this.data.toString();
		for(var r=0;r<this.RN;r++){//遍历data中每一行
			this.moveRightInRow(r);//左移当前行
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.updateView();
		}
	},
	moveRightInRow:function(r){
		//c从CN-1开始，遍历data中r行元素，到>0结束,每次-1
		for(var c=this.CN-1;c>0;c--){
			//找到c之前前一个不为0的值得位置，存在prevc中
			var prevc=this.getPrevInRow(r,c);
			if(prevc==-1){//如果prevc等于-1
				break;//   退出循环
			}else{//否则
			//	 如果c位置的值等于0
				if(this.data[r][c]==0){
			//		将c位置的值设置为prevc位置的值
					this.data[r][c]=this.data[r][prevc];
			//      将prevc位置设置为0
					this.data[r][prevc]=0;
					c++;//让c前进一位
				}else if(this.data[r][c]
					==this.data[r][prevc]){
			//   否则，如果c位置的值等于prevc位置的值
					this.data[r][c]*=2;//将c位置*2
					this.score+=this.data[r][c];
					this.data[r][prevc]=0;//将prev位置设为0
				}
			}
		}
	},
	getPrevInRow:function(r,c){
		//prevc从c-1开始，遍历data中r行元素，到>=0结束，每次-1
		for(var prevc=c-1;prevc>=0;prevc--){
			//	如果prevc位置的值不等于0
			if(this.data[r][prevc]!=0){
				return prevc;//返回prevc
			}
		}//(遍历结束)返回-1
		return -1;
	},
	moveUp:function(){//上移所有列
		//移动前拍照，保存在before
		var before=this.data.toString();
		//c从0开始，遍历data中每一列
		for(var c=0;c<this.CN;c++){
		//	调用moveUpInCol方法，传入列c，移动当前列
			this.moveUpInCol(c);
		}//移动后拍照，保存在after
		var after=this.data.toString();
		if(before!=after){//如果before不等于after
			this.randomNum();//	随机生成一个新数字
			this.updateView();//  更新界面
		}
	},
	moveUpInCol:function(c){
		/*r从0开始，到<RN-1，r++
			找c列，r行下方的下一个不为0的位置nextr
			如果nextr等于-1  就退出循环
			否则
				如果r位置的值等于0
					将r位置的值设置为nextr位置的值
					将nextr位置设置为0
					r--
				否则，如果r位置的值等于nextr位置的值
					r位置的值*2
					 nextr位置的值甚至为0*/
		for(var r=0;r<this.RN-1;r++){
			var nextr=this.getNextInCol(r,c);
			if(nextr==-1){
				break;
			}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[nextr][c];
					this.data[nextr][c]=0;
					r--;
				}else if(this.data[r][c]
					==this.data[nextr][c]){
					this.data[r][c]*=2;
					this.score+=this.data[r][c];
					this.data[nextr][c]=0;
				}
			}
		}
	},
	getNextInCol:function(r,c){
		//nextr从r+1开始，到<RN结束,每次+1
		for(var nextr=r+1;nextr<this.RN;nextr++){
		//	如果nextr行c列的值不等于0
			if(this.data[nextr][c]!=0){
				return nextr;//		返回nextr
			}
		}//(遍历结束)返回-1
		return -1;
	},
	moveDown:function(){//下移所有列，类似于moveUp方法
		//移动前拍照，保存在before
		var before=this.data.toString();
		//c从0开始，遍历data中每一列
		for(var c=0;c<this.CN;c++){
		//	调用moveDownInCol方法，传入列c，移动当前列
			this.moveDownInCol(c);
		}//移动后拍照，保存在after
		var after=this.data.toString();
		if(before!=after){//如果before不等于after
			this.randomNum();//	随机生成一个新数字
			this.updateView();//  更新界面
		}
	},
	moveDownInCol:function(c){
		//r从RN-1开始，到>0结束,每次-1
		for(var r=this.RN-1;r>0;r--){
		//	找r上方上一个不为0的位置，prevr中
			var prevr=this.getPrevInCol(r,c);
		//  如果prevr等于-1，就退出循环
			if(prevr==-1){break;}
			else{//  否则
				if(this.data[r][c]==0){//如果r行的值为0
		//			将r行设置为prevr行的内容
					this.data[r][c]=this.data[prevr][c];
		//          将prevr行设置为0
					this.data[prevr][c]=0;
					r++
				}else if(this.data[r][c]
						==this.data[prevr][c]){
		//      否则，如果r行的值等于prevr行的值
					this.data[r][c]*=2;//r行的值*2
					this.score+=this.data[r][c];
					this.data[prevr][c]=0;//prevr行的值设为0
				}
			}
		}
	},
	getPrevInCol:function(r,c){
		//prevr从r-1开始，到>=0结束，每次-1
		for(var prevr=r-1;prevr>=0;prevr--){
		//	如果prevr行的值不等于0
			if(this.data[prevr][c]!=0){
				return prevr;//返回prevr
			}
		}//(遍历结束)返回-1
		return -1;
	},
	//将data数组中每个元素更新到页面div
	updateView:function(){
		//遍历data中每个元素的值
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				//找到页面上和当前位置对应的div
			    var divObj=document.getElementById("c"+r+c);
				if(this.data[r][c]==0){//如果当前值为0
					divObj.innerHTML="";//清除innerHTML
				//  还原className为"cell"
					divObj.className="cell";
				}else{//否则,将当前值放入innerHTML
					divObj.innerHTML=this.data[r][c];
				//  修改className为"cell n"+当前值
					divObj.className="cell n"+this.data[r][c];
				}
			}
		}
		var span=document.getElementById("score");
		span.innerHTML=this.score;
		if(this.isGameOver()){
			//设置当前游戏对象的状态为GAMEOVER
			this.state=this.GAMEOVER;
			//找到id为finalScore的span，将游戏的score放入内容中
			document.getElementById("finalScore")//->span
				    .innerHTML=this.score;
			//找到id为gameOver的div，设置display属性为block
			document.getElementById("gameOver")//->div
				    .style.display="block";
		}
	},
	isGameOver:function(){//判断游戏的状态	
		for(var r=0;r<this.RN;r++){//外层循环遍历行
			for(var c=0;c<this.CN;c++){//内层循环遍历列
				if(this.data[r][c]==0){//如果当前元素==0
					return false;//返回false
				}else if(c<this.CN-1&&
					this.data[r][c]==this.data[r][c+1]){
				//否则，如果列号<CN-1且当前元素==右侧元素
					return false;//返回false
				}else if(r<this.RN-1&&
					this.data[r][c]==this.data[r+1][c]){
				//否则，如果行号<RN-1且当前元素==下方元素
					return false;//返回false
				}
			}
		}//(遍历结束)返回true
		return true;
	}
}
//当窗口加载后
window.onload=function(){
	game.start();
	//键盘事件绑定
	document.onkeydown=function(){
		if(game.state==game.RUNNING){
			var e=window.event||arguments[0];
			var code=e.keyCode;
			//如果按的是向左箭头，就调用左移方法
			//左37  上38   右39   下40
			if(code==37){
				game.moveLeft();
			}else if(code==39){
				game.moveRight();
			}else if(code==38){
				game.moveUp();
			}else if(code==40){
				game.moveDown();
			}
		}
	}
}