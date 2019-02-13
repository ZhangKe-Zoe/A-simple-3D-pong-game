"use strict";

// Initialize webGL
const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const renderer1 = new THREE.WebGLRenderer({canvas:canvas1,antialias:true});
renderer1.setClearColor('white');    
const renderer2 = new THREE.WebGLRenderer({canvas:canvas2, antialias:true});
renderer2.setClearColor('white');    // set background color

// Create a new Three.js scene with camera and light
const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera( 75, canvas1.width / canvas1.height, 0.1, 1000 );
camera1.position.set(2,0.3,2);
camera1.lookAt(scene1.position);   // camera looks at origin
const ambientLight = new THREE.AmbientLight('white');
scene1.add(ambientLight);

const scene2 = scene1.clone();
const camera2 = camera1.clone();

//Create a box
function Createbox( wbox,hbox,lbox){

const boxgeo= new THREE.BoxBufferGeometry( wbox,hbox,lbox);
const boxedg = new THREE.EdgesGeometry( boxgeo );
const box = new THREE.LineSegments( boxedg, new THREE.LineBasicMaterial( { color: 'green' } ) );

return box;
}

const lbox = 2;
const wbox = 1;
const hbox = 1;

const box1 = Createbox( wbox,hbox,lbox);
const box2 = box1.clone();

scene1.add( box1 );
scene2.add( box2 );

//Add a small ball to the box
function Createball(r,color){

const ballgeo = new THREE.SphereGeometry( r, 16,16);
const ballmat = new THREE.MeshPhongMaterial({color: color} );
const ball = new THREE.Mesh(ballgeo, ballmat);

return ball
}

const r = 0.05;

const ball1 = Createball(r,'black');
const ball2 = Createball(r,'yellow');

scene1.add(  ball1 );
scene2.add(  ball2 );


//Create a racket to the front side of the box
function Creatrkt(wrkt,hrkt,color,position){

const rktgeo = new THREE.PlaneGeometry( wrkt,hrkt);
const rktedg = new THREE.EdgesGeometry( rktgeo);
const rkt = new THREE.LineSegments( rktedg, new THREE.LineBasicMaterial( { color: color } ) );

//Position the racket initially at the center of the front side
rkt.position.z = position;
rkt.position.x = rkt.position.y = 0;

return rkt;
}

//Add a red racket to the front side of the box1
//Add a blue racket to the back side of the box1
const wrkt = wbox/4;
const hrkt = hbox/4;

const rktr1 = Creatrkt(wrkt,hrkt,'red',0.99)
const rktb1 = Creatrkt(wrkt,hrkt,'blue',-0.99)
scene1.add( rktr1 );
scene1.add( rktb1 );

//Add a red racket to the back side of the box2
//Add a blue racket to the front side of the box2
const rktr2 = Creatrkt(wrkt,hrkt,'red',-0.99)
const rktb2= Creatrkt(wrkt,hrkt,'blue',0.99)
scene2.add( rktr2 );
scene2.add( rktb2 );

//Add key events 
//Set the initial velocity of rackets
let rx1=0,ry1=0;
let rx2=0,ry2=0;

function mycb(event){

   event.preventDefault();

   //Use arrow keys to move the red acket.
  if (event.keyCode === 37) 
  {
  	 rx1 = -0.5;
  	 ry1 = 0;
  } 
  else if (event.keyCode === 39) 
  {
  	 rx1 = 0.5;
  	 ry1 = 0;
  } 
  else if(event.keyCode === 38)
  {
  	 ry1 = 0.5;
  	 rx1 = 0;
  }
  else if(event.keyCode === 40)
  {
  	 ry1 = -0.5;
  	 rx1 = 0;
  }

//Use the keys w, a, s, y to move the blue racket.
  if (event.keyCode === 65) 
  {
     rx2 = -0.5;
     ry2 = 0;
  } 
  else if (event.keyCode === 83) 
  {
     rx2 = 0.5;
     ry2 = 0;
  } 
  else if(event.keyCode === 87)
  {
     ry2 = 0.5;
     rx2 = 0;
  }
  else if(event.keyCode === 89)
  {
     ry2 = -0.5;
     rx2 = 0;
  }
	
}
document.addEventListener('keydown',mycb)
document.addEventListener('keyup',()=>{rx1=0;ry1=0;rx2=0;ry2=0;});

//Set flag
let flag=prompt("Please set the players number( 1 or 2)");

if (flag==='1')
{
  alert("Single player mode.");
}
else if(flag==='2')
{
  alert("Doble player mode.");
}
else
{
  prompt("Please set the players number( 1 or 2)");
}




//Render loop
//const axisHelper = new THREE.AxisHelper( 3 );
//scene1.add( axisHelper );
const controls1 = new THREE.TrackballControls( camera1, canvas1 );
const controls2 = new THREE.TrackballControls( camera2, canvas2 );
const clock = new THREE.Clock();
controls1.rotateSpeed = 2;
controls2.rotateSpeed = 2;

