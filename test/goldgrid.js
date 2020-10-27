(function(root , Utils){
	var Promise = root.Promise;
	
	
	var interErr = {result:false , errcode:'interErr'};
	var responseErr = {result:false , errcode:'responseErr'};
	var connectionErr = {result:false , errcode:'connectionErr'};
	
	var parseErr = {result:false , errcode:'parseErr'};
	var timeoutErr = {result:false , errcode:'timeoutErr'};
	var serverErr = {result:false , errcode:'serverErr'};
	
	var kinggrid =  function(url , proid , proidName){
		
		
	}
	
	
	var kingProto = kinggrid.prototype;

	kingProto.invoke = function(methodName ){
		this.promise();
	};
	
	
	
	root.kinggrid = kinggrid;
})(this , kingUtils);