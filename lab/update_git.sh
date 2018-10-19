#!/bin/bash

## CONFIG IPs
ubuntu="10.1.20.200"
dvwa="10.1.20.27"
hackazon="10.1.20.30"
bank="10.1.20.31"
server1="10.1.20.32"
server2="10.1.20.33"
server3="10.1.20.34"
server4="10.1.20.35"
server5="10.1.20.36"
csrf="10.1.20.37"
phishing="10.1.20.38"

user=ubuntu

# run only when server boots (through /etc/rc.local as root)
currentuser=$(whoami)
if [[  $currentuser == "root" ]]; then
    # fix hostname in /etc/hosts
    sudo echo $(hostname -I | cut -d\  -f1) $(hostname) | sudo tee -a /etc/hosts

    ## check if eth1 already configured
    ips_set=$(cat /etc/network/interfaces | grep eth1 | wc -l)
    if [ $ips_set -eq 0 ]; then
         # install docker
        sudo apt-get install apt-transport-https ca-certificates curl software-properties-common -y
        sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
        sudo apt-get update
        sudo apt-get install docker-ce -y

        sudo /etc/init.d/docker status
        
        # configure network interfaces
        echo "auto eth1
        iface eth1 inet static
            address $ubuntu
            netmask 255.255.255.255
            network 10.1.20.0
            broadcast 10.1.20.255
            gateway 10.1.20.1

        auto eth1:0
        iface eth1:0 inet static
            address $dvwa
            netmask 255.255.255.255

        auto eth1:1
        iface eth1:1 inet static
            address $hackazon
            netmask 255.255.255.255
            
        auto eth1:2
        iface eth1:2 inet static
            address $bank
            netmask 255.255.255.255

        auto eth1:3
        iface eth1:3 inet static
            address $server1
            netmask 255.255.255.255
            
        auto eth1:4
        iface eth1:4 inet static
            address $server2
            netmask 255.255.255.255
            
         auto eth1:5
        iface eth1:5 inet static
            address $server3
            netmask 255.255.255.255

        auto eth1:6
        iface eth1:6 inet static
            address $server4
            netmask 255.255.255.255
        
        auto eth1:7
        iface eth1:7 inet static
            address $server5
            netmask 255.255.255.255
            
        auto eth1:8
        iface eth1:8 inet static
            address $csrf
            netmask 255.255.255.255
            
        auto eth1:9
        iface eth1:9 inet static
            address $phishing
            netmask 255.255.255.255 >> /etc/network/interfaces

        init 6
    fi
fi

cd /home/$user

if [ -f /home/$user/udf_auto_update_git ]; then
    echo -e "\nIn order to force the scripts/tools updates, delete udf_auto_update_git and re-run update_git.sh (optional).\n"
    # show current docker containers running
    sudo docker ps
    # check IPs
    echo
    echo
    ip addr show eth1
else
    # Cleanup dockers
    sudo docker kill $(sudo docker ps -q)
    sudo docker rm $(sudo docker ps -a -q)
    sudo docker rmi $(sudo docker images -q) -f
    sudo ./manly_lamp/lab/cleanup-docker.sh

    # Installing docker images
    # Start containers
    # DVWA
    sudo docker run -dit -p $dvwa:80:80 --name DVWA --restart=always citizenstig/dvwa
    # Hackazon (All passwords (mysql and hackazon admin) are hackmesilly)
    sudo docker pull mutzel/all-in-one-hackazon:postinstall
    sudo docker run -dit -p $hackazon:80:80 --name hackazon --restart=always mutzel/all-in-one-hackazon:postinstall supervisord -n
    # Demo bank
    sudo docker run -dit -p $bank:80:80 --name bank --restart=always citizenstig/dvwa

    docker_dvwa_id=$(sudo docker ps | grep DVWA | awk '{print $1}')
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
    
    ## ADD SERVER 1 to 5
    ## ADD CSRF
    ## ADD PHISHING
 
    touch udf_auto_update_git
    rm -f last_update_*
    touch last_update_$(date +%Y-%m-%d_%H-%M)
fi
