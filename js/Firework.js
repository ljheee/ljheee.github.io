/**
 * 模拟java类的概念
 * @author semitree
 */

var Firework = {//烟花类
		getInstance : function(){//实例化方法
			var firework = {},
				num = 100,//爆炸成烟花时的烟花数量
				beforeBalst = BeforeBalst.getInstance(),//烟火上升的时间段
				inBalst = InBalst.getInstance(),//烟火爆炸一瞬间的时间段
				afterBalst = AfterBalst.getInstance(),//烟火爆炸四散成烟花的时间段
				afterBalstList = [],//爆炸后所有烟花的集合
				status = 0,//烟火状态 0-没有点燃引线 1-引线燃烧 2-烟火上升 3-烟火爆炸 4-烟花四散 5-烟花消散
				fireworkType = createCircleFirework,//爆炸后烟花的形状,默认为圆形
				resistance = 0.1,//烟火受到的空气阻力系数          加速度 = -速度 * 空气阻力系数
				roundness = 1,//爆炸后烟花形状的规则度,范围为0-1,1表示完全规则,0表示完全不规则
				delay = 0,//引线燃烧时间,单位为帧
				ctx = {};//canvas的context对象
			firework.setBeforeBalst = function(_beforeBalst){
				beforeBalst.setAnimate(_beforeBalst);
			}
			firework.getBeforeBalst = function(){
				return beforeBalst;
			}
			firework.setInBalst = function(_inBalst){
				inBalst.setAnimate(_inBalst);
			}
			firework.getInBalst = function(){
				return inBalst;
			}
			firework.setAfterBalst = function(_afterBalst){
				afterBalst.setAnimate(_afterBalst);
			}
			firework.getAfterBalst = function(){
				return afterBalst;
			}
			firework.setAfterBalstList = function(_afterBalstList){
				afterBalstList = _afterBalstList;
			}
			firework.getAfterBalstList = function(){
				return afterBalstList;
			}
			firework.setCtx = function(_ctx){
				ctx = _ctx;
			}
			firework.getCtx = function(){
				return ctx;
			}
			firework.setStatus = function(_status){
				status = _status;
			}
			firework.getStatus = function(){
				return status;
			}
			firework.setRoundness = function(_roundness){
				roundness = _roundness;
			}
			firework.getRoundness = function(){
				return roundness;
			}
			firework.setResistance = function(_resistance){
				resistance = _resistance;
			}
			firework.getResistance = function(){
				return resistance;
			}
			firework.setNum = function(_num){
				num = _num;
			}
			firework.getNum = function(){
				return num;
			}
			firework.setDelay = function(_delay){
				delay = _delay;
			}
			firework.getDelay = function(){
				return delay;
			}
			firework.setFireworkType = function(_fireworkType){
				fireworkType = _fireworkType;
			}
			firework.getFireworkType = function(){
				return fireworkType;
			}
			firework.draw = function(){//在canvas上画烟火
				if(status == 2){//烟火上升的时候
					ctx.beginPath();
					ctx.arc(beforeBalst.getAnimate().getQuiescence().x, beforeBalst.getAnimate().getQuiescence().y, beforeBalst.getR(), 0, Math.PI * 2);
					ctx.closePath();
					ctx.fillStyle = beforeBalst.getColor();
					ctx.fill();
				}else if(status == 3){//烟火爆炸一瞬间产生一片亮光的时候
					var x = inBalst.getAnimate().getQuiescence().x,
						y = inBalst.getAnimate().getQuiescence().y,
						r = inBalst.getR(),
						color = inBalst.getColor(),
						alpha = inBalst.getAlpha();
					var gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
					gradient.addColorStop(0, '#FFFFFF');//白色的爆炸亮光,将天空照亮
					gradient.addColorStop(0.2, color);
					gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
					ctx.globalAlpha = alpha;
					ctx.fillStyle = gradient;
					ctx.fillRect(x - r, y - r, r * 2, r * 2);
				}else if(status == 4){//烟火爆炸后四散形成烟花的时候
					for(let i = 0; i < afterBalstList.length; i++){
						let afterBalstCopy = afterBalstList[i],
							animate = afterBalstCopy.getAnimate(),
							x = animate.getQuiescence().x,
							y = animate.getQuiescence().y,
							r = afterBalstCopy.getR(),
							color = afterBalstCopy.getColor(),
							alpha = afterBalstCopy.getDelay() > 0 ? 0 : afterBalstCopy.getAlpha();
						ctx.beginPath();
						ctx.globalAlpha = alpha;
						ctx.arc(x, y, r, 0, Math.PI * 2);
						ctx.closePath();
						ctx.fillStyle = color;
						ctx.fill();
					}
				}
				
			};
			firework.update = function(){//改变每一帧的烟火的状态
				if(status == 1){//烟火点燃引线的时候
					delay--;//每一帧引线时间减一
					if(delay <= 0){
						status = 2;//引线燃烧完之后,进入发射状态
					}
				}else if(status == 2){//发射升空状态
					var animate = beforeBalst.getAnimate(),
						move = animate.getMove(),//速度向量参数
						quiescence = animate.getQuiescence(),//静态位置参数
						translate = animate.getTranslate(),//加速度参数
						life = beforeBalst.getLife();//持续时间参数
					translate_animate_state(move,translate);//以上一帧的速度和加速度得到此次的速度
					change_quiescence(quiescence,move);//以此次的速度得到此次的位置
					beforeBalst.setLife(--life);//离爆炸的时间减一
					if(life <= 0){//离爆炸的时间为0 的时候
						status = 3;//进入爆炸瞬间产生白光照亮天空的状态
						inBalst.setLife(1);//持续一帧,视觉上看就是一闪的白光
						inBalst.setColor("#FFFFFF");//白色
						inBalst.setR(400);//亮光范围为400像素
						inBalst.setAlpha(0.4);//0.4倍亮度
						inBalst.setAnimate({//设置亮光中心点的位置
							quiescence : {
								x : quiescence.x,
								y : quiescence.y
							}
						});
					}
				}else if(status == 3){//爆炸瞬间产生白光照亮天空的状态
					var life = inBalst.getLife();
					inBalst.setLife(--life);
					if(life <= 0){
						status = 4;//进入烟花爆炸四散的状态
						fireworkType(firework);//生成	烟花爆炸的形状				
					}
				}else if(status == 4){//烟花爆炸
					for(let i = afterBalstList.length - 1; i >= 0; i--){
						let _afterBalst = afterBalstList[i],
							animate = _afterBalst.getAnimate(),
							quiescence = animate.getQuiescence(),//静态位置
							move = animate.getMove(),//速度向量
							translate = animate.getTranslate(),//加速度向量
							life = _afterBalst.getLife(),
							base = _afterBalst.getBase(),
							custom_g = _afterBalst.getCustomG(),
							_delay = _afterBalst.getDelay();
						if(_delay <= 0){//爆炸
							translate.ax = -move.vx * resistance;//水平方向           速度 * 空气阻力系数 = 反向加速度
							translate.ay = (getType(custom_g) == "number" ? custom_g : g) - move.vy * resistance;//垂直方向      重力加速度  - 速度 * 空气阻力速度 = 加速度
							if(Math.abs(translate.ay) < Math.pow(10,-8)){//加速度很小的时候,置为0,不然会一直根据上面的公式计算下去,白白浪费机能
								translate.ay = 0;
							}
							if(Math.abs(translate.ax) < Math.pow(10,-8)){//加速度很小的时候,置为0,不然会一直根据上面的公式计算下去,白白浪费机能
								translate.ax = 0;
							}
							translate_animate_state(move,translate);//以上一帧的速度和加速度得到此次的速度
							change_quiescence(quiescence,move);//以此次的速度得到此次的位置
							_afterBalst.setLife(--life);//离烟花消失时间减一
							_afterBalst.setAlpha(0.2 + life / base.life * base.alpha);//设置亮度,烟花持续时间越长亮度越低,最低亮度0.2
							if(life <= 0){
								afterBalstList.splice(i,1);//烟花消失
							}
							if(afterBalstList.length == 0){//爆炸产生的所有烟花消失
								status = 5;//进入烟花爆炸完成状态
							}
						}else{//爆炸延迟,进入爆炸状态到正真爆炸的延迟时间
							_afterBalst.setDelay(--_delay);
						}
						
					}
					
				}
				
			}
			return firework;
		}
};



