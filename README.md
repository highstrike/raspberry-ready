# raspberry ready
The script I use when my raspberry pi turns on.

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
`sudo apt-get install -y libffi-dev libssl-dev`  
`sudo apt-get install -y python3 python3-pip`  
`sudo apt-get remove python-configparser`

6. Install docker-compose  
`sudo pip3 install docker-compose`

## Run on startup
1. Open rc.local  
`sudo nano /etc/rc.local`

2. Before exit add scripts  
```
# Run ready scripts
sudo /home/pi/./shutdown-script.sh &
docker run -itd --privileged -v /var/run/shutdown_signal:/shutdown_signal highstrike/raspberry-ready:v1.0.7
```

3. Add script to ~  
```
touch shutdown-script.sh
chmod +x shutdown-script.sh
nano shutdown-script.sh
```

4. Copy paste the script it from [here](https://github.com/highstrike/raspberry/blob/master/shutdown-script.sh)
