const Gpio = require('pigpio').Gpio;

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
module.exports.process = function(slotObject)
{

const MICROSECONDS_PER_CM = 1e6/34321;
let trig_pin = slotObject.sensors.ultrasonic.trigger;
let echo_pin = slotObject.sensors.ultrasonic.echo;
let pir_pin = slotObject.sensors.pir.pin;
let green_led_pin = slotObject.actuators.leds.green;
let red_led_pin = slotObject.actuators.leds.red;
let slot_name = slotObject.name ? slotObject.name : "Slot";


const trigger = new Gpio(trig_pin, {mode: Gpio.OUTPUT});
const echo = new Gpio(echo_pin, {mode: Gpio.INPUT, alert: true});
const pir = new Gpio(pir_pin,{mode:Gpio.INPUT, alert: true});
const green_led = new Gpio(green_led_pin,{mode:Gpio.OUTPUT});
const red_led = new Gpio(red_led_pin, {mode:Gpio.OUTPUT});

//Turn off led lights
green_led.digitalWrite(0);
red_led.digitalWrite(0);

trigger.digitalWrite(0); // Make sure trigger is low

const watchHCSR04 = () => {
  let startTick;

  echo.on('alert', (level, tick) => {
  if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      const distance = diff / 2 / MICROSECONDS_PER_CM;
      const isObject = pir.digitalRead()==0 ? true : false
      green_led.digitalWrite(0);
      red_led.digitalWrite(0);
      if(distance<=10)
       {
          if(isObject)
           {
             red_led.digitalWrite(1);
             console.log(slot_name+" is occupied. Car is parked "+distance+"cm from the wall");
            }
             else
            {
              green_led.digitalWrite(1);
              console.log(+slot_name+" is free but a living being is within parking slot");
            }

       }

      else
        {
          green_led.digitalWrite(1);
          console.log(slot_name+" is free and save to enter");
        }
    }
  });
};

watchHCSR04();

// Trigger a distance measurement once per second
setInterval(() => {
  trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 1000);

}