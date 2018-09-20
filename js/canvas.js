/**
 * 获取canvas对象
 * @author semitree
 * @param id
 * @returns
 */
function $$(id){
	return document.getElementById(id);
}

/**
 * 检测浏览器是否支持canvas
 * @author semitree
 * @returns
 */
function canvasSupport(){
    return !document.createElement('testcanvas').getContext;
}

/**
 * 旋转一定弧度
 * @author semitree
 * @param params
 * params.x : 要旋转的点的x坐标
 * params.y : 要旋转的点的y坐标
 * params.center_x : 中心点x坐标
 * params.center_y : 中心点y坐标
 * params.deg : 弧度,为正则顺时针旋转,为负则逆时针旋转
 * @returns
 */
function rotate(params){
	if(getType(params) == 'undefined' 
	   || getType(params.x) != 'number' 
	   || getType(params.y) != 'number' 
	   || getType(params.center_x) != 'number' 
	   || getType(params.center_y) != 'number' 
	   || getType(params.deg) != 'number'){
		return {};
	}else{
		let x = params.x,
			y = params.y,
			center_x = params.center_x,
			center_y = params.center_y,
			deg = params.deg;
		let new_x = (x - center_x) * Math.cos(deg) - (y - center_y) * Math.sin(deg) + center_x,
			new_y = (x - center_x) * Math.sin(deg) + (y - center_y) * Math.cos(deg) + center_y;
		params.x = new_x;
		params.y = new_y;
		return params;
	}	
}

/**
 * 每一帧的动画
 * @param params
 * params.x : 初始位置的x坐标
 * params.y : 初始位置的y坐标
 * params.del : 初始位置的旋转弧度
 * params.zoom : 初始位置的缩放倍率
 * @param animate_params
 * animate_params.vx : x方向位移
 * animate_params.vy : y方向位移
 * animate_params.pal : 角速度,正为顺时针
 * animate_params.scale : 缩放速度
 * @returns 返回一帧之后的绘制参数
 */
function change_quiescence(params, animate_params){
	var _default = {
		vx : 0,
		vy : 0,
		pal : 0,
		scale : 0
	};
	if(getType(params.x) != 'number' || getType(params.y) != 'number' || getType(params.deg) != 'number' && getType(params.deg) != 'undefined' || getType(params.zoom) != 'number'){
		return {};
	}
	var vx = getType(animate_params.vx) != 'number' ? _default.vx : animate_params.vx,
		vy = getType(animate_params.vy) != 'number' ? _default.vy : animate_params.vy,
		pal = getType(animate_params.pal) != 'number' ? _default.pal : animate_params.pal,
		scale = getType(animate_params.scale) != 'number' ? _default.scale : animate_params.scale;
	params.x += vx;
	params.y += vy;
	params.deg += pal;
	params.zoom += scale;
	return params;
}

/**
 * 改变每一帧的运动状态参数
 * @param animate_params
 * animate_params.vx : x方向位移
 * animate_params.vy : y方向位移
 * animate_params.pal : 角速度,正为顺时针
 * animate_params.scale : 缩放速度
 * @param translate_params
 * translate_params.ax : x方向加速度
 * translate_params.ay : y方向加速度
 * translate_params.apal : 角加速度
 * translate_params.ascale : 缩放加速度
 * @returns
 */
function translate_animate_state(animate_params, translate_params){
	var _default = {
		ax : 0,
		ay : 0,
		apal : 0,
		ascale : 0
	};
	if(getType(animate_params.vx) != 'number' || getType(animate_params.vy) != 'number' || getType(animate_params.pal) != 'number' || getType(animate_params.scale) != 'number'){
		return {};
	}
	var ax = getType(translate_params.ax) != 'number' ? _default.ax : translate_params.ax,
		ay = getType(translate_params.ay) != 'number' ? _default.ay : translate_params.ay,
		apal = getType(translate_params.apal) != 'number' ? _default.apal : translate_params.apal,
		ascale = getType(translate_params.ascale) != 'number' ? _default.ascale : translate_params.ascale;
	animate_params.vx += ax;
	animate_params.vy += ay;
	animate_params.pal += apal;
	animate_params.scale += ascale;
	return animate_params;
}

/**
 * 获取随机颜色
 * @returns {String}
 */
function randomColor() {
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	var color = 'rgb($r, $g, $b)';
	color = color.replace('$r', r);
	color = color.replace('$g', g);
	color = color.replace('$b', b);
	return color;
}











