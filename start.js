const { exec } = require('child_process');
const { Gpio } = require('pigpio');

const buzz = new Gpio(27, { mode: Gpio.OUTPUT });
const pwm = new Gpio(13, { mode: Gpio.OUTPUT });
const tacho = new Gpio(6, {
    mode: Gpio.INPUT,
    edge: Gpio.FALLING_EDGE
});
const button = new Gpio(3, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    alert: true
});

setTimeout(() => {
    buzz.digitalWrite(1);
    setTimeout(() => {
        buzz.digitalWrite(0);
        setTimeout(() => {
            buzz.digitalWrite(1);
            setTimeout(() => {
                buzz.digitalWrite(0);
            }, 25);
        }, 100);
    }, 25);
}, 0);

let increment = 0;
tacho.on('interrupt', () => {
    increment++;
});

const hz = 25000; // 25khz
const min = 60000; // 6%
const max = 500000; // 50%

let interval;
let state = false;
setInterval(() => {
    if (increment > 0) {
        if (state === true) {
            console.log('tacho alert off');
            clearInterval(interval);
            state = false;
        }
    } else {
        if (state === false) {
            console.log('tacho alert on');
            state = true;
            interval = sos();
        }
    }
    increment = 0;

    exec('cat /sys/class/thermal/thermal_zone0/temp', (err, out) => {
        let temp = Math.round(parseInt(out) / 1000);
        let duty = parseInt((temp - 40) / (60 - 40) * 100 * 10000);

        if (duty >= max) duty = max;
        if (duty <= min) duty = min;

        pwm.hardwarePwmWrite(hz, duty);
        console.log(`temp: ${temp}°C | speed: ${parseInt(duty / 10000)}%`);
    });
}, 500);

button.glitchFilter(10000); // stable for 10 ms before alert is emitted.
button.on('alert', (level) => {
    if (level === 0) {
        setTimeout(() => {
            buzz.digitalWrite(1);
            setTimeout(() => {
                buzz.digitalWrite(0);
            }, 25);
        }, 0);
    }

    if (level === 1) {
        exec('sudo sleep 1 && /sbin/shutdown -h now');
        process.exit();
    }
});

const sos = function () {
    let s = function () {
        setTimeout(() => {
            buzz.digitalWrite(1);
            setTimeout(() => {
                buzz.digitalWrite(0);
                setTimeout(() => {
                    buzz.digitalWrite(1);
                    setTimeout(() => {
                        buzz.digitalWrite(0);
                        setTimeout(() => {
                            buzz.digitalWrite(1);
                            setTimeout(() => {
                                buzz.digitalWrite(0);
                            }, 70);
                        }, 70);
                    }, 70);
                }, 70);
            }, 70);
        }, 0);
    };
    let o = function () {
        setTimeout(() => {
            buzz.digitalWrite(1);
            setTimeout(() => {
                buzz.digitalWrite(0);
                setTimeout(() => {
                    buzz.digitalWrite(1);
                    setTimeout(() => {
                        buzz.digitalWrite(0);
                        setTimeout(() => {
                            buzz.digitalWrite(1);
                            setTimeout(() => {
                                buzz.digitalWrite(0);
                            }, 150);
                        }, 150);
                    }, 150);
                }, 150);
            }, 150);
        }, 0);
    };
    let sos = function () {
        setTimeout(() => {
            s();
            setTimeout(() => {
                o();
                setTimeout(() => {
                    s();
                }, 950);
            }, 550);
        }, 0);
    };

    sos();
    return setInterval(() => {
        sos();
    }, 11500);
};
