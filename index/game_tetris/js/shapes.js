//Cell类型：描述所有格子的属性和方法
function Cell(r,c,img){
	this.r=r;//行下标
	this.c=c;//列下标
	this.img=img;//图片路径
}
//Shape类型：描述所有图形的属性和方法
function Shape(orgi){
	this.orgi=orgi;//设置参照格的下标
	this.statei=0; //设置所有图形默认状态的下标为0
}
Shape.prototype={
	IMGS:{O:"img/O.png",S:"img/S.png",L:"img/L.png",
		I:"img/I.png",J:"img/J.png",Z:"img/Z.png",
		T:"img/T.png"
	},
	moveDown:function(){//this-->shape
		//遍历当前图形对象中的cells数组
		//	将当前图形对象的r++
	for(var i=0;i<this.cells.length;this.cells[i++].r++);
		
	},
	moveLeft:function(){
	for(var i=0;i<this.cells.length;this.cells[i++].c--);
	},
	moveRight:function(){
	for(var i=0;i<this.cells.length;this.cells[i++].c++);
	},
	rotateR:function(){//向右转，切换到下一个state
		this.statei++;//将当前图形的statei++
		//如果statei，等于states的长度就改为0
	this.statei==this.states.length&&(this.statei=0);
		this.rotate();
	},
	rotateL:function(){//向左转，切换到上一个state
		this.statei--;
	this.statei==-1&&(this.statei=this.states.length-1);
		this.rotate();
	},
	//根据当前state的数据，计算图形中每个格的r和c
	rotate:function(){
		//从当前图形的states数组中获得statei位置的状态，保存在变量state中
		var state=this.states[this.statei];
		//[{r:-1,c:0},{r:0,c:0},{r:+1,c:0},{r:0,c:-1}]
		//获得shape中参照格
		var orgCell=this.cells[this.orgi];
		//遍历当前图形中的cells数组(i)
		for(var i=0;i<this.cells.length;i++){
		//将当前格的r设置为参照格r+state中i位置的对象的r
			this.cells[i].r=orgCell.r+state[i].r;
		//将当前格的c设置为参照格c+state中i位置的对象的c
			this.cells[i].c=orgCell.c+state[i].c;
		}
	}
}
//每种图形类型的对象
function O(){
	Shape.call(this,0);//借用父类型构造函数
	this.cells=[
 new Cell(0,4,this.IMGS.O),	new Cell(0,5,this.IMGS.O),
 new Cell(1,4,this.IMGS.O),  new Cell(1,5,this.IMGS.O)
	];
	this.states=[
		State(0,0,  0,+1,  +1,0,  +1,+1)
		   //  0     1       2      3
	];
}
//让子类型的原型继承自父类型的原型
Object.setPrototypeOf(O.prototype,Shape.prototype);
function T(){
	Shape.call(this,1);//借用父类型构造函数
	this.cells=[
		new Cell(0,3,this.IMGS.T),	
		new Cell(0,4,this.IMGS.T),
		new Cell(0,5,this.IMGS.T),  
		new Cell(1,4,this.IMGS.T)
	];
	this.states=[
		State(0,-1, 0,0, 0,+1, +1,0),
		State(-1,0,	0,0, +1,0, 0,-1),
		State(0,+1, 0,0, 0,-1, -1,0),
		State(+1,0, 0,0, -1,0, 0,+1)
	];
}
Object.setPrototypeOf(T.prototype,Shape.prototype);
function I(){
	Shape.call(this,1);//借用父类型构造函数
	this.cells=[
		new Cell(0,3,this.IMGS.I),	
		new Cell(0,4,this.IMGS.I),
		new Cell(0,5,this.IMGS.I),  
		new Cell(0,6,this.IMGS.I)
	];
	this.states=[
		State(0,-1, 0,0, 0,+1, 0,2),
		State(-1,0, 0,0, 1,0, 2,0)
	];
}
Object.setPrototypeOf(I.prototype,Shape.prototype);
//每个图形每种状态的数据类型
function State(r0,c0,r1,c1,r2,c2,r3,c3){
	return [
		{r:r0,c:c0},//第1个格相对于参照格的偏移量
		{r:r1,c:c1},//第2个格相对于参照格的偏移量
		{r:r2,c:c2},//第3个格相对于参照格的偏移量
		{r:r3,c:c3}//第4个格相对于参照格的偏移量
	];
}//构造函数结尾返回一个对象，则构造函数不再创建新对象