//Set a random initial velocity
let vx1,vy1,vz1,vx2,vy2,vz2;
vx1 = 0.3*Math.random();
vy1 = 0.3*Math.random();

vx2 = 0.3*Math.random();
vy2 = 0.3*Math.random();

//Set the largest speed component along the length of the box
vz1 = (vx1>vy1?vx1:vy1)+0.01;
vz2 = (vx2>vy2?vx2:vy2)+0.01;

function render() 
 {
  requestAnimationFrame(render);

  const h = clock.getDelta();
  const t = clock.getElapsedTime();


//Motion of balls
  ball1.position.x += vx1*h;
  ball1.position.y += vy1*h; 
  ball1.position.z += vz1*h; 

  ball2.position.x += vx2*h;
  ball2.position.y += vy2*h; 
  ball2.position.z += vz2*h; 

//Motion of rackets
// Move the racket1 within the front side plane of the box
  if(rktr1.position.x< - (wbox-wrkt)/2)
  {
  	rktr1.position.x = - (wbox-wrkt)/2;

  }
  else if(rktr1.position.x> (wbox-wrkt)/2)
  {
  	rktr1.position.x = (wbox-wrkt)/2;
  }
  else if(rktr1.position.y< - (hbox-hrkt)/2)
  {
  	rktr1.position.y = -(hbox-hrkt)/2;
  }
  else if(rktr1.position.y> (hbox-hrkt)/2)
  {
  	rktr1.position.y = (hbox-hrkt)/2;
  }
  else{
  	rktr1.position.x  += rx1*h;
    rktr1.position.y  += ry1*h;
  }

  // Move the racket2 within the front side plane of the box
  if(rktb2.position.x< - (wbox-wrkt)/2)
  {
    rktb2.position.x = - (wbox-wrkt)/2;

  }
  else if(rktb2.position.x> (wbox-wrkt)/2)
  {
    rktb2.position.x = (wbox-wrkt)/2;
  }
  else if(rktb2.position.y< - (hbox-hrkt)/2)
  {
    rktb2.position.y = -(hbox-hrkt)/2;
  }
  else if(rktb2.position.y> (hbox-hrkt)/2)
  {
    rktb2.position.y = (hbox-hrkt)/2;
  }
  else{
    rktb2.position.x  += rx2*h;
    rktb2.position.y  += ry2*h;
  }

  //Bounce off all the sides of the box except the front side  
  //Right and left sides
  if(ball1.position.x< -(wbox/2-r)||ball1.position.x> (wbox/2-r)){
  	vx1 = -vx1;
  }

  //Up and down sides
  else if(ball1.position.y< -(hbox/2-r)||ball1.position.y>(hbox/2-r)){
  	vy1 = -vy1;
  }

  //The back side 
  else if(ball1.position.z< -(lbox/2-r)){

  	vz1 = -vz1;
  }

  //The front side
  else if(ball1.position.z>(lbox/2-r)){

  //If the ball hits the racket it should be specularly reflected.
    if(ball1.position.x<(rktr1.position.x+wrkt/2)&&ball1.position.x>(rktr1.position.x-wrkt/2)
    && ball1.position.y<(rktr1.position.y+hrkt/2)&&ball1.position.y>(rktr1.position.y-hrkt/2))
    vz1 = -vz1;
  
  //Stop the game when the ball leaves the box and report Game Over!
    else
    {
      switch (flag){
        case '1' : alert("Game Over!");break;
        case '2' : alert("Game Over! Player2 wins!");break;
      }
      vx1=vx2=0;
      vy1=vy2=0;
      vz1=vz2=0;
     
    }
  }

  //Bounce off all the sides of the box except the front side  
  //Right and left sides
  if(ball2.position.x< -(wbox/2-r)||ball2.position.x> (wbox/2-r)){
    vx2 = -vx2;
  }

  //Up and down sides
  else if(ball2.position.y< -(hbox/2-r)||ball2.position.y>(hbox/2-r)){
    vy2 = -vy2;
  }

  //The back side 
  else if(ball2.position.z< -(lbox/2-r)){

    vz2 = -vz2;
  }

  //The front side
  else if(ball2.position.z>(lbox/2-r)){
    switch (flag){
        case '1' : vz2 = -vz2;break;
        case '2' :
        {
             if(ball2.position.x<(rktb2.position.x+wrkt/2)&&ball2.position.x>(rktb2.position.x-wrkt/2)
             && ball2.position.y<(rktb2.position.y+hrkt/2)&&ball2.position.y>(rktb2.position.y-hrkt/2))
             vz2 = -vz2;
           //Stop the game when the ball leaves the box and report Game Over!
              else
              {
                alert("Game Over! Player1 wins!");
                vx1=vx2=0;
                vy1=vy2=0;
                vz1=vz2=0;
                
              }
        }
        break;
      }

   
  }
  
  controls1.update();
  controls2.update();
  renderer1.render(scene1,camera1);
  renderer2.render(scene2,camera2);
}
render();