var BeforeBalst = {//烟火上升的时间段的类
	getInstance : function(){
		var beforeBalst = {},
			animate = Animate.getInstance(),//运动状态参数
			r = 0,//半径
			life = 0,//离爆炸的时间
			color = "#000000",//烟火颜色
			base = {};
		//以下全是set和get方法
		beforeBalst.setAnimate = function(_beforeBalst){
			let quiescence = getType(_beforeBalst.quiescence) == 'object' ? _beforeBalst.quiescence : {},
				move = getType(_beforeBalst.move) == 'object' ? _beforeBalst.move : {},
				translate = getType(_beforeBalst.translate) == 'object' ? _beforeBalst.translate : {};
			animate.setQuiescence(quiescence);
			animate.setMove(move);
			animate.setTranslate(translate);
		}
		beforeBalst.getAnimate = function(){
			return animate;
		}
		beforeBalst.setR = function(_r){
			r = _r;
		}
		beforeBalst.getR = function(){
			return r;
		}
		beforeBalst.setColor = function(_color){
			color = _color;
		}
		beforeBalst.getColor = function(){
			return color;
		}
		beforeBalst.setLife = function(_life){
			life = _life;
		}
		beforeBalst.getLife = function(){
			return life;
		}
		beforeBalst.setBase = function(){
			base.animate = {
				quiescence : deepCopy(beforeBalst.getAnimate().getQuiescence()),
				move : deepCopy(beforeBalst.getAnimate().getMove()),
				translate : deepCopy(beforeBalst.getAnimate().getTranslate())
			};
			base.r = r;
			base.color = color;
			base.life = life;
		}
		beforeBalst.getBase = function(){
			return base;
		}
		return beforeBalst;
	}	
};

