/**
 * 获取变量类型
 */
function getType(obj){
    var toString = Object.prototype.toString;
    var map = {
       '[object Boolean]'  : 'boolean', 
       '[object Number]'   : 'number', 
       '[object String]'   : 'string', 
       '[object Function]' : 'function', 
       '[object Array]'    : 'array', 
       '[object Date]'     : 'date', 
       '[object RegExp]'   : 'regExp', 
       '[object Undefined]': 'undefined',
       '[object Null]'     : 'null', 
       '[object Object]'   : 'object'
   };
   if(obj instanceof Element) {
        return 'element';
   }
   return map[toString.call(obj)];
}

/**
 * 利用递归实现深拷贝
 */
function deepCopy(data){
    var type = getType(data);
    var obj;
    if(type === 'array'){
        obj = [];
    } else if(type === 'object'){
        obj = {};
    } else {
        //不再具有下一层次
        return data;
    }
    if(type === 'array'){
        for(var i = 0, len = data.length; i < len; i++){
            obj.push(deepCopy(data[i]));
        }
    } else if(type === 'object'){
        for(var key in data){
            obj[key] = deepCopy(data[key]);
        }
    }
    return obj;
}