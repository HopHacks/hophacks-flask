(function() {
  
  window.CanvasSlideshow = function( options ) {

    var lastScrollTop = 0;

    //  SCOPE
    /// ---------------------------      
    var that = this;

    //  OPTIONS
    /// ---------------------------      
    options                     = options || {};
    options.stageWidth          = options.hasOwnProperty('stageWidth') ? options.stageWidth : 1920;
    options.stageHeight         = options.hasOwnProperty('stageHeight') ? options.stageHeight : 1080;
    options.pixiSprites         = options.hasOwnProperty('sprites') ? options.sprites : [];
    options.texts               = options.hasOwnProperty('texts') ? options.texts : [];
    options.autoPlay            = options.hasOwnProperty('autoPlay') ? options.autoPlay : true;
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


      // Enable Interactions
      stage.interactive = true;
      

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

      // PIXI tries to fit the filter bounding box to the renderer so we optionally bypass
      displacementFilter.autoFit = options.displaceAutoFit;
      
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
    //  DEFAULT RENDER/ANIMATION
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


    var isPlaying   = false;  
    var slideImages = slidesContainer.children;    
    this.moveSlider = function( newIndex ) {

      isPlaying = true;
      transitionAnimation.start();

      var baseTimeline = new TimelineMax( { onComplete: function () {
        that.currentIndex = newIndex;
        isPlaying = false;
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

    window.onscroll = function(e) {
      var scroll = window.pageYOffset || document.documentElement.scrollTop;
      if (scroll > lastScrollTop) {
        that.moveSlider(1);
      } else {
        that.moveSlider(0);
      }
      lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    }
    


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

    
    /// ---------------------------
    //  HELPER FUNCTIONS
    /// ---------------------------
    function scaleToWindow( canvas, backgroundColor ) {
      var scaleX, scaleY, scale, center;
    
      //1. Scale the canvas to the correct size
      //Figure out the scale amount on each axis
      scaleX = window.innerWidth / canvas.offsetWidth;
      scaleY = window.innerHeight / canvas.offsetHeight;
    
      //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
      scale = Math.min(scaleX, scaleY);
      canvas.style.transformOrigin = "0 0";
      canvas.style.transform = "scale(" + scale + ")";
    
      //2. Center the canvas.
      //Decide whether to center the canvas vertically or horizontally.
      //Wide canvases should be centered vertically, and 
      //square or tall canvases should be centered horizontally
      if (canvas.offsetWidth > canvas.offsetHeight) {
        if (canvas.offsetWidth * scale < window.innerWidth) {
          center = "horizontally";
        } else {
          center = "vertically";
        }
      } else {
        if (canvas.offsetHeight * scale < window.innerHeight) {
          center = "vertically";
        } else {
          center = "horizontally";
        }
      }
    
      //Center horizontally (for square or tall canvases)
      var margin;
      if (center === "horizontally") {
        margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
        canvas.style.marginTop = 0 + "px";
        canvas.style.marginBottom = 0 + "px";
        canvas.style.marginLeft = margin + "px";
        canvas.style.marginRight = margin + "px";
      }
    
      //Center vertically (for wide canvases) 
      if (center === "vertically") {
        margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
        canvas.style.marginTop = margin + "px";
        canvas.style.marginBottom = margin + "px";
        canvas.style.marginLeft = 0 + "px";
        canvas.style.marginRight = 0 + "px";
      }
    
      //3. Remove any padding from the canvas  and body and set the canvas
      //display style to "block"
      canvas.style.paddingLeft = 0 + "px";
      canvas.style.paddingRight = 0 + "px";
      canvas.style.paddingTop = 0 + "px";
      canvas.style.paddingBottom = 0 + "px";
      canvas.style.display = "block";
    
      //4. Set the color of the HTML body background
      document.body.style.backgroundColor = backgroundColor;
    
      //Fix some quirkiness in scaling for Safari
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf("safari") != -1) {
        if (ua.indexOf("chrome") > -1) {
          // Chrome
        } else {
          // Safari
          //canvas.style.maxHeight = "100%";
          //canvas.style.minHeight = "100%";
        }
      }
    
      //5. Return the `scale` value. This is important, because you'll nee this value 
      //for correct hit testing between the pointer and sprites
      return scale;
    } // http://bit.ly/2y1Yk2k      

    
  };

})(); 