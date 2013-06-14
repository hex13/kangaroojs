kng.define('byt', {
    model: {
        istnieje:true
    }, events: {
        whois: function() {
            alert('jestem bytem!');
        }
    }, plugins: [{
          events: {
              whois: function() {
                  alert('jestem pluginem bytowym!');
              }              
          }
        
    }]
});


kng.define('zwierze', {
    model: {
        zyje:true,
        porusza_sie:true,
        istnieje:false
    }, events: {
        whois: function() {
            alert('jestem zwierze!');
        }
    }, plugins: [{
          events: {
              whois: function() {
                  alert('jestem pluginem zwierzecym!');
              }              
          }
        
    }]
    
}, 'byt');

var piesek = kng.create('zwierze', {
    model: {
        lubi: 'miesko'
    },
    events: {
        whois: function(){
            alert('jestem piesek!');
        }
    }, plugins: [{
          events: {
              whois: function() {
                  alert('jestem pluginem pieskowym!!');
              }              
          }
        
    }, {
        events: {
            whois: function() {
                alert('jestem drugim pluginem pieskowym!!');
            }              
        }
    }
    
    ]
});
//piesek.send('whois');
//piesek.events.whois();

console.log(piesek);
console.log('kng.types.byt');
console.log(kng.types.byt);
console.log(kng.types.zwierze);
console.log('kng.types.zwierze');

//-------------------------------





function PluginTest() {
    console.log('PLUGIN TEST ROZPOCZETY');
    var pluginTest = '';
    var expected;    

    var plugin1 = {
        events: {
            apdejt: function() {
                pluginTest += 'plugin1apdejt;';
            }
        }
    };
    var plugin2 = {
        events: {
            apdejt: function() {
                pluginTest += 'plugin2apdejt;';
            }
        }
    };
    var plugin3 = {
        events: {
            apdejt: function() {
                pluginTest += 'plugin3apdejt;';
            }
        }
    };
    var plugin4 = {
        events: {
            apdejt: function() {
                pluginTest += 'plugin4apdejt;';
            }
        }
    };
    var death = {
        events: {
            apdejt: function() {
                pluginTest += 'deathapdejt;';
            }
        }
    };    
    var gossips = {
        events: {
            apdejt: function() {
                pluginTest += 'gossipsapdejt;';
            }
        }
    };    
    var heaven = {
        events: {
            apdejt: function() {
                pluginTest += 'heavenapdejt;';
            }
        }
    };    
    var shopping = {
        events: {
            apdejt: function() {
                pluginTest += 'shoppingapdejt;';
            }
        }
    };    
        
    
    
    
    kng.define('Byt', {
        plugins: [plugin1, plugin2, plugin3, plugin4]
    });    

    var byt = kng.create('Byt');
    byt.send('apdejt');
    expected = "plugin1apdejt;plugin2apdejt;plugin3apdejt;plugin4apdejt;";
    assert(pluginTest==expected, 'testowanie wykonania pluginow, bez hierarchii');    

    kng.define('Istota', {
        plugins: [plugin1, plugin2, plugin3, plugin4]
    },'Byt');    
    var istota = kng.create('Istota');
    
    pluginTest = '';
    istota.send('apdejt');
    assert(pluginTest==expected, 'testowanie wykonania pluginow, z 1 przodkiem');
    
    pluginTest ='';
    kng.define('Czlowiek', {
        plugins: [plugin1, plugin2, plugin3, plugin4, death]
    },'Istota');    
    pluginTest = '';
    var czlowiek = kng.create('Czlowiek');
    czlowiek.send('apdejt');
    expected =  "plugin1apdejt;plugin2apdejt;plugin3apdejt;plugin4apdejt;deathapdejt;";
    assert(pluginTest==expected, 'testowanie wykonania pluginow, z 2 przodkami i dodatkowym pluginem');

    pluginTest = '';
    
    kng.define('Marynia', {
        plugins: [gossips, death, heaven]
    },'Czlowiek');    
    var marynia = kng.create('Marynia');
    marynia.send('apdejt');
    expected = "plugin1apdejt;plugin2apdejt;plugin3apdejt;plugin4apdejt;gossipsapdejt;deathapdejt;heavenapdejt;";
    assert(pluginTest==expected, 'testowanie pluginow. z 3 przodkami i dodatkowym pluginem pomiedzy');    

    var corka_maryni = kng.create('Marynia', {plugins:[shopping, plugin3]});
    pluginTest = '';
    expected = 'plugin1apdejt;plugin2apdejt;plugin4apdejt;gossipsapdejt;deathapdejt;heavenapdejt;shoppingapdejt;plugin3apdejt;'
    corka_maryni.send('apdejt');
    //^__ to wyzej nie ma troche sensu ze po smierci na zakupy; ale tak juz musi dzialac 
    // przy okreslaniu listy pluginow jako parametr do funkcji create/define
    // zeby bylo elastycznie to:
    //TODO: dorobic dodatkowe funkcje addPluginAt.... removePlugin etc.
    assert(pluginTest==expected, 'sprawdzanie pluginow - funkcja create');

    assert(kng.types.Marynia, 'sprawdzanie czy typ istnieje');
  /*  kng.reset();    
    assert(!kng.types.Marynia, 'sprawdzanie czy typy sie skasowaly');*/
    console.log('PLUGIN TEST ZAKONCZONY');
}
new PluginTest();


//obj.event('collision')
//       .launch('apple', 'forward 1', -2).dec('energy', 10);










function ComTest() {
    var com = new Messenger;
    var s = '';
    var a = {
        send: function(msg) {
            s += msg.v;
        }
    };
    com.send({to:a, v:20});
    com.send({to:a, v:10});
    assert(s==='','ComTest1');
    com.dispatch();
    assert(s==='2010','ComTest2');    
    com.send({to:a, v:1209, immediate:true});    
    assert(s==='20101209','ComTest3');    
};

new ComTest;
