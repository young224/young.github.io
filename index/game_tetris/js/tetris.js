var tetris={
	CELL_SIZE:26,//每个格子的宽和高
	RN:20,//总行数
	CN:10,//总列数
	OFFSET:15,//左侧和上方边框修正的宽度
	pg:null,//保存游戏主界面容器对象
	shape:null,//保存正在下落的图形
	nextShape:null,//下一次将要登场的图形
	interval:800,//每次下落的时间间隔
	timer:null,//保存当前正在执行的定时器
	wall:null,//保存所有停止下落的方块对象
	score:0,//游戏得分
	SCORES:[0,10,50,80,200],//删除行数对应的得分
		  //0  1  2  3  4
	lines:0,//保存已经删除的总行数
	level:1,//保存游戏的等级

	state:1,//游戏状态：默认为启动
	GAMEOVER:0,//游戏结束状态
	RUNNING:1, //游戏进行中
	PAUSE:2,   //游戏暂停
	IMG_OVER:"img/game-over.png",
	IMG_PAUSE:"img/pause.png",

	paintState:function(){//专门绘制游戏特殊状态的图片
		var img=new Image();
		switch(this.state){
			case this.GAMEOVER: 
				img.src=this.IMG_OVER; break;
			case this.PAUSE:
				img.src=this.IMG_PAUSE; break;
		}
		this.pg.appendChild(img);
	},
	isGameOver:function(){
		//遍历nextShape中每个cell
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
		//	如果wall中和cell相同的位置不等于null
			if(this.wall[cell.r][cell.c]!=null){
				return true
			}
		}
		return false;
	},
	
	randomShape:function(){//随机生成一个图形对象
		//检查随机数
		switch(Math.floor(Math.random()*3)){
		//	如果是0，就返回一个O类型的对象
			case 0: return new O();
		//  如果是1，就返回一个T类型的对象
			case 1: return new T();
		//  如果是2，就返回一个I类型的对象
			case 2: return new I();
		}
	},
	paintNextShape:function(){//专门负责绘制nextShape图形
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.nextShape.cells.length;i++){
			var img=new Image();
			var cell=this.nextShape.cells[i];
			img.src=cell.img;
			img.style.top=
			(cell.r+1)*this.CELL_SIZE+this.OFFSET+"px";
			img.style.left=
			(cell.c+11)*this.CELL_SIZE+this.OFFSET+"px";
			frag.appendChild(img);
		}//(遍历结束后)
		this.pg.appendChild(frag);
	},
	paint:function(){//专门负责重绘一切！
		//使用正则表达式替换pg的内容中所有img元素为"",结果再保存回pg的内容中
		this.pg.innerHTML=
			this.pg.innerHTML.replace(/<img(.*?)>/g,"");
		//调用paintShape方法，重绘图形
		this.paintShape();//重绘主角图形
		this.paintNextShape(); //重绘配角图形
		this.paintWall(); //重绘墙
		this.paintScore(); //重绘分数
		this.paintState(); //重绘状态
	},
	start:function(){//游戏启动
		var self=this;
		self.state=self.RUNNING;//重置游戏状态为运行
		self.score=0;
		self.lines=0;
		self.level=1;

		self.pg=document.querySelector(".playground");
		self.shape=self.randomShape();//创建一个图形对象
		self.nextShape=self.randomShape();
		//初始化wall属性为空数组
		self.wall=[];
		//r从0开始;r<RN;r++
		for(var r=0;r<self.RN;r++){
		//	向wall中压入一个新数组对象，默认元素个数为CN
			self.wall.push(new Array(self.CN));
		}
		//启动周期性定时器，传入匿名函数封装当前对象的moveDown方法，同时传入interval属性作为时间间隔
		self.timer=setInterval(function(){
			self.moveDown();
		},self.interval);
		document.onkeydown=function(){
			//获得事件对象e
			var e=window.event||arguments[0];
			//	检查e中的keyCode
			switch(e.keyCode){//返回number类型
			//		如果为37，就调moveLeft方法
				case 37: 
					self.state==self.RUNNING&&
								self.moveLeft(); 
					break;
			//		如果为39，就调moveRight方法
				case 39: 
					self.state==self.RUNNING&&	
								self.moveRight(); 
					break;
			//		如果为40，就调moveDown方法
				case 40: 
					self.state==self.RUNNING&&
								self.moveDown(); 
					break;
			//		如果按向上，就顺时针转
				case 38: 
					self.state==self.RUNNING&&
								self.rotateR(); 
					break;
			//      如果按Z，就逆时针旋转
				case 90: 
					self.state==self.RUNNING&&
								self.rotateL(); 
					break;
			//		如果按S，就重启游戏
			    case 83: 
					if(self.state==self.GAMEOVER){
						self.start();
					}
					break;
			//		如果按P，就暂停游戏
				case 80:
					if(self.state==self.RUNNING){
						self.state=self.PAUSE;
						clearInterval(self.timer);
						self.timer=null;
						self.paint();
					}
					break;
			//		如果按C，就继续游戏
				case 67:
					if(self.state==self.PAUSE){
						self.state=self.RUNNING;
						self.timer=setInterval(
							function(){
								self.moveDown();
							}
						,self.interval);
					}
					break;
			//		如果按Q，就结束游戏
				case 81:
					if(self.state!=self.GAMEOVER){
						self.state=self.GAMEOVER;
						if(self.timer!=null){
							clearInterval(self.timer);
							self.timer=null;
						}
						self.paint();
					}
			}
		}
		self.paint();
	},
	rotateR:function(){//顺时针旋转一次
		//先调用shape的rotateR方法先旋转
		this.shape.rotateR();
		//再检查是否越界或和wall中冲突
		if(!this.canRotate()){
		//	如果冲突，就再调shape的rotateL方法转回来
			this.shape.rotateL();
		}
	},
	canRotate:function(){//能否顺时针旋转
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
		//	如果cell的c<0或c>=CN或r>=RN或在wall中相同位置有格
			if(cell.c<0||cell.c>=this.CN
				||cell.r<0||cell.r>=this.RN
				||this.wall[cell.r][cell.c]!=null){
				return false;
			}
		}
		return true;
	},
	rotateL:function(){//逆时针旋转一次
		//先调用shape的rotateL方法先旋转
		this.shape.rotateL();
		//再检查是否越界或和wall中冲突
		if(!this.canRotate()){
		//	如果冲突，就再调shape的rotateR方法转回来
			this.shape.rotateR();
		}
	},
	moveLeft:function(){
		if(this.canLeft()){//如果可以左移
		//	调用shape的moveLeft方法
			this.shape.moveLeft();
		}
	},
	canLeft:function(){
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
		//	如果cell的c==0或wall中当前cell左侧位置不等于null
			if(cell.c==0
				||this.wall[cell.r][cell.c-1]!=null){
				return false;
			}
		}//(遍历结束)
		return true;
	},
	moveRight:function(){
		if(this.canRight()){//如果可以右移
		//	调用shape的moveRight方法
			this.shape.moveRight();
		}
	},
	canRight:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==this.CN-1
				||this.wall[cell.r][cell.c+1]!=null){
				return false;
			}
		}//(遍历结束)
		return true;
	},
	canDown:function(){//专门检查是否可以下落
		//遍历shape中的cells数组中每个格
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
		//	如果当前cell的r等于RN-1，或在wall数组中和当前cell位置对应的下一行的元素不等于null
			if(cell.r==this.RN-1
				||this.wall[cell.r+1][cell.c]){
				return false;//返回false
			}
		}//(遍历结束)
		return true;//返回true
	},
	moveDown:function(){//负责主角图形shape下落一步
		if(this.canDown()){//如果可以下落
		//	才调用shape图形的moveDown方法()
			this.shape.moveDown();
		}else{//将shape中每个cell放入wall的相同位置
			//遍历shape中的每个cell对象
			for(var i=0;i<this.shape.cells.length;i++){
			//	将shape中当前cell临时保存在变量cell中
				var cell=this.shape.cells[i];
			//	将当前cell对象放到wall数组中相同r行c列的位置上
				this.wall[cell.r][cell.c]=cell;
			}
			var lines=this.deleteRows();
			//在SCORES数组中找到lines对应的得分累加到score属性中
			this.score+=this.SCORES[lines];
			//将lines累加到属性lines上
			this.lines+=lines;
			
			//(遍历结束)
			if(!this.isGameOver()){
				//将等待的图形，放入shape中
				this.shape=this.nextShape;
				//生成一个等待图形放在nextShape中
				this.nextShape=this.randomShape();
			}else{
				clearInterval(this.timer);
				this.timer=null;
				this.state=this.GAMEOVER;
			}
		}
		this.paint();
	},
	paintScore:function(){
		//找到.playground下的p元素下的span元素，保存在spans中
		var spans=document.querySelectorAll(
			".playground>p>span");
		//将score属性的值放入spans中第1个span的内容里
		spans[0].innerHTML=this.score;
		//将lines属性的值放入spans中第2个span的内容里
		spans[1].innerHTML=this.lines;
		//将level属性的值放入spans中第3个span的内容里
		spans[2].innerHTML=this.level;
	},
	deleteRows:function(){//删除所有已经满的行
		//*自低向上*遍历wall中每一行,同时声明lines为0
		for(var r=this.RN-1,lines=0;r>=0;r--){
		//	如果当前行是满格
			if(this.isFullRow(r)){
		//		调用deleteRow方法，传入r作为参数
				this.deleteRow(r);
				r++;//*刚被删除的行，还要再检查一次*
				lines++;//		lines+1
				//每次最多删4行，一旦删了4行，就退出循环
				if(lines==4){break;}
			}
		}//(遍历结束)
		return lines;//返回本次消除的行数
	},
	deleteRow:function(row){//删除第row行
		//r从row开始遍历wall中上方所有行
		for(var r=row;r>=0;r--){
		//	将wall的r-1行保存到wall的r行
			this.wall[r]=this.wall[r-1];
		//  将r-1行设置为[]
			this.wall[r-1]=[];
		//	遍历当前r行中每个元素
			for(var c=0;c<this.CN;c++){
		//		如果当前元素不等于null
				if(this.wall[r][c]!=null){
		//			将当前元素的r++
					this.wall[r][c].r++;
				}
			}
		//	如果r-2行无缝拼接后等于""，就break;
			if(this.wall[r-2].join("")==""){
				break;
			}
		}
	},
	isFullRow:function(row){//判断第row行是否满格
		//遍历wall中row行的每个元素
		for(var c=0;c<this.CN;c++){
		//	如果当前元素等于null
			if(this.wall[row][c]==null){
				return false;
			}
		}//(遍历结束)
		return true;
	},
	paintWall:function(){//绘制墙的方法
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//遍历wall中每个元素
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
		//	将wall中当前元素临时保存在变量cell中
				var cell=this.wall[r][c];
				if(cell){//	如果cell有效
		//		实例化一个Image对象，保存在变量img中
					var img=new Image();
		//		img的src等于cell的img
					img.src=cell.img;
		//		img的top等于cell的r*CELL_SIZE+OFFSET
					img.style.top=
						cell.r*this.CELL_SIZE+this.OFFSET+"px";
		//		img的left等于cell的c*CELL_SIZE+OFFSET
					img.style.left=
						cell.c*this.CELL_SIZE+this.OFFSET+"px";
		//		将img追加到frag中
					frag.appendChild(img);
				}
			}
		}//(遍历结束)将frag追加到pg中
		this.pg.appendChild(frag);
	},
	paintShape:function(){//专门负责绘制当前shape图形
		//创建文档片段，保存在变量frag中
		var frag=document.createDocumentFragment();
		//遍历当前shape中的cells数组
		for(var i=0;i<this.shape.cells.length;i++){
		//	new一个Image元素，保存在变量img中
			var img=new Image();
		//	将当前cell对象临时保存在变量cell中
			var cell=this.shape.cells[i];
		//  设置img的src属性为当前cell对象的img属性
			img.src=cell.img;
		//  设置img的top属性为当前cell对象的r*CELL_SIZE+OFFSET
			img.style.top=
				cell.r*this.CELL_SIZE+this.OFFSET+"px";
		//  设置img的left属性为当前cell对象的c*CELL_SIZE+OFFSET
			img.style.left=
				cell.c*this.CELL_SIZE+this.OFFSET+"px";
		//	将img追加到frag对象中
			frag.appendChild(img);
		}//(遍历结束后)
		//将frag对象追加到pg中
		this.pg.appendChild(frag);
	}
	
}
window.onload=function(){tetris.start();}