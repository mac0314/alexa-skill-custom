
/***********
 modules
********* */
const config = require("config.json")("./config/config.json");

const brightnessCTRL = require('../controllers/light/brightness');
const colorTempCTRL = require('../controllers/light/color_temperature');
const colorCTRL = require('../controllers/light/color');
const powerCTRL = require('../controllers/light/power');

const constants = require('../lib/constants');


module.exports = {
  'TurnOn': function () {
    console.log("TurnOn");

    var key = constants.TABLE_USER_GATEWAY;
    const gatewayObject = this.attributes[key];

    if(gatewayObject === undefined){
      const speechOutput = "First, you must discover your gateway!";
      this.response.speak(speechOutput);
      this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

      this.emit(':responseReady');
    }else{
      var key = constants.TABLE_USER_LIGHTS_FLAG;
      const flag = this.attributes[key];

      var unit = "";

      if(flag){
        if (this.event.request.dialogState === 'STARTED') {
          //console.log("STARTED");
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;


          if(slots.uSpaceName.hasOwnProperty("value")){
            const uSpaceName = slots.uSpaceName.value;

            var key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;

            if(this.attributes[key]){
              unit = "group";

              updatedIntent.slots.unit.value = unit;
              this.emit(':delegate', updatedIntent);
            }else{
              const speechOutput = 'The space is not registered..';

              this.response.speak(speechOutput);
              this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

              this.emit(':responseReady');
            }
          }else{
            this.emit(':delegate');
          }
        } else if (this.event.request.dialogState !== 'COMPLETED'){
          //console.log("!COMPLETED");
          this.emit(':delegate');
        } else {
          //console.log("COMPLETED");
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;

          const unitId = updatedIntent.slots.unitId.value;
          var uSpaceName = "";
          if(slots.uSpaceName.hasOwnProperty("value")){
            unit = updatedIntent.slots.unit.value;
            uSpaceName = slots.uSpaceName.value;
          }else{
            unit = updatedIntent.slots.unit.resolutions.resolutionsPerAuthority[0].values[0].value.name;
          }

          const key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;
          var uSpaceId = this.attributes[key];

          powerCTRL.handlePower(gatewayObject, uSpaceId, unit, unitId, constants.SL_API_POWER_ON, constants.DEFAULT_POWER_LEVEL, (function(error, resultObject){
            const speechOutput = 'turn on the ' + unitId + ' ' + unit;

            this.response.speak(speechOutput);
            this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

            this.emit(':responseReady');
          }).bind(this));
        }
      }else{
        const speechOutput = "First, you must discover your lights!";
        this.response.speak(speechOutput);
        this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

        this.emit(':responseReady');
      }
    }
  },// TurnOn
  'TurnOff': function () {
    console.log("TurnOff");

    var key = constants.TABLE_USER_GATEWAY;
    const gatewayObject = this.attributes[key];

    if(gatewayObject === undefined){
      const speechOutput = "First, you must discover your gateway!";
      this.response.speak(speechOutput);
      this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

      this.emit(':responseReady');
    }else{
      var key = constants.TABLE_USER_LIGHTS_FLAG;
      const flag = this.attributes[key];

      if(flag){
        if (this.event.request.dialogState === 'STARTED') {
          var updatedIntent = this.event.request.intent;
          console.log(updatedIntent.slots);

          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;


          if(slots.uSpaceName.hasOwnProperty("value")){
            const uSpaceName = slots.uSpaceName.value;

            var key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;

            if(this.attributes[key]){
              unit = "group";

              updatedIntent.slots.unit.value = unit;
              this.emit(':delegate', updatedIntent);
            }else{
              const speechOutput = 'The space is not registered..';

              this.response.speak(speechOutput);
              this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

              this.emit(':responseReady');
            }
          }else{
            this.emit(':delegate');
          }
        } else if (this.event.request.dialogState !== 'COMPLETED'){
          this.emit(':delegate');
        } else {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;

          const unitId = updatedIntent.slots.unitId.value;
          var uSpaceName = "";
          if(slots.uSpaceName.hasOwnProperty("value")){
            unit = updatedIntent.slots.unit.value;
            uSpaceName = slots.uSpaceName.value;
          }else{
            unit = updatedIntent.slots.unit.resolutions.resolutionsPerAuthority[0].values[0].value.name;
          }

          const key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;
          var uSpaceId = this.attributes[key];

          powerCTRL.handlePower(gatewayObject, uSpaceId, unit, unitId, constants.SL_API_POWER_OFF, constants.DEFAULT_POWER_LEVEL, (function(error, resultObject){
            const speechOutput = 'turn off the ' + unitId + ' ' + unit;

            this.response.speak(speechOutput);
            this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

            this.emit(':responseReady');
          }).bind(this));
        }
      }else{
        const speechOutput = "First, you must discover your lights!";
        this.response.speak(speechOutput);
        this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

        this.emit(':responseReady');
      }
    }
  },// TurnOff
  'AdjustPowerLevel': function () {
    console.log("AdjustPowerLevel");

    var key = constants.TABLE_USER_GATEWAY;
    const gatewayObject = this.attributes[key];

    if(gatewayObject === undefined){
      const speechOutput = "First, you must discover your gateway!";
      this.response.speak(speechOutput);
      this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

      this.emit(':responseReady');
    }else{

      var key = constants.TABLE_USER_LIGHTS_FLAG;
      const flag = this.attributes[key];

      if(flag){
        if (this.event.request.dialogState === 'STARTED') {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;


          if(slots.uSpaceName.hasOwnProperty("value")){
            const uSpaceName = slots.uSpaceName.value;

            var key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;

            if(this.attributes[key]){
              unit = "group";

              updatedIntent.slots.unit.value = unit;
              this.emit(':delegate', updatedIntent);
            }else{
              const speechOutput = 'The space is not registered..';

              this.response.speak(speechOutput);
              this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

              this.emit(':responseReady');
            }
          }else{
            this.emit(':delegate');
          }
        } else if (this.event.request.dialogState !== 'COMPLETED'){
          this.emit(':delegate');
        } else {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;

          console.log(updatedIntent.slots);

          const unitId = updatedIntent.slots.unitId.value;
          var uSpaceName = "";
          if(slots.uSpaceName.hasOwnProperty("value")){
            unit = updatedIntent.slots.unit.value;
            uSpaceName = slots.uSpaceName.value;
          }else{
            unit = updatedIntent.slots.unit.resolutions.resolutionsPerAuthority[0].values[0].value.name;
          }

          const key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;
          var uSpaceId = this.attributes[key];
          const command = updatedIntent.slots.command.resolutions.resolutionsPerAuthority[0].values[0].value.name;


          powerCTRL.adjustPowerLevel(gatewayObject, unit, unitId, command, (function(error, resultObject){
            const powerLevel = resultObject.data.powerLevel;

            const speechOutput = command + ', set the ' + unitId + ' ' + unit + ' power level ' + powerLevel;
            const reprompt = 'Do you want to Change more?'

            this.response.speak(speechOutput).listen(reprompt);
            this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

            this.emit(':responseReady');
          }).bind(this));
        }
      }else{
        const speechOutput = "First, you must discover your lights!";
        this.response.speak(speechOutput);
        this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

        this.emit(':responseReady');
      }
    }
  },// AdjustPowerLevel
  'SetPowerLevel': function () {
    console.log("SetPowerLevel");

    var key = constants.TABLE_USER_GATEWAY;
    const gatewayObject = this.attributes[key];

    if(gatewayObject === undefined){
      const speechOutput = "First, you must discover your gateway!";
      this.response.speak(speechOutput);
      this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

      this.emit(':responseReady');
    }else{

      var key = constants.TABLE_USER_LIGHTS_FLAG;
      const flag = this.attributes[key];

      if(flag){
        if (this.event.request.dialogState === 'STARTED') {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;


          if(slots.uSpaceName.hasOwnProperty("value")){
            const uSpaceName = slots.uSpaceName.value;

            var key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;

            if(this.attributes[key]){
              unit = "group";

              updatedIntent.slots.unit.value = unit;
              this.emit(':delegate', updatedIntent);
            }else{
              const speechOutput = 'The space is not registered..';

              this.response.speak(speechOutput);
              this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

              this.emit(':responseReady');
            }
          }else{
            this.emit(':delegate');
          }
        } else if (this.event.request.dialogState !== 'COMPLETED'){
          this.emit(':delegate');
        } else {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;

          const unitId = updatedIntent.slots.unitId.value;
          const powerLevel = updatedIntent.slots.powerLevel.value;
          var uSpaceName = "";
          if(slots.uSpaceName.hasOwnProperty("value")){
            unit = updatedIntent.slots.unit.value;
            uSpaceName = slots.uSpaceName.value;
          }else{
            unit = updatedIntent.slots.unit.resolutions.resolutionsPerAuthority[0].values[0].value.name;
          }

          const key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;
          var uSpaceId = this.attributes[key];


          powerCTRL.handlePower(gatewayObject, uSpaceId, unit, unitId, constants.SL_API_POWER_ON, powerLevel, (function(error, resultObject){
            const speechOutput = 'set the ' + unitId + ' ' + unit + ' power level ' + powerLevel;

            this.response.speak(speechOutput);
            this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

            this.emit(':responseReady');
          }).bind(this));
        }
      }else{
        const speechOutput = "First, you must discover your lights!";
        this.response.speak(speechOutput);
        this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

        this.emit(':responseReady');
      }
    }
  },// SetPowerLevel
  'AdjustBrightness': function () {
    console.log("AdjustBrightness");

    var key = constants.TABLE_USER_GATEWAY;
    const gatewayObject = this.attributes[key];

    if(gatewayObject === undefined){
      const speechOutput = "First, you must discover your gateway!";
      this.response.speak(speechOutput);
      this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

      this.emit(':responseReady');
    }else{

      var key = constants.TABLE_USER_LIGHTS_FLAG;
      const flag = this.attributes[key];

      if(flag){
        if (this.event.request.dialogState === 'STARTED') {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;


          if(slots.uSpaceName.hasOwnProperty("value")){
            const uSpaceName = slots.uSpaceName.value;

            var key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;

            if(this.attributes[key]){
              unit = "group";

              updatedIntent.slots.unit.value = unit;
              this.emit(':delegate', updatedIntent);
            }else{
              const speechOutput = 'The space is not registered..';

              this.response.speak(speechOutput);
              this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

              this.emit(':responseReady');
            }
          }else{
            this.emit(':delegate');
          }
        } else if (this.event.request.dialogState !== 'COMPLETED'){
          this.emit(':delegate');
        } else {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;

          var uSpaceName = "";
          const unitId = updatedIntent.slots.unitId.value;
          const command = updatedIntent.slots.command.resolutions.resolutionsPerAuthority[0].values[0].value.name;
          if(slots.uSpaceName.hasOwnProperty("value")){
            unit = updatedIntent.slots.unit.value;
            uSpaceName = slots.uSpaceName.value;
          }else{
            unit = updatedIntent.slots.unit.resolutions.resolutionsPerAuthority[0].values[0].value.name;
          }

          const key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;
          var uSpaceId = this.attributes[key];


          brightnessCTRL.adjustBrightness(unit, unitId, command, (function(error, resultObject){
            const brightness = resultObject.data.brightness;

            const speechOutput = command + ', set the ' + unitId + ' ' + unit + ' brightness ' + brightness;
            const reprompt = 'Do you want to Change more?'

            this.response.speak(speechOutput).listen(reprompt);
            this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

            this.emit(':responseReady');
          }).bind(this));
        }
      }else{
        const speechOutput = "First, you must discover your lights!";
        this.response.speak(speechOutput);
        this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

        this.emit(':responseReady');
      }
    }
  },// AdjustBrightness
  'SetBrightness': function () {
    console.log("SetBrightness");

    var key = constants.TABLE_USER_GATEWAY;
    const gatewayObject = this.attributes[key];

    if(gatewayObject === undefined){
      const speechOutput = "First, you must discover your gateway!";
      this.response.speak(speechOutput);
      this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

      this.emit(':responseReady');
    }else{

      var key = constants.TABLE_USER_LIGHTS_FLAG;
      const flag = this.attributes[key];

      if(flag){
        if (this.event.request.dialogState === 'STARTED') {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;


          if(slots.uSpaceName.hasOwnProperty("value")){
            const uSpaceName = slots.uSpaceName.value;

            var key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;

            if(this.attributes[key]){
              unit = "group";

              updatedIntent.slots.unit.value = unit;
              this.emit(':delegate', updatedIntent);
            }else{
              const speechOutput = 'The space is not registered..';

              this.response.speak(speechOutput);
              this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

              this.emit(':responseReady');
            }
          }else{
            this.emit(':delegate');
          }
        } else if (this.event.request.dialogState !== 'COMPLETED'){
          this.emit(':delegate');
        } else {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;

          var uSpaceName = "";
          const unitId = updatedIntent.slots.unitId.value;
          const brightness = updatedIntent.slots.brightness.value;
          if(slots.uSpaceName.hasOwnProperty("value")){
            unit = updatedIntent.slots.unit.value;
            uSpaceName = slots.uSpaceName.value;
          }else{
            unit = updatedIntent.slots.unit.resolutions.resolutionsPerAuthority[0].values[0].value.name;
          }

          const key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;
          var uSpaceId = this.attributes[key];


          brightnessCTRL.setBrightness(unit, unitId, brightness, (function(error, resultObject){
            const speechOutput = 'set the ' + unitId + ' ' + unit + ' brightness ' + brightness;

            this.response.speak(speechOutput);
            this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

            this.emit(':responseReady');
          }).bind(this));
        }
      }else{
        const speechOutput = "First, you must discover your lights!";
        this.response.speak(speechOutput);
        this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

        this.emit(':responseReady');
      }
    }
  },// SetBrightness
  'SetColor': function () {
    console.log("SetColor");

    var key = constants.TABLE_USER_GATEWAY;
    const gatewayObject = this.attributes[key];

    if(gatewayObject === undefined){
      const speechOutput = "First, you must discover your gateway!";
      this.response.speak(speechOutput);
      this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

      this.emit(':responseReady');
    }else{

      var key = constants.TABLE_USER_LIGHTS_FLAG;
      const flag = this.attributes[key];

      if(flag){
        if (this.event.request.dialogState === 'STARTED') {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;


          if(slots.uSpaceName.hasOwnProperty("value")){
            const uSpaceName = slots.uSpaceName.value;

            var key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;

            if(this.attributes[key]){
              unit = "group";

              updatedIntent.slots.unit.value = unit;
              this.emit(':delegate', updatedIntent);
            }else{
              const speechOutput = 'The space is not registered..';

              this.response.speak(speechOutput);
              this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

              this.emit(':responseReady');
            }
          }else{
            this.emit(':delegate');
          }
        } else if (this.event.request.dialogState !== 'COMPLETED'){
          this.emit(':delegate');
        } else {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;

          var uSpaceName = "";
          const unitId = updatedIntent.slots.unitId.value;
          const color = updatedIntent.slots.color.value;
          if(slots.uSpaceName.hasOwnProperty("value")){
            unit = updatedIntent.slots.unit.value;
            uSpaceName = slots.uSpaceName.value;
          }else{
            unit = updatedIntent.slots.unit.resolutions.resolutionsPerAuthority[0].values[0].value.name;
          }

          const key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;
          var uSpaceId = this.attributes[key];

          colorCTRL.handleColor(unit, unitId, color, (function(error, resultObject){
            const speechOutput = 'set the ' + unitId + ' ' + unit + ' color ' + color;

            this.response.speak(speechOutput);
            this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

            this.emit(':responseReady');
          }).bind(this));
        }
      }else{
        const speechOutput = "First, you must discover your lights!";
        this.response.speak(speechOutput);
        this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

        this.emit(':responseReady');
      }
    }
  },// SetColor
  'AdjustColorTemperature': function () {
    console.log("AdjustColorTemperature");

    var key = constants.TABLE_USER_GATEWAY;
    const gatewayObject = this.attributes[key];

    if(gatewayObject === undefined){
      const speechOutput = "First, you must discover your gateway!";
      this.response.speak(speechOutput);
      this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

      this.emit(':responseReady');
    }else{

      var key = constants.TABLE_USER_LIGHTS_FLAG;
      const flag = this.attributes[key];

      if(flag){
        if (this.event.request.dialogState === 'STARTED') {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;


          if(slots.uSpaceName.hasOwnProperty("value")){
            const uSpaceName = slots.uSpaceName.value;

            var key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;

            if(this.attributes[key]){
              unit = "group";

              updatedIntent.slots.unit.value = unit;
              this.emit(':delegate', updatedIntent);
            }else{
              const speechOutput = 'The space is not registered..';

              this.response.speak(speechOutput);
              this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

              this.emit(':responseReady');
            }
          }else{
            this.emit(':delegate');
          }
        } else if (this.event.request.dialogState !== 'COMPLETED'){
          this.emit(':delegate');
        } else {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;

          var uSpaceName = "";
          const unitId = updatedIntent.slots.unitId.value;
          const command = updatedIntent.slots.command.resolutions.resolutionsPerAuthority[0].values[0].value.name;

          if(slots.uSpaceName.hasOwnProperty("value")){
            unit = updatedIntent.slots.unit.value;
            uSpaceName = slots.uSpaceName.value;
          }else{
            unit = updatedIntent.slots.unit.resolutions.resolutionsPerAuthority[0].values[0].value.name;
          }

          const key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;
          var uSpaceId = this.attributes[key];


          colorTempCTRL.adjustColorTemperature(unit, unitId, command, (function(error, resultObject){
            const colorTemperature = resultObject.data.colorTemperature;

            const speechOutput = command + ', set the ' + unitId + ' ' + unit + ' color temperature ' + colorTemperature;
            const reprompt = 'Do you want to Change more?'

            this.response.speak(speechOutput).listen(reprompt);
            this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

            this.emit(':responseReady');
          }).bind(this));
        }
      }else{
        const speechOutput = "First, you must discover your lights!";
        this.response.speak(speechOutput);
        this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

        this.emit(':responseReady');
      }
    }
  },// AdjustColorTemperature
  'SetColorTemperature': function () {
    console.log("SetColorTemperature");

    var key = constants.TABLE_USER_GATEWAY;
    const gatewayObject = this.attributes[key];

    if(gatewayObject === undefined){
      const speechOutput = "First, you must discover your gateway!";
      this.response.speak(speechOutput);
      this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

      this.emit(':responseReady');
    }else{

      var key = constants.TABLE_USER_LIGHTS_FLAG;
      const flag = this.attributes[key];

      if(flag){
        if (this.event.request.dialogState === 'STARTED') {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;


          if(slots.uSpaceName.hasOwnProperty("value")){
            const uSpaceName = slots.uSpaceName.value;

            var key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;

            if(this.attributes[key]){
              unit = "group";

              updatedIntent.slots.unit.value = unit;
              this.emit(':delegate', updatedIntent);
            }else{
              const speechOutput = 'The space is not registered..';

              this.response.speak(speechOutput);
              this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

              this.emit(':responseReady');
            }
          }else{
            this.emit(':delegate');
          }
        } else if (this.event.request.dialogState !== 'COMPLETED'){
          this.emit(':delegate');
        } else {
          var updatedIntent = this.event.request.intent;
          var slots = updatedIntent.slots;

          var uSpaceName = "";
          const unitId = updatedIntent.slots.unitId.value;
          const colorTemperature = updatedIntent.slots.colorTemperature.value;

          if(slots.uSpaceName.hasOwnProperty("value")){
            unit = updatedIntent.slots.unit.value;
            uSpaceName = slots.uSpaceName.value;
          }else{
            unit = updatedIntent.slots.unit.resolutions.resolutionsPerAuthority[0].values[0].value.name;
          }

          const key = constants.TABLE_USER_UNIT_SPACE_PREFIX + uSpaceName;
          var uSpaceId = this.attributes[key];

          colorTempCTRL.setColorTemperature(unit, unitId, colorTemperature, (function(error, resultObject){
            const speechOutput = 'set the ' + unitId + ' ' + unit + ' color temperature ' + colorTemperature;

            this.response.speak(speechOutput);
            this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

            this.emit(':responseReady');
          }).bind(this));
        }
      }else{
        const speechOutput = "First, you must discover your lights!";
        this.response.speak(speechOutput);
        this.response.cardRenderer(global.APP_NAME, speechOutput, constants.BACKGROUND_IMAGE);

        this.emit(':responseReady');
      }
    }
  }// SetColorTemperature
};// LightPropertyHandler