var InBalst = {//爆炸瞬间产生亮光照亮天空的类
	getInstance : function(){
		var inBalst = {},
			animate = Animate.getInstance(),
			r = 0,//亮光半径
			color = "#000000",//颜色
			life = 0,//亮光持续时间
			alpha = 0.25;//亮光亮度
		//以下全是set和get方法
		inBalst.setAnimate = function(_inBalst){
			let quiescence = getType(_inBalst.quiescence) == 'object' ? _inBalst.quiescence : {},
				move = getType(_inBalst.move) == 'object' ? _inBalst.move : {},
				translate = getType(_inBalst.translate) == 'object' ? _inBalst.translate : {};
			animate.setQuiescence(quiescence);
			animate.setMove(move);
			animate.setTranslate(translate);
		}
		inBalst.getAnimate = function(){
			return animate;
		}
		inBalst.setR = function(_r){
			r = _r;
		}
		inBalst.getR = function(){
			return r;
		}
		inBalst.setAlpha = function(_alpha){
			alpha = _alpha > 1 ? 1 : (_alpha < 0 ? 0 : _alpha);
		}
		inBalst.getAlpha = function(){
			return alpha;
		}
		inBalst.setColor = function(_color){
			color = _color;
		}
		inBalst.getColor = function(){
			return color;
		}
		inBalst.setLife = function(_life){
			life = _life;
		}
		inBalst.getLife = function(){
			return life;
		}
		return inBalst;
	}	
};

var AfterBalst = {//爆炸后烟花四散的时候,描述单点烟花状态的类
	getInstance : function(){
		var afterBalst = {},			
			animate = Animate.getInstance(),//烟花位置和运动参数
			base = {},
			alpha = 1,//亮度
			r = 0,//半径
			color = "#FFFFFF",//颜色
			life = 0,//持续时间
			delay = 0,//爆炸延迟
			custom_g = null;//自定义重力加速度
		//以下全是set和get方法
		afterBalst.setBase = function(){
			base.life = life;
			base.alpha = alpha;
		}
		afterBalst.getBase = function(){
			return base;
		}
		afterBalst.setAnimate = function(_afterBalst){
			let quiescence = getType(_afterBalst.quiescence) == 'object' ? _afterBalst.quiescence : {},
				move = getType(_afterBalst.move) == 'object' ? _afterBalst.move : {},
				translate = getType(_afterBalst.translate) == 'object' ? _afterBalst.translate : {};
			animate.setQuiescence(quiescence);
			animate.setMove(move);
			animate.setTranslate(translate);
		}
		afterBalst.getAnimate = function(){
			return animate;
		}
		afterBalst.setAlpha = function(_alpha){
			alpha = _alpha > 1 ? 1 : (_alpha < 0 ? 0 : _alpha);
		}
		afterBalst.getAlpha = function(){
			return alpha;
		}
		afterBalst.setR = function(_r){
			r = _r;
		}
		afterBalst.getR = function(){
			return r;
		}
		afterBalst.setDelay = function(_delay){
			delay = _delay;
		}
		afterBalst.getDelay = function(){
			return delay;
		}
		afterBalst.setCustomG = function(_customG){
			custom_g = _customG;
		}
		afterBalst.getCustomG = function(){
			return custom_g;
		}
		afterBalst.setColor = function(_color){
			color = _color;
		}
		afterBalst.getColor = function(){
			return color;
		}
		afterBalst.setLife = function(_life){
			life = _life;
		}
		afterBalst.getLife = function(){
			return life;
		}
		return afterBalst;
	}
};

