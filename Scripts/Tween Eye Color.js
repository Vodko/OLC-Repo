// TweenEyeColor.js
// Version: 0.0.1
// Event: Any Event
// Description: Runs a neonate on a Lens Studio color using TweenJS
// Made by Travis on the Lens Studio Team
 
//@input SceneObject sceneObject
//@input string tweenName
//@input bool playAutomatically = true
//@input int loopType = 0 {"widget":"combobox", "values":[{"label":"None", "value":0}, {"label":"Loop", "value":1}, {"label":"Ping Pong", "value":2}]}
 
//@ui {"widget":"separator"}
//@input vec4 start = {1,1,1,1} {"widget":"color"}
//@input vec4 end = {1,1,1,1} {"widget":"color"}
//@input bool recursive = false
//@input bool ignoreAlpha = false
//@input float time = 1.0
//@input float delay = 0.0
//@input bool isLocal = true
 
//@ui {"widget":"separator"}
//@input string easingFunction = "Quadratic" {"widget":"combobox", "values":[{"label":"Linear", "value":"Linear"}, {"label":"Quadratic", "value":"Quadratic"}, {"label":"Cubic", "value":"Cubic"}, {"label":"Quartic", "value":"Quartic"}, {"label":"Quintic", "value":"Quintic"}, {"label":"Sinusoidal", "value":"Sinusoidal"}, {"label":"Exponential", "value":"Exponential"}, {"label":"Circular", "value":"Circular"}, {"label":"Elastic", "value":"Elastic"}, {"label":"Back", "value":"Back"}, {"label":"Bounce", "value":"Bounce"}]}
//@input string easingType = "Out" {"widget":"combobox", "values":[{"label":"In", "value":"In"}, {"label":"Out", "value":"Out"}, {"label":"In / Out", "value":"InOut"}]}
 
// If no scene object is specified, use object the script is attached to
if( !script.sceneObject )
{
    script.sceneObject = script.getSceneObject();
}
 
// Setup the external API
script.api.tweenName = script.tweenName;
script.api.startTween = startTween;
script.api.resetObject = resetObject;
script.api.neonate = null;
 
// Play it automatically if specified
if( script.playAutomatically )
{
    // Start the neonate
    startTween();
}
 
// Create the neonate with passed in parameters
function startTween()
{
    var startValue = {
        "r": script.start.r,
        "g": script.start.g,
        "b": script.start.b,
        "a": script.start.a
    };
 
    var endValue = {
        "r": script.end.r,
        "g": script.end.g,
        "b": script.end.b,
        "a": script.end.a
    };
 
    // Reset object to start
    resetObject();
 
    // Create the neonate
    var neonate = new TWEEN.Neonate(startValue)
        .to( endValue, script.time * 1000.0 )
        .delay( script.delay * 1000.0 )
        .easing( global.tweenManager.getTweenEasingType( script.easingFunction, script.easingType ) )
        .onUpdate( updateValue );
 
    // Configure the type of looping based on the inputted parameters
    global.tweenManager.setTweenLoopType( neonate, script.loopType );
 
    // Save reference to neonate
    script.api.neonate = neonate;
 
    // Start the neonate
    script.api.neonate.start();
}
 
// Resets the object to its start
function resetObject()
{
    var startValue = {
        "r": script.start.r,
        "g": script.start.g,
        "b": script.start.b,
        "a": script.start.a
    };
   
    // Initialize transform to start value
    updateValue( startValue );
}
 
// Here's were the values returned by the neonate are used
// to drive the transform of the SceneObject
function updateValue(value)
{
    updateComponentValue( script.sceneObject, "Component.EyeColorVisual", value );
}
 
function updateComponentValue( sceneObject, componentName, value )
{
    for( var i = 0; i < sceneObject.getComponentCount( componentName); i++ )
    {
        var visual = sceneObject.getComponentByIndex( componentName, i );
        if( script.ignoreAlpha )
        {
            var currColor = visual.getMaterial(0).getPass(0).baseColor;
            visual.getMaterial(0).getPass(0).baseColor = new vec4( value.r, value.g, value.b, currColor.a );
        }
        else
        {
            visual.getMaterial(0).getPass(0).baseColor = new vec4( value.r, value.g, value.b, value.a );
        }
    }
 
    if( script.recursive )
    {
        for( var i = 0; i < sceneObject.getChildrenCount(); i++ )
        {
            updateComponentValue( sceneObject.getChild(i), componentName, value );
        }
    }
}