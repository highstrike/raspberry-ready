# raspberry ready
The script I use when my raspberry pi turns on.

## Setup (headless)
1. Install Raspberry Pi Imager from [here](https://www.raspberrypi.org/downloads/) and flash the latest lite version onto an sdcard  

2. Create an empty SSH file in the boot partition  

3. Create a file called `wpa_supplicant.conf` in the boot partition with the contents  
```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=RO

network={
  ssid="Unimatrix"
  psk="<SECRET_PASS_HERE>"
}
```

4. SSH into your device (default password is `raspberry`)  
`ssh pi@raspberrypi`

5. Update software / firmware  
```
sudo apt update
sudo apt full-upgrade
sudo apt autoremove
sudo apt clean
```

6. Change default password and timezone  
`sudo raspi-config`

7. Reboot  
`sudo reboot`

## Overclock
1. Open the config file  
`sudo nano /boot/config.txt`

2. Uncomment and add the following lines  
```
over_voltage=6
arm_freq=2000
```

## Instalation
1. Install docker  
`curl -sSL https://get.docker.com | sh`

2. Add permission to pi user to run docker commands  
`sudo usermod -aG docker pi`

3. Reboot  
`sudo reboot`

4. Test docker installation  
`docker run hello-world`

5. Install dependencies for docker-compose  
`sudo apt install -y libffi-dev libssl-dev`  
`sudo apt install -y python3 python3-pip`  
`sudo apt remove python-configparser` (might not be needed)

6. Install docker-compose  
`sudo pip3 install docker-compose`

## Run on startup
1. Symlink /etc/rc.local to ~  
`ln -s /etc/rc.local startup`

2. Open startup  
`sudo nano startup`

3. Before exit add scripts (important: we need the `--privileged` flag so that we can access GPIO from the container)  
```
# Run ready scripts
sudo /home/pi/./shutdown-script.sh &
docker run --privileged --name ready -d -v /var/run/shutdown_signal:/shutdown_signal highstrike/raspberry-ready:v1.0.7
```

4. Add script to ~  
```
touch shutdown-script.sh
chmod +x shutdown-script.sh
nano shutdown-script.sh
```

5. Copy paste the script it from [here](https://github.com/highstrike/raspberry/blob/master/shutdown-script.sh)

6. Reboot  
`sudo reboot`

## Other
- check frequency  
`cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq`

- check temperature  
`/opt/vc/bin/vcgencmd measure_temp`

- check fanspeed  
`docker logs ready -f`

- install git  
`sudo apt install git`

- github ssh key  
`ssh-keygen -t rsa -b 4096 -C "highstrike@gmail.com"`  
`cat ~/.ssh/id_rsa.pub` and add it to github / settings / ssh / new ssh key  
`ssh -T git@github.com` to test connection

- benchmarking  
`sudo apt install sysbench`  
`sysbench --test=cpu --cpu-max-prime=50000 --num-threads=4 run`
