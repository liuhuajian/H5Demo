/**
 * 设定使用url
 */

var protocol = window.location.protocol;
window.hostname = window.location.origin;
if(protocol.indexOf("file") != -1){
	window.hostname = "http://192.168.0.12"; 
}