var DB = require('../db/data-base');
var Host = DB.import('host');

module.exports = {
    save: save,
    update: update,
    remove: remove,
    findById: findById,
    findAll: findAll
}

function save(host, callback){
	Host.create(host).then(function(it){
	    callback(null, it.dataValues);
	}).catch(function(err){
	    callback(err);
	});
}

function update(host, callback){
    Host.findById(host.id).then(function(it) {
        if (it) {
            it.name = host.name;
            it.ip = host.ip;

            it.save.then(function(){
                console.log(it.dataValues);
                callback(null, it.dataValues);
            });
        } else {
            callback({result: false, message: 'Nenhum registro encontrador para id = ' + id});
        }
    }).catch(function(err){
        callback(err);
    });
}

function findById(id, callback) {
	Host.findById(id).then(function(it) {
        getNodes(it, function(err, data){
            callback(err, data);
        });
    }).catch(function(err){
		callback(err);
	});
}

function remove(id, callback) {
    Host.findById(id).then(function(it) {
        if (it)
            it.destroy().then(function() {
                callback(null, {result: true});
            });
        else {
            callback({result: false, message: 'Nenhum registro encontrador para id = ' + id});
        }
    }).catch(function(err){
        callback(err);
    });
}

function getNodes(host, callback){
    host.getNodes().then(function(nodes) {
        var _host = host.dataValues;
        _host.nodes = [];

        nodes.forEach(function(node){
            _host.nodes.push(node.dataValues)
        });

	    callback(null, _host);
    });
}


function findAll(callback) {
	Host.findAll({where: {hostId: null}, order: ['id']}).then(function(hosts){
		var _hosts = []

		hosts.forEach(function(it, index){
            getNodes(it, function(err, data){
                _hosts.push(data);

                if(hosts.length === _hosts.length) {
                    callback(null, _hosts);
                }
            });
        });
	}).catch(function(err){
	    callback(err);
    });
}


//
//var h1 = {
//        name: "bytecom-mk-patricia-gomes",
//        ip: "10.77.100.1"
//    }
//var h2 = {
//        name: "bytecom-patricia-gomes-rep1",
//        ip: "10.77.100.101"
//    }

//Host.create(h1).then(function(host){
//    Host.create(h2).then(function(host2){
//        host.setNodes([host2])
//    });
//});