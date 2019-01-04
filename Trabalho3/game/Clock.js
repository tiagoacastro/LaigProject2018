/**
 * Clock class
 */
class Clock extends CGFobject
{   
    /**
     * @constructor
     * @param {XMLscene} scene 
     * @param {int} time
     */
	constructor(scene, time)
	{
		super(scene);
        
        this.time = time;
        this.blackT = time;
        this.whiteT = time;

        this.on = false;

        this.cube = new MyCube(scene);

        this.rectangle = new MyRectangle(scene, -0.5, 0.5, -0.5, 0.5);

        this.zero = new CGFappearance(this.scene);
        this.zero.loadTexture("./scenes/images/zero.jpg");
        this.zero.setShininess(80);
        this.zero.setEmission(0,0,0,1);
        this.zero.setAmbient(0.2,0.2,0.2,1);
        this.zero.setDiffuse(0.5,0.5,0.5,1);
        this.zero.setSpecular(0.5,0.5,0.5,1);

        this.one = new CGFappearance(this.scene);
        this.one.loadTexture("./scenes/images/one.jpg");
        this.one.setShininess(80);
        this.one.setEmission(0,0,0,1);
        this.one.setAmbient(0.2,0.2,0.2,1);
        this.one.setDiffuse(0.5,0.5,0.5,1);
        this.one.setSpecular(0.5,0.5,0.5,1);

        this.two = new CGFappearance(this.scene);
        this.two.loadTexture("./scenes/images/two.jpg");
        this.two.setShininess(80);
        this.two.setEmission(0,0,0,1);
        this.two.setAmbient(0.2,0.2,0.2,1);
        this.two.setDiffuse(0.5,0.5,0.5,1);
        this.two.setSpecular(0.5,0.5,0.5,1);

        this.three = new CGFappearance(this.scene);
        this.three.loadTexture("./scenes/images/three.jpg");
        this.three.setShininess(80);
        this.three.setEmission(0,0,0,1);
        this.three.setAmbient(0.2,0.2,0.2,1);
        this.three.setDiffuse(0.5,0.5,0.5,1);
        this.three.setSpecular(0.5,0.5,0.5,1);

        this.four = new CGFappearance(this.scene);
        this.four.loadTexture("./scenes/images/four.jpg");
        this.four.setShininess(80);
        this.four.setEmission(0,0,0,1);
        this.four.setAmbient(0.2,0.2,0.2,1);
        this.four.setDiffuse(0.5,0.5,0.5,1);
        this.four.setSpecular(0.5,0.5,0.5,1);

        this.five = new CGFappearance(this.scene);
        this.five.loadTexture("./scenes/images/five.jpg");
        this.five.setShininess(80);
        this.five.setEmission(0,0,0,1);
        this.five.setAmbient(0.2,0.2,0.2,1);
        this.five.setDiffuse(0.5,0.5,0.5,1);
        this.five.setSpecular(0.5,0.5,0.5,1);

        this.six = new CGFappearance(this.scene);
        this.six.loadTexture("./scenes/images/six.jpg");
        this.six.setShininess(80);
        this.six.setEmission(0,0,0,1);
        this.six.setAmbient(0.2,0.2,0.2,1);
        this.six.setDiffuse(0.5,0.5,0.5,1);
        this.six.setSpecular(0.5,0.5,0.5,1);

        this.seven = new CGFappearance(this.scene);
        this.seven.loadTexture("./scenes/images/seven.jpg");
        this.seven.setShininess(80);
        this.seven.setEmission(0,0,0,1);
        this.seven.setAmbient(0.2,0.2,0.2,1);
        this.seven.setDiffuse(0.5,0.5,0.5,1);
        this.seven.setSpecular(0.5,0.5,0.5,1);

        this.eight = new CGFappearance(this.scene);
        this.eight.loadTexture("./scenes/images/eight.jpg");
        this.eight.setShininess(80);
        this.eight.setEmission(0,0,0,1);
        this.eight.setAmbient(0.2,0.2,0.2,1);
        this.eight.setDiffuse(0.5,0.5,0.5,1);
        this.eight.setSpecular(0.5,0.5,0.5,1);

        this.nine = new CGFappearance(this.scene);
        this.nine.loadTexture("./scenes/images/nine.jpg");
        this.nine.setShininess(80);
        this.nine.setEmission(0,0,0,1);
        this.nine.setAmbient(0.2,0.2,0.2,1);
        this.nine.setDiffuse(0.5,0.5,0.5,1);
        this.nine.setSpecular(0.5,0.5,0.5,1);

        //this.start();                                       // REMOVER DEPOIS, SO PARA TESTAR

		this.display();
    };
    /**
     * starts the clock
     */
    start(){
        this.blackT = this.time;
        this.whiteT = this.time;
        this.player = false;    //black
        this.on = true;
        this.rebase = false;
        this.base = 0;
        this.current = 0;
    }
    /**
     * stops the clock
     */
    stop(){
        this.on = false;
    }
    /**
     * starts without reseting the clock
     */
    continue(){
        this.on = true;
    }
    /**
     * changes the player
     */
    change(){
        this.player = !this.player;
        this.rebase = true;

        if(this.player)
            this.whiteT = this.time;
        else
            this.blackT = this.time;
    }
    /**
     * update function
     * @param {float} deltaTime
     * @param {object} game
     */
    update(deltaTime, game) {
        if(this.on){
            this.current += deltaTime;
            if(this.rebase){
                this.base = this.current;
                this.rebase = false;
            }

            if((this.current - this.base)/1000 > this.time){
                game.state = 'end';
                this.on = false;
                if(this.player)
                    this.whiteT=0;
                else
                    this.blackT=0;
            }

            if(this.player){
                if(Math.floor((this.current - this.base)/1000) > this.time - this.whiteT){
                    this.whiteT--;
                    //if(this.whiteT == 25)                                                           // REMOVER DEPOIS, SO PARA TESTAR
                        //this.change();                                                              // REMOVER DEPOIS, SO PARA TESTAR
                }
            } else {
                if(Math.floor((this.current - this.base)/1000) > this.time - this.blackT){
                    this.blackT--;
                    //if(this.blackT == 25)                                                           // REMOVER DEPOIS, SO PARA TESTAR
                        //this.change();                                                              // REMOVER DEPOIS, SO PARA TESTAR
                }
            }                
        }
    }
    /**
     * function to draw the clock
     */
    display()
	{
        this.scene.pushMatrix();
            this.scene.scale(2, 1.2, 0.8);
            this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-0.5, 0.65, 0);
            this.scene.scale(0.4, 0.1, 0.2);
            this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.5, 0.65, 0);
            this.scene.scale(0.4, 0.1, 0.2);
            this.cube.display();
        this.scene.popMatrix();
        
        this.apply(Math.floor(this.blackT/10));

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0, 0.41);
            this.scene.scale(0.4, 0.8, 1);
            this.rectangle.display();
        this.scene.popMatrix();
        
        this.apply(this.blackT%10);

        this.scene.pushMatrix();
            this.scene.translate(0.7, 0, 0.41);
            this.scene.scale(0.4, 0.8, 1);
            this.rectangle.display();
        this.scene.popMatrix();

        this.apply(Math.floor(this.whiteT/10));

        this.scene.pushMatrix();
            this.scene.translate(-0.7, 0, 0.41);
            this.scene.scale(0.4, 0.8, 1);
            this.rectangle.display();
        this.scene.popMatrix();
        
        this.apply(this.whiteT%10);

        this.scene.pushMatrix();
            this.scene.translate(-0.3, 0, 0.41);
            this.scene.scale(0.4, 0.8, 1);
            this.rectangle.display();
        this.scene.popMatrix();
    };
    /**
     * apply texture based on number
     */
    apply(n){
        switch(n){
            case 0:
                this.zero.apply();
                break;
            case 1:
                this.one.apply();
                break;
            case 2:
                this.two.apply();
                break;
            case 3:
                this.three.apply();
                break;
            case 4:
                this.four.apply();
                break;
            case 5:
                this.five.apply();
                break;
            case 6:
                this.six.apply();
                break;
            case 7:
                this.seven.apply();
                break;
            case 8:
                this.eight.apply();
                break;
            case 9:
                this.nine.apply();
                break;
        }
    }
}; 