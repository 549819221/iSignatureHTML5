(function(root){
	var isIE8 = false;
	if(root['JSON']){
		isIE8 = '{"x":"中"}' !== root['JSON'].stringify({x:'中'});
	}
	
	var now = function() {
        return (new Date()).getTime();
    }
	function rnd( seed ){
	    seed = ( seed * 9301 + 49297 ) % 233280;
	    return seed / ( 233280.0 );
	};
	
	var Utils = {};
	
	function stringify(isIE8){
		if(isIE8){
			return function(obj){
				var string = JSON.stringify(obj);
				return string.replace(/\\u([0-9a-fA-F]{2,4})/g,function(string,matched){
		            return String.fromCharCode(parseInt(matched,16))
		        })
			}
		}else{
			return function(obj){
				return JSON.stringify(obj);
			}
			
		}
	}
	
	
	var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
	 
	var isArrayLike = function(collection) {
		var length = collection && collection.length;
		return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	};
	 
	var allKeys = function(obj) {
		if (!Utils.is('Object' , obj)) return [];
		var keys = [];
		for (var key in obj) keys.push(key);
		if (hasEnumBug) collectNonEnumProps(obj, keys);
		return keys;
	}
	 function collectNonEnumProps(obj, keys) {
			var nonEnumIdx = nonEnumerableProps.length;
			var constructor = obj.constructor;
			var proto = (Utils.is('Function' , constructor) && constructor.prototype) || ObjProto;
			var prop = 'constructor';
		    if (Utils.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
		
		    while (nonEnumIdx--) {
				prop = nonEnumerableProps[nonEnumIdx];
				if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
					keys.push(prop);
				}
		    }
		}
	var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };
	
	 /**
	 * JSON序列化
	 */
	Utils.stringify =  stringify(isIE8);
		
	Utils.slice =  function (args, start) {
	    var len = args.length, ret = [];
	    start = start || 0;
	    while (len-- > start) ret[len - start] = args[len];
	    return ret;
	}
	
	Utils.rand =  function(len){
		return Math.ceil( rnd( new Date().getTime() ) * len );
	}
	
	Utils.extend = createAssigner(allKeys);
	
	Utils.inherit = function (Child, Parent) {
		var F = function(){};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.uber = Parent.prototype;
	};
	
	
	Utils.is = function (type, obj) {
	    var clas = Object.prototype.toString.call(obj).slice(8, -1);
	    return obj !== undefined && obj !== null && clas === type;
	};
	
	Utils.$ = function(id){
		var obj = document.getElementById(id);
		if(!obj){
			var z = document.getElementsByName(id);
			if(z.length>0){
				obj = z[0];
			}
		}
		if(!obj){
			var z = document.getElementsByTagName(id);
			if(z.length>0){
				obj = z[0];
			}
		}
		return obj;
	}
	
	Utils.formatDate = function (date  , fmt) {
	    var o = {
	        "M+": date.getMonth() + 1,
	        "d+": date.getDate(),
	        "h+": date.getHours(),
	        "m+": date.getMinutes(),
	        "s+": date.getSeconds(),
	        "q+": Math.floor((date.getMonth() + 3) / 3),
	        "S": date.getMilliseconds()
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
	
	Utils.val =  function(fn , self){
		if(Utils.is('Function' , fn)){
			var args = Utils.slice( arguments , 2);
			return fn.apply(self , args);
		}else{
			return fn;
		}
	}
	
	Utils.template =  function(html, target){
		var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(var|if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
	    var add = function(line, js) {
	        js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
	            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
	        return add;
	    }
	    while(match = re.exec(html)) {
	        add(html.slice(cursor, match.index))(match[1], true);
	        cursor = match.index + match[0].length;
	    }
	    add(html.substr(cursor, html.length - cursor));
	    code += 'return r.join("");';
	    return new Function(code.replace(/[\r\t\n]/g, '')).apply(target , slice(arguments , 2));
	}
	
	Utils.firstChar = function(str , x){
		return str.substring(0,1)[x?'toLowerCase':'toUpperCase']()+str.substring(1);
	};
	
	root.kingUtils = Utils;
})(this);