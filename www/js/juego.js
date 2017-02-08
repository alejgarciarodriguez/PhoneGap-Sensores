var app={
  inicio: function(){
    DIAMETRO_mini_bola = 15;
    dificultad = 1;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    var maze;
    var cursors;

    function preload() {
      
      game.stage.backgroundColor = '#f27d0c';
      game.load.image('mini_bola','assets/mini_bola.png');
      game.load.image('maze','assets/maze.png');

      game.load.physics('physicsData', 'assets/mapa.json');
    }

    function create() {
      game.physics.startSystem(Phaser.Physics.P2JS);
      game.physics.p2.applyGravity = false
      maze = game.add.sprite(game.world.centerX, game.world.centerY,'maze');
      maze.static = true;
      maze.kinematic = false;
      maze.mass = 0;
      game.physics.p2.enable(maze);
      maze.body.clearShapes();
      maze.body.loadPolygon('physicsData', 'maze');
      

      game.physics.p2.defaultRestitution = 0.8;
      
      mini_bola = game.add.sprite(maze.body.x, maze.body.y, 'mini_bola');
      mini_bola.static = true;
      mini_bola.kinematic = false;
      mini_bola.mass = 0;

      game.physics.p2.enable(mini_bola);


      mini_bola.body.collideWorldBounds = true;
      mini_bola.body.onWorldBounds = new Phaser.Signal();
      mini_bola.body.onWorldBounds.add( () => console.log("bounds"), this);
      
      cursors = game.input.keyboard.createCursorKeys();
    }

    function update(){
      //var factorDificultad = (300 + (dificultad * 100));
      //mini_bola.body.velocity.y = (velocidadY * factorDificultad);
      //mini_bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
      if(cursors.up.isDown){
        mini_bola.body.y--;
      } else if(cursors.down.isDown){
        mini_bola.body.y++;
      } else if(cursors.left.isDown){
        mini_bola.body.x--;
      } else if(cursors.right.isDown){
        mini_bola.body.x++;
      }

    }
      

    function render(){}

    var estados = { preload: preload, create: create, update: update, render: render };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}