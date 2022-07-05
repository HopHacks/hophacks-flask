(function() {
  
  window.CanvasSlideshow = function( options ) {

    //  SCOPE
    /// ---------------------------      
    var that = this;

    //  OPTIONS
    /// ---------------------------      
    options                     = options || {};
    // options.stageWidth          = options.hasOwnProperty('stageWidth') ? options.stageWidth : 1920;
    options.stageWidth          = options.hasOwnProperty('stageWidth') ? options.stageWidth : 2000;
    options.stageHeight         = options.hasOwnProperty('stageHeight') ? options.stageHeight : 1080;
    options.pixiSprites         = options.hasOwnProperty('sprites') ? options.sprites : [];
    options.texts               = options.hasOwnProperty('texts') ? options.texts : [];
    options.autoPlay            = options.hasOwnProperty('autoPlay') ? options.autoPlay : false;
    options.autoPlaySpeed       = options.hasOwnProperty('autoPlaySpeed') ? options.autoPlaySpeed : [10, 3];
    options.fullScreen          = options.hasOwnProperty('fullScreen') ? options.fullScreen : true;
    options.displaceScale       = options.hasOwnProperty('displaceScale') ? options.displaceScale : [200, 70];
    options.displacementImage   = options.hasOwnProperty('displacementImage') ? options.displacementImage : '';
    options.navElement          = options.hasOwnProperty('navElement')  ?  options.navElement : document.querySelectorAll( '.scene-nav' ); 
    options.displaceAutoFit     = options.hasOwnProperty('displaceAutoFit')  ?  options.displaceAutoFit : false; 
    options.wacky               = options.hasOwnProperty('wacky') ? options.wacky : false;
    options.interactive         = options.hasOwnProperty('interactive') ? options.interactive : false;
    options.displaceScaleTo     = ( options.autoPlay === false ) ? [ 0, 0 ] : [ 20, 20 ];
    options.textColor           = options.hasOwnProperty('textColor') ? options.textColor : '#fff';
    options.displacementCenter  = options.hasOwnProperty('displacementCenter') ? options.displacementCenter : false;
    options.dispatchPointerOver = options.hasOwnProperty('dispatchPointerOver') ? options.dispatchPointerOver : false;

    //  PIXI VARIABLES
    /// ---------------------------    
    var renderer            = new PIXI.autoDetectRenderer(options.stageWidth, options.stageHeight, { transparent: true });
    var stage               = new PIXI.Container();
    var slidesContainer     = new PIXI.Container();
    var displacementSprite  = new PIXI.Sprite.fromImage( options.displacementImage );
    var displacementFilter  = new PIXI.filters.DisplacementFilter( displacementSprite );

    //  TEXTS
    /// ---------------------------    
    var style = new PIXI.TextStyle({
      fill: options.textColor,
      wordWrap: true,
      wordWrapWidth: 400,
      letterSpacing: 20,
      fontSize: 14
    });

    //  SLIDES ARRAY INDEX
    /// ---------------------------    
    this.currentIndex = 0;

    /// ---------------------------
    //  INITIALISE PIXI
    /// ---------------------------      
    this.initPixi = function() {

      // Add canvas to the HTML
      document.body.appendChild( renderer.view );

      // Add child container to the main container 
      stage.addChild( slidesContainer );

      // Fit renderer to the screen
      if ( options.fullScreen === true ) {
        renderer.view.style.objectFit = 'cover';
        renderer.view.style.width     = '100%';
        renderer.view.style.height    = '100%';
        renderer.view.style.top       = '50%';
        renderer.view.style.left      = '50%';
        renderer.view.style.webkitTransform = 'translate( -50%, -50% ) scale(1.2)';
        renderer.view.style.transform = 'translate( -50%, -50% ) scale(1.2)';      
      } else {
        renderer.view.style.maxWidth  = '100%';
        renderer.view.style.top       = '50%';
        renderer.view.style.left      = '50%';
        renderer.view.style.webkitTransform = 'translate( -50%, -50% )';
        renderer.view.style.transform = 'translate( -50%, -50% )';          
      }
      
      displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

      // Set the filter to stage and set some default values for the animation
      stage.filters = [displacementFilter];        

      if ( options.autoPlay === false ) {
        displacementFilter.scale.x = 0;
        displacementFilter.scale.y = 0;
      }

      if ( options.wacky === true ) {
        displacementSprite.anchor.set(0.5);
        displacementSprite.x = renderer.width / 2;
        displacementSprite.y = renderer.height / 2; 
      }

      displacementSprite.scale.x = 2;
      displacementSprite.scale.y = 2;
      
      stage.addChild( displacementSprite );

    };

    /// ---------------------------
    //  LOAD PICS TO CANVAS
    /// ---------------------------          
    this.loadPixiSprites = function( sprites ) {
      
      var rSprites = options.sprites;
      var rTexts   = options.texts;

      for ( var i = 0; i < rSprites.length; i++ ) {
        
        var texture   = new PIXI.Texture.fromImage( sprites[i] );
        var image     = new PIXI.Sprite( texture );

        if ( rTexts ) {
          var richText = new PIXI.Text( rTexts[i], style);
          image.addChild(richText);

          richText.anchor.set(0.5);
          richText.x = image.width / 2;
          richText.y = image.height / 2;                     
        }      

        if ( options.centerSprites === true ) {
          image.anchor.set(0.5);
          image.x = renderer.width / 2;
          image.y = renderer.height / 2;            
        }
        
        if ( i !== 0  ) {
          TweenMax.set( image, { alpha: 0 } );
        }

        slidesContainer.addChild( image );

      } 
      
    };

    /// ---------------------------
    //  DEFAULT RENDER
    /// ---------------------------        
    var render = new PIXI.ticker.Ticker();

    render.autoStart = true;

    render.add(function( delta ) {
      renderer.render( stage );
    });        
    

    /// ---------------------------
    //  DISTORTION TRANSITION
    /// ---------------------------    
    var transitionAnimation = new PIXI.ticker.Ticker();
    transitionAnimation.autoStart = false;

    transitionAnimation.add(function( delta ) {
      displacementSprite.x += 2.14 * delta;
      displacementSprite.y += 22.24 * delta;
      displacementSprite.rotation.x += 20.3;          
    });


    var slideImages = slidesContainer.children;    
    this.moveSlider = function( newIndex ) {

      transitionAnimation.start();

      var baseTimeline = new TimelineMax( { onComplete: function () {
        that.showCover = false;
        that.currentIndex = newIndex;
        transitionAnimation.stop();
        if ( options.wacky === true ) {
          displacementSprite.scale.set( 1 );
        }          
       },onUpdate: function() {
        
          if ( options.wacky === true ) {
            displacementSprite.rotation += baseTimeline.progress() * 0.02;      
            displacementSprite.scale.set( baseTimeline.progress() * 3 );
          }
    
      } });
      
      baseTimeline.clear();
      
      if ( baseTimeline.isActive() ) {
        return;
      }        
      
      baseTimeline
        .to(displacementFilter.scale, 1, { y: "+="+1280+"", ease: Power3.easeOut })
        .to(slideImages[that.currentIndex], 0.5, { alpha: 0, ease: Power3.easeOut }, 0.4)
        .to(slideImages[newIndex], 0.5, { alpha: 1, ease: Power3.easeInOut }, 0.7)          
        .to(displacementFilter.scale, 1, { y: 20,  ease: Power3.easeOut }, 1 );          

    };

    /// ---------------------------
    //  SCROLL
    /// ---------------------------   

    window.onbeforeunload = function () { // page refresh to top of page
      window.scrollTo(0, 0);
    }

    this.lastScroll = 0;
    this.showUpCover = true;
    this.showDownCover = true;
    
    window.addEventListener('wheel', function(event) {
      var scroll = window.pageYOffset || document.documentElement.scrollTop;

      if (event.deltaY < 0) { // scroll up
        if (that.showUpCover === false) {
          window.scrollTo(0,0);
          that.moveSlider(0);
          that.showUpCover = true;
          that.showDownCover = true;
        } else if (that.lastScroll !== 0) {
          that.showUpCover = false;
        }
      } else if (event.deltaY > 0) { // scroll down
        if (that.showDownCover === true) {
          document.body.style.overflow = 'hidden';
          window.scrollTo(0,1);
          that.moveSlider(1);
          that.showDownCover = false;
          setTimeout(function() {
            window.scrollTo(0,1);
            document.body.style.overflow = 'auto';
            that.showDownCover = false;
          }, 1500);
        } 
      }

      that.lastScroll = scroll <= 0 ? 0 : scroll;
    });
    
    /// ---------------------------
    //  INIT FUNCTIONS
    /// ---------------------------     
    this.init = function() {
      that.initPixi();
      that.loadPixiSprites( options.pixiSprites );
    };
    
    /// ---------------------------
    //  CENTER DISPLACEMENT
    /// ---------------------------
    if ( options.displacementCenter === true ) {
      displacementSprite.anchor.set(0.5);
      displacementSprite.x = renderer.view.width / 2;
      displacementSprite.y = renderer.view.height / 2;        
    }
    
    /// ---------------------------
    //  START 
    /// ---------------------------           
    this.init();  
    
  };

})(); 