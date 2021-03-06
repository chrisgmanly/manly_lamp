Chris Manly's LAMP server for SE and partner SE training

# Installation Instructions

- This script has been tested only with UDF image "Ubuntu 16.04 LTS Server – 2018-Jan-23"
- Do not forget to bind additional network interfaces in UDF/Ravello
- Add SSH Access to the Ubuntu server in UDF

1. Edit /etc/rc.local

```
sudo vi /etc/rc.local
```

2. Add following in /etc/rc.local

```
cd /home/ubuntu
rm -rf /home/ubuntu/manly_lamp update_git.sh
git clone https://github.com/chrisgmanly/manly_lamp.git --branch master
cp /home/ubuntu/manly_lamp/lab/update_git.sh /home/ubuntu
chmod +x /home/ubuntu/update_git.sh
chmod +x /home/ubuntu/manly_lamp/lab/*sh
/home/ubuntu/update_git.sh >> /home/ubuntu/update_git.log
chown -R ubuntu:ubuntu /home/ubuntu
```

3. Reboot

```
sudo init 6
```

4. Check if docker containers are running and if the IP addresses are configured properly
```
./update_git.sh
```

5. In case you need to force the re-deployment of the github repository
```
rm udf_auto_update_git
sudo init 6
```

# Troubleshooting

Log file: /home/ubuntu/update_git.log
