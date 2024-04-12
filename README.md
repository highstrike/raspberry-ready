# raspberry ready
The script I use when my raspberry pi turns on.

## Setup (headless)
1. Install Raspberry Pi Imager from [here](https://www.raspberrypi.org/downloads/) and flash the latest lite version with the following settings:
   - hostname: raspberrypi
   - username & password: pi / pass
   - no wlan
   - locale: Europe/Bucharest, keyboard: us
   - enable ssh with password authentication

2. SSH into your device `ssh pi@raspberrypi`

3. Update software / firmware  
    ```bash
    sudo apt update && \
    sudo apt full-upgrade -y && \
    sudo apt autoremove && \
    sudo apt clean
    ```

4. Reboot `sudo reboot`

## Overclock
1. Open the config file `sudo nano /boot/firmware/config.txt` and add the following:
    ```
    over_voltage=6
    arm_freq=2000
    ```

## Instalation
1. Install docker `curl -sSL https://get.docker.com | sh`
2. Add permission to pi user to run docker commands `sudo usermod -aG docker pi`
3. Test docker installation `docker run hello-world`
4. Install docker-compose (check for [latest version here](https://github.com/docker/compose/releases))  
    ```bash
    sudo curl -L https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-`uname -s`-`uname -m` > docker-compose && \
    sudo mv docker-compose /usr/bin/ && \
    sudo chown root: /usr/bin/docker-compose && \
    sudo chmod +x /usr/bin/docker-compose
    ```

## Run on startup
1. Symlink /etc/rc.local to ~  
`ln -s /etc/rc.local startup`

2. Open startup  
`sudo nano startup`

3. Before exit add scripts (important: the `--privileged` flag is needed in order to access the GPIO from the container)  
```
# Run ready scripts
sudo /home/pi/./shutdown-script.sh &
docker run --privileged --rm --name ready -d -v /var/run/shutdown_signal:/shutdown_signal highstrike/raspberry-ready:v1.0.8
```

4. Add script to ~  
```bash
nano shutdown-script.sh && chmod +x $_
```

5. Copy paste the script it from [here](https://github.com/highstrike/raspberry/blob/master/shutdown-script.sh)

6. Reboot  
`sudo reboot`

## Other
- check frequency  
`cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq`

- check temperature  
`/opt/vc/bin/vcgencmd measure_temp`

- check fan-speed  
`docker logs ready -f`

- install git  
`sudo apt install -y git`

- set git global identity  
`git config --global user.email "flavius@unimatrix.ro"`  
`git config --global user.name "highstrike"`

- github ssh key  
`ssh-keygen -t rsa -b 4096 -C "highstrike@gmail.com"`  
`cat ~/.ssh/id_rsa.pub` and add it to github / settings / ssh / new ssh key  
`ssh -T git@github.com` to test connection

- benchmarking  
`sudo apt install -y sysbench`  
`sysbench --test=cpu --cpu-max-prime=50000 --num-threads=4 run` (cpu speed)  
`sudo curl https://raw.githubusercontent.com/TheRemote/PiBenchmarks/master/Storage.sh | sudo bash` (storage speed)

- block wifi & bluetooth  
`rfkill block wifi`  
`rfkill block bluetooth`

- neofetch  
`sudo wget -O /usr/local/bin/neofetch https://raw.githubusercontent.com/dylanaraps/neofetch/master/neofetch`  
`sudo chmod a+x /usr/local/bin/neofetch`