var Animate = {//位置和运动状态类
	getInstance : function(){
		var animate = {};
		var quiescence = {//静态位置
			x : 0,//横坐标
			y : 0,//纵坐标
			deg : 0,//旋转弧度
			zoom : 1//放大倍数
		},move = {
			vx : 0,//横向速度
			vy : 0,//纵向速度
			pal: 0,//旋转速度
			scale : 0//缩放速度
		},translate = {
			ax : 0,//横向加速度
			ay : 0,//纵向加速度
			apal : 0,//旋转加速度
			ascale : 0//缩放加速度
		};
		//以下全是set和get方法
		animate.setQuiescence = function(_quiescence){
			quiescence.x = getType(_quiescence.x) != 'number' ? quiescence.x : _quiescence.x;
			quiescence.y = getType(_quiescence.y) != 'number' ? quiescence.y : _quiescence.y;
			quiescence.deg = getType(_quiescence.deg) != 'number' ? quiescence.deg : _quiescence.deg;
			quiescence.zoom = getType(_quiescence.zoom) != 'number' ? quiescence.zoom : _quiescence.zoom;
		}
		animate.getQuiescence = function(){
			return quiescence;
		}
		animate.setMove = function(_move){
			move.vx = getType(_move.vx) != 'number' ? move.vx : _move.vx;
			move.vy = getType(_move.vy) != 'number' ? move.vy : _move.vy;
			move.pal = getType(_move.pal) != 'number' ? move.pal : _move.pal;
			move.scale = getType(_move.scale) != 'number' ? move.scale : _move.scale;
		}
		animate.getMove = function(){
			return move;
		}
		animate.setTranslate = function(_translate){
			translate.ax = getType(_translate.ax) != 'number' ? translate.ax : _translate.ax;
			translate.ay = getType(_translate.ay) != 'number' ? translate.ay : _translate.ay;
			translate.apal = getType(_translate.apal) != 'number' ? translate.apal : _translate.apal;
			translate.ascale = getType(_translate.ascale) != 'number' ? translate.ascale : _translate.ascale;
		}
		animate.getTranslate = function(){
			return translate;
		}
		return animate;
	}
};


function createCircleFirework(firework){//创建圆形烟花
	var inBalst = firework.getInBalst(),
		num = firework.getNum(),//烟花的点点数量
		roundness = firework.getRoundness(),//规则度
		resistance = firework.getResistance(),//空气阻力系数
		afterBalstList = [];
	for(let i = 0; i < num; i++){								
		let afterBalstCopy = AfterBalst.getInstance(),
			degree = i * 2 * Math.PI / num,
			animate = inBalst.getAnimate(),
			quiescence = animate.getQuiescence(),
			v = 20 * (roundness + (1 - roundness) * Math.random());//默认烟花四散的速度为20像素每帧
		afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));//持续时间
		afterBalstCopy.setColor(randomColor());//随机颜色
		afterBalstCopy.setAlpha(1);//亮度为1
		afterBalstCopy.setR(2);//半径为2像素
		afterBalstCopy.setAnimate({
			quiescence : {
				x : quiescence.x,
				y : quiescence.y
			},move : {
				vx : Math.cos(degree) * v,
				vy : Math.sin(degree) * v										
			},translate : {
				ax : Math.cos(degree) * v * -resistance,//考虑空气阻力
				ay : g - resistance * Math.sin(degree) * v//考虑空气阻力
			}
		});
		afterBalstCopy.setBase();
		afterBalstList.push(afterBalstCopy);
	}
	firework.setAfterBalstList(afterBalstList);
}

