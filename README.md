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
docker run -d --privileged -v /var/run/shutdown_signal:/shutdown_signal highstrike/raspberry-ready:v1.0.7
```

4. Add script to ~  
```
touch shutdown-script.sh
chmod +x shutdown-script.sh
nano shutdown-script.sh
```

5. Copy paste the script it from [here](https://github.com/highstrike/raspberry/blob/master/shutdown-script.sh)

## Updating

1. Update system  
```
sudo apt update
sudo apt full-upgrade
sudo apt autoremove
sudo apt clean
```

2. Update docker-compose  
`sudo pip3 install --upgrade docker-compose`
