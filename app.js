const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars= require('express-handlebars');
const app = express();
const urlencodeParser = bodyParser.urlencoded({extended:false});


const sql = mysql.createPool({
	host:'localhost',
	user: 'root',
	password: '1234',
	database: 'lista_telefonica',
	port: 3306
});
/*
const sql = mysql.createPool({
	user: "bfc2a399bb6c31",
	password: "b655126c",
	host: "us-cdbr-iron-east-04.cleardb.net",
	database: "heroku_1405222828f0c04"
});
*/

app.use('/img',express.static('img'));
app.use('/js',express.static('js'));
app.use('/css',express.static('css'));

//Template engine
app.engine('handlebars',handlebars({defaultLayout:'main'}));
app.set('view engine','handlebars');

var port = process.env.PORT || 3000;
//Routes and templates

app.get("/",function(req,res){
	//res.sendFile(__dirname+"/index.html");
	res.render('index');
	//console.log(req.params.id);
});

app.get("/inserir",function(req,res) {
	res.render('inserir');
});

app.get("/select",function(req,res) {
	res.render('select');
});

app.get("/deletar/:id",function(req,res) {

	sql.getConnection(function(err,connection){
		connection.query("delete from user where id=?",[req.params.id])
		res.render('deletar');
	});


});

app.get("/update/:id",function(req,res) {
	sql.query("select * from user where id=?",[req.params.id],function(err,results,fields){
		res.render('update',{nome:results[0].nome,telefone:results[0].telefone,id:req.params.id});
	});
});

app.post("/selectForm",urlencodeParser,function(req,res) {
	sql.getConnection(function(err,connection){
		connection.query("SELECT * FROM user WHERE nome LIKE ?",req.body.nome + '%',function(err,results,fields){
			if(Object.entries(results).length === 0){
				res.render("aviso");
			}else{
				res.render("selectForm",{data:results});
			}
		});
	});
});

app.post('/controllerForm',urlencodeParser,function(req,res){

	sql.getConnection(function(err,connection){
		const values=[[req.body.nome,req.body.telefone]];
		sql.query("insert into user (nome,telefone) values ?",[values]);
		res.render("controllerForm",{nome:req.body.nome});
	});

});

app.post('/update/controllerUpdate',urlencodeParser,function(req,res){
	sql.getConnection(function(err,connection){
		connection.query("update user set nome=?, telefone=? where id=?",[req.body.nome,req.body.telefone,req.body.id]);
		res.render("controllerUpdate");
	});	

});

//start
app.listen(port,function(req,res){
	console.log('Servidor está rodando');
});