function createHeartFirework(firework){//创建桃心形烟花
	var inBalst = firework.getInBalst(),
		num = firework.getNum(),
		roundness = firework.getRoundness(),
		resistance = firework.getResistance(),
		afterBalstList = [];
	for(let i = 0; i < num; i++){								
		let afterBalstCopy = AfterBalst.getInstance(),
			degree = i * 2 * Math.PI / num,
			animate = inBalst.getAnimate(),
			quiescence = animate.getQuiescence(),
			v = 20 * (roundness + (1 - roundness) * Math.random());
		afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
		afterBalstCopy.setColor(randomColor());
		afterBalstCopy.setAlpha(1);
		afterBalstCopy.setR(2);
		afterBalstCopy.setAnimate({
			quiescence : {
				x : quiescence.x,
				y : quiescence.y
			},move : {
				vx : 16 * Math.pow(Math.sin(degree), 3) / 13 * v,
				vy : -(13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v										
			},translate : {
				ax : 16 * Math.pow(Math.sin(degree), 3) / 13 * v * -resistance,
				ay : g - resistance * -(13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v	
			}
		});
		afterBalstCopy.setBase();
		afterBalstList.push(afterBalstCopy);
	}
	firework.setAfterBalstList(afterBalstList);
}

function createDoubleHeartFirework(firework){//创建一箭穿心形烟花
	var inBalst = firework.getInBalst(),
		num = firework.getNum(),
		roundness = firework.getRoundness(),
		resistance = firework.getResistance(),
		afterBalstList = [];
	for(let i = 0; i < num; i++){//绘制左边的全的爱心
		let degree = i * 2 * Math.PI / num,
			animate = inBalst.getAnimate(),
			quiescence = animate.getQuiescence(),
			v = 20 * (roundness + (1 - roundness) * Math.random());
		if(i > num / 16 && i < num * 5 / 8){//绘制右半个爱心
			let afterBalstCopy = AfterBalst.getInstance();
			afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
			afterBalstCopy.setColor(randomColor());
			afterBalstCopy.setAlpha(1);
			afterBalstCopy.setR(2);
			afterBalstCopy.setAnimate({
				quiescence : {
					x : quiescence.x,
					y : quiescence.y
				},move : {
					vx : 16 * Math.pow(Math.sin(degree), 3) / 13 * v + 20,
					vy : -(13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v										
				},translate : {
					ax : (16 * Math.pow(Math.sin(degree), 3) / 13 * v + 20) * -resistance,
					ay : g - resistance * -(13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v	
				}
			});
			afterBalstCopy.setBase();
			afterBalstList.push(afterBalstCopy);
		}	
		let afterBalstCopy = AfterBalst.getInstance();
		afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
		afterBalstCopy.setColor(randomColor());
		afterBalstCopy.setAlpha(1);
		afterBalstCopy.setR(2);
		afterBalstCopy.setAnimate({
			quiescence : {
				x : quiescence.x,
				y : quiescence.y
			},move : {
				vx : 16 * Math.pow(Math.sin(degree), 3) / 13 * v,
				vy : -(13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v										
			},translate : {
				ax : 16 * Math.pow(Math.sin(degree), 3) / 13 * v * -resistance,
				ay : g - resistance * -(13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v	
			}
		});
		afterBalstCopy.setBase();
		afterBalstList.push(afterBalstCopy);
	}
	num = Math.floor(num / 4);
	for(let i = 0; i < num; i++){//绘制箭的后半部分								
		let afterBalstCopy = AfterBalst.getInstance(),
			degree = 0,
			animate = inBalst.getAnimate(),
			quiescence = animate.getQuiescence(),
			v = 20 * (roundness + (1 - roundness) * Math.random());
		afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
		afterBalstCopy.setColor(randomColor());
		afterBalstCopy.setAlpha(1);
		afterBalstCopy.setR(2);
		afterBalstCopy.setAnimate({
			quiescence : {
				x : quiescence.x,
				y : quiescence.y
			},move : {
				vx : Math.cos(degree) * v + 20 + 30 * i / num,
				vy : Math.sin(degree) * v										
			},translate : {
				ax : (Math.cos(degree) * v + 20 + 30 * i / num) * -resistance,
				ay : g - resistance * Math.sin(degree) * v
			}
		});
		afterBalstCopy.setBase();
		afterBalstList.push(afterBalstCopy);
	}
	num = Math.floor(num * 4 / 3);
	for(let i = 0; i < num; i++){//绘制箭的前半部分							
		let afterBalstCopy = AfterBalst.getInstance(),
			degree = Math.PI,
			animate = inBalst.getAnimate(),
			quiescence = animate.getQuiescence(),
			v = 20 * (roundness + (1 - roundness) * Math.random());
		afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
		afterBalstCopy.setColor(randomColor());
		afterBalstCopy.setAlpha(1);
		afterBalstCopy.setR(2);
		afterBalstCopy.setAnimate({
			quiescence : {
				x : quiescence.x,
				y : quiescence.y
			},move : {
				vx : Math.cos(degree) * v + 10 - 30 * i / num,
				vy : Math.sin(degree) * v										
			},translate : {
				ax : (Math.cos(degree) * v + 10 - 30 * i / num) * -resistance,
				ay : g - resistance * Math.sin(degree) * v
			}
		});
		afterBalstCopy.setBase();
		afterBalstList.push(afterBalstCopy);
	}
	num = Math.floor(num * 12 / 5);
	for(let i = 0; i < num; i++){//绘制箭头,用一个横着的桃心形爱心模拟箭头							
		let afterBalstCopy = AfterBalst.getInstance(),
			degree = i * 2 * Math.PI / num,
			animate = inBalst.getAnimate(),
			quiescence = animate.getQuiescence(),
			v = 20 * (roundness + (1 - roundness) * Math.random()) / 6;
		afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
		afterBalstCopy.setColor(randomColor());
		afterBalstCopy.setAlpha(1);
		afterBalstCopy.setR(2);
		afterBalstCopy.setAnimate({
			quiescence : {
				x : quiescence.x,
				y : quiescence.y
			},move : {
				vx : (13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v - 40,
				vy : 16 * Math.pow(Math.sin(degree), 3) / 13 * v							
			},translate : {
				ax : ((13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v - 40) * -resistance,
				ay : g - resistance * 16 * Math.pow(Math.sin(degree), 3) / 13 * v	
			}
		});
		afterBalstCopy.setBase();
		afterBalstList.push(afterBalstCopy);
	}
	firework.setAfterBalstList(afterBalstList);
	
}


function createEllipseFirework(firework){//绘制椭圆烟花
	var inBalst = firework.getInBalst(),
		num = firework.getNum(),
		roundness = firework.getRoundness(),
		resistance = firework.getResistance(),
		afterBalstList = [];
	for(let i = 0; i < num; i++){								
		let afterBalstCopy = AfterBalst.getInstance(),
			degree = i * 2 * Math.PI / num,
			animate = inBalst.getAnimate(),
			quiescence = animate.getQuiescence(),
			v = 20 * (roundness + (1 - roundness) * Math.random());
		afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
		afterBalstCopy.setColor(randomColor());
		afterBalstCopy.setAlpha(1);
		afterBalstCopy.setR(2);
		afterBalstCopy.setAnimate({
			quiescence : {
				x : quiescence.x,
				y : quiescence.y
			},move : {
				vx : Math.cos(degree) * v * Math.cos(15 * Math.PI / 180) + Math.sin(degree) * v / 4 * Math.sin(15 * Math.PI / 180),
				vy : Math.sin(degree) * v / 4 * Math.cos(15 * Math.PI / 180) - Math.cos(degree) * v * Math.sin(15 * Math.PI / 180)										
			},translate : {
				ax : (Math.cos(degree) * v * Math.cos(15 * Math.PI / 180) + Math.sin(degree) * v / 4 * Math.sin(15 * Math.PI / 180)) * -resistance,
				ay : g - resistance * (Math.sin(degree) * v / 4 * Math.cos(15 * Math.PI / 180) - Math.cos(degree) * v * Math.sin(15 * Math.PI / 180))
			}
		});
		afterBalstCopy.setBase();
		afterBalstList.push(afterBalstCopy);
	}
	firework.setAfterBalstList(afterBalstList);
}



function createCustomFirework(firework){//绘制自定义烟花
	var inBalst = firework.getInBalst(),
		roundness = firework.getRoundness(),
		resistance = firework.getResistance(),
		animate = inBalst.getAnimate(),
		quiescence = animate.getQuiescence(),
		afterBalstList = [],	
		custom_g = g / 10,
		denominator = 10,
		r = 1.5,
		delay = 0;
	
	$.each(word,function(index,value){
		var text = word_matrix[value],
			num = text.length,
			position_x = word_position[index * 2],
			position_y = word_position[index * 2 + 1];
		for(let i = 0; i < num; i++){
			for(let j = 0; j < 9; j++){
				let point_x = text[i][0],
					point_y = text[i][1];
				switch(j){//每一个烟花再次按照九宫格的位置生成9个烟花,这样让字看起来更加丰满
					case 0 : 
						point_x -= 3.5 / denominator;
						point_y -= 3.5 / denominator;
						break;
					case 1 :
						point_y -= 3.5 / denominator;
						break;
					case 2 :
						point_x += 3.5 / denominator;
						point_y -= 3.5 / denominator;
						break;
					case 3 :
						point_x -= 3.5 / denominator;
						break;
					case 4 :
						break;
					case 5 :
						point_x += 3.5 / denominator;
						break;
					case 6 :
						point_x -= 3.5 / denominator;
						point_y += 3.5 / denominator;
						break;
					case 7 :
						point_y += 3.5 / denominator;
						break;
					case 8 :
						point_x += 3.5 / denominator;
						point_y += 3.5 / denominator;
						break;
					default :
						break;
				}
				let afterBalstCopy = AfterBalst.getInstance(),
					range = Math.sqrt(Math.pow(point_x, 2) + Math.pow(point_y, 2)),
					cos_degree = (range == 0) ? 0 : point_x / range,
					sin_degree = (range == 0) ? 0 : point_y / range,
					v = 2 * (roundness + (1 - roundness) * Math.random());
				afterBalstCopy.setDelay(delay);
				afterBalstCopy.setLife(200 + Math.floor(Math.random() * 40));
				afterBalstCopy.setColor(randomColor());
				afterBalstCopy.setAlpha(1);
				afterBalstCopy.setR(r);
				afterBalstCopy.setCustomG(custom_g);
				afterBalstCopy.setAnimate({
					quiescence : {
						x : quiescence.x + position_x,
						y : quiescence.y + position_y
					},move : {
						vx : v * range * cos_degree,
						vy : v * range * sin_degree										
					},translate : {
						ax :  (v * range * cos_degree) * -resistance,
						ay : custom_g - resistance * (v * range * sin_degree)
					}
				});
				afterBalstCopy.setBase();
				afterBalstList.push(afterBalstCopy);
			}
		}
		delay += 2;//每一个字都延迟2帧出现
	});	
	firework.setAfterBalstList(afterBalstList);
}




var word = ["黄","耀","慧","生","日","快","乐"];
var word_position = [-250,0,//黄 的位置
                     0,0,//耀 的位置
                     300,0,//慧 的位置
                     -375,250,//生 的位置
                     -125,250,//日 的位置
                     125,250,//快 的位置
                     375,250];//乐 的位置
//在如下坐标系中将这些点画出来就知道是什么意思了
//						|-6
//						|
//						|
//						|
//						|
//						|
//						|
//						|
//						|
//						|
//----------------------0---------------------->
//-6					|					  6
//						|
//						|
//						|
//						|
//						|
//						|
//						|
//						|6
//						V

var word_matrix = {黄 : [
        	[-3,-5],[-2,-5],[-1,-5],[0,-5],[1,-5],[2,-5],[3,-5],
        	[-1.5,-6],[-1.5,-5],[-1.5,-4],
        	[1.5,-6],[1.5,-5],[1.5,-4],
        	[-4,-3],[-3,-3],[-2,-3],[-1,-3],[0,-3],[1,-3],[2,-3],[3,-3],[4,-3],
        	[-2,-1],[-2,0],[-2,1],[-2,2],[-2,3],
        	[-1,-1],[0,-1],[1,-1],[2,-1],[2,0],[2,1],[2,2],[2,3],
        	[-1,1],[0,1],[1,1],
        	[0,-2],[0,0],[0,2],
        	[-1,3],[0,3],[1,3],
        	[-1,4],[-1,5],[-2,6],
        	[1,4],[1,5],[2,6]
        ], 耀 : [
            [-3,-6],[-3,-5],[-3,-4],[-3,-3],[-3,-2],
            [-6,-4],[-5,-3],[-4,-2],
            [-1,-4],[-1,-3],[-2,-2],
            [-6,-1],[-5,-1],[-4,-1],[-3,-1],[-2,-1],[-1,-1],
            [-3.5,0],[-3.5,1],[-3.5,2],[-3.5,3],[-4.5,4],[-5.5,5],
            [-2.5,0],[-2.5,1],[-2.5,2],[-2.5,3],[-2.5,4],[-2.5,5],[-1.5,4],[-0.5,3],
            [0,-6],[1,-6],[2,-6],[2,-5],[2,-4],[2,-3],[2,-2],
            [0,-5],[1,-4],
            [0,-2],[1,-3],
            [4,-6],[5,-6],[6,-6],[6,-5],[6,-4],[6,-3],[6,-2],
            [4,-5],[5,-4],
            [4,-2],[5,-3],
            [2,-1],[1,0],[0,0],
            [1,1],[1,2],[1,3],[1,4],[1,5],[1,6],
            [4.5,-1],
            [3,0],[4,0],[5,0],[6,0],
            [3.5,2],[4.5,2],[5.5,2],
            [3.5,4],[4.5,4],[5.5,4],
            [3,6],[4,6],[5,6],[6,6],
            [4.5,1],[4.5,3],[4.5,5]
        ], 慧 : [
            [-5,-5],[-4,-5],[-3,-5],[-2,-5],[-1,-5],
            [-4,-3.5],[-2,-3.5],
            [-5,-2],[-4,-2],[-3,-2],[-2,-2],[-1,-2],
            [-3,-6],[-3,-4],[-3,-3],[-3,-1],
            [1,-5],[2,-5],[3,-5],[4,-5],[5,-5],
            [2,-3.5],[4,-3.5],
            [1,-2],[2,-2],[3,-2],[4,-2],[5,-2],
            [3,-6],[3,-4],[3,-3],[3,-1],
            [-3,0],[-2,0],[-1,0],[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],
            [-2,1.5],[-1,1.5],[0,1.5],[1,1.5],[2,1.5],
            [-3,3],[-2,3],[-1,3],[0,3],[1,3],[2,3],
            [-5,4],[-6,5],
            [-4,4],[-4,5],[-3,6],[-2,6],[-1,6],[0,6],[1,6],[2,6],[3,6],[4,6],[4,5],
            [0,4],[1,5],
            [5,3],[5,4],[6,5]
        ], 生 : [
            [-3,-5],[-3,-4],[-3.5,-3],[-4,-2],[-5,-1],[-6,-1],
            [-3,-2],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[3,-2],
            [-2,1],[-1,1],[0,1],[1,1],[2,1],
            [0,-5],[0,-4],[0,-3],[0,-1],[0,0],[0,2],[0,3],[0,4],
            [-5,5],[-4,5],[-3,5],[-2,5],[-1,5],[0,5],[1,5],[2,5],[3,5],[4,5]
        ], 日 : [
            [-3,-4],[-3,-3],[-3,-2],[-3,-1],[-3,0],[-3,1],[-3,2],[-3,3],[-3,4],[-3,5],
            [-2,-4],[-1,-4],[0,-4],[1,-4],[2,-4],[3,-4],[3,-3],[3,-2],[3,-1],[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],
            [-2,0],[-1,0],[0,0],[1,0],[2,0],
            [-2,5],[-1,5],[0,5],[1,5],[2,5]
        ], 快 : [
            [-5,-2],[-5,-1],[-6,0],
            [-4,-5],[-4,-4],[-4,-3],[-4,-2],[-4,-1],[-4,0],[-4,1],[-4,2],[-4,3],[-4,4],[-4,5],
            [-3,-1],[-2,0],
            [-1,-2],[0,-2],[1,-2],[2,-2],[3,-2],[4,-2],[4,-1],[4,0],
            [-2,1],[-1,1],[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],
            [1,-5],[1,-4],[1,-3],[1,-1],[1,0],[1,2],[0,3],[-1,4],[-2,5],
            [2,3],[3,4],[4,5]
        ], 乐 : [
            [3,-5],[2,-4.5],[1,-4],[0,-4],[-1,-4],[-2,-4],[-3,-4],[-4,-4],
            [-4,-3],[-4,-2],[-4,-1],[-4,0],[-3,0],[-2,0],[-1,0],[0,0],[1,0],[2,0],[3,0],[4,0],
            [0,-3],[0,-2],[0,-1],[0,1],[0,2],[0,3],[0,4],[0,5],[-1,5],[-2,4],
            [-3,2],[-3,3],[-4,4],
            [2,2],[3,3],[4,4]
        ]};

