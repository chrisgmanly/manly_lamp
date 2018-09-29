#!/bin/bash

## This script has been tested only with UDF image "Ubuntu 16.04 LTS Server – 2018-Jan-23"

## INSTALL:
## run:
# cd /home/ubuntu
# sudo git clone https://github.com/chrisgmanly/manly_lamp.git --branch master
# sudo cp manly_lamp/lab/update_git.sh .
# sudo chmod +x update_git.sh
## Add following in /etc/rc.local
# sudo vi /etc/rc.local
# /home/ubuntu/update_git.sh
# sudo chown -R ubuntu:ubuntu /home/ubuntu
##
## then reboot:
# sudo init 6

user=ubuntu

cd /home/$user

if [ -f /home/$user/udf_auto_update_git ]; then
    echo -e "\nIn order to force the scripts/tools updates, delete udf_auto_update_git and re-run update_git.sh (optional).\n"
    # show current docker containers running
    sudo docker ps
    # check IPs
    sudo ifconfig
    sudo route -n
else
    sudo echo $(hostname -I | cut -d\  -f1) $(hostname) | sudo tee -a /etc/hosts
    
    echo "Cleanup previous files..."
    sudo rm -rf manly_lamp
    echo "Install new scripts..."
    sudo git clone https://github.com/chrisgmanly/manly_lamp.git --branch master
    echo "Fixing permissions..."
    sudo chmod +x ./manly_lamp/lab/*sh

    # install docker
    sudo apt-get install apt-transport-https ca-certificates curl software-properties-common -y
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt-get update
    sudo apt-get install docker-ce -y

    sudo /etc/init.d/docker status

    # Cleanup docker
    sudo docker kill $(sudo docker ps -q)
    sudo docker rm $(sudo docker ps -a -q)
    sudo docker rmi $(sudo docker images -q) -f
    sudo ./manly_lamp/lab/cleanup-docker.sh

    # Installing docker images
    # Start containers
    # DVWA
    sudo docker run -dit -p 10.1.20.27:80:80 --name dvwa --restart=always citizenstig/dvwa
    # Hackazon (All passwords (mysql and hackazon admin) are hackmesilly)
    sudo docker pull mutzel/all-in-one-hackazon:postinstall
    sudo docker run -dit -p 10.1.20.30:80:80 --name hackazon --restart=always mutzel/all-in-one-hackazon:postinstall supervisord -n
    # Demo bank
    sudo docker run -dit -p 10.1.20.31:80:80 --name bank --restart=always citizenstig/dvwa

    docker_dvwa_id=$(sudo docker ps | grep dvwa | awk '{print $1}')
    docker_bank_id=$(sudo docker ps | grep bank | awk '{print $1}')
    docker_hackazon_id=$(sudo docker ps | grep hackazon | awk '{print $1}')

    # replace old dvwa website with new customer chris dvwa
    sudo docker cp manly_lamp/lab/dvwa_chris $docker_dvwa_id:/
    sudo docker exec -i -t $docker_dvwa_id sh -c "mv /app /app.old"
    sudo docker exec -i -t $docker_dvwa_id sh -c "mv /dvwa_chris /app"

    # replace old dvwa website with bank site
    sudo docker cp manly_lamp/lab/bank_chris $docker_bank_id:/
    sudo docker exec -i -t $docker_bank_id sh -c "mv /app /app.old"
    sudo docker exec -i -t $docker_bank_id sh -c "mv /bank_chris /app"
 
    touch udf_auto_update_git
    rm -f last_update_*
    touch last_update_$(date +%Y-%m-%d_%H-%M)
fi

# run only when server boots (through /etc/rc.local as root)
currentuser=$(whoami)
if [[  $currentuser == "root" ]]; then
    # configure network interfaces
    sudo su - root -c 'echo "auto eth1
    iface eth1 inet static
        address 10.1.20.200
        netmask 255.255.255.255
        network 10.1.20.0
        broadcast 10.1.20.255
        gateway 10.1.20.1

    auto eth1:0
    iface eth1:0 inet static
        address 10.1.20.27
        netmask 255.255.255.255

    auto eth1:1
    iface eth1:1 inet static
        address 10.1.20.30
        netmask 255.255.255.255

    auto eth1:2
    iface eth1:1 inet static
        address 10.1.20.31
        netmask 255.255.255.255" >> /etc/network/interfaces'

    sudo echo $(hostname -I | cut -d\  -f1) $(hostname) | sudo tee -a /etc/hosts

    sudo /etc/init.d/networking restart
fi